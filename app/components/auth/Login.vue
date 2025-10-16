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

    <div class="h-[25px] border-r border-t border-b divide-gray-200">
      <input
          name="user-password"
          class="text-sm w-[140px] outline-none flex items-center"
          type="password"
          placeholder="password"
      >
    </div>

    <input
        class="text-sm w-[80px] h-[25px] bg-gray-200 cursor-pointer"
        type="submit"
        value="Login"
    >
  </form>
</template>

<style scoped>

</style>