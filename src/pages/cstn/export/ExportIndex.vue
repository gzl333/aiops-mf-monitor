<script setup lang="ts">
/* eslint-disable */
import { onMounted } from 'vue'
import G6, { Algorithm  } from '@antv/g6'
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
// const { louvain } = G6.Algorithm
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

  const mapData = {
    nodes: [
      { id: 'Myriel' },
      { id: 'Napoleon' },
      { id: 'Mlle.Baptistine' },
      { id: 'Mme.Magloire' },
      { id: 'CountessdeLo' },
      { id: 'Geborand' },
      { id: 'Champtercier' },
      { id: 'Cravatte' },
      { id: 'Count' },
      { id: 'OldMan' },
      { id: 'Labarre' },
      { id: 'Valjean' },
      { id: 'Marguerite' },
      { id: 'Mme.deR' },
      { id: 'Isabeau' },
      { id: 'Gervais' },
      { id: 'Tholomyes' },
      { id: 'Listolier' },
      { id: 'Fameuil' },
      { id: 'Blacheville' },
      { id: 'Favourite' },
      { id: 'Dahlia' },
      { id: 'Zephine' },
      { id: 'Fantine' },
      { id: 'Mme.Thenardier' },
      { id: 'Thenardier' },
      { id: 'Cosette' },
      { id: 'Javert' },
      { id: 'Fauchelevent' },
      { id: 'Bamatabois' },
      { id: 'Perpetue' },
      { id: 'Simplice' },
      { id: 'Scaufflaire' },
      { id: 'Woman1' },
      { id: 'Judge' },
      { id: 'Champmathieu' },
      { id: 'Brevet' },
      { id: 'Chenildieu' },
      { id: 'Cochepaille' },
      { id: 'Pontmercy' },
      { id: 'Boulatruelle' },
      { id: 'Eponine' },
      { id: 'Anzelma' },
      { id: 'Woman2' },
      { id: 'MotherInnocent' },
      { id: 'Gribier' },
      { id: 'Jondrette' },
      { id: 'Mme.Burgon' },
      { id: 'Gavroche' },
      { id: 'Gillenormand' },
      { id: 'Magnon' },
      { id: 'Mlle.Gillenormand' },
      { id: 'Mme.Pontmercy' },
      { id: 'Mlle.Vaubois' },
      { id: 'Lt.Gillenormand' },
      { id: 'Marius' },
      { id: 'BaronessT' },
      { id: 'Mabeuf' },
      { id: 'Enjolras' },
      { id: 'Combeferre' },
      { id: 'Prouvaire' },
      { id: 'Feuilly' },
      { id: 'Courfeyrac' },
      { id: 'Bahorel' },
      { id: 'Bossuet' },
      { id: 'Joly' },
      { id: 'Grantaire' },
      { id: 'MotherPlutarch' },
      { id: 'Gueulemer' },
      { id: 'Babet' },
      { id: 'Claquesous' },
      { id: 'Montparnasse' },
      { id: 'Toussaint' },
      { id: 'Child1' },
      { id: 'Child2' },
      { id: 'Brujon' },
      { id: 'Mme.Hucheloup' }
    ],
    edges: [
      { source: 'Napoleon', target: 'Myriel', value: 1 },
      { source: 'Mlle.Baptistine', target: 'Myriel', value: 8 },
      { source: 'Mme.Magloire', target: 'Myriel', value: 10 },
      { source: 'Mme.Magloire', target: 'Mlle.Baptistine', value: 6 },
      { source: 'CountessdeLo', target: 'Myriel', value: 1 },
      { source: 'Geborand', target: 'Myriel', value: 1 },
      { source: 'Champtercier', target: 'Myriel', value: 1 },
      { source: 'Cravatte', target: 'Myriel', value: 1 },
      { source: 'Count', target: 'Myriel', value: 2 },
      { source: 'OldMan', target: 'Myriel', value: 1 },
      { source: 'Valjean', target: 'Labarre', value: 1 },
      { source: 'Valjean', target: 'Mme.Magloire', value: 3 },
      { source: 'Valjean', target: 'Mlle.Baptistine', value: 3 },
      { source: 'Valjean', target: 'Myriel', value: 5 },
      { source: 'Marguerite', target: 'Valjean', value: 1 },
      { source: 'Mme.deR', target: 'Valjean', value: 1 },
      { source: 'Isabeau', target: 'Valjean', value: 1 },
      { source: 'Gervais', target: 'Valjean', value: 1 },
      { source: 'Listolier', target: 'Tholomyes', value: 4 },
      { source: 'Fameuil', target: 'Tholomyes', value: 4 },
      { source: 'Fameuil', target: 'Listolier', value: 4 },
      { source: 'Blacheville', target: 'Tholomyes', value: 4 },
      { source: 'Blacheville', target: 'Listolier', value: 4 },
      { source: 'Blacheville', target: 'Fameuil', value: 4 },
      { source: 'Favourite', target: 'Tholomyes', value: 3 },
      { source: 'Favourite', target: 'Listolier', value: 3 },
      { source: 'Favourite', target: 'Fameuil', value: 3 },
      { source: 'Favourite', target: 'Blacheville', value: 4 },
      { source: 'Dahlia', target: 'Tholomyes', value: 3 },
      { source: 'Dahlia', target: 'Listolier', value: 3 },
      { source: 'Dahlia', target: 'Fameuil', value: 3 },
      { source: 'Dahlia', target: 'Blacheville', value: 3 },
      { source: 'Dahlia', target: 'Favourite', value: 5 },
      { source: 'Zephine', target: 'Tholomyes', value: 3 },
      { source: 'Zephine', target: 'Listolier', value: 3 },
      { source: 'Zephine', target: 'Fameuil', value: 3 },
      { source: 'Zephine', target: 'Blacheville', value: 3 },
      { source: 'Zephine', target: 'Favourite', value: 4 },
      { source: 'Zephine', target: 'Dahlia', value: 4 },
      { source: 'Fantine', target: 'Tholomyes', value: 3 },
      { source: 'Fantine', target: 'Listolier', value: 3 },
      { source: 'Fantine', target: 'Fameuil', value: 3 },
      { source: 'Fantine', target: 'Blacheville', value: 3 },
      { source: 'Fantine', target: 'Favourite', value: 4 },
      { source: 'Fantine', target: 'Dahlia', value: 4 },
      { source: 'Fantine', target: 'Zephine', value: 4 },
      { source: 'Fantine', target: 'Marguerite', value: 2 },
      { source: 'Fantine', target: 'Valjean', value: 9 },
      { source: 'Mme.Thenardier', target: 'Fantine', value: 2 },
      { source: 'Mme.Thenardier', target: 'Valjean', value: 7 },
      { source: 'Thenardier', target: 'Mme.Thenardier', value: 13 },
      { source: 'Thenardier', target: 'Fantine', value: 1 },
      { source: 'Thenardier', target: 'Valjean', value: 12 },
      { source: 'Cosette', target: 'Mme.Thenardier', value: 4 },
      { source: 'Cosette', target: 'Valjean', value: 31 },
      { source: 'Cosette', target: 'Tholomyes', value: 1 },
      { source: 'Cosette', target: 'Thenardier', value: 1 },
      { source: 'Javert', target: 'Valjean', value: 17 },
      { source: 'Javert', target: 'Fantine', value: 5 },
      { source: 'Javert', target: 'Thenardier', value: 5 },
      { source: 'Javert', target: 'Mme.Thenardier', value: 1 },
      { source: 'Javert', target: 'Cosette', value: 1 },
      { source: 'Fauchelevent', target: 'Valjean', value: 8 },
      { source: 'Fauchelevent', target: 'Javert', value: 1 },
      { source: 'Bamatabois', target: 'Fantine', value: 1 },
      { source: 'Bamatabois', target: 'Javert', value: 1 },
      { source: 'Bamatabois', target: 'Valjean', value: 2 },
      { source: 'Perpetue', target: 'Fantine', value: 1 },
      { source: 'Simplice', target: 'Perpetue', value: 2 },
      { source: 'Simplice', target: 'Valjean', value: 3 },
      { source: 'Simplice', target: 'Fantine', value: 2 },
      { source: 'Simplice', target: 'Javert', value: 1 },
      { source: 'Scaufflaire', target: 'Valjean', value: 1 },
      { source: 'Woman1', target: 'Valjean', value: 2 },
      { source: 'Woman1', target: 'Javert', value: 1 },
      { source: 'Judge', target: 'Valjean', value: 3 },
      { source: 'Judge', target: 'Bamatabois', value: 2 },
      { source: 'Champmathieu', target: 'Valjean', value: 3 },
      { source: 'Champmathieu', target: 'Judge', value: 3 },
      { source: 'Champmathieu', target: 'Bamatabois', value: 2 },
      { source: 'Brevet', target: 'Judge', value: 2 },
      { source: 'Brevet', target: 'Champmathieu', value: 2 },
      { source: 'Brevet', target: 'Valjean', value: 2 },
      { source: 'Brevet', target: 'Bamatabois', value: 1 },
      { source: 'Chenildieu', target: 'Judge', value: 2 },
      { source: 'Chenildieu', target: 'Champmathieu', value: 2 },
      { source: 'Chenildieu', target: 'Brevet', value: 2 },
      { source: 'Chenildieu', target: 'Valjean', value: 2 },
      { source: 'Chenildieu', target: 'Bamatabois', value: 1 },
      { source: 'Cochepaille', target: 'Judge', value: 2 },
      { source: 'Cochepaille', target: 'Champmathieu', value: 2 },
      { source: 'Cochepaille', target: 'Brevet', value: 2 },
      { source: 'Cochepaille', target: 'Chenildieu', value: 2 },
      { source: 'Cochepaille', target: 'Valjean', value: 2 },
      { source: 'Cochepaille', target: 'Bamatabois', value: 1 },
      { source: 'Pontmercy', target: 'Thenardier', value: 1 },
      { source: 'Boulatruelle', target: 'Thenardier', value: 1 },
      { source: 'Eponine', target: 'Mme.Thenardier', value: 2 },
      { source: 'Eponine', target: 'Thenardier', value: 3 },
      { source: 'Anzelma', target: 'Eponine', value: 2 },
      { source: 'Anzelma', target: 'Thenardier', value: 2 },
      { source: 'Anzelma', target: 'Mme.Thenardier', value: 1 },
      { source: 'Woman2', target: 'Valjean', value: 3 },
      { source: 'Woman2', target: 'Cosette', value: 1 },
      { source: 'Woman2', target: 'Javert', value: 1 },
      { source: 'MotherInnocent', target: 'Fauchelevent', value: 3 },
      { source: 'MotherInnocent', target: 'Valjean', value: 1 },
      { source: 'Gribier', target: 'Fauchelevent', value: 2 },
      { source: 'Mme.Burgon', target: 'Jondrette', value: 1 },
      { source: 'Gavroche', target: 'Mme.Burgon', value: 2 },
      { source: 'Gavroche', target: 'Thenardier', value: 1 },
      { source: 'Gavroche', target: 'Javert', value: 1 },
      { source: 'Gavroche', target: 'Valjean', value: 1 },
      { source: 'Gillenormand', target: 'Cosette', value: 3 },
      { source: 'Gillenormand', target: 'Valjean', value: 2 },
      { source: 'Magnon', target: 'Gillenormand', value: 1 },
      { source: 'Magnon', target: 'Mme.Thenardier', value: 1 },
      { source: 'Mlle.Gillenormand', target: 'Gillenormand', value: 9 },
      { source: 'Mlle.Gillenormand', target: 'Cosette', value: 2 },
      { source: 'Mlle.Gillenormand', target: 'Valjean', value: 2 },
      { source: 'Mme.Pontmercy', target: 'Mlle.Gillenormand', value: 1 },
      { source: 'Mme.Pontmercy', target: 'Pontmercy', value: 1 },
      { source: 'Mlle.Vaubois', target: 'Mlle.Gillenormand', value: 1 },
      { source: 'Lt.Gillenormand', target: 'Mlle.Gillenormand', value: 2 },
      { source: 'Lt.Gillenormand', target: 'Gillenormand', value: 1 },
      { source: 'Lt.Gillenormand', target: 'Cosette', value: 1 },
      { source: 'Marius', target: 'Mlle.Gillenormand', value: 6 },
      { source: 'Marius', target: 'Gillenormand', value: 12 },
      { source: 'Marius', target: 'Pontmercy', value: 1 },
      { source: 'Marius', target: 'Lt.Gillenormand', value: 1 },
      { source: 'Marius', target: 'Cosette', value: 21 },
      { source: 'Marius', target: 'Valjean', value: 19 },
      { source: 'Marius', target: 'Tholomyes', value: 1 },
      { source: 'Marius', target: 'Thenardier', value: 2 },
      { source: 'Marius', target: 'Eponine', value: 5 },
      { source: 'Marius', target: 'Gavroche', value: 4 },
      { source: 'BaronessT', target: 'Gillenormand', value: 1 },
      { source: 'BaronessT', target: 'Marius', value: 1 },
      { source: 'Mabeuf', target: 'Marius', value: 1 },
      { source: 'Mabeuf', target: 'Eponine', value: 1 },
      { source: 'Mabeuf', target: 'Gavroche', value: 1 },
      { source: 'Enjolras', target: 'Marius', value: 7 },
      { source: 'Enjolras', target: 'Gavroche', value: 7 },
      { source: 'Enjolras', target: 'Javert', value: 6 },
      { source: 'Enjolras', target: 'Mabeuf', value: 1 },
      { source: 'Enjolras', target: 'Valjean', value: 4 },
      { source: 'Combeferre', target: 'Enjolras', value: 15 },
      { source: 'Combeferre', target: 'Marius', value: 5 },
      { source: 'Combeferre', target: 'Gavroche', value: 6 },
      { source: 'Combeferre', target: 'Mabeuf', value: 2 },
      { source: 'Prouvaire', target: 'Gavroche', value: 1 },
      { source: 'Prouvaire', target: 'Enjolras', value: 4 },
      { source: 'Prouvaire', target: 'Combeferre', value: 2 },
      { source: 'Feuilly', target: 'Gavroche', value: 2 },
      { source: 'Feuilly', target: 'Enjolras', value: 6 },
      { source: 'Feuilly', target: 'Prouvaire', value: 2 },
      { source: 'Feuilly', target: 'Combeferre', value: 5 },
      { source: 'Feuilly', target: 'Mabeuf', value: 1 },
      { source: 'Feuilly', target: 'Marius', value: 1 },
      { source: 'Courfeyrac', target: 'Marius', value: 9 },
      { source: 'Courfeyrac', target: 'Enjolras', value: 17 },
      { source: 'Courfeyrac', target: 'Combeferre', value: 13 },
      { source: 'Courfeyrac', target: 'Gavroche', value: 7 },
      { source: 'Courfeyrac', target: 'Mabeuf', value: 2 },
      { source: 'Courfeyrac', target: 'Eponine', value: 1 },
      { source: 'Courfeyrac', target: 'Feuilly', value: 6 },
      { source: 'Courfeyrac', target: 'Prouvaire', value: 3 },
      { source: 'Bahorel', target: 'Combeferre', value: 5 },
      { source: 'Bahorel', target: 'Gavroche', value: 5 },
      { source: 'Bahorel', target: 'Courfeyrac', value: 6 },
      { source: 'Bahorel', target: 'Mabeuf', value: 2 },
      { source: 'Bahorel', target: 'Enjolras', value: 4 },
      { source: 'Bahorel', target: 'Feuilly', value: 3 },
      { source: 'Bahorel', target: 'Prouvaire', value: 2 },
      { source: 'Bahorel', target: 'Marius', value: 1 },
      { source: 'Bossuet', target: 'Marius', value: 5 },
      { source: 'Bossuet', target: 'Courfeyrac', value: 12 },
      { source: 'Bossuet', target: 'Gavroche', value: 5 },
      { source: 'Bossuet', target: 'Bahorel', value: 4 },
      { source: 'Bossuet', target: 'Enjolras', value: 10 },
      { source: 'Bossuet', target: 'Feuilly', value: 6 },
      { source: 'Bossuet', target: 'Prouvaire', value: 2 },
      { source: 'Bossuet', target: 'Combeferre', value: 9 },
      { source: 'Bossuet', target: 'Mabeuf', value: 1 },
      { source: 'Bossuet', target: 'Valjean', value: 1 },
      { source: 'Joly', target: 'Bahorel', value: 5 },
      { source: 'Joly', target: 'Bossuet', value: 7 },
      { source: 'Joly', target: 'Gavroche', value: 3 },
      { source: 'Joly', target: 'Courfeyrac', value: 5 },
      { source: 'Joly', target: 'Enjolras', value: 5 },
      { source: 'Joly', target: 'Feuilly', value: 5 },
      { source: 'Joly', target: 'Prouvaire', value: 2 },
      { source: 'Joly', target: 'Combeferre', value: 5 },
      { source: 'Joly', target: 'Mabeuf', value: 1 },
      { source: 'Joly', target: 'Marius', value: 2 },
      { source: 'Grantaire', target: 'Bossuet', value: 3 },
      { source: 'Grantaire', target: 'Enjolras', value: 3 },
      { source: 'Grantaire', target: 'Combeferre', value: 1 },
      { source: 'Grantaire', target: 'Courfeyrac', value: 2 },
      { source: 'Grantaire', target: 'Joly', value: 2 },
      { source: 'Grantaire', target: 'Gavroche', value: 1 },
      { source: 'Grantaire', target: 'Bahorel', value: 1 },
      { source: 'Grantaire', target: 'Feuilly', value: 1 },
      { source: 'Grantaire', target: 'Prouvaire', value: 1 },
      { source: 'MotherPlutarch', target: 'Mabeuf', value: 3 },
      { source: 'Gueulemer', target: 'Thenardier', value: 5 },
      { source: 'Gueulemer', target: 'Valjean', value: 1 },
      { source: 'Gueulemer', target: 'Mme.Thenardier', value: 1 },
      { source: 'Gueulemer', target: 'Javert', value: 1 },
      { source: 'Gueulemer', target: 'Gavroche', value: 1 },
      { source: 'Gueulemer', target: 'Eponine', value: 1 },
      { source: 'Babet', target: 'Thenardier', value: 6 },
      { source: 'Babet', target: 'Gueulemer', value: 6 },
      { source: 'Babet', target: 'Valjean', value: 1 },
      { source: 'Babet', target: 'Mme.Thenardier', value: 1 },
      { source: 'Babet', target: 'Javert', value: 2 },
      { source: 'Babet', target: 'Gavroche', value: 1 },
      { source: 'Babet', target: 'Eponine', value: 1 },
      { source: 'Claquesous', target: 'Thenardier', value: 4 },
      { source: 'Claquesous', target: 'Babet', value: 4 },
      { source: 'Claquesous', target: 'Gueulemer', value: 4 },
      { source: 'Claquesous', target: 'Valjean', value: 1 },
      { source: 'Claquesous', target: 'Mme.Thenardier', value: 1 },
      { source: 'Claquesous', target: 'Javert', value: 1 },
      { source: 'Claquesous', target: 'Eponine', value: 1 },
      { source: 'Claquesous', target: 'Enjolras', value: 1 },
      { source: 'Montparnasse', target: 'Javert', value: 1 },
      { source: 'Montparnasse', target: 'Babet', value: 2 },
      { source: 'Montparnasse', target: 'Gueulemer', value: 2 },
      { source: 'Montparnasse', target: 'Claquesous', value: 2 },
      { source: 'Montparnasse', target: 'Valjean', value: 1 },
      { source: 'Montparnasse', target: 'Gavroche', value: 1 },
      { source: 'Montparnasse', target: 'Eponine', value: 1 },
      { source: 'Montparnasse', target: 'Thenardier', value: 1 },
      { source: 'Toussaint', target: 'Cosette', value: 2 },
      { source: 'Toussaint', target: 'Javert', value: 1 },
      { source: 'Toussaint', target: 'Valjean', value: 1 },
      { source: 'Child1', target: 'Gavroche', value: 2 },
      { source: 'Child2', target: 'Gavroche', value: 2 },
      { source: 'Child2', target: 'Child1', value: 3 },
      { source: 'Brujon', target: 'Babet', value: 3 },
      { source: 'Brujon', target: 'Gueulemer', value: 3 },
      { source: 'Brujon', target: 'Thenardier', value: 3 },
      { source: 'Brujon', target: 'Gavroche', value: 1 },
      { source: 'Brujon', target: 'Eponine', value: 1 },
      { source: 'Brujon', target: 'Claquesous', value: 1 },
      { source: 'Brujon', target: 'Montparnasse', value: 1 },
      { source: 'Mme.Hucheloup', target: 'Bossuet', value: 1 },
      { source: 'Mme.Hucheloup', target: 'Joly', value: 1 },
      { source: 'Mme.Hucheloup', target: 'Grantaire', value: 1 },
      { source: 'Mme.Hucheloup', target: 'Bahorel', value: 1 },
      { source: 'Mme.Hucheloup', target: 'Courfeyrac', value: 1 },
      { source: 'Mme.Hucheloup', target: 'Gavroche', value: 1 },
      { source: 'Mme.Hucheloup', target: 'Enjolras', value: 1 }
    ]
  }
  const mapData3 = {
    nodes: [
      { id: 'international' },
      { id: 'Napoleon' },
      { id: 'Mlle.Baptistine' },
      { id: 'Mme.Magloire' },
      { id: 'CountessdeLo' },
      { id: 'Geborand' },
      { id: 'Champtercier' },
      { id: 'Cravatte' },
      { id: 'Count' },
      { id: 'OldMan' },
      { id: 'Labarre' },
      { id: 'Valjean' },
      { id: 'Marguerite' },
      { id: 'Mme.deR' },
      { id: 'Isabeau' },
      { id: 'Gervais' },
      { id: 'Tholomyes' },
      { id: 'Listolier' },
      { id: 'Fameuil' },
      { id: 'Blacheville' }
    ],
    edges: [
      { source: 'Napoleon', target: 'international', value: 11 },
      { source: 'Mlle.Baptistine', target: 'international', value: 1 },
      { source: 'Mme.Magloire', target: 'international', value: 10 },
      { source: 'Mme.Magloire', target: 'Mlle.Baptistine', value: 6 },
      { source: 'CountessdeLo', target: 'international', value: 1 },
      { source: 'Geborand', target: 'international', value: 1 },
      { source: 'Champtercier', target: 'international', value: 1 },
      { source: 'Cravatte', target: 'international', value: 1 },
      { source: 'Count', target: 'international', value: 2 },
      { source: 'OldMan', target: 'international', value: 1 },
      { source: 'Valjean', target: 'Labarre', value: 1 },
      { source: 'Valjean', target: 'Mme.Magloire', value: 3 },
      { source: 'Valjean', target: 'Mlle.Baptistine', value: 3 },
      { source: 'Valjean', target: 'international', value: 5 },
      { source: 'Marguerite', target: 'Valjean', value: 1 },
      { source: 'Mme.deR', target: 'Valjean', value: 1 },
      { source: 'Isabeau', target: 'Valjean', value: 1 },
      { source: 'Gervais', target: 'Valjean', value: 1 },
      { source: 'Listolier', target: 'Tholomyes', value: 4 },
      { source: 'Fameuil', target: 'Tholomyes', value: 4 },
      { source: 'Fameuil', target: 'Listolier', value: 4 },
      { source: 'Blacheville', target: 'Tholomyes', value: 4 },
      { source: 'Blacheville', target: 'Listolier', value: 4 },
      { source: 'Blacheville', target: 'Fameuil', value: 4 }
    ]
  }
  const { louvain } = Algorithm
// result 中包含 clusters 与 clusterEdges 数组。data 中的每个节点数据将带有 clusterId 字段
  const clusteredData1 = louvain(mapData, false, 'weight')
  console.log(clusteredData1)
  const clusteredData3 = louvain(mapData3, false, 'weight')
  console.log(clusteredData3)
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
