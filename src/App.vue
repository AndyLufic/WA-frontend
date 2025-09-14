<template>
  <div id="app">
    <nav>
      <div class="nav-container">
        <div class="logo">Scooter Rental</div>

        <div class="nav-links">
          <!-- Logged OUT -->
          <template v-if="!auth.isLogged">
            <router-link to="/">Home</router-link>
            <router-link to="/customer-login">Customer Login</router-link>
            <router-link to="/provider-login">Provider Login</router-link>
            <router-link to="/sign-up">Sign Up</router-link>
          </template>

          <!-- Logged IN -->
          <template v-else>
            <router-link to="/">Home</router-link>
            <UserMenu
              :name="auth.displayName"
              :role="auth.user.role"
              @logout="logout"
            />
          </template>
        </div>
      </div>
    </nav>

    <!-- The routed page fills the rest of the viewport -->
    <main class="page">
      <router-view />
    </main>
    <AppToasts /> 
  </div>
</template>

<script>
import { useAuth } from "@/stores/auth";
import UserMenu from "@/components/UserMenu.vue";
import AppToasts from "@/components/Toasts.vue"; 

export default {
  name: "App",
  components: { UserMenu, AppToasts },
  setup() {
    const auth = useAuth();
    // ensure we load stored session on refresh
    auth.loadFromStorage();
    const logout = () => {
      auth.logout();
      window.location.href = "/"; // simple redirect to home
    };
    return { auth, logout };
  },
};
</script>

<style>
:root { --nav-h: 64px; }
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

.page { height: calc(100vh - var(--nav-h)); }
.page > * { height: 100%; }
</style>
