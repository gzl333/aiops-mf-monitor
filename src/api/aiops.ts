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
    // 获取指标
    getMailMetricField (payload: {query: {
        category?: string,
        instance?: string,
        ordering?: string,
        page?: number,
        page_size?: number
      }}) {
      const config = {
        params: payload.query
      }
      return axiosAiops.get('v1/mail/machine/field/', config)
    },
    // 获取监控数据
    getMailMetric (payload: {query: {
        timestamp?: number,
        timestamp__lt?: number,
        timestamp__gt?: number,
        timestamp__gte?: number,
        timestamp__lte?: number
        instance?: string,
        field?: string,
        ordering?: string,
        page?: number,
        page_size?: number
      }}) {
      const config = {
        params: payload.query
      }
      return axiosAiops.get('v1/mail/metric/value/', config)
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
      return axiosAiops.get('v1/mail/machine/threshold/', config)
    },
    // 修改预警线
    postMetricWarning (payload: {body: {
        instance: string,
        cpu_rate?: number,
        memory_used?: number,
        disk_used?: number
      }}) {
      const data = payload.body
      return axiosAiops.post('v1/mail/machine/threshold/', data)
    },
    // 获取日志信息
    getMailLog (payload: {query: {
        timestamp?: number,
        timestamp__lt?: number,
        timestamp__gt?: number,
        timestamp__gte?: number
        timestamp__lte?: number,
        instance?: string,
        log_name?: string,
        log_source?: string
        ordering?: string,
        page?: number,
        page_size?: number
      }}) {
      const config = {
        params: payload?.query
      }
      return axiosAiops.get('v1/mail/log/', config)
    }
  },
  monitor: {
    getStatusOverview () {
      return axiosAiops.get('v1/monitor/status/overview/')
    }
  }
}
