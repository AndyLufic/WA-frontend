<template>
  <div class="auth">
    <h1>Create account</h1>

    <form class="card" @submit.prevent="submit">
      <label>Email</label>
      <input type="email" v-model="email" required />

      <label>Password</label>
      <input type="password" v-model="password" required minlength="6" />

      <label>Alias (display name)</label>
      <input v-model="alias" placeholder="Shown in header instead of email" />

      <label>Role</label>
      <select v-model="role" required>
        <option value="customer">Customer</option>
        <option value="provider">Provider</option>
      </select>

      <button :disabled="auth.loading">Sign up</button>
      <p v-if="auth.error" class="err">{{ auth.error }}</p>
    </form>

    <p class="muted">
      Already have an account?
      <router-link to="/customer-login">Log in here</router-link>
    </p>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuth } from "@/stores/auth";

export default {
  name: "SignUp",
  setup() {
    const auth = useAuth();
    const email = ref("");
    const password = ref("");
    const alias = ref("");
    const role = ref("customer");

    async function submit() {
      try {
        await auth.signup({ email: email.value, password: password.value, role: role.value, alias: alias.value });
        // After signup, go home (header will show alias if present)
        window.location.href = "/";
      } catch (e) {
        // error already set in store; leave here if you want a console too
        console.error(e);
      }
    }

    return { auth, email, password, alias, role, submit };
  },
};
</script>

<style>
.auth { max-width: 420px; margin: 24px auto; padding: 0 12px; }
.card { border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; }
h1 { margin-bottom: 16px; }
label { display:block; margin-top:10px; font-size:14px; color:#555; }
input, select { width:100%; padding:8px; border:1px solid #d1d5db; border-radius:6px; margin:4px 0 10px; }
button { background:#2563eb; color:#fff; border:0; padding:8px 12px; border-radius:6px; cursor:pointer; width:100%; }
button:disabled { opacity:.6; cursor:not-allowed; }
.err { color:#dc2626; margin-top:8px; }
.muted { color:#6b7280; font-size: 13px; margin-top: 12px; }
</style>
