/* 标准api调用函数库,严格与后端接口一致 */
// service backend api

/* eslint-disable camelcase */

import { axiosService } from 'boot/axios'

export default {
  registry: {
    getRegistry () {
      return axiosService.get('/registry')
    }
  },
  monitor: {
    getMonitorServerQuery (payload: { query: { monitor_unit_id: string; query: string } }) {
      const config = {
        params: payload.query
      }
      return axiosService.get('/monitor/server/query', config)
    },
    getMonitorUnitServer (payload?: { query: { page: number; page_size: number, organization_id: string } }) {
      const config = {
        params: payload?.query
      }
      return axiosService.get('/monitor/unit/server', config)
    },
    getMonitorUnitCeph (payload?: { query: { page: number; page_size: number, organization_id: string } }) {
      const config = {
        params: payload?.query
      }
      return axiosService.get('/monitor/unit/ceph', config)
    },
    getMonitorUnitTidb (payload?: { query: { page: number, page_size: number, organization_id: string }}) {
      const config = {
        params: payload?.query
      }
      return axiosService.get('/monitor/unit/tidb', config)
    },
    getMonitorTidbQuery (payload: { query: { monitor_unit_id: string; query: string } }) {
      const config = {
        params: payload.query
      }
      return axiosService.get('/monitor/tidb/query', config)
    },
    getMonitorCephQuery (payload: { query: { monitor_unit_id: string; query: string } }) {
      const config = {
        params: payload.query
      }
      return axiosService.get('/monitor/ceph/query', config)
    },
    getMonitorVideoQuery (payload: { query: { query: string } }) {
      const config = {
        params: payload.query
      }
      return axiosService.get('/monitor/video-meeting/query', config)
    },
    postMonitorWebsite (payload: { body: { name: string; scheme: string; hostname: string; uri: string; is_tamper_resistant?: boolean; remark?: string } }) {
      const data = payload.body
      return axiosService.post('/monitor/website', data)
    },
    putMonitorWebsite (payload: { body: { name: string; scheme: string; hostname: string; uri: string; is_tamper_resistant?: boolean; remark?: string }, path: { id: string } }) {
      const data = payload.body
      return axiosService.put('/monitor/website/' + payload.path.id, data)
    },
    deleteMonitorWebsite (payload: { path: { id: string } }) {
      return axiosService.delete('/monitor/website/' + payload.path.id)
    },
    geiMonitorWebsiteDetectionPoint (payload?: { query: { page: number, page_size: number, enable: boolean } }) {
      const config = {
        params: payload?.query
      }
      return axiosService.get('/monitor/website/detection-point', config)
    }
  }
}
