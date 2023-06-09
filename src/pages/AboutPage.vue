<script setup lang="ts">
// import { ref, computed, PropType } from "vue"
// import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'

import { logs } from 'src/configs/logs'

// const props = defineProps({
//   foo: {
//     type: String as PropType<'bar'>,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

// const { tc } = i18n.global
// const store = useStore()
// const route = useRoute()
// const router = useRouter()

</script>

<template>
  <div class="AboutPage bg-grey-2 column items-center" style="min-height: calc(100vh - 50px);">

    <q-card flat bordered class="content-fixed-width q-mt-lg">
      <q-card-section>
        <div class="text-h6">关于AIOps-Monitor</div>
        <div>AIOps监控应用</div>
      </q-card-section>

      <!--      <q-separator inset/>-->

      <q-card-section>
        <div class="text-h6">研发团队</div>
        <div>中国科学院计算机网络信息中心，科技云部。</div>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">当前版本</div>

        <div v-for="log in [logs[0]]" :key="log.version" class="">

          <div class="row items-center q-gutter-md q-pb-sm">
            <q-badge rounded color="grey-8"/>
            <div class="col-auto">{{ log.version }}</div>
            <div class="col-auto">发布时间:{{ log.date + ' ' + log.time }}</div>
            <div class="col-auto">发布人:{{ log.release_author }}</div>
          </div>

          <div v-for="update in log.updates" :key="update.info" class="row items-center q-gutter-md q-pl-lg">
            <div class="col-auto">*</div>
            <div class="col-auto text-grey-8">{{ update.info }}</div>
            <div class="col-auto text-grey-8">提交人: {{ update.commit_author }}</div>
          </div>

        </div>

      </q-card-section>

      <q-card-section>
        <div class="text-h6">历史版本</div>

        <div v-for="log in logs.slice(1)" :key="log.version" class="q-pb-xl">

          <div class="row items-center q-gutter-md q-pb-sm">
            <q-badge rounded color="grey-8"/>
            <div class="col-auto">{{ log.version }}</div>
            <div class="col-auto">发布时间:{{ log.date + ' ' + log.time }}</div>
            <div class="col-auto">发布人:{{ log.release_author }}</div>
          </div>

          <div v-for="update in log.updates" :key="update.info" class="row items-center q-gutter-md q-pl-lg">
            <div class="col-auto">*</div>
            <div class="col-auto text-grey-8">{{ update.info }}</div>
            <div class="col-auto text-grey-8">提交人: {{ update.commit_author }}</div>
          </div>

        </div>

      </q-card-section>

    </q-card>

  </div>
</template>

<style lang="scss" scoped>
.AboutPage {
  white-space: pre-wrap;
}
</style>
