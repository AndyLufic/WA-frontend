<template>
  <div id="app">
    <nav>
      <div class="nav-container">
        <div class="logo">Scooter Rental</div>
        <div class="nav-links">
          <template v-if="!auth.isLogged">
            <router-link to="/">Home</router-link>
            <router-link to="/customer-login">Customer Login</router-link>
            <router-link to="/provider-login">Provider Login</router-link>
            <router-link to="/sign-up">Sign Up</router-link>
          </template>

          <template v-else>
  <router-link to="/">Home</router-link>
  <router-link v-if="auth.isProvider" to="/provider-dashboard">Dashboard</router-link>
  <span class="user-info">
    {{ auth.user.email }} ({{ auth.user.role }})
  </span>
  <button @click="logout">Logout</button>
</template>

        </div>
      </div>
    </nav>

    <!-- Give the routed content a fixed-height area -->
    <main class="page">
      <router-view />
    </main>
  </div>
</template>

<script>
import { useAuth } from "@/stores/auth";

export default {
  name: "App",
  setup() {
    const auth = useAuth();
    const logout = () => { auth.logout(); window.location.href = "/"; };
    return { auth, logout };
  }
};
</script>

<style>
:root { --nav-h: 64px; }          /* adjust if your nav is taller/shorter */
html, body, #app { height: 100%; margin: 0; }

nav {
  position: sticky;
  top: 0;
  height: var(--nav-h);
  width: 100%;
  background-color: #333;
  color: white;
  display: flex;
  align-items: center;
  z-index: 10;
}

.nav-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  margin: 0 auto;
}

nav .logo { font-size: 1.5rem; font-weight: bold; }
.nav-links { display: flex; align-items: center; gap: 1rem; }
.nav-links a { color: white; text-decoration: none; }
.nav-links a:hover { text-decoration: underline; }
.user-info { color: #ddd; font-size: 0.9rem; }
button { background: #e74c3c; border: none; color: white; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; }
button:hover { background: #c0392b; }

/* 👇 This makes the routed view fill the rest of the screen */
.page { height: calc(100vh - var(--nav-h)); }
.page > * { height: 100%; }       /* lets HomePage fill .page */
</style>
