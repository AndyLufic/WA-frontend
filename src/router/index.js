import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import CustomerLogin from "@/views/CustomerLogin.vue";
import ProviderLogin from "@/views/ProviderLogin.vue";
import SignUp from "@/views/SignUp.vue";
import { useAuth } from "@/stores/auth";
import ProviderDashboard from "@/views/ProviderDashboard.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/customer-login", component: CustomerLogin },
  { path: "/provider-login", component: ProviderLogin },
  { path: "/sign-up", component: SignUp },
  { path: "/provider-dashboard", component: ProviderDashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// --- Global guard ---
router.beforeEach((to, from, next) => {
  const auth = useAuth();

  // Prevent logged-in users from re-visiting login/signup
  if (auth.isLogged && ["/customer-login", "/provider-login", "/sign-up"].includes(to.path)) {
    return next("/"); // send them home
  }

  // Prevent customers from opening provider login
  if (to.path === "/provider-login" && auth.isCustomer) {
    alert("You are logged in as a customer, not a provider!");
    return next("/");
  }

  // Prevent providers from opening customer login
  if (to.path === "/customer-login" && auth.isProvider) {
    alert("You are logged in as a provider, not a customer!");
    return next("/");
  }
  
  if (to.path === "/provider-dashboard" && !auth.isProvider) {
  alert("Only providers can access the dashboard");
  return next("/");
  }


  next();
});

export default router;
