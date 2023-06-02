<script setup lang="ts">
import { ref/* , computed  */ } from 'vue'
// import { navigateToUrl } from 'single-spa'
// import { useStore } from 'stores/store'
// import { useRoute, useRouter } from 'vue-router'
// import { i18n } from 'boot/i18n'

import useCopyToClipboard from 'src/composables/useCopyToClipboard'

// const props = defineProps({
//   foo: {
//     type: String,
//     required: false,
//     default: ''
//   }
// })
// const emits = defineEmits(['change', 'delete'])

// const store = useStore()
// const route = useRoute()
// const router = useRouter()
// const tc = i18n.global.tc

const input = ref<string>('')
const copy = useCopyToClipboard()

</script>

<template>
  <div class="Service1Page">

    <div class="row">
      <div>
        当前输入值为:
      </div>
      <div>
        {{ input }}
      </div>
    </div>

    <div class="row">
      <q-input class="col-4"
               v-model="input"
               outlined/>
    </div>

    <q-btn class="row"
           color="primary"
           @click="copy(input)">
      复制输入内容
    </q-btn>

  </div>
</template>

<style lang="scss" scoped>
.Service1Page {
}
</style>
