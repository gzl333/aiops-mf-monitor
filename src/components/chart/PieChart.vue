<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, toRefs } from 'vue'
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
])

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  height: {
    type: String,
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
  <div class="LineChart" style="width: 100%">
    <div ref="container" :style="{ width: '100%', height: props?.height + 'px'  }"></div>
  </div>
</template>

<style lang="scss" scoped>
.LineChart {
}
</style>
