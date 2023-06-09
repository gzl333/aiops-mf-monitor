<script setup lang="ts">
import { computed, ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { UnitInterface, UnitMetricInterface } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
import aiops from 'src/api/aiops'
import { date } from 'quasar'
import MyNoData from 'components/mail/MyNoData.vue'
import LineChart from 'components/chart/LineChart.vue'
// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

// const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
const timeStamp = Date.now()
const formattedString = date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm')
const endTime = ref(formattedString)
const startDate = date.subtractFromDate(endTime.value, { minutes: 5 })
const startTime = ref(date.formatDate(startDate, 'YYYY-MM-DD HH:mm'))
const queryText = ref('')
const active = ref()
const unitList = ref<UnitInterface[]>([])
const allUnitList = ref<UnitInterface[]>([])
const tab = ref('sequential')
const cardInfo = ref<UnitMetricInterface[]>([])
const isRight = ref(false)
const unitQuery = ref({
  value: 'host',
  label: '主机',
  labelEn: 'host'
})
const xAxis = ref<string[]>([])
const unitOptions = [
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
    value: 'load_balance',
    label: 'F5负载均衡',
    labelEn: 'load_balance'
  },
  {
    value: 'VPN',
    label: 'VPN',
    labelEn: 'VPN'
  },
  {
    value: 'Tomcat',
    label: 'Tomcat',
    labelEn: 'Tomcat'
  },
  {
    value: 'Nginx',
    label: 'Nginx',
    labelEn: 'Nginx'
  },
  {
    value: 'MySQL',
    label: 'MySQL',
    labelEn: 'MySQL'
  }
]

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
interface WarningLineInterface {
  instance: string
  cpu_rate: number
  memory_used: number
  disk_used: number
}

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
const cpuOption = computed(() => ({
  title: {
    text: 'CPU使用率',
    textStyle: {
      fontSize: 15
    }
  },
  tooltip: {
    trigger: 'axis'
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
    type: 'value',
    max: 100,
    min: 0
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
          formatter: warningLineObj.value ? '预警线' + warningLineObj.value.cpu_rate + '%' : ''
        },
        data: [{
          silent: false, // 鼠标悬停事件  true没有，false有
          lineStyle: { // 警戒线的样式  ，虚实  颜色
            type: 'solid',
            color: 'rgba(238, 99, 99)'
          },
          yAxis: warningLineObj.value ? warningLineObj.value.cpu_rate : '' // 警戒线在y轴的坐标
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
    type: 'value',
    max: 1000,
    min: 0
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
          formatter: warningLineObj.value ? '预警线' + warningLineObj.value.memory_used + 'GB' : ''
        },
        data: [{
          silent: false, // 鼠标悬停事件  true没有，false有
          lineStyle: { // 警戒线的样式  ，虚实  颜色
            type: 'solid',
            color: 'rgba(238, 99, 99)'
          },
          yAxis: warningLineObj.value ? warningLineObj.value.memory_used : '' // 警戒线在y轴的坐标
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
    type: 'value',
    max: 2000,
    min: 0
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
          formatter: warningLineObj.value ? '预警线' + warningLineObj.value.disk_used + 'GB' : ''
        },
        data: [{
          silent: false, // 鼠标悬停事件  true没有，false有
          lineStyle: { // 警戒线的样式  ，虚实  颜色
            type: 'solid',
            color: 'rgba(238, 99, 99)'
          },
          yAxis: warningLineObj.value ? warningLineObj.value.disk_used : '' // 警戒线在y轴的坐标
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
    type: 'value',
    max: 300,
    min: 0
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
const search = () => {
  if (queryText.value === '') {
    unitList.value = allUnitList.value
  } else {
    unitList.value = allUnitList.value.filter(item => item.instance.indexOf(queryText.value) !== -1)
  }
}
const getDetail = async (instance: string) => {
  xAxis.value = []
  resourcesChartData.value.cpu.total = []
  resourcesChartData.value.cpu.user = []
  resourcesChartData.value.cpu.disk = []
  resourcesChartData.value.cpu.sys = []
  active.value = instance
  const metricRes = await aiops.mail.getMailMetric({
    query: {
      timestamp__gte: Number(date.formatDate(startTime.value, 'X')),
      timestamp__lte: Number(date.formatDate(endTime.value, 'X')),
      instance
    }
  })
  cardInfo.value = metricRes.data.results
  metricRes.data.results.forEach((item: UnitMetricInterface) => {
    // console.log(item)
    xAxis.value.unshift(date.formatDate(item.timestamp * 1000, 'HH:mm'))
    resourcesChartData.value.cpu.total.unshift(Number(item.cpu_rate).toFixed(2))
    resourcesChartData.value.cpu.user.unshift(Number(item.cpu_user_rate).toFixed(2))
    resourcesChartData.value.cpu.disk.unshift(Number(item.cpu_iowait_rate).toFixed(2))
    resourcesChartData.value.cpu.sys.unshift(Number(item.cpu_system_rate).toFixed(2))
    resourcesChartData.value.mem.total.unshift((Number(item.memory_total) / 1024 / 1024 / 1024).toFixed(2))
    resourcesChartData.value.mem.use.unshift((Number(item.memory_used) / 1024 / 1024 / 1024).toFixed(2))
    resourcesChartData.value.disk.total.unshift((Number(item.filesystem_avail) / 1024 / 1024 / 1024).toFixed(2))
    resourcesChartData.value.disk.use.unshift((Number(item.filesystem_size) / 1024 / 1024 / 1024).toFixed(2))
    performanceChartData.value.load.one.unshift(item.node_load1)
    performanceChartData.value.load.five.unshift(item.node_load5)
    performanceChartData.value.load.fifteen.unshift(item.node_load15)
    networkChartData.value.bandwidth.upload.unshift((Number(item.network_transmit) / 1024 / 1024).toFixed(2))
    networkChartData.value.bandwidth.download.unshift((Number(item.network_receive) / 1024 / 1024).toFixed(2))
    networkChartData.value.socket.currEstab.unshift(Number(item.socket_CurrEstab).toFixed(2))
    networkChartData.value.socket.tw.unshift(Number(item.socket_TCP_tw).toFixed(2))
    networkChartData.value.socket.used.unshift(Number(item.socket_Sockets_used).toFixed(2))
    networkChartData.value.socket.inuse.unshift(Number(item.socket_UDP_inuse).toFixed(2))
    networkChartData.value.socket.alloc.unshift(Number(item.socket_TCP_alloc).toFixed(2))
    networkChartData.value.socket.inSegs.unshift(Number(item.socket_Tcp_InSegs).toFixed(2))
    networkChartData.value.socket.outSegs.unshift(Number(item.socket_Tcp_OutSegs).toFixed(2))
    networkChartData.value.socket.retransSegs.unshift(Number(item.socket_Tcp_RetransSegs).toFixed(2))
  })
  const warningRes = await aiops.mail.getMetricWarning({ query: { instance } })
  warningLineObj.value = warningRes.data.results[0]
  isRight.value = true
}
const changeUnit = async (val: Record<string, string>) => {
  const res = await aiops.mail.getMailMachine({ query: { category: val.value, page: 1, page_size: 100 } })
  unitList.value = res.data.results
  allUnitList.value = res.data.results
}
changeUnit(unitQuery.value)
</script>

<template>
  <div class="MailSystemList column" style="height: calc(100vh - 120px)">
    <div class="row justify-between col-1">
      <div class="row col-3 items-center justify-between">
        <div class="text-subtitle1">监控单元</div>
        <q-select outlined dense v-model="unitQuery" :options="unitOptions" label="请选择" class="col-9"
                  @update:model-value="changeUnit"/>
      </div>
      <div class="row items-center">
        <div class="text-subtitle1">时间选择</div>
        <q-input filled dense v-model="startTime" class="q-ml-md">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm">
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
                <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
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
                <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm">
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
                <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm" format24h>
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
    <div class="row col-10">
      <q-card flat bordered class="col-3 q-px-xs" style="height: 100%">
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
        <q-scroll-area style="height: 90%">
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
        <q-card flat bordered class="my-card row" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
          <q-card-section class="col-4">
            <div>
              <span>操作系统：</span>
              <span>{{ cardInfo[0].sys_name }}</span>
            </div>
            <div class="q-mt-xs">
              <span>系统内核：</span>
              <span>{{ cardInfo[0].release }}</span>
            </div>
            <div class="q-mt-xs">
              <span>启动天数：</span>
              <span>{{ cardInfo[0].boot_days }}天</span>
            </div>
            <div class="q-mt-xs">
              <span>健康值：</span>
              <span>/</span>
            </div>
            <div class="q-mt-xs">
              <span>告警数：</span>
              <span>/</span>
            </div>
          </q-card-section>
          <q-card-section class="col">
            <div>
              <span>内存：</span>
              <span>{{ (Number(cardInfo[0].memory_total) / 1024 / 1024 / 1024).toFixed(2) }}GB</span>
            </div>
            <div class="q-mt-xs">
              <span>CPU：</span>
              <span>{{ cardInfo[0].cpu_core_count }}核</span>
            </div>
            <div class="q-mt-xs">
              <span>负载：</span>
              <span>{{ cardInfo[0].node_load1 }}</span>
            </div>
            <div class="q-mt-xs">
              <span>CPU使用率：</span>
              <span>{{ Number(cardInfo[0].cpu_rate).toFixed(2) }}%</span>
            </div>
            <div class="q-mt-xs">
              <span>内存使用率：</span>
              <span>{{ (Number(cardInfo[0].memory_used) / Number(cardInfo[0].memory_total)).toFixed(2) }}%</span>
            </div>
          </q-card-section>
          <q-card-section class="col">
            <div>
              <span>分区使用率：</span>
              <span>{{ Number(cardInfo[0].filesystem_used_rate).toFixed(2) }}%</span>
            </div>
            <div class="q-mt-xs">
              <span>IOutil使用率：</span>
              <span>/</span>
            </div>
            <div class="q-mt-xs">
              <span>磁盘读取：</span>
              <span>{{ (Number(cardInfo[0].disk_read) / 1024 / 1024 / 1024).toFixed(2) }}GB/s</span>
            </div>
            <div class="q-mt-xs">
              <span>磁盘写入：</span>
              <span>{{ (Number(cardInfo[0].disk_written) / 1024 / 1024 / 1024).toFixed(2) }}GB/s</span>
            </div>
          </q-card-section>
          <q-card-section class="col">
            <div>
              <span>连接数：</span>
              <span>{{ cardInfo[0].socket_CurrEstab }}</span>
            </div>
            <div class="q-mt-xs">
              <span>tcp_tw：</span>
              <span>{{ cardInfo[0].socket_TCP_tw }}</span>
            </div>
            <div class="q-mt-xs">
              <span>下载带宽：</span>
              <span>{{ (Number(cardInfo[0].network_receive) / 1024 / 1024).toFixed(2) }}Mb/s</span>
            </div>
            <div class="q-mt-xs">
              <span>上传带宽：</span>
              <span>{{ (Number(cardInfo[0].network_transmit) / 1024 / 1024).toFixed(2) }}MB/s</span>
            </div>
          </q-card-section>
        </q-card>
        <div style="height: 100%">
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
            <q-tab name="log" label="日志信息"/>
            <q-tab name="warn" label="告警信息"/>
          </q-tabs>

          <q-separator/>

          <q-tab-panels v-model="tab" animated style="height: 100%">
            <q-tab-panel name="sequential">
              <q-scroll-area style="height: 70%">
                <q-list bordered>
                  <q-expansion-item
                    switch-toggle-side
                    expand-separator
                    default-opened
                    label="资源"
                  >
                    <q-card>
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
                  </q-expansion-item>
                  <q-expansion-item
                    switch-toggle-side
                    expand-separator
                    default-opened
                    label="性能"
                  >
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
                    <q-card>
                      <q-card-section class="row">
                        <div class="col-6">
                          <line-chart :option="bandwidthOption"/>
                        </div>
<!--                        <div class="col-6">-->
<!--                          <line-chart :option="cpuOption"/>-->
<!--                        </div>-->
                        <div class="col-6">
                          <line-chart :option="socketOption"/>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>
              </q-scroll-area>
            </q-tab-panel>

            <q-tab-panel name="log">
              <div class="text-h6">
                待上线中
              </div>
            </q-tab-panel>

            <q-tab-panel name="warn">
              <div class="text-h6">
                待上线中
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
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
