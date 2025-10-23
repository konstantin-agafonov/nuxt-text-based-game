<script setup lang="ts">
const authStore = useAuthStore()
const isLoggingOut = ref(false)

const logout = async () => {
  isLoggingOut.value = true
  await authStore.signOut()
  isLoggingOut.value = false
}
</script>

<template>
  <div v-if="authStore.isAuthenticated" class="flex items-center gap-2">
    <span class="text-sm text-gray-600">
      Welcome, {{ authStore.user?.name || authStore.user?.email }}
    </span>
    <button
        @click="logout"
        :disabled="isLoggingOut"
        class="text-sm w-[80px] h-[25px] bg-red-200 cursor-pointer disabled:opacity-50"
    >
      {{ isLoggingOut ? '...' : 'Logout' }}
    </button>
  </div>
</template>

