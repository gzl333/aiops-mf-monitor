<script lang="ts" setup>
import { ref } from 'vue'
import { useStore } from 'stores/store'
// import { useRoute/* , useRouter */ } from 'vue-router'
import { Notify, useDialogPluginComponent } from 'quasar'
import { i18n } from 'boot/i18n'
import service from 'src/api/service'

const props = defineProps({
  taskId: {
    type: String,
    required: true
  }
})

defineEmits([...useDialogPluginComponent.emits])
const store = useStore()
// const route = useRoute()
const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel
} = useDialogPluginComponent()
const { tc } = i18n.global
const isDisable = ref(false)
const onOKClick = () => {
  service.monitor.deleteMonitorWebsite({ path: { id: props.taskId } }).then(() => {
    store.tables.webMonitorTable.allIds = store.tables.webMonitorTable.allIds.filter(id => id !== props.taskId)
    Reflect.deleteProperty(store.tables.webMonitorTable.byId, props.taskId)
    onDialogOK()
    Notify.create({
      classes: 'notification-positive shadow-15',
      icon: 'check_circle',
      textColor: 'positive',
      message: `${tc('删除成功')}`,
      position: 'bottom',
      closeBtn: true,
      timeout: 5000,
      multiLine: false
    })
  }).catch(() => {
    Notify.create({
      classes: 'notification-negative shadow-15',
      icon: 'check_circle',
      textColor: 'negative',
      message: tc('删除失败'),
      position: 'bottom',
      closeBtn: true,
      timeout: 5000,
      multiLine: false
    })
  })
}
const onCancelClick = onDialogCancel

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin dialog-primary q-pt-xl">
      <div class="text-center"><h5>{{ tc('确认要删除该任务吗') }}？</h5></div>
      <div class="text-center q-mt-xl"><h6>{{ tc('此操作是不可逆的') }}！</h6></div>
      <q-card-actions align="center" class="q-mt-xl">
        <q-btn class="q-ma-sm" color="primary" :label="tc('确认')" no-caps unelevated @click="onOKClick"
               :disable="isDisable"/>
        <q-btn class="q-ma-sm" color="primary" :label="tc('取消')" no-caps unelevated @click="onCancelClick"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
</style>
