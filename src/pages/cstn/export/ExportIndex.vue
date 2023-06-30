<script setup lang="ts">
/* eslint-disable */
import { onMounted } from 'vue'
import G6 from '@antv/g6'
import { insertCss } from 'insert-css'
insertCss(`
  .g6-component-contextmenu {
    position: absolute;
    z-index: 2;
    list-style-type: none;
    background-color: #363b40;
    border-radius: 6px;
    font-size: 14px;
    color: hsla(0,0%,100%,.85);
    width: fit-content;
    transition: opacity .2s;
    text-align: center;
    padding: 0px 20px 0px 20px;
    box-shadow: 0 5px 18px 0 rgba(0, 0, 0, 0.6);
    border: 0px;
  }
  .g6-component-contextmenu ul {
    padding-left: 0px;
    margin: 0;
  }
  .g6-component-contextmenu li {
    cursor: pointer;
    list-style-type: none;
    list-style: none;
    margin-left: 0;
    line-height: 38px;
  }
  .g6-component-contextmenu li:hover {
    color: #aaaaaa;
  }
`)
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
    { source: 'softwareParkAccess-1', target: 'softwareParkCore-1' },
    { source: 'softwareParkAccess-2', target: 'softwareParkCore-1' },
    { source: 'softwareParkAccess-3', target: 'softwareParkCore-1' },
    { source: 'softwareParkAccess-4', target: 'softwareParkCore-1' },
    { source: 'softwareParkAccess-5', target: 'softwareParkCore-1' },
    { source: 'softwareParkAccess-6', target: 'softwareParkCore-1' },
    { source: 'softwareParkAccess-7', target: 'softwareParkCore-3' },
    { source: 'softwareParkAccess-8', target: 'softwareParkCore-3' },
    { source: 'softwareParkAccess-9', target: 'softwareParkCore-3' },
    { source: 'softwareParkAccess-10', target: 'softwareParkCore-3' },
    { source: 'softwareParkAccess-11', target: 'softwareParkCore-3' },
    { source: 'softwareParkAccess-12', target: 'softwareParkCore-3' },
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
    { source: 'softwareParkCore-2', target: 'cnicCore-1' },
    { source: 'softwareParkCore-4', target: 'cnicCore-2' },
    { source: 'softwareParkCore-4', target: 'hyCore-1' },
    { source: 'domestic', target: 'cnicCore' },
    { source: 'domestic', target: 'hyCore' },
    { source: 'cnicCore', target: 'cnicCore-1' },
    { source: 'cnicCore', target: 'cnicCore-2' },
    { source: 'hyCore', target: 'hyCore-1' },
    { source: 'hyCore', target: 'hyCore-2' }
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

  G6.registerNode(
    'aggregated-node',
    {
      draw (cfg, group) {
        // console.log('cfg1', cfg)
        const width = 53, height = 27
        const style = cfg.style || {}
        const colorSet = cfg.colorSet || colorSets[0]

        // halo for hover
        group.addShape('rect', {
          attrs: {
            x: -width * 0.55,
            y: -height * 0.6,
            width: width * 1.1,
            height: height * 1.2,
            fill: colorSet.mainFill,
            opacity: 0.9,
            lineWidth: 0,
            radius: (height / 2 || 13) * 1.2
          },
          name: 'halo-shape',
          visible: false
        })

        // focus stroke for hover
        group.addShape('rect', {
          attrs: {
            x: -width * 0.55,
            y: -height * 0.6,
            width: width * 1.1,
            height: height * 1.2,
            fill: colorSet.mainFill, // '#3B4043',
            stroke: '#AAB7C4',
            lineWidth: 1,
            lineOpacty: 0.85,
            radius: (height / 2 || 13) * 1.2
          },
          name: 'stroke-shape',
          visible: false
        })

        const keyShape = group.addShape('rect', {
          attrs: {
            ...style,
            x: -width / 2,
            y: -height / 2,
            width,
            height,
            fill: colorSet.mainFill, // || '#3B4043',
            stroke: colorSet.mainStroke,
            lineWidth: 2,
            cursor: 'pointer',
            radius: height / 2 || 13,
            lineDash: [2, 2]
          },
          name: 'aggregated-node-keyShape'
        })

        let labelStyle = {}
        if (cfg.labelCfg) {
          labelStyle = Object.assign(labelStyle, cfg.labelCfg.style)
        }
        group.addShape('text', {
          attrs: {
            text: `${cfg.count + '---' + cfg.label}`,
            x: 0,
            y: 0,
            textAlign: 'center',
            textBaseline: 'middle',
            cursor: 'pointer',
            fontSize: 12,
            fill: '#fff',
            opacity: 0.85,
            fontWeight: 400
          },
          name: 'count-shape',
          className: 'count-shape',
          draggable: true
        })

        // tag for new node
        if (cfg.new) {
          group.addShape('circle', {
            attrs: {
              x: width / 2 - 3,
              y: -height / 2 + 3,
              r: 4,
              fill: '#6DD400',
              lineWidth: 0.5,
              stroke: '#FFFFFF'
            },
            name: 'typeNode-tag-circle'
          })
        }
        return keyShape
      },
      setState: (name, value, item: any) => {
        const group = item.get('group')
        if (name === 'layoutEnd' && value) {
          const labelShape = group.find((e: any) => e.get('name') === 'text-shape')
          if (labelShape) labelShape.set('visible', true)
        } else if (name === 'hover') {
          if (item.hasState('focus')) {
            return
          }
          const halo = group.find((e: any) => e.get('name') === 'halo-shape')
          const keyShape = item.getKeyShape()
          const colorSet = item.getModel().colorSet || colorSets[0]
          if (value) {
            halo && halo.show()
            keyShape.attr('fill', colorSet.activeFill)
          } else {
            halo && halo.hide()
            keyShape.attr('fill', colorSet.mainFill)
          }
        } else if (name === 'focus') {
          const stroke = group.find((e) => e.get('name') === 'stroke-shape')
          const keyShape = item.getKeyShape()
          const colorSet = item.getModel().colorSet || colorSets[0]
          if (value) {
            stroke && stroke.show()
            keyShape.attr('fill', colorSet.selectedFill)
          } else {
            stroke && stroke.hide()
            keyShape.attr('fill', colorSet.mainFill)
          }
        }
      },
      update: undefined
    },
    'single-node'
  )

  G6.registerEdge(
    'custom-quadratic',
    {
      setState: (name, value, item) => {
        const group = item.get('group')
        const model = item.getModel()
        if (name === 'focus') {
          const back = group.find((ele) => ele.get('name') === 'back-line')
          if (back) {
            back.stopAnimate()
            back.remove()
            back.destroy()
          }
          const keyShape = group.find((ele) => ele.get('name') === 'edge-shape')
          const arrow = model.style.endArrow
          if (value) {
            if (keyShape.cfg.animation) {
              keyShape.stopAnimate(true)
            }
            keyShape.attr({
              strokeOpacity: animateOpacity,
              opacity: animateOpacity,
              stroke: '#fff',
              endArrow: {
                ...arrow,
                stroke: '#fff',
                fill: '#fff'
              }
            })
            if (model.isReal) {
              const { lineWidth, path, endArrow, stroke } = keyShape.attr()
              const back = group.addShape('path', {
                attrs: {
                  lineWidth,
                  path,
                  stroke,
                  endArrow,
                  opacity: animateBackOpacity
                },
                name: 'back-line'
              })
              back.toBack()
              const length = keyShape.getTotalLength()
              keyShape.animate(
                (ratio) => {
                  // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
                  const startLen = ratio * length
                  // Calculate the lineDash
                  const cfg = {
                    lineDash: [startLen, length - startLen]
                  }
                  return cfg
                },
                {
                  repeat: true, // Whether executes the animation repeatly
                  duration // the duration for executing once
                }
              )
            } else {
              let index = 0
              const lineDash = keyShape.attr('lineDash')
              const totalLength = lineDash[0] + lineDash[1]
              keyShape.animate(
                () => {
                  index++
                  if (index > totalLength) {
                    index = 0
                  }
                  const res = {
                    lineDash,
                    lineDashOffset: -index
                  }
                  // returns the modified configurations here, lineDash and lineDashOffset here
                  return res
                },
                {
                  repeat: true, // whether executes the animation repeatly
                  duration // the duration for executing once
                }
              )
            }
          } else {
            keyShape.stopAnimate()
            const stroke = '#acaeaf'
            const opacity = model.isReal ? realEdgeOpacity : virtualEdgeOpacity
            keyShape.attr({
              stroke,
              strokeOpacity: opacity,
              opacity,
              endArrow: {
                ...arrow,
                stroke,
                fill: stroke
              }
            })
          }
        }
      }
    },
    'quadratic'
  )

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
      type: 'aggregated-node',
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
  <div class="ExportIndex" style="width: 100%; background-color: #2B2F33">
    <div ref="container" id="container" style="width:100%;height:100vh"></div>
  </div>
</template>

<style lang="scss" scoped>
.ExportIndex {
}
</style>
