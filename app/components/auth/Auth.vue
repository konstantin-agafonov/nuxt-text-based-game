<script setup lang="ts">
const { isAuthenticated } = useSanctumAuth()
</script>

<template>
  <div class="flex flex-inline flex-nowrap items-center">
    <UserProfile/>
    <template v-if="!isAuthenticated">
      <NuxtLink to="/login" class="text-green-500">LOGIN</NuxtLink>
      <NuxtLink to="/register" class="text-red-500">REGISTER</NuxtLink>
    </template>
  </div>
</template>
