<script setup lang="ts">
const authStore = useAuthStore()
const loginIsActive = ref(false)
const registerIsActive = ref(false)

function activateLogin() {
  loginIsActive.value = true
  registerIsActive.value = false
}

function activateRegister() {
  loginIsActive.value = false
  registerIsActive.value = true
}

function deactivateForms() {
  loginIsActive.value = false
  registerIsActive.value = false
}
</script>

<template>
  <div class="flex flex-inline flex-nowrap items-center">
    <!-- Show user profile if authenticated -->
    <UserProfile v-if="authStore.isAuthenticated" />
    
    <!-- Show auth forms if not authenticated -->
    <template v-else>
      <a
          v-if="!loginIsActive"
          href="#"
          class="text-green-500"
          @click="activateLogin"
      >
        {{ registerIsActive ? 'GO TO LOGIN' : 'LOGIN' }}
      </a>

      <Login
          v-if="loginIsActive"
          @login_successful="deactivateForms"
      />

      <a
          v-if="!registerIsActive"
          href="#" 
          class="text-red-500"
          @click="activateRegister"
      >
        {{ loginIsActive ? 'GO TO REGISTER' : 'REGISTER' }}
      </a>

      <Register
          v-if="registerIsActive"
          @register_successful="deactivateForms"
      />
    </template>
  </div>
</template>

<style scoped>

</style>
