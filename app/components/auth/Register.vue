<script setup lang="ts">

</script>

<template>
  <form class="flex flex-inline flex-nowrap items-center mt-[2px]">
    <div class="h-[25px] border divide-gray-200">
      <input
          name="user-email"
          class="text-sm w-[140px] outline-none flex items-center"
          type="email"
          placeholder="your@email.com"
      >
    </div>

    <input
        class="text-sm w-[80px] h-[25px] bg-gray-200 cursor-pointer"
        type="submit"
        value="Register"
    >
  </form>
</template>

<style scoped>

</style>