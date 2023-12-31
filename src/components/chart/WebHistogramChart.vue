<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent
} from 'echarts/components'
import { BarChart, LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition
])
import { i18n } from 'boot/i18n'
const props = defineProps({
  statusObj: {
    type: Object,
    required: true
  },
  xAxisTime: {
    type: Array,
    required: true
  },
  chartSeries: {
    type: Array,
    required: true
  },
  status: {
    type: String,
    required: true
  }
})
const container = ref<HTMLElement>()
const { tc } = i18n.global
onMounted(() => {
  const chart = echarts.init(container.value!)
  const option = computed(() => ({
    title: {
      text: tc('网站监控汇总图'),
      left: 'center'
    },
    grid: {
      top: 120,
      left: 85,
      right: 50,
      bottom: 70
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#283b56'
        }
      },
      // eslint-disable-next-line
      formatter: function (params: Record<string, any>) {
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const today = year + '-' + month + '-' + day
        const totalArr: Record<string, string> = {}
        let num = 0
        for (let i = 0, l = params.length; i < l; i++) {
          const dId = params[i].seriesId.slice(0, params[i].seriesId.lastIndexOf('-'))
          if (Number(params[i].value) > 0) {
            if ((i + 1) % 5 === 0) {
              num += Number(params[i].value)
              totalArr[dId] = num.toFixed(2)
              num = 0
            } else {
              num += Number(params[i].value)
            }
          } else if (params[i].value === '' || Number(params[i].value) <= 0) {
            if (params.length % 5 === 0) {
              if ((i + 1) % 5 === 0) {
                if (params[i].value !== '') {
                  num += Number(params[i].value)
                }
                totalArr[dId] = (num * -1).toFixed(2)
                num = 0
              } else {
                if (params[i].value !== '') {
                  num += Number(params[i].value)
                }
              }
            } else {
              totalArr[dId] = (Number(params[i].value) * -1).toFixed(2)
            }
          }
        }
        let relVal
        if (params[0].seriesName.indexOf('recent') !== -1) {
          relVal = today + ' ' + params[0].name
        } else {
          relVal = year + '-' + params[0].name
        }
        for (let i = 0, l = params.length; i < l; i++) {
          const dId = params[i].seriesId.slice(0, params[i].seriesId.lastIndexOf('-'))
          if (params[i].value !== '' && params[i].value > 0) {
            if (i >= 0 && i % 5 === 0) {
              if (i === 0) {
                relVal += `<hr/><div>${params[i].seriesName.slice(0, params[i].seriesName.indexOf('-'))}<span class="q-ml-md">${tc('状态')}：</span><span class="text-positive text-weight-bold">${props.statusObj[dId][params[i].dataIndex][1]}</span></div>
<div class="row justify-between"><div>${tc('总耗时（毫秒）')}：</div><div class="text-subtitle1 text-weight-bold text-positive">${totalArr[dId]}</div></div>
<div class="row justify-between"><div style="color: ${params[i].color}">${params[i].marker + params[i].seriesName.slice(params[i].seriesName.indexOf('-') + 1)}：</div><div class="text-weight-regular">${params[i].value}</div></div>`
              } else {
                relVal += `<div>${params[i].seriesName.slice(0, params[i].seriesName.indexOf('-'))}<span class="q-ml-md">${tc('状态')}：</span><span class="text-positive text-weight-bold">${props.statusObj[dId][params[i].dataIndex][1]}</span></div>
<div class="row justify-between"><div>${tc('总耗时（毫秒）')}：</div><div class="text-subtitle1 text-weight-bold text-positive">${totalArr[dId]}</div></div>
<div class="row justify-between"><div style="color: ${params[i].color}">${params[i].marker + params[i].seriesName.slice(params[i].seriesName.indexOf('-') + 1)}：</div><div class="text-weight-regular">${params[i].value}</div></div>`
              }
            } else {
              if ((i + 1) % 5 === 0) {
                relVal += `<div class="row justify-between"><div style="color: ${params[i].color}">${params[i].marker + params[i].seriesName.slice(params[i].seriesName.indexOf('-') + 1)}：</div><div>${params[i].value}</div></div>
<div class="row"><div class="col-10"><hr></div></div>`
              } else {
                relVal += `<div class="row justify-between"><div style="color: ${params[i].color}">${params[i].marker + params[i].seriesName.slice(params[i].seriesName.indexOf('-') + 1)}：</div><div>${params[i].value}</div></div>`
              }
            }
          } else if (params[i].value !== '' && params[i].value < 0) {
            if (params.length % 5 === 0) {
              if (i >= 0 && i % 5 === 0) {
                if (i === 0) {
                  relVal += `<hr/><div>${params[i].seriesName.slice(0, params[i].seriesName.indexOf('-'))}<span class="q-ml-md">${tc('状态')}：</span><span class="text-negative text-weight-bold">${props.statusObj[dId][params[i].dataIndex][1]}</span></div>
<div class="row justify-between"><div>${tc('总耗时（毫秒）')}：</div><div class="text-subtitle1 text-weight-bold text-positive">${totalArr[dId]}</div></div>
<div class="row justify-between"><div style="color: ${params[i].color}">${params[i].marker + params[i].seriesName.slice(params[i].seriesName.indexOf('-') + 1)}：</div><div class="text-weight-regular">${params[i].value * -1}</div></div>`
                } else {
                  relVal += `<div>${params[i].seriesName.slice(0, params[i].seriesName.indexOf('-'))}<span class="q-ml-md">${tc('状态')}：</span><span class="text-negative text-weight-bold">${props.statusObj[dId][params[i].dataIndex][1]}</span></div>
<div class="row justify-between"><div>${tc('总耗时（毫秒）')}：</div><div class="text-subtitle1 text-weight-bold text-positive">${totalArr[dId]}</div></div>
<div class="row justify-between"><div style="color: ${params[i].color}">${params[i].marker + params[i].seriesName.slice(params[i].seriesName.indexOf('-') + 1)}：</div><div class="text-weight-regular">${params[i].value * -1}</div></div>`
                }
              } else {
                if ((i + 1) % 5 === 0) {
                  relVal += `<div class="row justify-between"><div style="color: ${params[i].color}">${params[i].marker + params[i].seriesName.slice(params[i].seriesName.indexOf('-') + 1)}：</div><div>${params[i].value * -1}</div></div>
<div class="row"><div class="col-10"><hr></div></div>`
                } else {
                  relVal += `<div class="row justify-between"><div style="color: ${params[i].color}">${params[i].marker + params[i].seriesName.slice(params[i].seriesName.indexOf('-') + 1)}：</div><div>${params[i].value * -1}</div></div>`
                }
              }
            } else {
              if (i === 0) {
                relVal += `<hr/><div>${params[i].seriesName.slice(0, params[i].seriesName.indexOf('-'))}<span class="q-ml-md">${tc('状态')}：</span><span class="text-negative text-weight-bold">${props.statusObj[dId][params[i].dataIndex][1]}</span></div>
<div class="row justify-between"><div>${tc('总耗时（毫秒）')}：</div><div class="text-subtitle1 text-weight-bold text-positive">${totalArr[dId]}</div></div>
<div class="row justify-between"><div style="color: ${params[i].color}">${params[i].marker + params[i].seriesName.slice(params[i].seriesName.indexOf('-') + 1)}：</div><div class="text-weight-regular">${params[i].value * -1}</div></div>
<div class="row"><div class="col-10"><hr></div></div>`
              } else {
                relVal += `<div>${params[i].seriesName.slice(0, params[i].seriesName.indexOf('-'))}<span class="q-ml-md">${tc('状态')}：</span><span class="text-negative text-weight-bold">${props.statusObj[dId][params[i].dataIndex][1]}</span></div>
<div class="row justify-between"><div>${tc('总耗时（毫秒）')}：</div><div class="text-subtitle1 text-weight-bold text-positive">${totalArr[dId]}</div></div>
<div class="row justify-between"><div style="color: ${params[i].color}">${params[i].marker + params[i].seriesName.slice(params[i].seriesName.indexOf('-') + 1)}：</div><div class="text-weight-regular">${params[i].value * -1}</div></div>
<div class="row"><div class="col-10"><hr></div></div>`
              }
            }
          }
        }
        return relVal
      }
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        offset: 20,
        data: props.xAxisTime
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: tc('请求耗时'),
        scale: true,
        max: 3000,
        min: -1000,
        boundaryGap: [0.2, 0.2],
        splitLine: {
          show: true
        },
        axisLine: {
          show: true
        },
        axisTick: {
          show: true
        },
        axisLabel: {
          formatter: function (value: number) {
            if (value >= 0) {
              return value + tc('毫秒')
            }
            if (value < 0) {
              return value * -1 + tc('毫秒')
            }
          }
        }
      }
    ],
    series: props.chartSeries
  }))
  const errorOption = {
    title: {
      text: tc('历史数据有误，正在修正中'),
      x: 'center',
      y: 'center',
      textStyle: {
        fontSize: 20,
        fontWeight: 'normal'
      }
    }
  }
  watch(props, () => {
    // console.log(props)
    if (props.status === 'normal') {
      chart.setOption(option.value, true)
    } else {
      chart.setOption(errorOption, true)
    }
  }, { deep: true })
  const chartResize = () => {
    chart.resize()
  }
  window.addEventListener('resize', chartResize)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', chartResize)
  })
})
</script>

<template>
  <div class="HistogramChart" style="width: 100%">
    <div ref="container" :style="{ width: '100%', height: '700px' }"></div>
  </div>
</template>

<style lang="scss" scoped>
.WebHistogramLineChart {
}
</style>
