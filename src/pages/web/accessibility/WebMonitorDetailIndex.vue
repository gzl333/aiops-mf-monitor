<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'stores/store'
import { useRoute, useRouter } from 'vue-router'
// import service from 'src/api/service'
import { i18n } from 'boot/i18n'
import { date, Notify } from 'quasar'
import WebHistogramChart from 'components/Chart/WebHistogramChart.vue'
import aiops from 'src/api/aiops'

// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])
interface WebMonitorInterface {
  metric: {
    group: string
    instance: string
    job: string
    monitor: string
    phase?: string
    receive_cluster: string
    receive_replica: 1
    tenant_id: string
    url: string
    urlhash: string
    __name__: string
  },
  values: [number, string][]
}
interface MaxInterface {
  maxTime: string
  minTime: string
}
const store = useStore()
const route = useRoute()
const router = useRouter()
const { tc } = i18n.global
// const arr1 = computed(() => store.getDetectionPointTable())
const arr1 = [{ value: '1', label: '软件园区' }, { value: '2', label: '信息化大厦' }]
const taskId = route.params.webMonitorTaskId as string
const nowTime = new Date().getTime()
// 请求起始时间戳
const startTimeStamp = Math.round(nowTime / 1000 - 1800)
// 用与存储x轴坐标时间
const xAxis = ref<string[]>([])
// 图表数据
const chartSeries = ref<Record<string, unknown>[]>([])
// 用与存储状态判断政府
const statusObj = ref<Record<string, Array<[number, string]>>>({})
// 用于判断图表状态，后端有坏数据无法显示
const chartStatus = ref<'normal' | 'error'>('normal')
// 刷新时间
const renovateTime = ref(60)
// 用于判断该任务是否是新创建第一页进入页面
const isNewCreate = ref(true)
// 用于判断刷新时是否有最新数据
const isHaveChange = ref(false)
const isEmpty = ref(false)
const isCurrent = ref(true)
const tab = ref('recent')
// 用于存储总耗时
const durationTotalArr: Record<string, Array<[number, string]>> = {}
// 存放最大值最小值对应的x轴时间
const maxMinObj: Record<string, MaxInterface> = {}
// 存在x轴时间戳数组
let xTimeStamp: number[] = []
// 最后一条数据的时间，用于计算下次刷新时间
let lastTimeStamp: number
const normalColor = ['#8085e9', '#a5c2d5', '#73C0DE', '#8AC070', '#5470C6']
const errorColor = ['#EE6666', '#FD7F55', '#c12c44', '#FFC936', '#FEA147']
// 获取x轴，不依据后端返回数据，固定30条数据，无数据则为空
const getXAxis = (start: number, step: number) => {
  xAxis.value = []
  xTimeStamp = []
  let time = start
  for (let i = 0; i < 30; i++) {
    if (step === 60) {
      const formattedString = date.formatDate(time * 1000, 'HH:mm:ss')
      xAxis.value.push(formattedString)
    } else {
      const formattedString = date.formatDate(time * 1000, 'MM-DD HH:mm')
      xAxis.value.push(formattedString)
    }
    xTimeStamp.push(time)
    time += step
  }
  // lastTimeStamp为x轴最后一次时间，用于计算下一次刷新的时间
  lastTimeStamp = xTimeStamp[xTimeStamp.length - 1]
}
const calcMaxMin = (id: string, step: number) => {
  let max = 0
  let maxTimeStamp = 0
  let min = 100
  let minTimeStamp = 0
  const obj = {
    maxTime: '',
    minTime: ''
  }
  durationTotalArr[id].forEach((item: [number, string]) => {
    if (item[1] !== '') {
      if (Number(item[1]) > max) {
        max = Number(item[1])
        maxTimeStamp = item[0]
      }
      if (Number(item[1]) < min) {
        min = Number(item[1])
        minTimeStamp = item[0]
      }
    }
  })
  if (step === 60) {
    obj.maxTime = date.formatDate(maxTimeStamp * 1000, 'HH:mm:ss')
    obj.minTime = date.formatDate(minTimeStamp * 1000, 'HH:mm:ss')
  } else {
    obj.maxTime = date.formatDate(maxTimeStamp * 1000, 'MM-DD HH:mm')
    obj.minTime = date.formatDate(minTimeStamp * 1000, 'MM-DD HH:mm')
  }
  maxMinObj[id] = obj
}
// 获取数据
const getWebMonitoringData = async (detectId: string, name: string, start: number, step:number, index: number) => {
  // 先请求获取状态码，再去请求获取耗时，因为图表通过正负区分方向，状态码异常时需要 * -1，所以需要先获取状态码之后再去请求耗时
  // 固定30条数据，根据传入的步长请求数据
  const statusResp = await aiops.monitor.getMonitorWebsiteQueryRange({ query: { query: 'http_status_code', start, probe_id: detectId, step }, path: { id: taskId } })
  // item.metric.monitor === 'example' 为后端出现坏数据时的条件判断，数据出现问题时返回数据中的monitor字段为‘example’
  if (statusResp.status === 200 && statusResp.data.length > 0 && statusResp.data.findIndex((item: WebMonitorInterface) => item.metric.monitor === 'example') === -1) {
    // 存放状态元组
    let statusSeriesData: [number, string][]
    const stagingStatusData: Array<[number, string]> = []
    // 固定30条数据，因存在时间误差后端可能返回31条数据
    if (statusResp.data[0].values.length <= 30) {
      statusSeriesData = statusResp.data[0].values
    } else {
      statusSeriesData = statusResp.data[0].values.slice(0, -1)
    }
    // statusSeriesData[10][1] = '0'
    xTimeStamp.forEach((xTime, xTimeIndex) => {
      // 判断此时间是否有数据
      const index = statusSeriesData.findIndex(item => item[0] === xTime)
      if (index !== -1) {
        stagingStatusData.push(statusSeriesData[index])
      } else {
        stagingStatusData.push([xTimeStamp[xTimeIndex], ''])
      }
    })
    statusObj.value[detectId] = stagingStatusData
    // 获取总耗时
    const durationTotalResp = await aiops.monitor.getMonitorWebsiteQueryRange({ query: { query: 'duration_seconds', start, probe_id: detectId, step }, path: { id: taskId } })
    if (durationTotalResp.status === 200 && durationTotalResp.data.length > 0) {
      let durationTotalData: [number, string][]
      const stagingTotalData: Array<[number, string]> = []
      if (durationTotalResp.data[0].values.length <= 30) {
        durationTotalData = durationTotalResp.data[0].values
      } else {
        durationTotalData = durationTotalResp.data[0].values.slice(0, -1)
      }
      xTimeStamp.forEach((xTime, xTimeIndex) => {
        const index = durationTotalData.findIndex(item => item[0] === xTime)
        if (index !== -1) {
          stagingTotalData.push(durationTotalData[index])
        } else {
          stagingTotalData.push([xTimeStamp[xTimeIndex], ''])
        }
      })
      durationTotalArr[detectId] = stagingTotalData
    }
    // 获取各个阶段的耗时
    const durationResp = await aiops.monitor.getMonitorWebsiteQueryRange({ query: { query: 'http_duration_seconds', start, probe_id: detectId, step }, path: { id: taskId } })
    if (durationResp.status === 200 && durationResp.data.length > 0) {
      const sortDurationResp: WebMonitorInterface[] = []
      // 存放耗时数据数组
      let durationSeriesData: string[] = []
      // 用于给每段柱形添加不同的name，echarts要求多柱形堆加name需不一致
      let stageName = ''
      // 根据顺序对后端返回的数据按照阶段排序
      durationResp.data.forEach((item: WebMonitorInterface) => {
        if (item.metric.phase === 'resolve') {
          sortDurationResp[0] = item
        } else if (item.metric.phase === 'connect') {
          sortDurationResp[1] = item
        } else if (item.metric.phase === 'tls') {
          sortDurationResp[2] = item
        } else if (item.metric.phase === 'processing') {
          sortDurationResp[3] = item
        } else {
          sortDurationResp[4] = item
        }
      })
      calcMaxMin(detectId, step)
      sortDurationResp.forEach((duration: WebMonitorInterface, durationIndex: number) => {
        durationSeriesData = []
        let durationData: [number, string][]
        if (duration.values.length <= 30) {
          durationData = duration.values
        } else {
          durationData = duration.values.slice(0, -1)
        }
        xTimeStamp.forEach((xTime, xTimeIndex) => {
          const index = durationData.findIndex(item => item[0] === xTime)
          if (index !== -1) {
            if (statusObj.value[detectId][xTimeIndex][1] === '200') {
              // if (xTimeIndex === 1) {
              //   durationSeriesData.push('120000000.11')
              // } else {
              durationSeriesData.push((Number(durationData[index][1]) * 1000).toFixed(2))
              // }
            } else {
              durationSeriesData.push((Number(durationData[index][1]) * 1000 * -1).toFixed(2))
            }
          } else {
            durationSeriesData.push('')
          }
        })
        if (duration.metric.phase === 'resolve') {
          stageName = 'DNS解析（毫秒）'
        } else if (duration.metric.phase === 'connect') {
          stageName = 'TCP连接（毫秒）'
        } else if (duration.metric.phase === 'tls') {
          stageName = 'TLS连接（毫秒）'
        } else if (duration.metric.phase === 'processing') {
          stageName = '连接成功到收到响应（毫秒）'
        } else {
          stageName = '本次响应内容传输（毫秒）'
        }
        // chartSeries为echarts图表数据
        chartSeries.value.push(
          {
            name: name + '-' + stageName,
            id: detectId + '-' + duration.metric.phase,
            type: 'bar',
            stack: 'bar' + index,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  fontSize: 12,
                  distance: 5,
                  position: duration.metric.phase === 'transfer' ? 'top' : duration.metric.phase === 'resolve' ? 'bottom' : 'inside',
                  // 自定义顶部文字判断
                  // eslint-disable-next-line
                  formatter: function (val: Record<string, any>) {
                    // transfer为最顶部一段柱状图，echarts label不能控制单独某一段，只能控制一个整体
                    // resolve为底部一段柱状图
                    // 其他区间的柱状图label返回空
                    if (val.seriesId.indexOf('transfer') !== -1) {
                      if (val.name === maxMinObj[val.seriesId.slice(0, val.seriesId.lastIndexOf('-'))].maxTime || val.name === maxMinObj[val.seriesId.slice(0, val.seriesId.lastIndexOf('-'))].minTime) {
                        return (Number(durationTotalArr[detectId][val.dataIndex][1]) * 1000).toFixed(2)
                      } else {
                        return ''
                      }
                    } else if (val.seriesId.indexOf('resolve') !== -1) {
                      if (val.seriesIndex === 0) {
                        return `${val.seriesIndex + 1}`
                      } else if (val.seriesIndex > 0 && val.seriesIndex % 5 === 0) {
                        // seriesIndex为按照顺序叠加的每一段柱状图的索引，每个整体为5段，所以seriesIndex为5的倍数，用于判断第几个探针
                        return `${val.seriesIndex / 5 + 1}`
                      } else if (val.seriesIndex > 0 && val.seriesIndex % 5 !== 0) {
                        return `${val.seriesIndex + 1}`
                      }
                    } else {
                      return ''
                    }
                  },
                  rich: {
                    a: {
                      color: 'green',
                      lineHeight: 10
                    },
                    b: {
                      color: 'red',
                      lineHeight: 10
                    }
                  }
                },
                // eslint-disable-next-line
                color: function (val: Record<string, any>) {
                  if (val.value > 0) {
                    return normalColor[durationIndex]
                  } else {
                    return errorColor[durationIndex]
                  }
                }
              }
            },
            data: durationSeriesData
          }
        )
      })
      // 如新创建的任务，此时已经存在数据，则变量修改为false
      if (isNewCreate.value === true) {
        isNewCreate.value = false
      }
    }
  } else if (statusResp.data.length > 0 && statusResp.data.findIndex((item: WebMonitorInterface) => item.metric.monitor === 'example') !== -1) {
    chartStatus.value = 'error'
  }
}
// 每一分钟刷新获取数据方法
const getWebMonitoringLastData = async (id: string, name: string, start: number) => {
  const statusResp = await aiops.monitor.getMonitorWebsiteQueryRange({ query: { query: 'http_status_code', start, probe_id: id, step: 60 }, path: { id: taskId } })
  if (statusResp.status === 200) {
    if (statusResp.data.length > 0) {
      // 判断最新数据的时间是否等于当前数据的最后一条数据时间，一致的话则数据没有变化
      if (statusResp.data[0].values[statusResp.data[0].values.length - 1][0] !== xTimeStamp[xTimeStamp.length - 1]) {
        isHaveChange.value = true
        // 将数组中最早时间第一个值删除，向数组最后添加最新时刻的数据
        if (statusObj.value[id]) {
          statusObj.value[id].shift()
          statusObj.value[id].push(statusResp.data[0].values[statusResp.data[0].values.findIndex((item: [number, string]) => item[0] === lastTimeStamp + 60)])
        } else {
          statusObj.value[id] = statusResp.data[0].values[statusResp.data[0].values.findIndex((item: [number, string]) => item[0] === lastTimeStamp + 60)]
        }
        // lastTimeStamp = statusResp.data[0].values[statusResp.data[0].values.length - 1][0]
      }
    } else {
      isEmpty.value = true
    }
  }
  if (isHaveChange.value) {
    const durationTotalResp = await aiops.monitor.getMonitorWebsiteQueryRange({ query: { query: 'duration_seconds', start, probe_id: id, step: 60 }, path: { id: taskId } })
    if (durationTotalResp.status === 200 && durationTotalResp.data.length > 0) {
      if (durationTotalArr[id]) {
        if (durationTotalArr[id].length >= 30) {
          durationTotalArr[id].shift()
        }
        durationTotalArr[id].push(durationTotalResp.data[0].values[durationTotalResp.data[0].values.findIndex((item: [number, string]) => item[0] === lastTimeStamp + 60)])
      } else {
        durationTotalArr[id] = durationTotalResp.data[0].values[durationTotalResp.data[0].values.findIndex((item: [number, string]) => item[0] === lastTimeStamp + 60)]
      }
    }
    const durationResp = await aiops.monitor.getMonitorWebsiteQueryRange({ query: { query: 'http_duration_seconds', start, probe_id: id, step: 60 }, path: { id: taskId } })
    if (durationResp.status === 200 && durationResp.data.length > 0) {
      // eslint-disable-next-line
      chartSeries.value.forEach((bar: Record<string, any>) => {
        // 根据探针名找到该探针的图表数据
        if (bar.name.indexOf(name) !== -1) {
          if (bar.data.length >= 30) {
            bar.data.shift()
          }
          durationResp.data.forEach((duration: WebMonitorInterface) => {
            // 判断是哪个阶段耗时，替换数据
            if (duration.metric.phase === bar.id.slice(bar.id.lastIndexOf('-') + 1, bar.id.length)) {
              // 刷新时因为存在时间误差，后端可能返回一个值或两个值
              if (statusObj.value[id][statusObj.value[id].length - 1][1] === '200') {
                bar.data.push((Number(duration.values[duration.values.findIndex((item: [number, string]) => item[0] === lastTimeStamp + 60)][1]) * 1000).toFixed(2))
              } else {
                bar.data.push((Number(duration.values[duration.values.findIndex((item: [number, string]) => item[0] === lastTimeStamp + 60)][1]) * -1000).toFixed(2))
              }
            }
          })
        }
      })
    }
    calcMaxMin(id, 60)
  }
}
let countDownTimer: NodeJS.Timer | null = setInterval(() => {
  if (renovateTime.value > 0) {
    renovateTime.value--
  }
}, 1000)
let dynamicRefreshTimer: NodeJS.Timer | null = setInterval(() => {
  if (isNewCreate.value) {
    const refreshNowTime = new Date().getTime()
    const startTime = Math.round(refreshNowTime / 1000 - 1800)
    refreshAll(startTime, 60)
    renovateTime.value = 60
  } else {
    refreshData()
  }
}, 60000)
const refreshData = async () => {
  isHaveChange.value = false
  // echarts动态变化数据需要手动删除第一个元素，在数组末尾添加新元素
  for (const detect of arr1) {
    await getWebMonitoringLastData(detect.value, detect.label, lastTimeStamp)
  }
  lastTimeStamp += 60
  if (isHaveChange.value || isEmpty.value) {
    const formattedString = date.formatDate(lastTimeStamp * 1000, 'HH:mm:ss')
    // 动态删除添加x轴的值
    xTimeStamp.shift()
    xTimeStamp.push(lastTimeStamp)
    if (xAxis.value.length >= 30) {
      xAxis.value.shift()
    }
    xAxis.value.push(formattedString)
    // 刷新后清空定时器，重新赋值
    clearInterval(Number(dynamicRefreshTimer))
    dynamicRefreshTimer = setInterval(() => {
      refreshData()
    }, 60000)
  } else {
    Notify.create({
      message: tc('已是最新数据'),
      color: 'secondary',
      position: 'bottom',
      timeout: 3000,
      multiLine: false
    })
  }
  renovateTime.value = 60
}
const refreshAll = async (time: number, step: number) => {
  getXAxis(time, step)
  arr1.forEach((item, index) => {
    getWebMonitoringData(item.value, item.label, time, step, index)
  })
}
const changeChatTab = (val: string) => {
  clearInterval(Number(dynamicRefreshTimer))
  clearInterval(Number(countDownTimer))
  chartSeries.value = []
  statusObj.value = {}
  const changNowTime = new Date().getTime()
  if (val === 'recent') {
    const startTime = Math.round(changNowTime / 1000 - 1800)
    refreshAll(startTime, 60)
    renovateTime.value = 60
    isCurrent.value = true
    countDownTimer = setInterval(() => {
      if (renovateTime.value > 0) {
        renovateTime.value--
      }
    }, 1000)
    dynamicRefreshTimer = setInterval(() => {
      refreshData()
    }, 60000)
  } else if (val === 'day') {
    isCurrent.value = false
    const startTime = Math.round(changNowTime / 1000 - 86400)
    const step = 2880
    refreshAll(startTime, step)
  } else if (val === 'week') {
    isCurrent.value = false
    const startTime = Math.round(changNowTime / 1000 - 604800)
    const step = 20160
    refreshAll(startTime, step)
  } else {
    isCurrent.value = false
    const startTime = Math.round(changNowTime / 1000 - 2592000)
    const step = 86400
    refreshAll(startTime, step)
  }
}
const goBack = () => {
  router.go(-1)
}
// const firstRefreshTimer = setTimeout(() => {
//   if (isNewCreate.value) {
//     const startTime = Math.round(nowTime / 1000 - 1800)
//     refreshAll(startTime, 60)
//   }
// }, 90000)
// watch(isNewCreate, () => {
//   if (!isNewCreate.value) {
//     countDownTimer = setInterval(() => {
//       if (renovateTime.value > 0) {
//         renovateTime.value--
//       }
//     }, 1000)
//     dynamicRefreshTimer = setInterval(() => {
//       refreshData()
//     }, 60000)
//   } else {
//     clearInterval(Number(dynamicRefreshTimer))
//     clearInterval(Number(countDownTimer))
//     renovateTime.value = 60
//   }
// })
watch(arr1, () => {
  if (arr1.length > 0) {
    getXAxis(startTimeStamp, 60)
    arr1.forEach((item, index) => {
      getWebMonitoringData(item.value, item.label, startTimeStamp, 60, index)
    })
  }
})
onMounted(() => {
  if (arr1.length > 0) {
    getXAxis(startTimeStamp, 60)
    arr1.forEach((item, index) => {
      getWebMonitoringData(item.value, item.label, startTimeStamp, 60, index)
    })
  }
})
onUnmounted(() => {
  clearInterval(Number(dynamicRefreshTimer))
  clearInterval(Number(countDownTimer))
  // clearTimeout(firstRefreshTimer)
})
</script>

<template>
  <div class="WebMonitorTaskDetail">
    <div class="row title-area">
      <div class="col">
        <q-btn icon="arrow_back_ios" color="primary" flat unelevated dense
               @click="goBack"/>
        {{ tc('网站监控详情') }}
      </div>
    </div>
    <div class="row justify-center" v-if="store.tables.webMonitorTable.byId[taskId]?.name && store.tables.webMonitorTable.byId[taskId]?.name">
      <div class="text-h6">
        <div>
          <span>{{ tc('监控任务名称') }}：</span>
          <span class="text-primary">{{ store.tables.webMonitorTable.byId[taskId]?.name }}</span>
        </div>
        <div>
          <span>{{ tc('监控任务url') }}：</span>
          <span class="text-primary">{{ store.tables.webMonitorTable.byId[taskId]?.url }}</span>
        </div>
        <div>
          <span>{{ tc('备注') }}：</span>
          <span class="text-primary">{{ store.tables.webMonitorTable.byId[taskId]?.remark === '' ? tc('暂无备注') : store.tables.webMonitorTable.byId[taskId]?.remark }}</span>
        </div>
      </div>
    </div>
    <div class="row justify-between items-center">
      <div class="q-py-md">
        <div v-for="(item, index) in arr1" :key="item.value">{{ `${tc('探针')}${index + 1}：${ i18n.global.locale === 'zh' ? item.label : item.labelEn}` }}</div>
      </div>
      <div class="row items-center" v-show="isCurrent">
        <div class="text-grey-7 q-mr-md">{{ tc('剩余更新时间') }}</div>
        <q-circular-progress
          show-value
          class="text-light-blue"
          :value="renovateTime"
          size="50px"
          max="60"
          color="light-blue"
          track-color="grey-3"
        >
          {{ renovateTime }}s
        </q-circular-progress>
        <q-btn flat no-caps color="primary" :label="tc('更新数据')" @click="refreshData"/>
      </div>
<!--      <div v-else>{{ tc('请稍后，等待刷新中') }}</div>-->
    </div>
    <div>
      <div class="col-auto">
        <q-tabs
            class="col-auto"
            v-model="tab"
            active-color="primary"
            align="left"
            inline-label
            @update:model-value="changeChatTab"
          >
            <q-tab class="q-px-none q-py-none q-mr-md"
                   no-caps
                   :ripple="false"
                   name="recent"
                   icon="las la-clock"
                   :label="tc('实时数据')"/>
            <q-tab class="q-px-none q-py-none q-mr-md"
                   no-caps
                   :ripple="false"
                   name="day"
                   icon="las la-calendar-check"
                   :label="tc('最近一天')"/>
            <q-tab class="q-px-none q-py-none q-mr-md"
                   no-caps
                   :ripple="false"
                   name="week"
                   icon="las la-clipboard-list"
                   :label="tc('最近一周')"/>
            <q-tab class="q-px-none q-py-none q-mr-md"
                   no-caps
                   :ripple="false"
                   name="month"
                   icon="las la-calendar"
                   :label="tc('最近一个月')"/>
          </q-tabs>
        <q-separator/>
      </div>
      <div>
        <q-tab-panels v-model="tab">
          <q-tab-panel class="q-pa-none overflow-hidden" name="recent">
            <div class="row q-mt-lg">
              <div class="col-12">
                <q-card flat bordered class="no-border-radius">
                  <web-histogram-chart :status-obj="statusObj" :x-axis-time="xAxis" :chart-series="chartSeries" :status="chartStatus"/>
                </q-card>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel class="q-pa-none overflow-hidden" name="day">
            <div class="row q-mt-lg">
              <div class="col-12">
                <q-card flat bordered class="no-border-radius">
                  <web-histogram-chart :status-obj="statusObj" :x-axis-time="xAxis" :chart-series="chartSeries" :status="chartStatus"/>
                </q-card>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel class="q-pa-none overflow-hidden" name="week">
            <div class="row q-mt-lg">
              <div class="col-12">
                <q-card flat bordered class="no-border-radius">
                  <web-histogram-chart :status-obj="statusObj" :x-axis-time="xAxis" :chart-series="chartSeries" :status="chartStatus"/>
                </q-card>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel class="q-pa-none overflow-hidden" name="month">
            <div class="row q-mt-lg">
              <div class="col-12">
                <q-card flat bordered class="no-border-radius">
                  <web-histogram-chart :status-obj="statusObj" :x-axis-time="xAxis" :chart-series="chartSeries" :status="chartStatus"/>
                </q-card>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.title-area {
  width: 1230px;
  text-align: left;
  color: $primary;
  font-size: large;
  font-weight: bold;
}
</style>
