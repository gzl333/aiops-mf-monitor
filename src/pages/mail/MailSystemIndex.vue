<script setup lang="ts">
import { ref } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'

// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

const store = useStore()
// const route = useRoute()
// const router = useRouter()
const tc = i18n.global.tc

const activeItem = ref(store.items.currentPath[1])
const changeTab = (name: string) => {
  activeItem.value = name
  navigateToUrl(`/my/monitor/mail/${name}`)
}
</script>

<template>
  <div class="WebGroupIndex">

    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6 q-pt-lg q-px-none">{{ tc('邮件系统') }}</div>
          <q-tabs
            v-model="activeItem"
            inline-label
            align="left"
            indicator-color="primary"
            active-color="primary"
          >
            <q-tab no-caps name="system" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('信息监控')"
                   icon="las la-align-justify" @click="changeTab('system')">
            </q-tab>
          </q-tabs>
        </div>
      </div>
      <q-separator/>
      <div class="row justify-center">
        <router-view class="content-fixed-width" :key="$route.fullPath"/>
      </div>
    </div>
    <div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.WebGroupIndex {
}
</style>
