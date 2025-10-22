<script setup lang="ts">

</script>

<template>
  <Header/>

  <div class="grid grid-cols-2">
    <Aside/>

    <main>
      <slot/>
    </main>
  </div>

  <Footer/>
</template>

<style scoped>

</style>
