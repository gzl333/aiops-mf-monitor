<script lang="ts" setup>
import { ref } from 'vue'
// import { useStore } from 'stores/store'
import { i18n } from 'boot/i18n'
import { QBtn, QInput, useDialogPluginComponent } from 'quasar'
import aiops from 'src/api/aiops'
import $bus from 'src/hooks/bus'
const props = defineProps({
  instance: {
    type: String,
    required: true,
    default: ''
  },
  type: {
    type: String,
    required: true
  },
  defaultWarn: {
    type: Number,
    required: true
  }
})
defineEmits([...useDialogPluginComponent.emits])
// const store = useStore()
const { tc } = i18n.global
// code starts...

const {
  dialogRef,
  onDialogHide,
  onDialogCancel,
  onDialogOK
} = useDialogPluginComponent()

const isLoading = ref(false)
const inputRef = ref<QInput>()

const onCancelClick = onDialogCancel
const warnLine = ref(props.defaultWarn === 0 ? '' : props.defaultWarn)
const onOKClick = async () => {
  if (props.type === 'cpu') {
    await aiops.mail.postMetricWarning({ body: { instance: props.instance, cpu_rate: warnLine.value } })
  } else if (props.type === 'mem') {
    await aiops.mail.postMetricWarning({ body: { instance: props.instance, memory_used: warnLine.value } })
  } else {
    await aiops.mail.postMetricWarning({ body: { instance: props.instance, disk_used: warnLine.value } })
  }
  $bus.emit('warn', true)
  onDialogOK()
}

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin dialog-primary" style="width: 450px">
      <q-card-section class="row items-center justify-center q-pb-md">
        <div class="text-primary">{{ tc('设置预警线') }}</div>
        <q-space/>
        <q-btn icon="close" flat dense size="sm" v-close-popup/>
      </q-card-section>
      <q-separator/>
      <q-card-section>
        <div class="row q-pb-lg  items-center">
          <div class="text-grey-7">
            {{ tc('预警线') }}
          </div>
          <div class="col-6 q-ml-md">
            <q-input ref="inputRef" v-model="warnLine" outlined dense suffix="%">
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-separator/>
      <q-card-actions align="between">
        <q-btn class="q-ma-sm" color="primary" :label="tc('取消')" no-caps unelevated @click="onCancelClick"/>
        <q-btn class="q-ma-sm" color="primary" :label="tc('修改')" no-caps unelevated :loading="isLoading"
               @click="onOKClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
</style>
