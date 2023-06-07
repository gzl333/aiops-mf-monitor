import { defineStore } from 'pinia'

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
  actions: {}
})
