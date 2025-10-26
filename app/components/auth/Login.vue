<script setup lang="ts">
const emit = defineEmits(['login_successful'])

const authStore = useAuthStore()
const form = reactive({ email: '', password: '' })
const error = ref('')
const isSubmitting = ref(false)

const login = async () => {
  if (!form.email || !form.password) {
    error.value = 'Please fill in all fields'
    return
  }
  
  isSubmitting.value = true
  error.value = ''
  
  const result = await authStore.signIn(form)
  
  if (result.success) {
    // Reset form on success
    form.email = ''
    form.password = ''
    emit('login_successful')
    navigateTo('/games')
  } else {
    error.value = result.error || 'Login failed'
  }
  
  isSubmitting.value = false
}
</script>

<template>
  <div>
    <form
        class="flex flex-inline flex-nowrap items-center mt-[2px]"
        @submit.prevent="login"
    >
      <div class="h-[25px] border divide-gray-200">
        <input
            name="user-email"
            class="text-sm w-[140px] outline-none flex items-center"
            type="email"
            placeholder="your@email.com"
            v-model="form.email"
            :disabled="isSubmitting"
        >
      </div>

      <div class="h-[25px] border-r border-t border-b divide-gray-200">
        <input
            name="user-password"
            class="text-sm w-[140px] outline-none flex items-center"
            type="password"
            placeholder="password"
            v-model="form.password"
            :disabled="isSubmitting"
        >
      </div>

      <input
          class="text-sm w-[80px] h-[25px] bg-gray-200 cursor-pointer disabled:opacity-50"
          type="submit"
          :value="isSubmitting ? '...' : 'Login'"
          :disabled="isSubmitting"
      >
    </form>
    
    <div v-if="error" class="text-red-500 text-xs mt-1">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>

</style>