/* 标准api调用函数库,严格与后端接口一致 */
// service backend api

/* eslint-disable camelcase */

import { axiosService } from 'boot/axios'

export default {
  monitor: {
    getMonitorVideoQuery (payload: { query: { query: string } }) {
      const config = {
        params: payload.query
      }
      return axiosService.get('/monitor/video-meeting/query', config)
    },
    getMonitorWebsite (payload?: { query: { page: number; page_size: number } }) {
      const config = {
        params: payload?.query
      }
      return axiosService.get('/monitor/website', config)
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
    },
    getMonitorWebsiteQuery (payload: { query: { query: string, detection_point_id: string }, path: { id: string } }) {
      const config = {
        params: payload.query
      }
      return axiosService.get('/monitor/website/' + payload.path.id + '/query', config)
    },
    getMonitorWebsiteQueryRange (payload: { query: { query: string, start: number, end?: number, step?: number, detection_point_id: string }, path: { id: string } }) {
      const config = {
        params: payload.query
      }
      return axiosService.get('/monitor/website/' + payload.path.id + '/query/range', config)
    }
  }
}
