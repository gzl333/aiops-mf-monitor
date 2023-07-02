<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
import PieChart from 'components/chart/PieChart.vue'
import HistogramChart from 'components/chart/HistogramChart.vue'
// import { navigateToUrl } from 'single-spa'
import { date } from 'quasar'
import aiops from 'src/api/aiops'
import LineChart from 'components/chart/LineChart.vue'
import { navigateToUrl } from 'single-spa'
// import { date } from 'quasar'
import { i18n } from 'boot/i18n'
// import { store } from 'quasar/wrappers'
// import { sharpInsertLink } from '@quasar/extras/material-icons-sharp'
// import { List } from 'echarts'

// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

// interface delay_distribution_interface {
//   '1s-3s': number
//   '50ms-100ms': number
//   '100ms-300ms': number
//   '300ms-600ms': number
//   '600ms-1s': number
//   '<50ms': number
//   '>3s': number
// }
// const res = aiops.monitor.getWebsite()
// console.log(res)

interface delay_distribution_series {
  name: string
  type: string
  data: number[]
}
interface runtime_mission_list {
  id: string
  mission_name: string
  mission_url: string
  mission_status: string
  mission_delay: number
  probe: string
  detail: string
}
// const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc
// const webMonitorTaskRow = computed(() => store.getWebMonitorTaskTable())
const overviewOption = computed(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: '任务状态总览',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: '正常' },
        { value: 735, name: '异常' }
      ]
    }
  ]
}))
const delayOption = computed(() => ({
  title: {
    text: '任务时延分布'
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
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: ['<50ms', '50ms-100ms', '100ms-300ms', '300ms-600ms', '600ms-1s', '1s-3s', '>3s']
  },
  series: series_ref.value
}))
const tc = i18n.global.tc
// [
// {
//   name: '探针1',
//   type: 'bar',
//   data: [103, 239, 294, 1070, 1144, 6303, 200]
// },
//   {
//     name: '探针2',
//     type: 'bar',
//     data: [195, 238, 300, 1194, 1311, 6810, 190]
//   }
// ]
const series_ref = ref<delay_distribution_series[]>([])
const runtime_ref = ref<runtime_mission_list[]>([])
const typeselect = ref('探针1')
const options = [
  '探针1', '探针2'
]
const pagination = ref({
  page: 1,
  rowsPerPage: 20
})

// const columns = [
//   {
//     name: 'name',
//     required: true,
//     label: '告警时间',
//     align: 'left',
//     field: 'name'
//   },
//   { name: 'mission_name', align: 'center', label: '告警详情', field: 'mission_name' }
// ]

// const rows = [
//   {
//     name: 'Frozen Yogurt',
//     mission_name: 159
//   },
//   {
//     name: 'Ice cream sandwich',
//     mission_name: 237
//   },
//   {
//     name: 'Eclair',
//     mission_name: 262
//   },
//   {
//     name: 'Cupcake',
//     mission_name: 305
//   },
//   {
//     name: 'Gingerbread',
//     mission_name: 356
//   }
// ]
const date1 = ref(date.formatDate(date.subtractFromDate(Date.now(), { days: 7 }), 'YYYY-MM-DD HH:mm'))
const date2 = ref(date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'))
// console.log(date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'))
// const model = ref(null)
// const options = [
//   '探针1', '探针2'
// ]
// const standard = ref({
//   min: 10,
//   max: 35
// })
// const text = ref('')
// const columns1 = computed(() => [
//   { name: 'id', label: (() => tc('任务id'))(), align: 'center', field: 'id' },
//   { name: 'name', label: (() => tc('任务名称'))(), align: 'center', field: 'name' },
//   { name: 'url', label: (() => tc('监控url'))(), align: 'center', field: 'url' },
//   { name: 'remark', label: (() => tc('备注'))(), align: 'center', field: 'remark' },
//   { name: 'creation', label: (() => tc('创建时间'))(), align: 'center', field: 'creation' },
//   { name: 'operation', label: (() => tc('操作'))(), field: 'operation', align: 'center' }
// ])
// const isLoad = ref(false)

const cpuOption = computed(() => ({
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  title: {
    text: '24小时状态分布图'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['异常', '高延迟', '流畅']
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['-24', '-23', '-22', '-21`', '-20', '-19', '-18', '-17', '-16', '-15', '-14', '-13', '-12', '-11`', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '异常',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: 'red'
      },
      emphasis: {
        focus: 'series'
      },
      data: hour_rate_data_1.value
    },
    {
      name: '高延迟',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: 'yellow'
      },
      emphasis: {
        focus: 'series'
      },
      data: hour_rate_data_2.value
    },
    {
      name: '流畅',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: 'green'
      },
      emphasis: {
        focus: 'series'
      },
      data: hour_rate_data_3.value
    }
  ]
}))
const hour_rate_data_1 = ref<number[]>([])
const hour_rate_data_2 = ref<number[]>([])
const hour_rate_data_3 = ref<number[]>([])
const getStatusHourRate = () => {
  hour_rate_data_1.value = []
  hour_rate_data_2.value = []
  hour_rate_data_3.value = []
  const probeType = typeselect.value
  const probeid = ref(1)
  if (probeType === '探针1' || probeType === null) {
    probeid.value = 1
  } else {
    probeid.value = 2
  }
  aiops.monitor.getStatusHourRate({ query: { probe_id: probeid.value } }).then((res) => {
    const single_hour_rate_1: number[] = []
    const single_hour_rate_2: number[] = []
    const single_hour_rate_3: number[] = []
    for (const resKey in res.data) {
      for (const hourKey in res.data[resKey]) {
        if (hourKey === '流畅') {
          single_hour_rate_3.push(res.data[resKey][hourKey])
        } else if (hourKey === '异常') {
          single_hour_rate_1.push(res.data[resKey][hourKey])
        } else if (hourKey === '高延迟') {
          single_hour_rate_2.push(res.data[resKey][hourKey])
        }
      }
    }
    hour_rate_data_1.value = single_hour_rate_1
    hour_rate_data_2.value = single_hour_rate_2
    hour_rate_data_3.value = single_hour_rate_3
  })
}

const all_mission_cnt = ref(null)
const invalid_mission_cnt = ref(null)
const valid_mission_cnt = ref(null)
const getStatusOverview = () => {
  aiops.monitor.getStatusOverview().then((res) => {
    all_mission_cnt.value = res.data.total
    invalid_mission_cnt.value = res.data.invalid
    valid_mission_cnt.value = res.data.valid
  })
}
const getDelayDistribution = () => {
  const start_time = date.formatDate(date1.value, 'X')
  const end_time = date.formatDate(date2.value, 'X')
  const tmp_series_ref = ref<delay_distribution_series[]>([])
  aiops.monitor.getDelayDistribution({ query: { start: start_time, end: end_time } }).then((res) => {
    for (const resKey in res.data) {
      // const single_bar: type= new Map()
      // console.log(resKey)
      const single_bar: delay_distribution_series = {
        name: '',
        type: '',
        data: []
      }
      const bar_data : number[] = []
      single_bar.name = '探针' + resKey
      single_bar.type = 'bar'
      // single_bar.set('name', '探针' + resKey)
      // single_bar.set('type', 'bar')
      for (const barDataKey in res.data[resKey]) {
        // console.log(barDataKey)
        // console.log(res.data[resKey][barDataKey])
        bar_data.push(res.data[resKey][barDataKey])
      }
      // single_bar.set('data', bar_data)
      single_bar.data = bar_data.reverse()
      // console.log(bar_data)
      tmp_series_ref.value.push(single_bar)
    }
  })
  // console.log(res)
  // console.log(series_ref.value)
  series_ref.value = tmp_series_ref.value
  // console.log('hello')
  // console.log(series_ref.value)
}
watch(date1, (newValue, oldValue) => {
  // const bigger_time = date.formatDate(date2.value, 'X')
  // console.log(oldValue)
  const unit = 'seconds'
  const now = date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm')
  let diff = date.getDateDiff(newValue, now, unit)
  if (diff > 0) {
    date1.value = oldValue
    alert('time should not bigger than now!')
  }
  diff = date.getDateDiff(date2.value, newValue, unit)
  if (diff < 0) {
    date1.value = oldValue
    alert('start time should not biggger than end time!')
  }
  if (date1.value !== oldValue) {
    getDelayDistribution()
    getAlertCnt()
  }
  // console.log(bigger_time)
  // console.log(newValue)
  // console.log(diff)
})
watch(date2, async (newValue, oldValue) => {
  // const bigger_time = date.formatDate(date2.value, 'X')
  const unit = 'seconds'
  const now = date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm')
  let diff = date.getDateDiff(newValue, now, unit)
  if (diff > 0) {
    date2.value = oldValue
    alert('time should not bigger than now!')
  }
  diff = date.getDateDiff(date1.value, newValue, unit)
  if (diff > 0) {
    date2.value = oldValue
    alert('end time should not be smaller than start time!')
  }
  if (date2.value !== oldValue) {
    getDelayDistribution()
    getAlertCnt()
  }
  // console.log(bigger_time)
  // console.log(newValue)
  // console.log(diff)
})
const alertCnt = ref(null)
const getAlertCnt = () => {
  const start_time = date.formatDate(date1.value, 'X')
  const end_time = date.formatDate(date2.value, 'X')
  // const tmp_series_ref = ref<delay_distribution_series[]>([])
  aiops.monitor.getAlertCnt({ query: { start: start_time, end: end_time } }).then((res) => {
    for (const resKey in res.data.results) {
      // const single_bar: type= new Map()
      // console.log(resKey)
      if (res.data.results[resKey].alertname !== 'webPageNotAvailable') {
        continue
      }
      alertCnt.value = res.data.results[resKey].count
    }
  })
  // console.log(res)
  // console.log(series_ref.value)
  // series_ref.value = tmp_series_ref.value
}
getStatusHourRate()
getDelayDistribution()
getStatusOverview()
getAlertCnt()
// const fun2 = () => {
//   model_option_type_search.value = null
// }
function compareStatus (a, b) {
  if (a === b) return 0
  if (a === '异常') return -1
  if (b === '异常') return 1
  if (a === '高延迟') return -1
  if (b === '高延迟') return 1
}
function compareStatus1 (a, b) {
  if (a > b) return 1
  if (a === b) return 0
  if (a < b) return -1
}
const getStatusRate = () => {
  runtime_ref.value = []
  aiops.monitor.getStatusRate({ query: { probe_id: 1 } }).then((res1) => {
    for (const res1Key in res1.data.results) {
      const single_data: runtime_mission_list = {
        id: '',
        mission_name: '',
        mission_url: '',
        mission_status: '',
        mission_delay: 0,
        probe: '',
        detail: ''
      }
      single_data.id = res1.data.results[res1Key].id
      single_data.mission_name = res1.data.results[res1Key].name
      single_data.mission_url = res1.data.results[res1Key].url
      single_data.mission_status = res1.data.results[res1Key].状态
      // console.log(res1.data.results[res1Key].耗时)
      if (single_data.mission_status === '异常') {
        single_data.mission_delay = res1.data.results[res1Key].耗时.substring(0, res1.data.results[res1Key].耗时.length - 3) * -1
      } else {
        single_data.mission_delay = res1.data.results[res1Key].耗时.substring(0, res1.data.results[res1Key].耗时.length - 3) * 1
      }
      single_data.probe = '1'
      single_data.detail = '查看详情'
      runtime_ref.value.push(single_data)
    }
  })
  aiops.monitor.getStatusRate({ query: { probe_id: 2 } }).then((res2) => {
    for (const res2Key in res2.data.results) {
      const single_data: runtime_mission_list = {
        id: '',
        mission_name: '',
        mission_url: '',
        mission_status: '',
        mission_delay: 0,
        probe: '',
        detail: ''
      }
      single_data.id = res2.data.results[res2Key].id
      single_data.mission_name = res2.data.results[res2Key].name
      single_data.mission_url = res2.data.results[res2Key].url
      single_data.mission_status = res2.data.results[res2Key].状态
      if (single_data.mission_status === '异常') {
        single_data.mission_delay = res2.data.results[res2Key].耗时.substring(0, res2.data.results[res2Key].耗时.length - 3) * -1
      } else {
        single_data.mission_delay = res2.data.results[res2Key].耗时.substring(0, res2.data.results[res2Key].耗时.length - 3) * 1
      }
      single_data.probe = '2'
      single_data.detail = '查看详情'
      // console.log(single_data)
      runtime_ref.value.push(single_data)
    }
  })
  // console.log(res1)
}
getStatusRate()
const runtime_columns = [
  { name: 'mission_name', align: 'center', label: '任务名称', field: 'mission_name', sortable: true },
  { name: 'mission_url', align: 'center', label: '任务链接', field: 'mission_url', sortable: true },
  { name: 'mission_status', align: 'center', label: '任务状态', field: 'mission_status', sortable: true, sort: (a, b) => compareStatus(a, b) },
  { name: 'mission_delay', align: 'center', label: '任务延时(ms)', field: 'mission_delay', sortable: true, sort: (a, b) => compareStatus1(a, b) },
  { name: 'probe', align: 'center', label: '探测节点', field: 'probe', sortable: true }
]
const runtime_rows = runtime_ref
</script>

<template>
  <div class="WebAccessibility">
    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="row">
            <div class="col-5">
              <div class="row items-center">
                <div class="row items-center justify-end">
                  <q-input class="q-mr-md" filled dense v-model="date1">
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="date1" mask="YYYY-MM-DD HH:mm">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>

                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="date1" mask="YYYY-MM-DD HH:mm" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <div class="q-mr-md">一</div>
                  <q-input filled dense v-model="date2">
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="date2" mask="YYYY-MM-DD HH:mm">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>

                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="date2" mask="YYYY-MM-DD HH:mm" format24h>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="q-mt-lg">
                  <div class="col text-center">
                  <div>告警数：{{ alertCnt }}</div>
                    <div></div>
                  </div>
                </div>
              </div>
              <div class="row items-center">
                <div class="col">
                  <pie-chart height="220" :option="overviewOption"/>
                </div>
                <div class="col text-center">
                  <div class="text-h6">当前任务总览</div>
                  <div class="q-mt-sm">总任务数：{{ all_mission_cnt }}</div>
                  <div>异常数：{{ invalid_mission_cnt }}</div>
                  <div>正常连接数：{{ valid_mission_cnt }}</div>
                </div>
              </div>
            </div>
            <div class="col-7">
              <div class="q-mt-lg">
                <histogram-chart :option="delayOption" height="385"/>
              </div>
            </div>
          </div>
          <div class="row">
            <q-select outlined dense v-model="typeselect" :options="options" label="请选择" class="col-3"
                      @update:model-value="getStatusHourRate"/>
            <line-chart :option="cpuOption"/>
          </div>
          <div class="row">
            <q-table
              flat
              class="col"
              table-header-class="bg-grey-1 text-grey"
              title="实时监控任务结果"
              color="primary"
              :rows="runtime_rows"
              :loading-label="tc('notifyLoading')"
              :no-data-label="tc('noData')"
              :columns="runtime_columns"
              row-key="name"
              v-model:pagination=pagination
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="id" :props="props" class="no-padding" v-show="false">
                  </q-td>
                  <q-td key="mission_name" :props="props" class="no-padding">
                    <q-btn no-caps flat color="primary" :label="tc('查看详情')" @click="navigateToUrl(`/my/monitor/web/detail/${props.row.id}`)"/>
                    {{ props.row.mission_name }}
                  </q-td>
                  <q-td key="mission_url" :props="props" class="no-padding">
                    {{ props.row.mission_url }}
                  </q-td>
                  <q-td key="mission_status" :props="props" :class="props.row.mission_status === '异常' ? 'text-negative' : props.row.mission_status === '流畅' ? 'text-positive' : 'text-warning'">
                    {{ props.row.mission_status }}
                  </q-td>
                  <q-td key="mission_delay" :props="props">
                    {{ props.row.mission_status !== '异常' ? props.row.mission_delay : props.row.mission_delay * -1 }}
                  </q-td>
                  <q-td key="probe" :props="props" class="no-padding">
                    {{ props.row.probe === '1' ? '探针1（软件园区）' : '探针2（信息化大厦）' }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.WebAccessibility {
}
</style>
