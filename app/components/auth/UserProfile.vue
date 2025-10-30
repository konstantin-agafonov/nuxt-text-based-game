<script setup lang="ts">
const { isAuthenticated, user, logout } = useSanctumAuth()
const isLoggingOut = ref(false)

const logoutHandle = async () => {
  isLoggingOut.value = true
  logout()
  isLoggingOut.value = false
}
</script>

<template>
  <div v-if="isAuthenticated" class="flex items-center gap-2">
    <span class="text-sm text-gray-600">
      Welcome, {{ user?.name || user?.email }}
    </span>
    <button
        @click="logoutHandle"
        :disabled="isLoggingOut"
        class="text-sm w-[80px] h-[25px] bg-red-200 cursor-pointer disabled:opacity-50"
    >
      {{ isLoggingOut ? '...' : 'Logout' }}
    </button>
  </div>
</template>


