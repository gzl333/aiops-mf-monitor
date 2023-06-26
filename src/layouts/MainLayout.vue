<script setup lang="ts">
import { computed } from 'vue'
import { navigateToUrl } from 'single-spa'
import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'

import { logs } from 'src/configs/logs'

// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

const store = useStore()
void store.loadAllTables()
console.log(store.tables)
// const router = useRouter()
// const route = useRoute()
const tc = i18n.global.tc

const activeItem = computed(() => store.items.currentPath[0])

const appPath = process.env.appPath as string
const releaseTime = process.env.releaseTime as string
const appVersion = logs[0].version
</script>

<template>
  <q-layout view="hHh LpR fFf">

    <q-drawer :model-value="true" style="padding-top: 60px;" :breakpoint="0" side="left" width="120" bordered>

      <div class="column full-height bg-grey-2">
        <q-scroll-area class="col non-selectable" visible>

          <q-list>

            <q-item>
              <q-item-section class="column items-center q-py-sm text-center text-weight-bold text-grey-8">
                {{ tc('监控') }}
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'cstn'"
              @click="navigateToUrl(appPath + '/cstn')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <img src="../../src/assets/cst_blue.png" alt="" v-if="activeItem === 'cstn'">
                <img src="../../src/assets/cst.png" alt="" v-else>
                <div class="active-text text-center">{{ tc('中国科技网') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'meeting'"
              @click="navigateToUrl(appPath + '/meeting')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-video" size="lg"/>
                <div class="active-text text-center">{{ tc('视频会议') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'web'"
              @click="navigateToUrl(appPath + '/web')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-poll-h" size="lg"/>
                <div class="active-text text-center">{{ tc('网站群') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'server'"
              @click="activeItem = 'server'; navigateToUrl(appPath + '/server')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-server" size="lg"/>
                <div class="active-text text-center">{{ tc('服务器') }}</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'ceph'"
              @click="activeItem = 'ceph'; navigateToUrl(appPath + '/ceph')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-digital-tachograph" size="lg"/>
                <div class="active-text text-center">Ceph</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'tidb'"
              @click="activeItem = 'tidb'; navigateToUrl(appPath + '/tidb')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-database" size="lg"/>
                <div class="active-text text-center">TiDB</div>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :active="activeItem === 'mail'"
              @click="navigateToUrl(appPath + '/mail')"
              active-class="active-item"
            >
              <q-item-section class="column items-center">
                <q-icon name="las la-mail-bulk" size="lg"/>
                <div class="active-text text-center">{{ tc('邮件系统') }}</div>
              </q-item-section>
            </q-item>

          </q-list>

          <div class="row justify-center q-pt-lg">
            <q-icon class="text-center cursor-pointer"
                    name="info"
                    size="xs"
                    :color="activeItem === 'about' ? 'primary' : 'grey-4'"
                    @click="navigateToUrl(appPath + '/about')">
              <q-tooltip class="bg-grey-3">
                <div class="text-grey text-caption text-center">{{ tc('appVersion') }}</div>
                <div class="text-grey text-caption text-center">
                  {{ appVersion }}
                </div>

                <div class="text-grey text-caption text-center">{{ tc('releaseTime') }}</div>
                <div class="text-grey text-caption text-center">
                  {{ new Date(releaseTime).toLocaleString(i18n.global.locale as string) }}
                </div>
              </q-tooltip>
            </q-icon>
          </div>

        </q-scroll-area>
      </div>
    </q-drawer>

    <q-page-container>
      <q-scroll-area style="height: calc(100vh - 70px)">
        <router-view/>
      </q-scroll-area>
    </q-page-container>

  </q-layout>
</template>

<style lang="scss" scoped>
.active-item {
  background-color: #DBF0FC; // $grey-4;

  .active-text {
    color: $primary;
  }
}
</style>
