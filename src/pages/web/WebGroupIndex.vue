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
  navigateToUrl(`/my/monitor/web/${name}`)
}
</script>

<template>
  <div class="WebGroupIndex">

    <div class="column">
      <div class="row justify-center">
        <div class="content-fixed-width">
          <div class="text-h6 q-pt-lg q-px-none">{{ tc('网站群') }}</div>
          <div class="row">
            <div class="col">
              <q-tabs
                v-model="activeItem"
                inline-label
                align="left"
                indicator-color="primary"
                active-color="primary"
              >
                <q-tab no-caps name="overall" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('全局')"
                       icon="las la-user" @click="changeTab('overall')">
                </q-tab>
                <q-tab no-caps name="accessibility" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('可访问性')"
                       icon="las la-users" @click="changeTab('accessibility')">
                </q-tab>
                <q-tab no-caps name="tamper" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('防篡改')"
                       icon="las la-database" @click="changeTab('tamper')">
                </q-tab>
              </q-tabs>
            </div>
            <div class="col-1">
              <q-btn
                style="float: right;transform: translate(0, 65%);padding: 16px;border-radius: 28px;min-height: 56px;min-width: 56px;"
                no-caps no-wrap rounded color="primary" icon="add" @click="navigateToUrl('/my/monitor/web/create')">
                {{ tc('新建') }}
              </q-btn>
            </div>
          </div>
        </div>
      </div>
      <q-separator/>
      <div class="row justify-center q-pt-xl">
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
