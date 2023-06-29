<script setup lang="ts">
import { computed, ref, watch } from 'vue'
// import LineChart from 'components/chart/LineChart.vue'
import PieChart from 'components/chart/PieChart.vue'
import { navigateToUrl } from 'single-spa'
import { date } from 'quasar'
import { i18n } from 'boot/i18n'
import { useStore } from 'stores/store'
import $bus from 'src/hooks/bus'
import aiops from 'src/api/aiops'

interface distributionData {
  value: number
  name: string
  // color: string
}

const date2 = ref(date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'))
const date1 = ref(date.formatDate(Date.now() - 300, 'YYYY-MM-DD HH:mm'))
const standard = ref({
  min: 0,
  max: 500
})
const text = ref('')
const expanded = ref(false)

const tc = i18n.global.tc
const columns1 = computed(() => [
  { name: 'id', label: (() => tc('任务id'))(), align: 'center', field: 'id' },
  { name: 'name', label: (() => tc('任务名称'))(), align: 'center', field: 'name' },
  { name: 'url', label: (() => tc('监控url'))(), align: 'center', field: 'url' },
  { name: 'remark', label: (() => tc('备注'))(), align: 'center', field: 'remark' },
  { name: 'creation', label: (() => tc('创建时间'))(), align: 'center', field: 'creation' },
  { name: 'operation', label: (() => tc('操作'))(), field: 'operation', align: 'center' }
])
const store = useStore()
const webMonitorTaskRow = computed(() => store.getWebMonitorTaskTable())
const isLoad = ref(false)

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
      data: distributionTypeData.value
    },
    {
      name: '耗时占比',
      type: 'pie',
      radius: ['45%', '55 %'],
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
      data: distributionDelayData.value
    }
  ]
})) // 嵌套饼环图

const typeselect = ref('探针1')
const model_option_search = ref('探针1')
const model_option_type_search = ref(null)
const options_type = [
  '异常', '高时延', '流畅'
]
const options = [
  '探针1', '探针2'
]
const isDisable1 = ref(false)
const fun2 = () => {
  model_option_type_search.value = null
}
watch(model_option_type_search, async (new_value) => {
  if (new_value == null) {
    isDisable1.value = false
  } else {
    if (new_value === '异常') {
      isDisable1.value = true
    } else {
      if (new_value === '流畅') {
        standard.value = { min: 1, max: 3000 }
        isDisable1.value = false
      } else {
        standard.value = { min: 3000, max: 5000 }
        isDisable1.value = false
      }
    }
  }
})
const type_list: string[] = ['异常', '高延迟', '流畅']

$bus.on('mission_select', msg => {
  // console.log(msg.name)
  expanded.value = true
  model_option_search.value = typeselect.value
  if (type_list.includes(msg.name)) {
    // 是类型分支
    // console.log(`${a} is in the list`);
    model_option_type_search.value = msg.name
    if (msg.name === '异常') {
      // model_option_type_search.value = msg.name
    } else {
      if (msg.name === '流畅') {
        standard.value = { min: 1, max: 3000 }
        isDisable1.value = false
      } else {
        standard.value = { min: 3000, max: 5000 }
        isDisable1.value = false
      }
    }
    console.log(msg.name)
  } else {
    // 是延时分支
    // console.log(`${a} is not in the list`);
    model_option_type_search.value = null
    const ind1 = msg.name.indexOf('ms')
    const ind2 = msg.name.lastIndexOf('ms')
    // if (ind1 === ind2) {
    // }
    const dash = msg.name.indexOf('-')
    const delay1 = msg.name.substring(0, ind1) as number
    const delay2 = msg.name.substring(dash + 1, ind2) as number
    console.log(delay1, delay2)
    standard.value = { min: delay1, max: delay2 }
    // console.log(msg.value)
  }
})

const distributionTypeData = ref<distributionData[]>([])
const distributionDelayData = ref<distributionData[]>([])
const getDistribution = () => {
  distributionTypeData.value = []
  distributionDelayData.value = []
  const probeid = ref(1)
  if (typeselect.value === '探针1') {
    probeid.value = 1
  } else {
    probeid.value = 2
  }
  aiops.monitor.getDistribution({ query: { probe_id: probeid.value } }).then((res) => {
    for (const status in res.data.status) {
      const single_distribution_type_data: distributionData = {
        value: 0,
        name: ''
      }
      single_distribution_type_data.name = status
      single_distribution_type_data.value = res.data.status[status]
      distributionTypeData.value.push(single_distribution_type_data)
    }
    for (const delay in res.data.delay) {
      const single_distribution_delay_data: distributionData = {
        value: 0,
        name: ''
      }
      single_distribution_delay_data.name = delay
      single_distribution_delay_data.value = res.data.delay[delay]
      distributionDelayData.value.push(single_distribution_delay_data)
      console.log(res.data.status[delay])
    }
  })
}
const funTmp = () => {
  console.log('waiting for api')
  const probeid = ref(1)
  if (typeselect.value === '探针1') {
    probeid.value = 1
  } else {
    probeid.value = 2
  }
  if (expanded.value === true) {
    console.log('detail search')
    console.log(date1.value)
    console.log(date2.value)
    console.log(model_option_search.value)
    if (model_option_type_search.value === '异常') console.log(model_option_type_search.value)
    else {
      console.log(standard.value)
    }
  } else {
    console.log(text.value + ' as param')
  }
}

watch(date1, (newValue, oldValue) => {
  // const bigger_time = date.formatDate(date2.value, 'X')
  console.log(oldValue)
  const unit = 'seconds'
  const now = date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm')
  let diff = date.getDateDiff(newValue, now, unit)
  if (diff > 0) {
    date1.value = oldValue
    alert('time should not bigger than now!')
  }
  diff = date.getDateDiff(date2.value, newValue, unit)
  if (diff < 0) {
    date1.value = oldValue
    alert('start time should not biggger than end time!')
  }
  if (date1.value !== oldValue) funTmp()
  // console.log(bigger_time)
  // console.log(newValue)
  // console.log(diff)
})
watch(date2, async (newValue, oldValue) => {
  // const bigger_time = date.formatDate(date2.value, 'X')
  const unit = 'seconds'
  const now = date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm')
  let diff = date.getDateDiff(newValue, now, unit)
  if (diff > 0) {
    date2.value = oldValue
    alert('time should not bigger than now!')
  }
  diff = date.getDateDiff(date1.value, newValue, unit)
  if (diff > 0) {
    date2.value = oldValue
    alert('end time should not be smaller than start time!')
  }
  if (date2.value !== oldValue) funTmp()
  // console.log(bigger_time)
  // console.log(newValue)
  // console.log(diff)
})
getDistribution()
</script>

<template>
  <div class="WebOverall">
    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6">网页实时状态概览</div>
          <div class="row q-mt-md">
            <q-select outlined dense v-model="typeselect" :options="options" label="请选择" class="col-3"
                      @update:model-value="getDistribution"/>
          </div>
          <div class="q-mt-lg row">
            <div class="col">
              <pie-chart height="730" :option="dataOption"/>
            </div>
          </div>
          <div class="q-mt-md">
            <!--      <q-list bordered>-->
            <q-toggle v-model="expanded" label="高级检索" class="q-mb-md"/>
            <!--        <q-expansion-item-->
            <!--          v-model="expanded"-->
            <!--          label="根据延时及时间区间检索"-->
            <!--        >-->
            <q-separator/>
            <div class="q-pa-sm" v-show="expanded">
              <div class="row items-center">
                <q-input filled dense v-model="date1">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="date1" mask="YYYY-MM-DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="date1" mask="YYYY-MM-DD HH:mm" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div class="q-ml-md">一</div>
                <q-input class="q-ml-md" filled dense v-model="date2">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="date2" mask="YYYY-MM-DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="date2" mask="YYYY-MM-DD HH:mm" format24h>
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-select class="q-ml-md col-3" outlined dense v-model="model_option_search" :options="options" label="请选择" />
                <q-select class="q-ml-md col-3" outlined dense clearable v-model="model_option_type_search" ref="basic_type" :options="options_type" label="请选择" />
              </div>
              <div class="q-mt-md">
                <q-badge color="secondary">
                  根据时延范围筛选任务: {{ standard.min }}ms 到 {{ standard.max }}ms
                </q-badge>
                <q-range
                  v-model="standard"
                  @update:model-value="fun2"
                  :disable="isDisable1"
                  :min="1"
                  :max="5000"
                  label-always
                />
              </div>
            </div>
            <!--        </q-expansion-item>-->
            <!--      </q-list>-->
            <div class="row items-center q-mt-sm">
              <div class="col-3">
                <q-input outlined dense v-model="text" label="请输入">
                  <template v-slot:prepend>
                    <q-icon name="las la-search" />
                  </template>
                </q-input>
              </div>
              <div class="q-ml-sm">
                <q-btn outline color="primary" label="搜索" @click="funTmp"/>
              </div>
            </div>
          </div>
          <div>
            <q-table
              flat
              class="col"
              table-header-class="bg-grey-1 text-grey"
              :rows="webMonitorTaskRow"
              :columns="columns1"
              :loading="isLoad"
              row-key="name"
              color="primary"
              :loading-label="tc('notifyLoading')"
              :no-data-label="tc('noData')"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="id" :props="props" class="no-padding">
                    <q-btn no-caps flat color="primary" :label="tc('查看详情')" @click="navigateToUrl(`/my/monitor/web/detail/${props.row.id}`)"/>
                    <span>{{ props.row.id }}</span>
                  </q-td>
                  <q-td key="name" :props="props" class="no-padding">
                    {{ props.row.name }}
                  </q-td>
                  <q-td key="url" :props="props" class="no-padding">
                    {{ props.row.url }}
                  </q-td>
                  <q-td key="remark" :props="props" class="no-padding">
                    {{ props.row.remark ? props.row.remark : tc('暂无备注') }}
                  </q-td>
                  <q-td key="creation" :props="props" class="no-padding">
                    {{ date.formatDate(props.row.creation, 'YYYY-MM-DD HH:mm') }}
                  </q-td>
                  <q-td key="operation" :props="props" class="no-padding">
                    <q-btn color="primary" unelevated no-caps @click="store.triggerReviseTaskDialog(props.row.id)">
                      {{ tc('修改') }}
                    </q-btn>
                    <q-btn class="q-ml-xs" color="primary" unelevated no-caps @click="store.triggerDeleteTaskDialog(props.row.id)">
                      {{ tc('删除') }}
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <q-separator/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

//.centered-content {
//  display: flex;
//  justify-content: center;
//  align-items: center;
//}

</style>
