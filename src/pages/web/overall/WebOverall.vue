<script setup lang="ts">
import { computed, ref } from 'vue'
// import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
import LineChart from 'components/chart/LineChart.vue'
import PieChart from 'components/chart/PieChart.vue'

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
  { name: '任务15', link: 'https://aiops.cstcloud.cn/', status: '异常', delayed: '100ms' },
  { name: '任务16', link: 'https://aiops.cstcloud.cn/', status: '高延时', delayed: '100ms' },
  { name: '任务17', link: 'https://aiops.cstcloud.cn/', status: '流畅', delayed: '100ms' },
  { name: '任务18', link: 'https://aiops.cstcloud.cn/', status: '异常', delayed: '100ms' },
  { name: '任务19', link: 'https://aiops.cstcloud.cn/', status: '高延时', delayed: '100ms' },
  { name: '任务20', link: 'https://aiops.cstcloud.cn/', status: '流畅', delayed: '100ms' }
]
const cpuOption = computed(() => ({
  title: {
    text: '24小时任务状态比例',
    textStyle: {
      fontSize: 16
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
const dataOption = computed(() => ({
  title: {
    text: '各区间耗时分布',
    textStyle: {
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    top: 30
  },
  series: [
    {
      name: '状态占比',
      type: 'pie',
      selectedMode: 'single',
      radius: [0, '30%'],
      label: {
        position: 'inner',
        fontSize: 14
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1548, name: '高延时' },
        { value: 775, name: '流畅' },
        { value: 679, name: '异常' }
      ]
    },
    {
      name: '耗时占比',
      type: 'pie',
      radius: ['45%', '60%'],
      labelLine: {
        length: 30
      },
      label: {
        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
        backgroundColor: '#F6F8FC',
        borderColor: '#8C8D8E',
        borderWidth: 1,
        borderRadius: 4,
        rich: {
          a: {
            color: '#6E7079',
            lineHeight: 22,
            align: 'center'
          },
          hr: {
            borderColor: '#8C8D8E',
            width: '100%',
            borderWidth: 1,
            height: 0
          },
          b: {
            color: '#4C5058',
            fontSize: 14,
            fontWeight: 'bold',
            lineHeight: 33
          },
          per: {
            color: '#fff',
            backgroundColor: '#4C5058',
            padding: [3, 4],
            borderRadius: 4
          }
        }
      },
      data: [
        { value: 1048, name: '0ms-500ms' },
        { value: 335, name: '500ms-1000ms' },
        { value: 310, name: '1000ms-1500ms' },
        { value: 251, name: '1500ms-2000ms' },
        { value: 234, name: '20000ms-2500ms' },
        { value: 147, name: '2500ms-3000ms' },
        { value: 135, name: '3000ms-4000ms' },
        { value: 102, name: '4000ms-5000ms' }
      ]
    }
  ]
}))
</script>

<template>
  <div class="WebOverall">
    <div class="text-h6">网页实时状态概览</div>
    <div class="row q-mt-md">
      <q-select outlined dense v-model="model" :options="options" label="请选择" class="col-3" />
    </div>
    <div class="q-mt-md">
      <line-chart :option="cpuOption"/>
    </div>
    <div class="q-mt-lg row">
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
        <pie-chart height="730" :option="dataOption"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.WebOverall {
}
</style>
