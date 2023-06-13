<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, toRefs } from 'vue'
import * as echarts from 'echarts/core'
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent
} from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  BarChart,
  CanvasRenderer
])

const props = defineProps({
  option: {
    type: Object,
    required: true
  }
})
const container = ref<HTMLElement>()
// defineExpose({ })
onMounted(() => {
  const chart = echarts.init(container.value!)
  chart.setOption(props.option)
  const { option } = toRefs(props)
  watch(option, () => {
    chart.setOption(props.option)
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
    <div ref="container" :style="{ width: '100%', height: '220px' }"></div>
  </div>
</template>

<style lang="scss" scoped>
.HistogramChart {
}
</style>
