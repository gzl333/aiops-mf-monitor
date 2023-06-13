import { defineStore } from 'pinia'
import { Dialog } from 'quasar'
import ModifyWarningLine from 'components/mail/ModifyWarningLine.vue'
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
export const useStore = defineStore('main', {
  state: () => ({
    items: {
      // 实时记录用户所在app局部路径位置
      // 例如'/my/server/personal/list' -> ['personal', 'list'], 供二级三级导航栏在刷新时保持选择使用
      currentPath: [] as string[]
    },
    tables: {}
  }),
  getters: {},
  actions: {
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
    }
  }
})
