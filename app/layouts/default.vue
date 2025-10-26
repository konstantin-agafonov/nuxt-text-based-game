<script setup lang="ts">

</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <Header/>

    <div class="flex flex-1 overflow-hidden">
      <Aside/>

      <main class="flex-1 bg-gray-50 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <slot/>
      </main>
    </div>

    <Footer/>
  </div>
  
  <NuxtNotifications position="bottom left" :speed="500" />
  <ModalsContainer />
</template>

<style scoped>

</style>
