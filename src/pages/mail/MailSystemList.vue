<script setup lang="ts">
import { computed, ref, onBeforeMount, onBeforeUnmount } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { UnitInterface, useStore } from 'stores/store'
import { useRoute } from 'vue-router'
// import { i18n } from 'boot/i18n'
import aiops from 'src/api/aiops'
import { date } from 'quasar'
import $bus from 'src/hooks/bus'
import MyNoData from 'components/mail/MyNoData.vue'
import LineChart from 'components/chart/LineChart.vue'
import HistogramChart from 'components/chart/HistogramChart.vue'
import HeaderInformation from 'components/mail/HeaderInformation.vue'
// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])
interface ResourcesDataInterface {
  cpu: {
    total: string[],
    user: string[],
    disk: string[],
    sys: string[]
  }
  mem: {
    total: string[],
    use: string[]
  }
  disk: {
    total: string[],
    use: string[]
  }
}
interface PerformanceDataInterface {
  load: {
    one: string[],
    five: string[],
    fifteen: string[]
  }
}
interface NetworkDataInterface {
  bandwidth: {
    upload: string[],
    download: string[]
  }
  flow: {
    upload: string[],
    download: string[]
  }
  socket: {
    currEstab: string[],
    tw: string[],
    used: string[],
    inuse: string[],
    alloc: string[],
    inSegs: string[],
    outSegs: string[],
    retransSegs: string[]
  }
}
interface F5FlowObjInterface {
  cpu: {
    total: string[]
  },
  mem: {
    tmm: string[],
    host: string[]
  },
  flow: {
    clientBytesIn: string[],
    clientBytesOut: string[],
    serverBytesIn: string[],
    serverBytesOut: string[]
  }
}
interface WarningLineInterface {
  instance: string
  cpu_rate: number
  memory_used: number
  disk_used: number
}
interface LogInterface {
  instance: string
  log_name: string
  log_source: string
  text: string
  timestamp: number
}
const store = useStore()
const route = useRoute()
// const router = useRouter()
console.log('route', route)
// const tc = i18n.global.tc
const routeInstance = route.query.instance as string
const routeCategory = route.query.category as string
const routeStart = route.query.start as string
const routeEnd = route.query.end as string
const timeStamp = Date.now()
const formattedString = date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm')
const endTime = ref(formattedString)
const startDate = date.subtractFromDate(endTime.value, { minutes: 5 })
const startTime = ref(date.formatDate(startDate, 'YYYY-MM-DD HH:mm'))
const queryText = ref('')
const active = ref()
const unitList = ref<UnitInterface[]>([])
let allUnitList: UnitInterface[] = []
const tab = ref('sequential')
// eslint-disable-next-line
const cardInfo: any = ref({})
const isRight = ref(false)
let unitInstance = ''
const unitQuery = ref({
  value: 'host',
  label: '主机',
  labelEn: 'host'
})
const isChange = ref('')
const xAxis = ref<string[]>([])
const categoryOptions = [
  {
    value: 'host',
    label: '主机',
    labelEn: 'host'
  },
  {
    value: 'switch',
    label: '交换机',
    labelEn: 'switch'
  },
  {
    value: 'firewall',
    label: '防火墙',
    labelEn: 'firewall'
  },
  {
    value: 'f5',
    label: 'F5负载均衡',
    labelEn: 'f5'
  },
  {
    value: 'vpn',
    label: 'VPN',
    labelEn: 'VPN'
  },
  {
    value: 'tomcat',
    label: 'Tomcat',
    labelEn: 'Tomcat'
  },
  {
    value: 'nginx',
    label: 'Nginx',
    labelEn: 'Nginx'
  },
  {
    value: 'mysql',
    label: 'MySQL',
    labelEn: 'MySQL'
  }
]
const resourcesChartData = ref<ResourcesDataInterface>({
  cpu: {
    total: [],
    user: [],
    disk: [],
    sys: []
  },
  mem: {
    total: [],
    use: []
  },
  disk: {
    total: [],
    use: []
  }
})
const performanceChartData = ref<PerformanceDataInterface>({
  load: {
    one: [],
    five: [],
    fifteen: []
  }
})
const networkChartData = ref<NetworkDataInterface>({
  bandwidth: {
    upload: [],
    download: []
  },
  flow: {
    upload: [],
    download: []
  },
  socket: {
    currEstab: [],
    tw: [],
    used: [],
    inuse: [],
    alloc: [],
    inSegs: [],
    outSegs: [],
    retransSegs: []
  }
})
const warningLineObj = ref<WarningLineInterface>({
  instance: '',
  cpu_rate: 0,
  memory_used: 0,
  disk_used: 0
})
const f5FlowObj = ref<F5FlowObjInterface>({
  cpu: {
    total: []
  },
  mem: {
    tmm: [],
    host: []
  },
  flow: {
    clientBytesIn: [],
    clientBytesOut: [],
    serverBytesIn: [],
    serverBytesOut: []
  }
})
// 主机 tomcat nginx mysql
const cpuOption = computed(() => ({
  title: {
    text: 'CPU使用率',
    textStyle: {
      fontSize: 15
    }
  },
  tooltip: {
    trigger: 'axis'
    // formatter: '类目值：{b0}<br/> {a0}:{c0}封 <br/>{a1}:{c1}个 <br/>{a2}:{c2}条'
    // formatter: function (params: Record<string, any>) {
    //   console.log(params)
    // }
  },
  toolbox: {
    showTitle: false,
    itemSize: 12,
    left: 90,
    iconStyle: {
      color: '#1976D2'
    },
    feature: {
      myTool1: {
        show: true,
        title: '修改预警线',
        icon: 'path://M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z',
        onclick: function () {
          store.triggerModifyWarningLine(unitInstance, 'cpu', warningLineObj.value.cpu_rate)
        }
      }
    },
    tooltip: { // 和 option.tooltip 的配置项相同
      show: true,
      formatter: function () {
        return '修改预警线' // 自定义的 DOM 结构
      },
      borderWidth: 0,
      backgroundColor: '#757575',
      textStyle: {
        color: '#FFFFFF',
        fontSize: 12
      }
    }
  },
  legend: {
    top: 30,
    data: ['总使用率', '用户使用率', '磁盘使用率', '系统使用率']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxis.value
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '总使用率',
      type: 'line',
      data: resourcesChartData.value.cpu.total
    },
    {
      name: '用户使用率',
      type: 'line',
      data: resourcesChartData.value.cpu.user
    },
    {
      name: '磁盘使用率',
      type: 'line',
      data: resourcesChartData.value.cpu.disk
    },
    {
      name: '系统使用率',
      type: 'line',
      data: resourcesChartData.value.cpu.sys,
      lineStyle: {
        color: '#91c7ae'
      },
      markLine: {
        symbol: 'none', // 去掉警戒线最后面的箭头
        label: {
          position: 'middle', // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
          formatter: warningLineObj.value.cpu_rate !== 0 ? '预警线' + warningLineObj.value.cpu_rate + '%' : ''
        },
        data: [{
          silent: false, // 鼠标悬停事件  true没有，false有
          lineStyle: { // 警戒线的样式  ，虚实  颜色
            type: 'solid',
            color: 'rgba(238, 99, 99)'
          },
          yAxis: warningLineObj.value.cpu_rate !== 0 ? warningLineObj.value.cpu_rate : '' // 警戒线在y轴的坐标
        }]
      }
    }
  ]
}))
const memOption = computed(() => ({
  title: {
    text: '内存信息',
    textStyle: {
      fontSize: 15
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    showTitle: false,
    itemSize: 12,
    left: 90,
    iconStyle: {
      color: '#1976D2'
    },
    feature: {
      myTool1: {
        show: true,
        title: '修改预警线',
        icon: 'path://M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z',
        onclick: function () {
          store.triggerModifyWarningLine(unitInstance, 'mem', warningLineObj.value.memory_used)
        }
      }
    },
    tooltip: { // 和 option.tooltip 的配置项相同
      show: true,
      formatter: function () {
        return '修改预警线' // 自定义的 DOM 结构
      },
      borderWidth: 0,
      backgroundColor: '#757575',
      textStyle: {
        color: '#FFFFFF',
        fontSize: 12
      }
    }
  },
  legend: {
    top: 30,
    data: ['总内存', '已用']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxis.value
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '总内存',
      type: 'line',
      data: resourcesChartData.value.mem.total
    },
    {
      name: '已用',
      type: 'line',
      data: resourcesChartData.value.mem.use,
      markLine: {
        symbol: 'none', // 去掉警戒线最后面的箭头
        label: {
          position: 'middle', // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
          formatter: warningLineObj.value.memory_used !== 0 ? '预警线' + warningLineObj.value.memory_used + 'GB' : ''
        },
        data: [{
          silent: false, // 鼠标悬停事件  true没有，false有
          lineStyle: { // 警戒线的样式  ，虚实  颜色
            type: 'solid',
            color: 'rgba(238, 99, 99)'
          },
          yAxis: warningLineObj.value.memory_used !== 0 ? warningLineObj.value.memory_used : '' // 警戒线在y轴的坐标
        }]
      }
    }
  ]
}))
const diskOption = computed(() => ({
  title: {
    text: '磁盘信息',
    textStyle: {
      fontSize: 15
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    showTitle: false,
    itemSize: 12,
    left: 90,
    iconStyle: {
      color: '#1976D2'
    },
    feature: {
      myTool1: {
        show: true,
        title: '修改预警线',
        icon: 'path://M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z',
        onclick: function () {
          store.triggerModifyWarningLine(unitInstance, 'disk', warningLineObj.value.disk_used)
        }
      }
    },
    tooltip: { // 和 option.tooltip 的配置项相同
      show: true,
      formatter: function () {
        return '修改预警线' // 自定义的 DOM 结构
      },
      borderWidth: 0,
      backgroundColor: '#757575',
      textStyle: {
        color: '#FFFFFF',
        fontSize: 12
      }
    }
  },
  legend: {
    top: 30,
    data: ['总磁盘量', '总使用量']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxis.value
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '总磁盘量',
      type: 'line',
      data: resourcesChartData.value.disk.total
    },
    {
      name: '总使用量',
      type: 'line',
      data: resourcesChartData.value.disk.use,
      markLine: {
        symbol: 'none', // 去掉警戒线最后面的箭头
        label: {
          position: 'middle', // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
          formatter: warningLineObj.value.disk_used !== 0 ? '预警线' + warningLineObj.value.disk_used + 'GB' : ''
        },
        data: [{
          silent: false, // 鼠标悬停事件  true没有，false有
          lineStyle: { // 警戒线的样式  ，虚实  颜色
            type: 'solid',
            color: 'rgba(238, 99, 99)'
          },
          yAxis: warningLineObj.value.disk_used !== 0 ? warningLineObj.value.disk_used : '' // 警戒线在y轴的坐标
        }]
      }
    }
  ]
}))
const loadOption = computed(() => ({
  title: {
    text: '系统平均负载',
    textStyle: {
      fontSize: 15
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top: 30,
    data: ['1ms', '5ms', '15ms']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxis.value
  },
  yAxis: {
    type: 'value',
    max: 10,
    min: 0
  },
  series: [
    {
      name: '1ms',
      type: 'line',
      data: performanceChartData.value.load.one
    },
    {
      name: '5ms',
      type: 'line',
      data: performanceChartData.value.load.five
    },
    {
      name: '15ms',
      type: 'line',
      data: performanceChartData.value.load.fifteen
    }
  ]
}))
const bandwidthOption = computed(() => ({
  title: {
    text: '每分钟网络带宽使用',
    textStyle: {
      fontSize: 15
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top: 30,
    data: ['上传', '下载']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxis.value
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '上传',
      type: 'line',
      data: networkChartData.value.bandwidth.upload
    },
    {
      name: '下载',
      type: 'line',
      data: networkChartData.value.bandwidth.download
    }
  ]
}))
const socketOption = computed(() => ({
  title: {
    text: '网络socket连接信息',
    textStyle: {
      fontSize: 15
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top: 30,
    type: 'scroll',
    data: ['CurrEstab', 'TCP_Tw', 'Socket_Used', 'UDP_Inuse', 'TCP_Alloc', 'TCP_InSegs', 'TCP_OutSegs', 'TCP_RetransSegs']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxis.value
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'CurrEstab',
      type: 'line',
      data: networkChartData.value.socket.currEstab
    },
    {
      name: 'TCP_Tw',
      type: 'line',
      data: networkChartData.value.socket.tw
    },
    {
      name: 'Socket_Used',
      type: 'line',
      data: networkChartData.value.socket.used
    },
    {
      name: 'UDP_Inuse',
      type: 'line',
      data: networkChartData.value.socket.inuse
    },
    {
      name: 'TCP_Alloc',
      type: 'line',
      data: networkChartData.value.socket.alloc
    },
    {
      name: 'TCP_InSegs',
      type: 'line',
      data: networkChartData.value.socket.inSegs
    },
    {
      name: 'TCP_OutSegs',
      type: 'line',
      data: networkChartData.value.socket.outSegs
    },
    {
      name: 'TCP_RetransSegs',
      type: 'line',
      data: networkChartData.value.socket.retransSegs
    }
  ]
}))
const flowOption = computed(() => ({
  title: {
    text: '每分钟流量',
    textStyle: {
      fontSize: 15
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: xAxis.value
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '下载',
      type: 'bar',
      stack: 'flow',
      emphasis: {
        focus: 'series'
      },
      data: networkChartData.value.flow.download
    },
    {
      name: '上传',
      type: 'bar',
      stack: 'flow',
      emphasis: {
        focus: 'series'
      },
      data: networkChartData.value.flow.upload
    }
  ]
}))
// 负载均衡
const f5CpuOption = computed(() => ({
  title: {
    text: 'CPU使用率',
    textStyle: {
      fontSize: 15
    }
  },
  tooltip: {
    trigger: 'axis'
    // formatter: '类目值：{b0}<br/> {a0}:{c0}封 <br/>{a1}:{c1}个 <br/>{a2}:{c2}条'
    // formatter: function (params: Record<string, any>) {
    //   console.log(params)
    // }
  },
  legend: {
    top: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxis.value
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '使用率',
      type: 'line',
      data: f5FlowObj.value.cpu.total
    }
  ]
}))
const f5MemOption = computed(() => ({
  title: {
    text: '内存信息',
    textStyle: {
      fontSize: 15
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxis.value
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'TMM',
      type: 'line',
      data: f5FlowObj.value.mem.tmm
    },
    {
      name: '主机',
      type: 'line',
      data: f5FlowObj.value.mem.host
    }
  ]
}))
const f5FlowOption = computed(() => ({
  title: {
    text: '流量使用',
    textStyle: {
      fontSize: 15
    }
  },
  tooltip: {
    trigger: 'axis'
    // formatter: '类目值：{b0}<br/> {a0}:{c0}封 <br/>{a1}:{c1}个 <br/>{a2}:{c2}条'
    // formatter: function (params: Record<string, any>) {
    //   console.log(params)
    // }
  },
  legend: {
    top: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxis.value
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '客户端入站流量',
      type: 'line',
      data: f5FlowObj.value.flow.clientBytesIn
    },
    {
      name: '客户端出站流量',
      type: 'line',
      data: f5FlowObj.value.flow.clientBytesOut
    },
    {
      name: '服务器入站流量',
      type: 'line',
      data: f5FlowObj.value.flow.serverBytesIn
    },
    {
      name: '服务器出站流量',
      type: 'line',
      data: f5FlowObj.value.flow.serverBytesOut,
      lineStyle: {
        color: '#91c7ae'
      }
    }
  ]
}))

const logColumns = [
  {
    name: 'time',
    required: true,
    label: '时间',
    align: 'center',
    field: 'time'
  },
  { name: 'source', align: 'center', label: '日志源', field: 'logType' },
  {
    name: 'info',
    align: 'center',
    label: '日志信息',
    field: 'info'
  }
]
const logRows = ref<LogInterface[]>([])
const columns1 = [
  {
    name: 'index',
    label: '序号',
    align: 'left',
    field: 'index'
  },
  {
    name: 'name',
    required: true,
    label: '告警名称',
    align: 'left',
    field: 'name',
    sortable: false
  },
  {
    name: 'time',
    required: true,
    label: '触发时间',
    align: 'left',
    field: row => row.time,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'type', align: 'left', label: '告警类型', field: 'type', sortable: false },
  { name: 'rule', align: 'left', label: '告警规则', field: 'rule', sortable: false },
  { name: 'level', align: 'left', label: '告警级别', field: 'level', sortable: false },
  { name: 'state', align: 'left', label: '处理状态', field: 'state', sortable: false }
]
const rows1 = ref([
  {
    id: '00001',
    name: 'user-serivce提供请求延时过高',
    time: '2023-04-10 09:30:42',
    type: '应用监控报警',
    rule: '最近3分钟应用提供服务调用响应时间_ms大于等于500',
    level: '严重',
    state: '待处理'
  },
  {
    id: '00002',
    name: 'user-service提供请求成功率下跌',
    time: '2023-04-10 09:30:42',
    type: '应用监控报警',
    rule: '最近3分钟应用提供服务调用响应时间_ms大于等于500',
    level: '严重',
    state: '待处理'
  },
  {
    id: '00003',
    name: 'user-service提供请求成功率下跌',
    time: '2023-04-10 09:30:42',
    type: '应用监控报警',
    rule: '最近3分钟应用提供服务调用响应时间_ms大于等于500',
    level: '严重',
    state: '待处理'
  },
  {
    id: '00004',
    name: 'user-service提供请求成功率下跌',
    time: '2023-04-10 09:30:42',
    type: '应用监控报警',
    rule: '最近3分钟应用提供服务调用响应时间_ms大于等于500',
    level: '一般',
    state: '待处理'
  },
  {
    id: '00005',
    name: 'user-service提供请求成功率下跌',
    time: '2023-04-10 09:30:42',
    type: '应用监控报警',
    rule: '最近3分钟应用提供服务调用响应时间_ms大于等于500',
    level: '一般',
    state: '待处理'
  },
  {
    id: '00006',
    name: 'user-service提供请求成功率下跌',
    time: '2023-04-10 09:30:42',
    type: '应用监控报警',
    rule: '最近3分钟应用提供服务调用响应时间_ms大于等于500',
    level: '严重',
    state: '已完成'
  },
  {
    id: '00007',
    name: 'user-service提供请求成功率下跌',
    time: '2023-04-10 09:30:42',
    type: '应用监控报警',
    rule: '最近3分钟应用提供服务调用响应时间_ms大于等于500',
    level: '严重',
    state: '处理中'
  }
])
const getUnitList = async (val: Record<string, string>) => {
  const res = await aiops.mail.getMailMachine({ query: { category: val.value, page: 1, page_size: 100 } })
  unitList.value = res.data.results
  allUnitList = res.data.results
}
const search = () => {
  if (queryText.value === '') {
    unitList.value = allUnitList
  } else {
    unitList.value = allUnitList.filter(item => item.instance.indexOf(queryText.value) !== -1)
  }
}
const changeTime = () => {
  getDetail(unitInstance)
}
const getWarnLine = (instance: string) => {
  aiops.mail.getMetricWarning({ query: { instance } }).then((warningRes) => {
    if (Object.keys(warningRes.data).length > 0) {
      if (warningRes.data.results.length > 0) {
        warningLineObj.value = warningRes.data.results[0]
      } else {
        warningLineObj.value.instance = instance
        warningLineObj.value.cpu_rate = 0
        warningLineObj.value.memory_used = 0
        warningLineObj.value.disk_used = 0
      }
    }
  })
}
const getDetail = async (instance: string) => {
  isChange.value = unitQuery.value.value
  active.value = instance
  unitInstance = instance
  cardInfo.value = {}
  xAxis.value = []
  resourcesChartData.value.cpu.total = []
  resourcesChartData.value.cpu.user = []
  resourcesChartData.value.cpu.disk = []
  resourcesChartData.value.cpu.sys = []
  resourcesChartData.value.mem.total = []
  resourcesChartData.value.mem.use = []
  resourcesChartData.value.disk.total = []
  resourcesChartData.value.disk.use = []
  performanceChartData.value.load.one = []
  performanceChartData.value.load.five = []
  performanceChartData.value.load.fifteen = []
  networkChartData.value.bandwidth.upload = []
  networkChartData.value.bandwidth.download = []
  networkChartData.value.flow.upload = []
  networkChartData.value.flow.download = []
  networkChartData.value.socket.currEstab = []
  networkChartData.value.socket.tw = []
  networkChartData.value.socket.used = []
  networkChartData.value.socket.inuse = []
  networkChartData.value.socket.alloc = []
  networkChartData.value.socket.inSegs = []
  networkChartData.value.socket.outSegs = []
  networkChartData.value.socket.retransSegs = []
  f5FlowObj.value.flow.clientBytesIn = []
  f5FlowObj.value.flow.clientBytesOut = []
  f5FlowObj.value.flow.serverBytesIn = []
  f5FlowObj.value.flow.serverBytesOut = []
  f5FlowObj.value.mem.tmm = []
  f5FlowObj.value.mem.host = []
  // await aiops.mail.getMailMetricField({
  //   query: {
  //     instance
  //   }
  // })
  const metricRes = await aiops.mail.getMailMetric({
    query: {
      timestamp__gte: Number(date.formatDate(startTime.value, 'X')),
      timestamp__lte: Number(date.formatDate(endTime.value, 'X')),
      instance
    }
  })
  const dataArr = Object.keys(metricRes.data.results)
  if (dataArr.length > 0) {
    cardInfo.value = metricRes.data.results[dataArr[dataArr.length - 1]]
    if (unitQuery.value.value === 'host' || unitQuery.value.value === 'tomcat' || unitQuery.value.value === 'nginx' || unitQuery.value.value === 'mysql') {
      dataArr.forEach((item) => {
        let totalSize = 0
        let availSize = 0
        xAxis.value.push(date.formatDate(Number(metricRes.data.results[item].timestamp) * 1000, 'HH:mm'))
        resourcesChartData.value.cpu.total.push(Number(metricRes.data.results[item].cpu_rate).toFixed(2))
        resourcesChartData.value.cpu.user.push(Number(metricRes.data.results[item].cpu_user_rate).toFixed(2))
        resourcesChartData.value.cpu.disk.push(Number(metricRes.data.results[item].cpu_iowait_rate).toFixed(2))
        resourcesChartData.value.cpu.sys.push(Number(metricRes.data.results[item].cpu_system_rate).toFixed(2))
        resourcesChartData.value.mem.total.push((Number(metricRes.data.results[item].memory_total) / 1024 / 1024 / 1024).toFixed(2))
        resourcesChartData.value.mem.use.push((Number(metricRes.data.results[item].memory_free) / 1024 / 1024 / 1024).toFixed(2))
        performanceChartData.value.load.one.push(metricRes.data.results[item].node_load1)
        performanceChartData.value.load.five.push(metricRes.data.results[item].node_load5)
        performanceChartData.value.load.fifteen.push(metricRes.data.results[item].node_load15)
        networkChartData.value.bandwidth.upload.push((Number(metricRes.data.results[item].network_transmit) / 1024 / 1024).toFixed(2))
        networkChartData.value.bandwidth.download.push((Number(metricRes.data.results[item].network_receive) / 1024 / 1024).toFixed(2))
        networkChartData.value.flow.upload.push((Number(metricRes.data.results[item].netflow_transmit) / 1024 / 1024).toFixed(2))
        networkChartData.value.flow.download.push((Number(metricRes.data.results[item].netflow_receive) / 1024 / 1024).toFixed(2))
        networkChartData.value.socket.currEstab.push(Number(metricRes.data.results[item].socket_CurrEstab).toFixed(2))
        networkChartData.value.socket.tw.push(Number(metricRes.data.results[item].socket_TCP_tw).toFixed(2))
        networkChartData.value.socket.used.push(Number(metricRes.data.results[item].socket_Sockets_used).toFixed(2))
        networkChartData.value.socket.inuse.push(Number(metricRes.data.results[item].socket_UDP_inuse).toFixed(2))
        networkChartData.value.socket.alloc.push(Number(metricRes.data.results[item].socket_TCP_alloc).toFixed(2))
        networkChartData.value.socket.inSegs.push(Number(metricRes.data.results[item].socket_Tcp_InSegs).toFixed(2))
        networkChartData.value.socket.outSegs.push(Number(metricRes.data.results[item].socket_Tcp_OutSegs).toFixed(2))
        networkChartData.value.socket.retransSegs.push(Number(metricRes.data.results[item].socket_Tcp_RetransSegs).toFixed(2))
        if (metricRes.data.results[item].filesystem_size) {
          metricRes.data.results[item].filesystem_size.forEach((size) => {
            totalSize += Number(size.filesystem_size)
          })
        }
        if (metricRes.data.results[item].filesystem_avail) {
          metricRes.data.results[item].filesystem_avail.forEach((size) => {
            availSize += Number(size.filesystem_avail)
          })
        }
        resourcesChartData.value.disk.use.push((availSize / 1024 / 1024 / 1024).toFixed(2))
        resourcesChartData.value.disk.total.push((totalSize / 1024 / 1024 / 1024).toFixed(2))
      })
    } else if (unitQuery.value.value === 'f5') {
      dataArr.forEach((item) => {
        xAxis.value.push(date.formatDate(Number(item) * 1000, 'HH:mm'))
        f5FlowObj.value.cpu.total.push(Number(metricRes.data.results[item].cpu_rate).toFixed(2))
        f5FlowObj.value.mem.tmm.push(Number((metricRes.data.results[item].memory_tmm) / 1024 / 1024 / 1024).toFixed(2))
        f5FlowObj.value.mem.host.push(Number((metricRes.data.results[item].memory_host) / 1024 / 1024 / 1024).toFixed(2))
        f5FlowObj.value.flow.clientBytesIn.push(Number(metricRes.data.results[item].sysStatClientBytesIn).toFixed(2))
        f5FlowObj.value.flow.clientBytesOut.push(Number(metricRes.data.results[item].sysStatClientBytesOut).toFixed(2))
        f5FlowObj.value.flow.serverBytesIn.push(Number(metricRes.data.results[item].sysStatServerBytesIn).toFixed(2))
        f5FlowObj.value.flow.serverBytesOut.push(Number(metricRes.data.results[item].sysStatServerBytesOut).toFixed(2))
      })
    } else {
      dataArr.forEach((item) => {
        xAxis.value.push(date.formatDate(Number(item) * 1000, 'HH:mm'))
        resourcesChartData.value.cpu.total.push(Number(metricRes.data.results[item].cpu_rate).toFixed(2))
      })
    }
    isRight.value = true
  }
  getWarnLine(instance)
}
const currentPage = ref(1)
const logCount = ref(0)
const logTab = async () => {
  const logRes = await aiops.mail.getMailLog({
    query: {
      instance: unitInstance,
      page: currentPage.value,
      page_size: 10
    }
  })
  logRows.value = logRes.data.results
  logCount.value = logRes.data.count
}
const changePagination = () => {
  logTab()
}
onBeforeMount(async () => {
  if (routeInstance && routeCategory && routeStart && routeEnd) {
    unitQuery.value = categoryOptions.find((category) => category.value === routeCategory)
    startTime.value = date.formatDate(Number(routeStart) * 1000, 'YYYY-MM-DD HH:mm')
    endTime.value = date.formatDate(Number(routeEnd) * 1000, 'YYYY-MM-DD HH:mm')
  }
  await getUnitList(unitQuery.value)
  await getDetail(routeInstance)
})
$bus.on('warn', async (value: boolean) => {
  if (value) {
    await getWarnLine(unitInstance)
  }
})
onBeforeUnmount(() => {
  $bus.off('warn')
})
</script>

<template>
  <div class="MailSystemList">
    <div class="row justify-between q-mt-md">
      <div class="row col-3 items-center justify-between">
        <div class="text-subtitle1">监控单元</div>
        <q-select outlined dense v-model="unitQuery" :options="categoryOptions" label="请选择" class="col-9"
                  @update:model-value="getUnitList"/>
      </div>
      <div class="row items-center">
        <div class="text-subtitle1">时间选择</div>
        <q-input filled dense v-model="startTime" class="q-ml-md">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm" @update:model-value="changeTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h @update:model-value="changeTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div class="q-ml-md">一</div>
        <q-input filled dense v-model="endTime" class="q-ml-md">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm" @update:model-value="changeTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm" format24h @update:model-value="changeTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat/>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="row q-mt-md">
      <q-card flat bordered class="col-3 q-px-xs column">
        <q-input
          class="q-my-sm"
          input-class="cursor-pointer"
          filled
          v-model="queryText"
          :dense="true"
          label="请输入查询的内容"
          @update:model-value="search"
        >
          <template #append>
            <q-icon name="lab la-sistrix" class="cursor-pointer"></q-icon>
          </template>
        </q-input>
        <q-scroll-area class="col" style="min-height: 630px">
          <q-list v-if="unitList.length > 0">
            <q-item
              :class="{'bg-blue-1': active === item.instance}"
              style="min-height: 42px;"
              v-for="(item, index) in unitList"
              :key="index"
              :clickable="active !== item.instance"
              v-ripple
              :active="active === item.instance"
              @click="getDetail(item.instance)"
            >
              <q-item-section>
                {{ item.instance }}&nbsp;({{ item.alias }})
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="row justify-center text-h6 q-mt-xl q-pt-xl">
            <div>
              暂无监控单元
            </div>
          </div>
        </q-scroll-area>
      </q-card>
      <div class="col-9 q-pl-sm" v-if="isRight">
        <header-information :type="isChange" :data-info="cardInfo"/>
          <q-tabs
            v-model="tab"
            style="width: 300px"
            dense
            class="text-grey row"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="sequential" label="时序信息"/>
            <q-tab name="log" label="日志信息" @click="logTab"/>
            <q-tab name="warn" label="告警信息"/>
          </q-tabs>
          <q-separator/>
          <q-tab-panels v-model="tab" animated class="q-mt-sm">
            <q-tab-panel name="sequential" class="no-padding">
              <q-list bordered>
                <q-expansion-item
                    switch-toggle-side
                    expand-separator
                    default-opened
                    label="资源"
                  >
                  <q-separator/>
                    <q-card v-if="unitQuery.value === 'host' || unitQuery.value === 'tomcat' || unitQuery.value === 'nginx' || unitQuery.value === 'mysql'">
                      <q-card-section class="row">
                        <div class="col-6">
                          <line-chart :option="cpuOption"/>
                        </div>
                        <div class="col-6">
                          <line-chart :option="memOption"/>
                        </div>
                        <div class="col-6 q-mt-lg">
                          <line-chart :option="diskOption"/>
                        </div>
                      </q-card-section>
                    </q-card>
                  <q-card v-if="unitQuery.value === 'f5'">
                    <q-card-section class="row">
                      <div class="col">
                        <line-chart :option="f5CpuOption"/>
                      </div>
                      <div class="col">
                        <line-chart :option="f5MemOption"/>
                      </div>
                    </q-card-section>
                  </q-card>
                  <q-card v-if="unitQuery.value === 'vpn' || unitQuery.value === 'firewall' || unitQuery.value === 'switch'">
                    <q-card-section class="row">
                      <div class="col-6">
                        <line-chart :option="f5CpuOption"/>
                      </div>
                    </q-card-section>
                  </q-card>
                  </q-expansion-item>
                <q-expansion-item
                    v-if="unitQuery.value === 'host' || unitQuery.value === 'tomcat' || unitQuery.value === 'nginx' || unitQuery.value === 'mysql'"
                    switch-toggle-side
                    expand-separator
                    default-opened
                    label="性能"
                  >
                  <q-separator/>
                    <q-card>
                      <q-card-section class="row">
                        <div class="col-6">
                          <line-chart :option="loadOption"/>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                <q-expansion-item
                    switch-toggle-side
                    expand-separator
                    default-opened
                    label="网络"
                  >
                  <q-separator/>
                    <q-card v-if="unitQuery.value === 'host' || unitQuery.value === 'tomcat' || unitQuery.value === 'nginx' || unitQuery.value === 'mysql'">
                      <q-card-section class="row">
                        <div class="col-6">
                          <line-chart :option="bandwidthOption"/>
                        </div>
                        <div class="col-6">
                          <histogram-chart :option="flowOption" height="220"/>
                        </div>
                        <div class="col-6 q-mt-lg">
                          <line-chart :option="socketOption"/>
                        </div>
                      </q-card-section>
                    </q-card>
                  <q-card v-if="unitQuery.value === 'f5'">
                    <q-card-section class="row">
                      <div class="col-6">
                        <line-chart :option="f5FlowOption"/>
                      </div>
                    </q-card-section>
                  </q-card>
                  </q-expansion-item>
                </q-list>
            </q-tab-panel>
            <q-tab-panel name="log" class="no-padding">
              <q-table
                class="my-sticky-column-table q-pb-sm"
                flat
                bordered
                :rows="logRows"
                :table-header-style="{ backgroundColor: 'rgb(239, 240, 244)' }"
                :columns="logColumns"
                hide-pagination
                no-data-label="暂无日志信息"
                :pagination="{ rowsPerPage: 0 }"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="time" auto-width>
                      {{ date.formatDate(props.row.timestamp / 1000000, 'YYYY-MM-DD HH:mm') }}
                    </q-td>
                    <q-td key="source" auto-width>
<!--                      <q-chip v-show="props.row.logType === 'error'" square dense color="aiops-negative" text-color="white" :label="props.row.logType" />-->
<!--                      <q-chip v-show="props.row.logType !== 'error'" square dense :label="props.row.logType" />-->
                      {{ props.row.log_source }}
                    </q-td>
                    <q-td key="info" style="max-width: 500px; white-space: pre-wrap;">
                      {{ props.row.text }}
                    </q-td>
<!--                    <q-td key="info" style="max-width: 500px; white-space: pre-wrap;">-->
<!--                      <div class="row wrap">-->
<!--                        <div-->
<!--                          v-for="(value, key, index) in props.row.info"-->
<!--                          :key="index"-->
<!--                          :class="[-->
<!--                  {'col-6': key !== 'message'},-->
<!--                  {'ellipsis': key !== 'message'},-->
<!--                  {'bg-aiops-hover-primary': key === 'message'},-->
<!--                  {'col-12': key === 'message'},-->
<!--                  'q-pr-sm'-->
<!--                ]"-->
<!--                        >-->
<!--                          {{ key }}: {{ value }}-->
<!--                        </div>-->
<!--                      </div>-->
<!--                    </q-td>-->
                  </q-tr>
                </template>
              </q-table>
              <div class="row justify-end q-mt-sm">
                <q-pagination
                  v-model="currentPage"
                  :max="logCount / 10"
                  input
                  @update:model-value="changePagination"
                />
              </div>
            </q-tab-panel>
            <q-tab-panel name="warn" class="no-padding" >
              <q-table
                class="my-sticky-column-table"
                flat
                bordered
                :rows="rows1"
                :table-header-style="{ backgroundColor: 'rgb(239, 240, 244)' }"
                :columns="columns1"
                :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
                :pagination="{ rowsPerPage: 10 }"
                row-key="id"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="index" auto-width>
                      {{ props.row.index }}
                    </q-td>
                    <q-td key="name" auto-width>
                      {{ props.row.name }}
                    </q-td>
                    <q-td key="time" auto-width>
                      {{ props.row.time }}
                    </q-td>
                    <q-td key="type" auto-width>
                      {{ props.row.type }}
                    </q-td>
                    <q-td key="rule" auto-width>
                      {{ props.row.rule }}
                    </q-td>
                    <q-td key="level" auto-width>
                      {{ props.row.level }}
                    </q-td>
                    <q-td key="state" auto-width>
                      {{ props.row.state }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
      </div>
      <!-- 无数据 -->
      <div v-else class="column justify-center items-center transform-no-data" style="flex: 1">
        <my-no-data :width="300"></my-no-data>
        <p>请在左侧选择监控单元</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.MailSystemList {
}
</style>
