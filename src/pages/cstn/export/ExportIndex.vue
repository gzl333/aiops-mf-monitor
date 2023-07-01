<script setup lang="ts">
/* eslint-disable */
import { onMounted } from 'vue'
import G6 from '@antv/g6'

const data = {
  nodes: [
    { id: 'international', label: '国际出口' },
    { id: 'softwareParkAccess', label: '软件园接入' },
    { id: 'softwareParkAccess-1', label: '软件园接入1' },
    { id: 'softwareParkAccess-2', label: '软件园接入2' },
    { id: 'softwareParkAccess-3', label: '软件园接入3' },
    { id: 'softwareParkAccess-4', label: '软件园接入4' },
    { id: 'softwareParkAccess-5', label: '软件园接入5' },
    { id: 'softwareParkAccess-6', label: '软件园接入6' },
    { id: 'softwareParkAccess-7', label: '软件园接入7' },
    { id: 'softwareParkAccess-8', label: '软件园接入8' },
    { id: 'softwareParkAccess-9', label: '软件园接入9' },
    { id: 'softwareParkAccess-10', label: '软件园接入10' },
    { id: 'softwareParkAccess-11', label: '软件园接入11' },
    { id: 'softwareParkAccess-12', label: '软件园接入12' },
    { id: 'softwareParkCore', label: '软件园核心' },
    { id: 'softwareParkCore-1', label: '软件园核心1' },
    { id: 'softwareParkCore-2', label: '软件园核心2' },
    { id: 'softwareParkCore-3', label: '软件园核心3' },
    { id: 'softwareParkCore-4', label: '软件园核心4' },
    { id: 'domestic', label: '国内出口' },
    { id: 'cnicCore', label: '信息化大厦核心' },
    { id: 'cnicCore-1', label: '信息化大厦核心1' },
    { id: 'cnicCore-2', label: '信息化大厦核心2' },
    { id: 'hyCore', label: '怀柔核心' },
    { id: 'hyCore-1', label: '怀柔核心1' }
  ],
  edges: [
    { source: 'international', target: 'softwareParkAccess' },
    { source: 'international', target: 'softwareParkCore' },
    { source: 'softwareParkAccess', target: 'softwareParkAccess-1' },
    { source: 'softwareParkAccess', target: 'softwareParkAccess-2' },
    { source: 'softwareParkAccess', target: 'softwareParkAccess-3' },
    { source: 'softwareParkAccess', target: 'softwareParkAccess-4' },
    { source: 'softwareParkAccess', target: 'softwareParkAccess-5' },
    { source: 'softwareParkAccess', target: 'softwareParkAccess-6' },
    { source: 'softwareParkAccess', target: 'softwareParkAccess-7' },
    { source: 'softwareParkAccess', target: 'softwareParkAccess-8' },
    { source: 'softwareParkAccess', target: 'softwareParkAccess-9' },
    { source: 'softwareParkAccess', target: 'softwareParkAccess-10' },
    { source: 'softwareParkAccess', target: 'softwareParkAccess-11' },
    { source: 'softwareParkAccess', target: 'softwareParkAccess-12' },
    { source: 'softwareParkCore', target: 'softwareParkCore-1' },
    { source: 'softwareParkCore', target: 'softwareParkCore-2' },
    { source: 'softwareParkCore', target: 'softwareParkCore-3' },
    { source: 'softwareParkCore', target: 'softwareParkCore-4' },
    { source: 'softwareParkCore-1', target: 'softwareParkCore-2' },
    { source: 'softwareParkCore-3', target: 'softwareParkCore-4' },
    { source: 'domestic', target: 'cnicCore' },
    { source: 'domestic', target: 'hyCore' },
    { source: 'cnicCore', target: 'cnicCore-1' },
    { source: 'cnicCore', target: 'cnicCore-2' },
    { source: 'hyCore', target: 'hyCore-1' },
  ]
}
let graph = null
const subjectColors = [
  '#5F95FF', // blue
  '#61DDAA',
  '#65789B',
  '#F6BD16',
  '#7262FD',
  '#78D3F8',
  '#9661BC',
  '#F6903D',
  '#008685',
  '#F08BB4'
]
const duration = 2000
const animateOpacity = 0.6
const animateBackOpacity = 0.1
const virtualEdgeOpacity = 0.1
const realEdgeOpacity = 0.2
const darkBackColor = 'rgb(43, 47, 51)'
const disableColor = '#777'
const theme = 'dark'
const colorSets = G6.Util.getColorSetsBySubjectColors(
  subjectColors,
  darkBackColor,
  theme,
  disableColor
)
onMounted(() => {
  const container = document.getElementById('container')
  const width = container.scrollWidth
  const height = (container.scrollHeight || 500) - 30

  graph = new G6.Graph({
    container: 'container',
    width,
    height,
    modes: {
      default: [
        'drag-canvas',
        'zoom-canvas',
        'drag-node',
        'click-select'
      ]
    },
    layout: {
      type: 'dagre',
      rankdir: 'TB', // 可选，默认为图的中心
      nodeSize: [60, 40],
      nodesep: 50,
      ranksep: 20,
      controlPoints: true
    },
    animate: true,
    fitCenter: true,
    defaultNode: {
      size: [70, 40],
      type: 'rect',
      style: {
        lineWidth: 2,
        stroke: '#5B8FF9',
        fill: '#C6E5FF',
      },
    },
    defaultEdge: {
      size: 1,
      color: '#e2e2e2',
      style: {
        endArrow: {
          path: 'M 0,0 L 8,4 L 8,-4 Z',
          fill: '#e2e2e2',
        },
      },
    },
    nodeStateStyles: {
      selected: {
        stroke: '#d9d9d9',
        fill: '#5394ef',
      },
    }
  })
  graph.data(data)
  graph.render()

})
if (typeof window !== 'undefined') {
  window.onresize = () => {
    if (!graph || graph.get('destroyed')) return
    const container = document.getElementById('container')
    if (!container) return
    graph.changeSize(container.scrollWidth, container.scrollHeight - 30)
  }
}

</script>

<template>
  <div class="ExportIndex" style="width: 100%">
    <div ref="container" id="container" style="width:100%;height:100vh"></div>
  </div>
</template>

<style lang="scss" scoped>
.ExportIndex {
}
</style>
