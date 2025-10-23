<script setup lang="ts">
const emit = defineEmits(['register_successful'])

const authStore = useAuthStore()
const form = reactive({ 
  name: '', 
  email: '', 
  password: '', 
  password_confirmation: '' 
})
const error = ref('')
const isSubmitting = ref(false)

const register = async () => {
  if (!form.name || !form.email || !form.password || !form.password_confirmation) {
    error.value = 'Please fill in all fields'
    return
  }
  
  if (form.password !== form.password_confirmation) {
    error.value = 'Passwords do not match'
    return
  }
  
  isSubmitting.value = true
  error.value = ''
  
  const result = await authStore.signUp(form)
  
  if (result.success) {
    // Reset form on success
    form.name = ''
    form.email = ''
    form.password = ''
    form.password_confirmation = ''
    emit('register_successful')
  } else {
    error.value = result.error || 'Registration failed'
  }
  
  isSubmitting.value = false
}
</script>

<template>
  <div>
    <form 
        class="flex flex-inline flex-nowrap items-center mt-[2px]"
        @submit.prevent="register"
    >
      <div class="h-[25px] border divide-gray-200">
        <input
            name="user-name"
            class="text-sm w-[120px] outline-none flex items-center"
            type="text"
            placeholder="Name"
            v-model="form.name"
            :disabled="isSubmitting"
        >
      </div>

      <div class="h-[25px] border-r border-t border-b divide-gray-200">
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
            class="text-sm w-[120px] outline-none flex items-center"
            type="password"
            placeholder="password"
            v-model="form.password"
            :disabled="isSubmitting"
        >
      </div>

      <div class="h-[25px] border-r border-t border-b divide-gray-200">
        <input
            name="user-password-confirmation"
            class="text-sm w-[120px] outline-none flex items-center"
            type="password"
            placeholder="confirm password"
            v-model="form.password_confirmation"
            :disabled="isSubmitting"
        >
      </div>

      <input
          class="text-sm w-[80px] h-[25px] bg-gray-200 cursor-pointer disabled:opacity-50"
          type="submit"
          :value="isSubmitting ? '...' : 'Register'"
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