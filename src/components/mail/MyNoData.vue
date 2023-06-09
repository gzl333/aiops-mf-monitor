<!-- 无数据展示 -->
<script setup lang="ts">

interface Props {
  width?: number
  tips?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 300
})
</script>

<template>
  <div class="MyNoData" :style="{width: `${props.width}px`, textAlign: 'center'}">
    <img class="logo" src="../../assets/no_data.png" />
    <p>{{ tips }}</p>
  </div>
</template>

<style lang="scss" scoped>
.MyNoData {
  position: relative;

  img {
    width: 100%;
  }
}
</style>
