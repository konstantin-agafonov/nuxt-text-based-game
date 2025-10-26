<script setup lang="ts">
  const {
    clickHandle,
    label
  } = defineProps([
    'clickHandle',
    'label'
  ])
</script>

<template>
  <button
      @click="clickHandle"
      class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
  >
    <Icon name="heroicons:arrow-left" class="h-4 w-4 mr-1" />
    {{ label ?? 'Back' }}
  </button>
</template>

<style scoped>

</style>