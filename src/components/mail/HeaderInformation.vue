<!-- 无数据展示 -->
<script setup lang="ts">

const props = defineProps({
  type: {
    type: String,
    required: true,
    default: ''
  },
  dataInfo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="HeaderInformation">
    <q-card flat bordered class="my-card" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" v-if="props.type === 'host' || props.type === 'tomcat' || props.type === 'nginx' || props.type === 'mysql'">
      <div class="row">
        <q-card-section class="col-4 q-pb-xs">
          <div>
            <span>操作系统：</span>
            <span>{{ props.dataInfo ? props.dataInfo.sysname : '/' }}</span>
          </div>
          <div class="q-mt-xs">
            <span>系统内核：</span>
            <span>{{ props.dataInfo ? props.dataInfo.release : '/' }}</span>
          </div>
          <div class="q-mt-xs">
            <span>启动天数：</span>
            <span>{{ props.dataInfo ? (Number(props.dataInfo.boot_seconds) / 60 / 60 / 24).toFixed(0) : '/' }}天</span>
          </div>
          <div class="q-mt-xs">
            <span>健康值：</span>
            <span>/</span>
          </div>
          <div class="q-mt-xs">
            <span>告警数：</span>
            <span>/</span>
          </div>
        </q-card-section>
        <q-card-section class="col q-pb-xs">
          <div>
            <span>内存：</span>
            <span>{{ props.dataInfo ? (Number(props.dataInfo.memory_total) / 1024 / 1024 / 1024).toFixed(2) : '/' }}GB</span>
          </div>
          <div class="q-mt-xs">
            <span>CPU：</span>
            <span>{{ props.dataInfo ? props.dataInfo.cpu_core_count : '/' }}核</span>
          </div>
          <div class="q-mt-xs">
            <span>负载：</span>
            <span>{{ props.dataInfo ? props.dataInfo.node_load1 : '/' }}</span>
          </div>
          <div class="q-mt-xs">
            <span>CPU使用率：</span>
            <span>{{ props.dataInfo ? Number(props.dataInfo.cpu_rate).toFixed(2) : '/' }}%</span>
          </div>
          <div class="q-mt-xs">
            <span>内存使用率：</span>
            <span>{{ props.dataInfo ? ((Number(props.dataInfo.memory_total) - Number(props.dataInfo.memory_free)) / Number(props.dataInfo.memory_total) * 100).toFixed(2) : '/' }}%</span>
          </div>
        </q-card-section>
<!--        <q-card-section class="col">-->
<!--          <div class="q-mt-xs">-->
<!--            <span>IOutil使用率：</span>-->
<!--            <span>/</span>-->
<!--          </div>-->
<!--        </q-card-section>-->
        <q-card-section class="col q-pb-xs">
          <div>
            <span>连接数：</span>
            <span>{{ props.dataInfo ? props.dataInfo.socket_CurrEstab : '/' }}</span>
          </div>
          <div class="q-mt-xs">
            <span>tcp_tw：</span>
            <span>{{ props.dataInfo ? props.dataInfo.socket_TCP_tw : '/' }}</span>
          </div>
          <div class="q-mt-xs">
            <span>下载带宽：</span>
            <span>{{ props.dataInfo ? (Number(props.dataInfo.network_receive) / 1024 / 1024).toFixed(2) : '/' }}Mb/s</span>
          </div>
          <div class="q-mt-xs">
            <span>上传带宽：</span>
            <span>{{ props.dataInfo ? (Number(props.dataInfo.network_transmit) / 1024 / 1024).toFixed(2) : '/' }}MB/s</span>
          </div>
        </q-card-section>
      </div>
      <q-card-section class="q-pt-none col">
        <div>
          <span>磁盘读取：</span>
          <span v-for="(item, index) in props.dataInfo.disk_read_rate" :key="index" class="q-ml-sm">
            <span>{{ item.device }}</span>
            <span class="q-ml-xs">{{ (item.disk_read_rate / 1024 / 1024).toFixed(2) }}Mb/s</span>
          </span>
        </div>
        <div class="q-mt-xs">
          <span>磁盘写入：</span>
          <span v-for="(item, index) in props.dataInfo.disk_written_rate" :key="index" class="q-ml-sm">
            <span>{{ item.device }}</span>
            <span class="q-ml-xs">{{ (item.disk_written_rate / 1024 / 1024).toFixed(2) }}Mb/s</span>
          </span>
        </div>
        <div class="q-mt-xs">
          <span>分区使用率：</span>
          <span v-for="(item, index) in props.dataInfo.filesystem_size" :key="index" class="q-ml-sm">
          <span>{{ item.device }}</span>
          <span class="q-ml-xs">{{ (props.dataInfo.filesystem_avail[props.dataInfo.filesystem_avail.findIndex(item1 => item1.device === item.device)].filesystem_avail / item.filesystem_size * 100).toFixed(2) }}%</span>
        </span>
        </div>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="my-card row" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" v-if="props.type === 'switch' || props.type === 'firewall'">
      <q-card-section class="col-12">
        <div>
          <span>cpu使用率：</span>
          <span>{{ props.dataInfo.cpu_rate ? props.dataInfo.cpu_rate + '%' : '/' }}</span>
        </div>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="my-card row" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" v-if="props.type === 'f5'">
      <q-card-section class="col-4">
        <div>
          <span>cpu使用率：</span>
          <span>{{ props.dataInfo.cpu_rate }}%</span>
        </div>
        <div class="q-mt-xs">
          <span>客户端接收的字节数 （入站流量）：</span>
          <span>{{ Number(props.dataInfo.sysStatClientBytesIn).toFixed(2) }}</span>
        </div>
        <div class="q-mt-xs">
          <span>客户端发送的字节数 （出站流量）：</span>
          <span>{{ Number(props.dataInfo.sysStatClientBytesOut).toFixed(2) }}</span>
        </div>
        <div class="q-mt-xs">
          <span>服务器接收的字节数 （入站流量）：</span>
          <span>{{ Number(props.dataInfo.sysStatServerBytesIn).toFixed(2) }}</span>
        </div>
        <div class="q-mt-xs">
          <span>服务器发送的字节数 （出站流量）：</span>
          <span>{{ Number(props.dataInfo.sysStatServerBytesOut).toFixed(2) }}</span>
        </div>
        <div class="q-mt-xs">
          <span>F5设备上所有TCP连接的总数：</span>
          <span>{{ Number(props.dataInfo.sysTcpStatConnects).toFixed(2) }}</span>
        </div>
        <div class="q-mt-xs">
          <span>F5设备上所有服务器连接的总数：</span>
          <span>{{ Number(props.dataInfo.sysStatServerTotConns).toFixed(2) }}</span>
        </div>
      </q-card-section>
      <q-card-section class="col-4">
        <div class="q-mt-xs">
          <span>负载均衡_内存使用（TMM）：</span>
          <span>{{ (Number(props.dataInfo.memory_tmm) / 1024 / 1024 / 1024).toFixed(2) }}GB</span>
        </div>
        <div class="q-mt-xs">
          <span>当前正在进行的SSL会话数量：</span>
          <span>{{ Number(props.dataInfo.sysClientsslStatCurConns).toFixed(2) }}</span>
        </div>
        <div class="q-mt-xs">
          <span>F5设备上当前所有客户端连接的连接数：</span>
          <span>{{ Number(props.dataInfo.sysStatClientCurConns).toFixed(2) }}</span>
        </div>
        <div class="q-mt-xs">
          <span>F5设备上所有客户端连接的总数：</span>
          <span>{{ Number(props.dataInfo.sysStatClientTotConns).toFixed(2) }}</span>
        </div>
        <div class="q-mt-xs">
          <span>F5设备上当前所有服务器SSL会话的连接数：</span>
          <span>{{ Number(props.dataInfo.sysServersslStatCurConns).toFixed(2) }}</span>
        </div>
      </q-card-section>
      <q-card-section class="col-4">
        <div class="q-mt-xs">
          <span>负载均衡_内存使用（主机）：</span>
          <span>{{ (Number(props.dataInfo.memory_host) / 1024 / 1024 / 1024).toFixed(2) }}GB</span>
        </div>
        <div class="q-mt-xs">
          <span>设备启动以来所有建立的SSL会话的数量：</span>
          <span>{{ Number(props.dataInfo.sysClientsslStatTotNativeConns).toFixed(2) }}</span>
        </div>
        <div class="q-mt-xs">
          <span>F5设备上所有PVA客户端连接的总数（单点登录）：</span>
          <span>{{ Number(props.dataInfo.sysStatPvaClientTotConns).toFixed(2) }}</span>
        </div>
        <div class="q-mt-xs">
          <span>F5设备上所有PVA服务器连接的总数 ：</span>
          <span>{{ Number(props.dataInfo.sysStatPvaServerTotConns).toFixed(2) }}</span>
        </div>
        <div>
          <span>F5设备上当前所有服务器连接的连接数：</span>
          <span>{{ Number(props.dataInfo.sysStatServerCurConns).toFixed(2) }}</span>
        </div>
      </q-card-section>
    </q-card>
    <q-card flat bordered class="my-card row" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'" v-if="props.type === 'vpn'">
      <q-card-section class="col-4">
        <div>
          <span>cpu使用率：</span>
          <span>{{ props.dataInfo.cpu_rate ? props.dataInfo.cpu_rate + '%' : '/'}}</span>
        </div>
        <div class="q-mt-xs">
          <span>vpn指标：</span>
          <span>{{ props.dataInfo.user_in ? props.dataInfo.user_in : '/' }}</span>
        </div>
<!--        <div class="q-mt-xs">-->
<!--          <span>入包数：</span>-->
<!--          <span>{{ props.dataInfo.packet_in ? props.dataInfo.packet_in + 'Bytes/s' : '/' }}</span>-->
<!--        </div>-->
<!--        <div class="q-mt-xs">-->
<!--          <span>出包数：</span>-->
<!--          <span>{{ props.dataInfo.packet_out ? props.dataInfo.packet_out + 'Bytes/s' : '/' }}</span>-->
<!--        </div>-->
<!--        <div class="q-mt-xs">-->
<!--          <span>入流量：</span>-->
<!--          <span>{{ props.dataInfo.flow_in ? props.dataInfo.flow_in + 'Bytes/s' : '/' }}</span>-->
<!--        </div>-->
<!--        <div class="q-mt-xs">-->
<!--          <span>出流量：</span>-->
<!--          <span>{{ props.dataInfo.flow_out ? props.dataInfo.flow_out + 'Bytes/s' : '/' }}</span>-->
<!--        </div>-->
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.HeaderInformation {
}
</style>
