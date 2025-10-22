<script setup lang="ts">
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
</script>

<template>
  <div class="flex flex-inline flex-nowrap items-center">
    <a
        v-if="!loginIsActive"
        href="#"
        class="text-green-500"
        @click="activateLogin"
    >LOGIN</a>

    <Login v-if="loginIsActive"/>

    <a
        v-if="!registerIsActive"
        href="#" class="text-red-500"
        @click="activateRegister"
    >REGISTER</a>

    <Register v-if="registerIsActive"/>
  </div>
</template>

<style scoped>

</style>