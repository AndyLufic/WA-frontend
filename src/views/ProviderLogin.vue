<template>
  <div class="auth-page">
    <h2>Provider Login</h2>
    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button :disabled="auth.loading">Login</button>
    </form>
    <p v-if="auth.error" class="error">{{ auth.error }}</p>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuth } from "@/stores/auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const auth = useAuth();
    const router = useRouter();

    const email = ref("");
    const password = ref("");

    async function submit() {
      try {
        const user = await auth.login({ email: email.value, password: password.value });
        if (user.role !== "provider") {
          alert("Not a provider account!");
          auth.logout();
          return;
        }
        router.push("/"); // redirect home
      } catch (e) {
        console.error("Provider login failed:", e);
      }
    }

    return { auth, email, password, submit };
  }
};
</script>

<style>
.auth-page { max-width: 400px; margin: 2rem auto; display: flex; flex-direction: column; gap: 1rem; }
.error { color: red; }
</style>
