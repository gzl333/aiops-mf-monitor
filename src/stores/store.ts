import { defineStore } from 'pinia'
import { Dialog, Notify } from 'quasar'
import { normalize, schema } from 'normalizr'
import service from 'src/api/service'
import { i18n } from 'boot/i18n'
import ModifyWarningLine from 'components/mail/ModifyWarningLine.vue'
import WebTaskReviseDialog from 'components/web/WebTaskReviseDialog.vue'
import WebTaskDeleteDialog from 'components/web/WebTaskDeleteDialog.vue'
const { tc } = i18n.global

export interface DataCenterInterface {
  // 来自registry接口
  abbreviation: string
  creation_time: string
  desc: string
  endpoint_compute: never // null 待细化
  endpoint_monitor: never // null 待细化
  endpoint_object: never // null 待细化
  endpoint_vms: string
  id: string
  longitude: number
  latitude: number
  name: string
  name_en: string
  sort_weight: number
  status: {
    code: number
    message: string
  },
  // 来自service接口
  services: string[] // 全部services汇总
  // personalServices: string[] // 用户可用services汇总
  serverUnit: number
  cephUnit: number
  tidbUnit: number
}
export interface StatusArrayInterface {
  metric: {
    ipv4s: string[]
    latitude: number
    longitude: number
    name: string
  }
  value: [number, string]
}
export interface MeetingStatusInterface {
  monitor: {
    job_tag: string
    name: string
    name_en: string
  }
  value: StatusArrayInterface[]
}

export interface StartPointInterface {
  name: string
}

export interface EndPointInterface {
  ipv4: string[]
  latitude: number
  longitude: number
  name: string
  ping: string
  status: string
  value: number
}

export interface UnitInterface {
  alias: string
  category: string
  instance: string
  kernel: string
  log_name: string
  log_source: string
  os: string
}

export interface UnitMetricInterface {
  boot_days: string
  boot_seconds: string
  cpu_core_count: string
  cpu_iowait_rate: string
  cpu_rate: string
  cpu_system_rate: string
  cpu_user_rate: string
  disk_read: string
  disk_written: string
  domain_name: string
  f5_memory_used_host: string | null
  f5_memory_used_ttm: string | null
  f5_sysClientsslStatCurConns: string | null
  f5_sysClientsslStatTotNativeConns: string | null
  f5_sysServersslStatCurConns: string | null
  f5_sysStatClientBytesIn: string | null
  f5_sysStatClientBytesOut: string | null
  f5_sysStatClientCurConns: string | null
  f5_sysStatClientTotConns: string | null
  f5_sysStatPvaClientTotConns: string | null
  f5_sysStatPvaServerTotConns: string | null
  f5_sysStatServerBytesIn: string | null
  f5_sysStatServerBytesOut: string | null
  f5_sysStatServerCurConns: string | null
  f5_sysStatServerTotConns: string | null
  f5_sysTcpStatAccepts: string | null
  f5_sysTcpStatConnects: string | null
  filesystem_avail: string
  filesystem_free: string
  filesystem_size: string
  filesystem_used_rate: string
  instance: string
  job: string
  machine: string
  memory_available: string | null
  memory_free: string
  memory_total: string
  memory_used: string
  mysql_master_slave_delay: string | null
  mysql_qps: string | null
  mysql_tps: string | null
  netflow_receive: string
  netflow_transmit: string
  network_receive: string
  network_transmit: string
  node_load1: string
  node_load5: string
  node_load15: string
  node_name: string
  release: string
  service: string
  socket_CurrEstab: string
  socket_Sockets_used: string
  socket_TCP_alloc: string
  socket_TCP_tw: string
  socket_Tcp_InSegs: string
  socket_Tcp_OutSegs: string
  socket_Tcp_RetransSegs: string
  socket_UDP_inuse: string
  sys_name: string
  timestamp: number
  version: string
}
export interface WebMonitorInterface {
  creation: string
  hostname: string
  id: string
  is_attention: boolean
  is_tamper_resistant: boolean
  modification: string
  name: string
  remark: string
  scheme: string
  uri: string
  url: string
  url_hash: string
  user: {
    id: string
    username: string
  }
}
export interface DetectionPointInterface {
  creation: string
  enable: boolean
  id: string
  modification: string
  name: string
  name_en: string
  remark: string
}

export interface ServiceUnitInterface {
  creation: string
  dashboard_url: string
  grafana_url: string
  id: string
  job_tag: string
  name: string
  name_en: string
  organization: {
    abbreviation: string
    creation: string
    id: string
    name: string
    name_en: string
    sort_weight: number
  }
  remark: string
  sort_weight: number
  version: string
}
export const useStore = defineStore('main', {
  state: () => ({
    items: {
      // 实时记录用户所在app局部路径位置
      // 例如'/my/server/personal/list' -> ['personal', 'list'], 供二级三级导航栏在刷新时保持选择使用
      currentPath: [] as string[]
    },
    tables: {
      dataCenterTable: {
        byId: {} as Record<string, DataCenterInterface>,
        allIds: [],
        isLoaded: false
      },
      detectionPointTable: {
        byId: {} as Record<string, DetectionPointInterface>,
        allIds: [],
        isLoaded: false
      },
      webMonitorTable: {
        byId: {} as Record<string, WebMonitorInterface>,
        allIds: [] as string[],
        isLoaded: false
      }
    }
  }),
  getters: {
    getAllMonitoringOrganization: state => (type: string): DataCenterInterface[] => {
      const allOrganizations: DataCenterInterface[] = []
      let sort = 0
      if (type === 'server') {
        state.tables.dataCenterTable.allIds.forEach(id => {
          if (state.tables.dataCenterTable.byId[id].serverUnit > 0) {
            const organization = state.tables.dataCenterTable.byId[id]
            if (state.tables.dataCenterTable.byId[id].sort_weight >= sort) {
              allOrganizations.push(organization)
              sort = state.tables.dataCenterTable.byId[id].sort_weight
            } else {
              allOrganizations.unshift(organization)
              sort = state.tables.dataCenterTable.byId[id].sort_weight
            }
          }
        })
      } else if (type === 'ceph') {
        state.tables.dataCenterTable.allIds.forEach(id => {
          if (state.tables.dataCenterTable.byId[id].cephUnit > 0) {
            const organization = state.tables.dataCenterTable.byId[id]
            if (state.tables.dataCenterTable.byId[id].sort_weight >= sort) {
              allOrganizations.push(organization)
              sort = state.tables.dataCenterTable.byId[id].sort_weight
            } else {
              allOrganizations.unshift(organization)
              sort = state.tables.dataCenterTable.byId[id].sort_weight
            }
          }
        })
      } else {
        state.tables.dataCenterTable.allIds.forEach(id => {
          if (state.tables.dataCenterTable.byId[id].tidbUnit > 0) {
            const organization = state.tables.dataCenterTable.byId[id]
            if (state.tables.dataCenterTable.byId[id].sort_weight >= sort) {
              allOrganizations.push(organization)
              sort = state.tables.dataCenterTable.byId[id].sort_weight
            } else {
              allOrganizations.unshift(organization)
              sort = state.tables.dataCenterTable.byId[id].sort_weight
            }
          }
        })
      }
      return allOrganizations
    },
    getDetectionPointTable: state => (): {value: string, label: string, labelEn: string}[] => {
      const pointOptions = []
      for (const service of Object.values(state.tables.detectionPointTable.byId)) {
        pointOptions.unshift(
          {
            value: service.id,
            label: service.name,
            labelEn: service.name_en
          }
        )
      }
      return pointOptions
    },
    getWebMonitorTaskTable: state => (): WebMonitorInterface[] => {
      const sortFn = (a: WebMonitorInterface, b: WebMonitorInterface) => new Date(b.creation).getTime() - new Date(a.creation).getTime()
      const newArr: WebMonitorInterface[] = []
      Object.values(state.tables.webMonitorTable.byId).forEach((item) => {
        newArr.unshift(item)
      })
      newArr.sort(sortFn)
      return newArr
    }
  },
  actions: {
    loadAllTables () {
      if (!this.tables.dataCenterTable.isLoaded) {
        void this.loadDataCenterTable().then(() => {
          void this.loadUnitDataCenter()
        })
      }
      if (!this.tables.detectionPointTable.isLoaded) {
        void this.loadDetectionPointTable()
      }
      if (!this.tables.webMonitorTable.isLoaded) {
        void this.loadWebMonitorTable()
      }
    },
    async loadDataCenterTable () {
      this.tables.dataCenterTable = {
        byId: {},
        allIds: [],
        isLoaded: false
      }
      const respDataCenter = await service.registry.getRegistry()
      const dataCenter = new schema.Entity('dataCenter', {})
      respDataCenter.data.registries.forEach((data: Record<string, never>) => {
        const normalizedData = normalize(data, dataCenter)
        Object.values(normalizedData.entities.dataCenter!)[0].services = []
        Object.values(normalizedData.entities.dataCenter!)[0].personalServices = []
        Object.assign(this.tables.dataCenterTable.byId, normalizedData.entities.dataCenter)
        // @ts-ignore
        this.tables.dataCenterTable.allIds.unshift(Object.keys(normalizedData.entities.dataCenter)[0])
        this.tables.dataCenterTable.allIds = [...new Set(this.tables.dataCenterTable.allIds)]
      })
      this.tables.dataCenterTable.isLoaded = true
    },
    loadUnitDataCenter () {
      for (const id of this.tables.dataCenterTable.allIds) {
        service.monitor.getMonitorUnitServer({
          query: {
            page: 1,
            page_size: 10,
            organization_id: id
          }
        }).then((res) => {
          if (res.data.results.length > 0) {
            this.tables.dataCenterTable.byId[id].serverUnit = res.data.count
          } else {
            this.tables.dataCenterTable.byId[id].serverUnit = 0
          }
        })
        service.monitor.getMonitorUnitCeph({
          query: {
            page: 1,
            page_size: 10,
            organization_id: id
          }
        }).then((res) => {
          if (res.data.results.length > 0) {
            this.tables.dataCenterTable.byId[id].cephUnit = res.data.count
          } else {
            this.tables.dataCenterTable.byId[id].cephUnit = 0
          }
        })
        service.monitor.getMonitorUnitTidb({
          query: {
            page: 1,
            page_size: 10,
            organization_id: id
          }
        }).then((res) => {
          if (res.data.results.length > 0) {
            this.tables.dataCenterTable.byId[id].tidbUnit = res.data.count
          } else {
            this.tables.dataCenterTable.byId[id].tidbUnit = 0
          }
        })
      }
    },
    async loadDetectionPointTable () {
      this.tables.detectionPointTable = {
        byId: {},
        allIds: [],
        isLoaded: false
      }
      const respDetectionPoint = await service.monitor.geiMonitorWebsiteDetectionPoint()
      const point = new schema.Entity('point', {})
      respDetectionPoint.data.results.forEach((data: Record<string, never>) => {
        const normalizedData = normalize(data, point)
        Object.assign(this.tables.detectionPointTable.byId, normalizedData.entities.point)
        // @ts-ignore
        this.tables.detectionPointTable.allIds.unshift(Object.keys(normalizedData.entities.point)[0])
        this.tables.detectionPointTable.allIds = [...new Set(this.tables.detectionPointTable.allIds)]
      })
      this.tables.detectionPointTable.isLoaded = true
    },
    async loadWebMonitorTable () {
      this.tables.webMonitorTable = {
        byId: {},
        allIds: [],
        isLoaded: false
      }
      const webMonitorRes = await service.monitor.getMonitorWebsite({ query: { page: 1, page_size: 100 } })
      const web = new schema.Entity('web', {})
      webMonitorRes.data.results.forEach((data: Record<string, never>) => {
        const normalizedData = normalize(data, web)
        Object.assign(this.tables.webMonitorTable.byId, normalizedData.entities.web)
        // @ts-ignore
        this.tables.webMonitorTable.allIds.unshift(Object.keys(normalizedData.entities.web)[0])
        this.tables.webMonitorTable.allIds = [...new Set(this.tables.webMonitorTable.allIds)]
      })
      this.tables.webMonitorTable.isLoaded = true
    },
    async modifyMonitorTask (payload: { id: string; data: { name: string; scheme: string; hostname: string; uri: string; is_tamper_resistant?: boolean; remark?: string } }) {
      service.monitor.putMonitorWebsite({ body: payload.data, path: { id: payload.id } }).then((res) => {
        if (res.status === 200) {
          this.tables.webMonitorTable.byId[payload.id].name = res.data.name
          this.tables.webMonitorTable.byId[payload.id].scheme = res.data.scheme
          this.tables.webMonitorTable.byId[payload.id].hostname = res.data.hostname
          this.tables.webMonitorTable.byId[payload.id].uri = res.data.uri
          this.tables.webMonitorTable.byId[payload.id].is_tamper_resistant = res.data.is_tamper_resistant
          this.tables.webMonitorTable.byId[payload.id].remark = res.data.remark
          Notify.create({
            classes: 'notification-positive shadow-15',
            icon: 'check_circle',
            textColor: 'positive',
            message: `${tc('修改监控任务成功')}`,
            position: 'bottom',
            closeBtn: true,
            timeout: 5000,
            multiLine: false
          })
        }
      }).catch((error) => {
        Notify.create({
          classes: 'notification-negative shadow-15',
          icon: 'las la-times-circle',
          textColor: 'negative',
          message: `${tc('修改失败')}，${error.response.data.message}`,
          position: 'bottom',
          closeBtn: true,
          timeout: 5000,
          multiLine: false
        })
      })
    },
    // 触发新建访问密匙对话框
    triggerModifyWarningLine (instance: string, type: string, defaultWarn: number) {
      Dialog.create({
        component: ModifyWarningLine,
        componentProps: {
          instance,
          type,
          defaultWarn
        }
      })
    },
    triggerReviseTaskDialog (id: string) {
      Dialog.create({
        component: WebTaskReviseDialog,
        componentProps: {
          id
        }
      })
    },
    triggerDeleteTaskDialog (taskId: string) {
      Dialog.create({
        component: WebTaskDeleteDialog,
        componentProps: {
          taskId
        }
      })
    }
  }
})
