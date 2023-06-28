<script setup lang="ts">
import { onMounted } from 'vue'
// import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'
import G6 from '@antv/g6'

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
const data = {
  nodes: [
    {
      id: 'node_1',
      label: 'node-1',
      type: 'rect',
      x: 100,
      y: 200,
      size: [50, 25],
      style: {
        fill: '#0f0',
        lineWith: 5,
        fillOpacity: 0.4,
        strokeOpacity: 0.8
      }
    },
    {
      id: 'node_2',
      label: 'node-2',
      labelCfg: {
        position: 'bottom',
        style: {
          fill: '#00f',
          fontWeight: 500,
          textAlign: 'left'
        }
      }
    },
    {
      id: 'node_3',
      label: 'node-3'
    }
  ],
  edges: [
    {
      source: 'node_1',
      target: 'node_2',
      style: {
        startArrow: true,
        endArrow: true
      }
    },
    {
      source: 'node_2',
      target: 'node_3'
    },
    {
      source: 'node_3',
      target: 'node_1'
    }
  ]
}
// const container: any = ref(null)
onMounted(() => {
  // const width = container.value.scrollWidth
  // const height = container.value.scrollHeight || 500
  const graph = new G6.Graph({
    container: 'myContainer',
    width: 800,
    height: 500
  })
  graph.data(data)
  graph.render()
})
</script>

<template>
  <div class="ExportIndex">
    <div id="myContainer"></div>
  </div>
</template>

<style lang="scss" scoped>
.ExportIndex {
}
</style>
