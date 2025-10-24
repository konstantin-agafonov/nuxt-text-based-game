<script setup lang="ts">

</script>

<template>
  <Header/>

  <div class="flex justify-stretch">
    <Aside/>

    <main class="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <slot/>
    </main>
  </div>

  <Footer/>
  <NuxtNotifications position="bottom left" :speed="500" />
</template>

<style scoped>

</style>
