<template>
  <div class="auth-page">
    <h2>Sign Up</h2>
    <form @submit.prevent="submit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <select v-model="role" required>
        <option disabled value="">Choose role</option>
        <option value="customer">Customer</option>
        <option value="provider">Provider</option>
      </select>
      <button :disabled="auth.loading">Sign Up</button>
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
    const role = ref("");

    async function submit() {
      try {
        await auth.signup({ email: email.value, password: password.value, role: role.value });
        router.push("/"); // redirect home
      } catch (e) {
        console.error("Sign up failed:", e);
      }
    }

    return { auth, email, password, role, submit };
  }
};
</script>

<style>
.auth-page { max-width: 400px; margin: 2rem auto; display: flex; flex-direction: column; gap: 1rem; }
.error { color: red; }
</style>
