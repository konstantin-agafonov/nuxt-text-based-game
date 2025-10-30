<script lang="ts" setup>
definePageMeta({
  middleware: ["sanctum:guest"],
});

interface Credentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
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
    await register(credentials);
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

      <div>
        <label for="username">User name</label>
        <input
            id="username"
            v-model="credentials.name"
            type="text"
            name="username"
            placeholder="Your username"
            autocomplete="off"
        />
      </div>
      <div>
        <label for="useremail">User email</label>
        <input
            id="useremail"
            v-model="credentials.email"
            type="email"
            name="useremail"
            placeholder="Your email"
            autocomplete="off"
        />
      </div>
      <div>
        <label for="password">Password</label>
        <input
            id="password"
            v-model="credentials.password"
            type="password"
            name="password"
            placeholder="Your password"
            autocomplete="off"
        />
      </div>
      <div>
        <label for="password_confirmation">Repeat password</label>
        <input
            id="password_confirmation"
            v-model="credentials.password_confirmation"
            type="password"
            name="password_confirmation"
            placeholder="Confirm password"
            autocomplete="off"
        />
      </div>

      <button type="submit">Register</button>
    </form>

    <NuxtLink to="/login" class="text-blue-500">
      Login
    </NuxtLink>

    <NuxtLink to="/password-reset" class="text-blue-500">
      Forgot password
    </NuxtLink>
  </div>
</template>
