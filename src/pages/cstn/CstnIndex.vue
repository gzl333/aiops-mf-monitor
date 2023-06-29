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
  navigateToUrl(`/my/monitor/cstn/${name}`)
}
</script>

<template>
  <div class="WebGroupIndex">
    <div class="q-px-md">
      <div class="text-h6 q-pt-lg q-px-none">{{ tc('中国科技网') }}</div>
      <q-tabs
        v-model="activeItem"
        inline-label
        align="left"
        indicator-color="primary"
        active-color="primary"
      >
        <q-tab no-caps name="overall" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('全局')"
               icon="las la-sitemap" @click="changeTab('overall')">
        </q-tab>
        <q-tab no-caps name="export" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('出口')"
               icon="las la-sign-out-alt" @click="changeTab('export')">
        </q-tab>
      </q-tabs>
    </div>
    <q-separator/>
    <div class="q-mt-xs">
      <router-view :key="$route.fullPath"/>
    </div>
    <div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.WebGroupIndex {
}
</style>
