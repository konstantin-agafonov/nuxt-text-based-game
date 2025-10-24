<script setup lang="ts">
// Redirect to games page after authentication
onMounted(() => {
  navigateTo('/games')
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Redirecting to games...</p>
    </div>
  </div>
</template>

<style scoped>

</style>