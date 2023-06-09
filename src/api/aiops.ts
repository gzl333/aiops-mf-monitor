/* 标准api调用函数库,严格与后端接口一致 */
// aiops backend api

/* eslint-disable camelcase */

import { axiosAiops } from 'boot/axios'

export default {
  mail: {
    // 获取实例
    getMailMachine (payload: {query: {
        category?: string,
        instance?: string,
        ordering?: string,
        page?: number,
        page_size?: number
      }}) {
      const config = {
        params: payload.query
      }
      return axiosAiops.get('v1/mail/machine/', config)
    },
    // 获取监控数据
    getMailMetric (payload: {query: {
        timestamp?: number,
        timestamp__lt?: number,
        timestamp__gt?: number,
        timestamp__gte?: number,
        timestamp__lte?: number
        instance?: string,
        ordering?: string,
        page?: number,
        page_size?: number
      }}) {
      const config = {
        params: payload.query
      }
      return axiosAiops.get('v1/mail/metric/', config)
    },
    // 获取预警线
    getMetricWarning (payload: {query: {
        instance?: string,
        ordering?: string,
        page?: number,
        page_size?: number
      }}) {
      const config = {
        params: payload.query
      }
      return axiosAiops.get('v1/mail/metric/warning/', config)
    },
    // 修改预警线
    postMetricWarning (params: {body: {
        instance: string,
        cpu_rate?: number,
        memory_used?: number,
        disk_used?: number
      }}) {
      return axiosAiops({
        method: 'post',
        url: 'v1/mail/metric/warning/',
        data: params.body
      })
    }
  }
}
