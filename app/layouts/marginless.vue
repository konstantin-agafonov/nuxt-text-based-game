<script setup lang="ts">

</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <Header/>

    <div class="flex flex-1 overflow-hidden">
      <Aside/>

      <main class="flex-1 bg-gray-50 overflow-y-auto relative overflow-x-hidden">
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
