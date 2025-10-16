<script setup lang="ts">

</script>

<template>
  <header class="flex justify-between border-b border-black">
    <div  class="text-base font-light uppercase">
      Text-based adventure games engine
    </div>

    <Auth/>
  </header>

  <aside class="border-r w-250">
    aside
  </aside>

  <main>
    <slot/>
  </main>

  <footer>

  </footer>
</template>

<style scoped>

</style>