<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import { useStore, ServiceUnitInterface } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import TidbCluster from 'components/tibd/TidbCluster.vue'
import { i18n } from 'boot/i18n'
import service from 'src/api/service'
// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })

// const emits = defineEmits(['change', 'delete'])
// const route = useRoute()
// const router = useRouter()
const { tc } = i18n.global
const store = useStore()
const organizations = computed(() => store.getAllMonitoringOrganization('tibd'))
const tidbUnitsObj = ref<Record<string, ServiceUnitInterface[]>>({})
// 用于备份所有的单元，模糊搜索时用到
const allTidbUnitsObjData: Record<string, ServiceUnitInterface[]> = {}
const allExpendUnitsObjData: Record<string, ServiceUnitInterface[]> = {}
// 传输给子组件的数据
const propsUnitData = ref<Record<string, unknown>>({})
let timer: NodeJS.Timer | null
let countDownTimer: NodeJS.Timer | null
const renovateTime = ref(30)
const keyword = ref('')
// 用于判断是否可点击
const isDisable = ref(true)
// 用于判断是否存在计时器
const isIntervalOpen = ref(false)
// 用于判断刷新按钮显示和不显示 每一个子组件对应对象里的一个值
const renovateShow = ref<Record<string, boolean>>({})
const filterSelection = ref({
  label: '每30s刷新',
  labelEn: 'Refresh every 30 seconds',
  value: 30
})
const filterOptions = [
  {
    label: '每30s刷新',
    labelEn: 'Refresh every 30 seconds',
    value: 30
  },
  {
    label: '每1min刷新',
    labelEn: 'Refresh every 1 minute',
    value: 60
  },
  {
    label: '每10min刷新',
    labelEn: 'Refresh every 10 minutes',
    value: 600
  },
  {
    label: '每30min刷新',
    labelEn: 'Refresh every 30 minutes',
    value: 1800
  },
  {
    label: '每1h刷新',
    labelEn: 'Refresh every 1 hour',
    value: 3600
  }
]
const getAllUnit = async () => {
  for (const organization of organizations.value) {
    // 获取机构下所有单元
    const unitArr: ServiceUnitInterface[] = []
    const numberRequest = Math.ceil(store.tables.dataCenterTable.byId[organization.id].tidbUnit / 100)
    for (let i = 0; i < numberRequest; i++) {
      const unitObj: { [key: string]: ServiceUnitInterface[] } = {}
      const monitorUnitTidbRes = await service.monitor.getMonitorUnitTidb({
        query: {
          page: i + 1,
          page_size: 100,
          organization_id: organization.id
        }
      })
      if (monitorUnitTidbRes.status === 200) {
        let sort = 0
        // 按照sort_weight排序
        monitorUnitTidbRes.data.results.forEach((unit: ServiceUnitInterface) => {
          if (unit.sort_weight >= sort) {
            unitArr.push(unit)
          } else {
            unitArr.unshift(unit)
          }
          sort = unit.sort_weight
        })
        if (i + 1 === numberRequest) {
          unitObj[organization.id] = unitArr
          Object.assign(tidbUnitsObj.value, unitObj)
          Object.assign(allTidbUnitsObjData, unitObj)
        }
      }
    }
  }
}
getAllUnit()
// 获取数据
const getTidbQuery = async (monitor_unit_id: string) => {
  const tidbQuery: string[] = ['pd_nodes', 'tidb_nodes', 'tikv_nodes', 'region_count', 'region_health', 'storage_capacity', 'current_storage_size', 'storage', 'connections_count', 'qps', 'server_cpu_usage', 'server_mem_usage', 'server_disk_usage']
  const config = {
    query: {
      monitor_unit_id,
      query: ''
    }
  }
  const tidbObject: {[key: string]: never[] | number | string } = {}
  for (const query of tidbQuery) {
    config.query.query = query
    const monitorCephQuery = await service.monitor.getMonitorTidbQuery(config)
    if (monitorCephQuery.status === 200 && monitorCephQuery.data.length > 0) {
      // 连接数计算总和
      if (query === 'connections_count') {
        let totalConnect = 0
        monitorCephQuery.data.forEach((item: Record<string, string>) => {
          totalConnect += Number(item.value[1])
        })
        tidbObject['totalConnect' as keyof typeof tidbObject] = totalConnect
      }
      // qps计算总和
      if (query === 'qps') {
        let totalQps = 0
        monitorCephQuery.data.forEach((item: Record<string, string>) => {
          totalQps += Math.round(Number(item.value[1]))
        })
        tidbObject['totalQbs' as keyof typeof tidbObject] = totalQps
      }
      // 利用率计算最大值
      if (query === 'server_cpu_usage' || query === 'server_mem_usage' || query === 'server_disk_usage') {
        let max = 0
        monitorCephQuery.data.forEach((item: Record<string, string>) => {
          if (Number(item.value[1]) > max) {
            max = Number(item.value[1])
          }
        })
        tidbObject[query + '_max' as keyof typeof tidbObject] = max.toFixed(2)
      }
      tidbObject[query as keyof typeof tidbObject] = monitorCephQuery.data
    } else if (monitorCephQuery.status === 200 && monitorCephQuery.data.length === 0) {
      tidbObject[query as keyof typeof tidbObject] = []
    }
  }
  return tidbObject
}
const openPanel = async (organization_id: string) => {
  // 打开面板获取数据
  if (allTidbUnitsObjData[organization_id] && allTidbUnitsObjData[organization_id].length > 0) {
    const unitObj: { [key: string]: unknown } = {}
    unitObj[organization_id] = allTidbUnitsObjData[organization_id]
    Object.assign(allExpendUnitsObjData, unitObj)
    allTidbUnitsObjData[organization_id].forEach(unit => {
      getTidbQuery(unit.id).then((res) => {
        propsUnitData.value[unit.id] = res
        renovateShow.value[unit.id] = true
      })
    })
    // 开启定时器
    if (!isIntervalOpen.value) {
      countDownTimer = setInterval(() => {
        if (renovateTime.value > 0) {
          renovateTime.value--
        }
      }, 1000)
      timer = setInterval(() => {
        refreshAllUnit()
      }, filterSelection.value.value * 1000)
      isIntervalOpen.value = true
      isDisable.value = false
    }
  }
}
const closePanel = (organization_id: string) => {
  Reflect.deleteProperty(allExpendUnitsObjData, organization_id)
  if (Object.keys(allExpendUnitsObjData).length === 0) {
    // 清空定时器
    clearInterval(Number(timer))
    clearInterval(Number(countDownTimer))
    renovateTime.value = filterSelection.value.value
    isIntervalOpen.value = false
    isDisable.value = true
  }
}
// 全部刷新
const refreshAllUnit = () => {
  propsUnitData.value = {}
  isDisable.value = true
  Object.keys(allExpendUnitsObjData).forEach((org, orgIndex) => {
    allExpendUnitsObjData[org].forEach((unit, unitIndex) => {
      renovateShow.value[unit.id] = false
      getTidbQuery(unit.id).then((res) => {
        propsUnitData.value[unit.id] = res
        renovateShow.value[unit.id] = true
        if (orgIndex === Object.keys(allExpendUnitsObjData).length - 1 && unitIndex === allExpendUnitsObjData[org].length - 1) {
          isDisable.value = false
          renovateTime.value = filterSelection.value.value
        }
      })
    })
  })
}
// 单个刷新
const refreshUint = (unitId: string) => {
  propsUnitData.value[unitId] = {}
  renovateShow.value[unitId] = false
  getTidbQuery(unitId).then((res) => {
    propsUnitData.value[unitId] = res
    renovateShow.value[unitId] = true
  })
}
const keywordSearch = () => {
  if (keyword.value === '' || keyword.value === null) {
    tidbUnitsObj.value = { ...allTidbUnitsObjData }
  } else {
    Object.keys(allExpendUnitsObjData).forEach(item => {
      tidbUnitsObj.value[item] = allExpendUnitsObjData[item].filter(state => state.name.indexOf(keyword.value.trim()) > -1 || state.name_en.indexOf(keyword.value.trim()) > -1)
    })
  }
}
const gtToDetail = (url: string) => {
  window.open(url)
}
watch(filterSelection, () => {
  renovateTime.value = filterSelection.value.value
  clearInterval(Number(timer))
  timer = setInterval(() => {
    refreshAllUnit()
  }, filterSelection.value.value * 1000)
})
watch(organizations, () => {
  if (organizations.value.length > 0) {
    getAllUnit()
  }
})
onUnmounted(() => {
  clearInterval(Number(timer))
  clearInterval(Number(countDownTimer))
})
</script>

<template>
  <div class="TidbPage" style="min-width: 1000px">
    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6 q-pt-lg">
            TiDB
          </div>
          <div class="row justify-between items-center q-mt-lg">
            <div class="col-4">
              <q-input :disable="isDisable" outlined dense clearable v-model="keyword" :label="tc('输入关键字搜索')" @update:model-value="keywordSearch"/>
            </div>
            <div class="col-6 row justify-end items-center">
              <div v-show="!isDisable" class="col-5 row items-center justify-end">
                <q-icon class="q-mr-sm" name="refresh" size="lg" @click="refreshAllUnit"/>
                <div class="text-grey-7 q-mr-md">{{ tc('剩余刷新时间') }}</div>
                <q-circular-progress
                  show-value
                  class="text-light-blue q-mr-md"
                  :value="renovateTime"
                  size="40px"
                  :max="filterSelection.value"
                  color="light-blue"
                  track-color="grey-3"
                >
                  {{ renovateTime }}s
                </q-circular-progress>
              </div>
              <q-select class="col-5" :disable="isDisable" outlined dense v-model="filterSelection" :options="filterOptions" :option-label="i18n.global.locale ==='zh'? 'label':'labelEn'" :label="tc('刷新时间')" />
            </div>
          </div>
          <div class="q-mt-lg">
            <q-list bordered>
              <div v-for="org in organizations" :key="org.id">
                <q-expansion-item
                  expand-icon-class="text-primary"
                  header-class="bg-grey-2"
                  @show="openPanel(org.id)"
                  @hide="closePanel(org.id)"
                >
                  <template v-slot:header>
                    <q-item-section>
                      <div class="row justify-between items-center">
                        <div>
                          <div class="text-subtitle1">{{ i18n.global.locale === 'zh' ? org.name : org.name_en }}</div>
                          <div>{{ org?.abbreviation }}</div>
                        </div>
                        <div class="text-h6 text-primary">{{ store.tables.dataCenterTable.byId[org.id]?.tidbUnit }}</div>
                      </div>
                    </q-item-section>
                  </template>
                  <q-card>
                    <div v-if="tidbUnitsObj[org.id]?.length > 0">
                      <div v-for="monitor in tidbUnitsObj[org.id]" :key="monitor.id">
                        <div class="row justify-between items-center q-mt-md">
                          <div class="q-ml-sm">
                            <span class="text-subtitle1 text-weight-bold">{{ i18n.global.locale === 'zh' ? monitor.name : monitor.name_en }}</span>
                            <span class="q-ml-lg">集群版本：{{ monitor.version === '' ? '暂无' : monitor.version }}</span>
                          </div>
                          <div>
                            <q-icon class="q-mr-md cursor-pointer" name="refresh" size="1.7rem" v-show="renovateShow[monitor.id]" @click="refreshUint(monitor.id)"/>
                            <span class="text-primary q-mr-md cursor-pointer" @click="gtToDetail(monitor.grafana_url)">grafana</span>
                            <span class="text-primary q-mr-sm cursor-pointer" @click="gtToDetail(monitor.dashboard_url)">dashboard</span>
                          </div>
                        </div>
                        <tidb-cluster :unit-servers-data="propsUnitData[monitor.id]"></tidb-cluster>
                      </div>
                    </div>
                    <div v-else>
                      <div class="text-center text-h6 q-py-lg">
                        {{ tc('暂无监控单元') }}
                      </div>
                    </div>
                  </q-card>
                </q-expansion-item>
                <q-separator/>
              </div>
            </q-list>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.StoragePage {
}
</style>
