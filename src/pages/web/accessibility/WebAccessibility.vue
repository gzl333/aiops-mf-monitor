<script setup lang="ts">
import { ref, computed } from 'vue'
// import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'
import PieChart from 'components/chart/PieChart.vue'
import HistogramChart from 'components/chart/HistogramChart.vue'
import { navigateToUrl } from 'single-spa'
import { date } from 'quasar'
// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

const store = useStore()
// const route = useRoute()
// const router = useRouter()
const tc = i18n.global.tc
const webMonitorTaskRow = computed(() => store.getWebMonitorTaskTable())
const overviewOption = computed(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: '任务状态总览',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: '正常' },
        { value: 735, name: '异常' }
      ]
    }
  ]
}))
const delayOption = computed(() => ({
  title: {
    text: '任务时延分布'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    data: ['<50ms', '50ms-100ms', '100ms-300ms', '300ms-600ms', '600ms-1s', '1s-3s']
  },
  series: [
    {
      name: '探针1',
      type: 'bar',
      data: [103, 239, 294, 1070, 1144, 6303]
    },
    {
      name: '探针2',
      type: 'bar',
      data: [195, 238, 300, 1194, 1311, 6810]
    }
  ]
}))
const columns = [
  {
    name: 'name',
    required: true,
    label: '告警时间',
    align: 'left',
    field: 'name'
  },
  { name: 'calories', align: 'center', label: '告警详情', field: 'calories' }
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159
  },
  {
    name: 'Ice cream sandwich',
    calories: 237
  },
  {
    name: 'Eclair',
    calories: 262
  },
  {
    name: 'Cupcake',
    calories: 305
  },
  {
    name: 'Gingerbread',
    calories: 356
  }
]
const date2 = ref('2019-02-01 12:44')
const date1 = ref('2019-02-01 12:44')
const model = ref(null)
const options = [
  '探针1', '探针2'
]
const standard = ref({
  min: 10,
  max: 35
})
const text = ref('')
const columns1 = computed(() => [
  { name: 'id', label: (() => tc('任务id'))(), align: 'center', field: 'id' },
  { name: 'name', label: (() => tc('任务名称'))(), align: 'center', field: 'name' },
  { name: 'url', label: (() => tc('监控url'))(), align: 'center', field: 'url' },
  { name: 'remark', label: (() => tc('备注'))(), align: 'center', field: 'remark' },
  { name: 'creation', label: (() => tc('创建时间'))(), align: 'center', field: 'creation' },
  { name: 'operation', label: (() => tc('操作'))(), field: 'operation', align: 'center' }
])
const isLoad = ref(false)
</script>

<template>
  <div class="WebAccessibility">
    <div class="row">
      <div class="col-5">
        <div class="row items-center">
          <div class="col">
            <pie-chart height="220" :option="overviewOption"/>
          </div>
          <div class="col text-center">
            <div class="text-h6">当前任务总览</div>
            <div class="q-mt-sm">总任务数：1000</div>
            <div>异常数：300</div>
            <div>正常连接数：700</div>
          </div>
        </div>
        <q-table
          flat bordered
          title="告警信息"
          dense
          :rows="rows"
          :columns="columns"
          row-key="name"
          hide-pagination
        />
      </div>
      <div class="col-7">
        <div class="row items-center justify-end">
          <q-input class="q-mr-md" filled dense v-model="date2">
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
          <div class="q-mr-md">一</div>
          <q-input filled dense v-model="date2">
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
        </div>
        <div class="q-mt-lg">
          <histogram-chart :option="delayOption" height="385"/>
        </div>
      </div>
    </div>
    <div class="q-mt-md">
      <q-list bordered>
      <q-expansion-item
        expand-separator
        icon="las la-search-plus"
        label="根据条件筛选"
      >
        <q-separator/>
        <div class="q-pa-sm">
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
            <q-input class="q-ml-md" filled dense v-model="date1">
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
            <q-select class="q-ml-md col-3" outlined dense v-model="model" :options="options" label="请选择" />
          </div>
          <div class="q-mt-md">
            <q-badge color="secondary">
              根据时延范围筛选任务: {{ standard.min }}ms 到 {{ standard.max }}ms
            </q-badge>
            <q-range
              v-model="standard"
              :min="0"
              :max="50"
            />
          </div>
        </div>
      </q-expansion-item>
      </q-list>
      <div class="row items-center q-mt-sm">
        <div class="col-3">
          <q-input outlined dense v-model="text" label="请输入">
            <template v-slot:prepend>
              <q-icon name="las la-search" />
            </template>
          </q-input>
        </div>
        <div class="q-ml-sm">（任务名、任务id、任务备注检索）</div>
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
          hide-pagination
          :pagination="{ rowsPerPage: 0 }"
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
</template>

<style lang="scss" scoped>
.WebAccessibility {
}
</style>
