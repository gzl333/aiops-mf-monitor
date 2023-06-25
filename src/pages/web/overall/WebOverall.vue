<script setup lang="ts">
import { computed, ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
import LineChart from 'components/chart/LineChart.vue'
import HistogramChart from 'components/chart/HistogramChart.vue'

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
const model = ref(null)
const options = [
  '探针1', '探针2'
]
const taskArr = [
  { name: '任务1', link: 'https://aiops.cstcloud.cn/', status: '流畅', delayed: '100ms' },
  { name: '任务2', link: 'https://aiops.cstcloud.cn/', status: '异常', delayed: '100ms' },
  { name: '任务3', link: 'https://aiops.cstcloud.cn/', status: '流畅', delayed: '100ms' },
  { name: '任务4', link: 'https://aiops.cstcloud.cn/', status: '异常', delayed: '100ms' },
  { name: '任务5', link: 'https://aiops.cstcloud.cn/', status: '流畅', delayed: '100ms' },
  { name: '任务6', link: 'https://aiops.cstcloud.cn/', status: '高延时', delayed: '100ms' },
  { name: '任务7', link: 'https://aiops.cstcloud.cn/', status: '流畅', delayed: '100ms' },
  { name: '任务8', link: 'https://aiops.cstcloud.cn/', status: '异常', delayed: '100ms' },
  { name: '任务9', link: 'https://aiops.cstcloud.cn/', status: '高延时', delayed: '100ms' },
  { name: '任务10', link: 'https://aiops.cstcloud.cn/', status: '异常', delayed: '100ms' },
  { name: '任务11', link: 'https://aiops.cstcloud.cn/', status: '流畅', delayed: '100ms' },
  { name: '任务12', link: 'https://aiops.cstcloud.cn/', status: '高延时', delayed: '100ms' },
  { name: '任务13', link: 'https://aiops.cstcloud.cn/', status: '流畅', delayed: '100ms' },
  { name: '任务14', link: 'https://aiops.cstcloud.cn/', status: '异常', delayed: '100ms' },
  { name: '任务15', link: 'https://aiops.cstcloud.cn/', status: '异常', delayed: '100ms' }
]
const cpuOption = computed(() => ({
  title: {
    text: '24小时任务状态比例',
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
    data: ['异常', '高延时', '流畅']
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
    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24']
  },
  yAxis: {
    type: 'value',
    max: 100,
    min: 0
  },
  series: [
    {
      name: '异常',
      type: 'line',
      data: [20, 30, 40, 50, 10, 60, 30, 80, 20, 30, 40, 60, 10, 80, 20, 60, 30, 50, 70, 10, 30, 20, 60, 50]
    },
    {
      name: '高延时',
      type: 'line',
      data: [10, 30, 50, 20, 60, 20, 60, 20, 60, 80, 20, 60, 40, 70, 90, 80, 30, 50, 20, 50, 20, 40, 50, 40]
    },
    {
      name: '流畅',
      type: 'line',
      data: [40, 60, 30, 50, 10, 20, 10, 40, 60, 30, 10, 70, 20, 60, 20, 70, 10, 60, 20, 50, 10, 20, 30, 50]
    }
  ]
}))
const data = [
  [500, 1000, 678.71],
  [400, 1000, 682],
  [300, 650, 446.33],
  [250, 560, 379.83],
  [200, 400, 306],
  [200, 400, 322.33],
  [250, 400, 313.33],
  [180, 400, 310],
  [200, 350, 275],
  [200, 300, 250],
  [180, 300, 243.33],
  [200, 270, 235],
  [150, 280, 215]
]
const cities = ['0ms-100ms', '100ms-300ms', '300ms-500ms', '500ms-700ms', '700ms-900ms', '900ms-1300ms', '1300ms-1500ms', '1500ms-2000ms', '2000ms-2500ms', '2500ms-3000ms', '3000ms-3500ms', '3500ms-4000ms', '4000ms-5000ms']
const barHeight = 50
const dataOption = computed(() => ({
  title: {
    text: '各区间耗时分布'
  },
  legend: {
    show: true,
    top: 'bottom',
    data: ['Range', 'Average']
  },
  grid: {
    top: 100
  },
  angleAxis: {
    type: 'category',
    data: cities
  },
  tooltip: {
    show: true,
    // eslint-disable-next-line
    formatter: function (params: any) {
      const id = params.dataIndex
      return (
        cities[id] +
        '<br>Lowest：' +
        data[id][0] +
        '<br>Highest：' +
        data[id][1] +
        '<br>Average：' +
        data[id][2]
      )
    }
  },
  radiusAxis: {},
  polar: {},
  series: [
    {
      type: 'bar',
      itemStyle: {
        color: 'transparent'
      },
      data: data.map(function (d) {
        return d[0]
      }),
      coordinateSystem: 'polar',
      stack: 'Min Max',
      silent: true
    },
    {
      type: 'bar',
      data: data.map(function (d) {
        return d[1] - d[0]
      }),
      coordinateSystem: 'polar',
      name: 'Range',
      stack: 'Min Max'
    },
    {
      type: 'bar',
      itemStyle: {
        color: 'transparent'
      },
      data: data.map(function (d) {
        return d[2] - barHeight
      }),
      coordinateSystem: 'polar',
      stack: 'Average',
      silent: true,
      z: 10
    },
    {
      type: 'bar',
      data: data.map(function () {
        return barHeight * 2
      }),
      coordinateSystem: 'polar',
      name: 'Average',
      stack: 'Average',
      barGap: '-100%',
      z: 10
    }
  ]
}))
</script>

<template>
  <div class="WebOverall">
    <div class="text-h6">网页实时状态概览（5分钟内）</div>
    <div class="q-mt-md">
      <line-chart :option="cpuOption"/>
    </div>
    <div class="row q-mt-md">
      <q-select outlined dense v-model="model" :options="options" label="请选择" class="col-3" />
    </div>
    <div class="q-mt-md row">
      <q-card flat bordered class="my-card col-5">
        <div v-for="(item, index) in taskArr" :key="index" class="q-px-sm">
          <div class="row justify-between items-center">
            <div>
              <span>名称：</span>
              <span>{{ item.name }}</span>
            </div>
            <div>
              <span>链接：</span>
              <q-btn flat no-caps :label="item.link" color="primary" class="q-pa-none">
                <q-tooltip>
                  查看详情
                </q-tooltip>
              </q-btn>

            </div>
            <div>
              <span>状态：</span>
              <span :class="item.status === '异常' ? 'text-negative' : item.status === '流畅' ? 'text-positive' : 'text-warning'">{{ item.status }}</span>
            </div>
            <div>
              <span>耗时：</span>
              <span>{{ item.delayed }}</span>
            </div>
          </div>
        </div>
      </q-card>
      <div class="col-7">
        <histogram-chart height="600" :option="dataOption"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.WebOverall {
}
</style>
