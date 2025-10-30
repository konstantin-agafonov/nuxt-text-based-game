<script lang="ts" setup>
definePageMeta({
  middleware: ["sanctum:guest"],
});

interface Credentials {
  email: string;
  password: string;
  remember: boolean;
}

const { login } = useSanctumAuth();

const credentials: Credentials = reactive({
  email: "",
  password: "",
  remember: true,
});

const error = ref<string>("");

async function submit() {
  try {
    error.value = "";
    await login(credentials);
  } catch (err) {
    error.value = err as string;
  }
}
</script>

<template>
  <div>
    <p>Page: register</p>

    <form @submit.prevent="submit">
      <small>{{ error }}</small>

      <input
          id="username"
          v-model="credentials.email"
          type="text"
          name="username"
          placeholder="Your username"
          autocomplete="off"
      />
      <input
          id="password"
          v-model="credentials.password"
          type="password"
          name="password"
          placeholder="Your password"
          autocomplete="off"
      />

      <button type="submit">Login</button>
    </form>

    <NuxtLink to="/register" class="text-blue-500">
      Register
    </NuxtLink>

    <NuxtLink to="/password-reset" class="text-blue-500">
      Forgot password
    </NuxtLink>
  </div>
</template>
