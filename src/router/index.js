// WA-frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/stores/auth';

// Views
import HomePage from '@/views/HomePage.vue';
import CustomerLogin from '@/views/CustomerLogin.vue';
import ProviderLogin from '@/views/ProviderLogin.vue';
import SignUp from '@/views/SignUp.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import ProviderDashboard from '@/views/ProviderDashboard.vue'; // ← keep only if you have this view

const routes = [
  { path: '/', name: 'HomePage', component: HomePage },

  { path: '/customer-login', name: 'CustomerLogin', component: CustomerLogin },
  { path: '/provider-login', name: 'ProviderLogin', component: ProviderLogin },
  { path: '/sign-up', name: 'SignUp', component: SignUp },

  // Authenticated user page
  { path: '/profile', name: 'Profile', component: ProfilePage, meta: { requiresAuth: true } },

  // Provider-only page (requires login + provider role)
  {
    path: '/provider-dashboard',
    name: 'ProviderDashboard',
    component: ProviderDashboard,
    meta: { requiresAuth: true, requiresProvider: true },
  },

  // (optional) catch-all 404
  // { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // optional: reset scroll on route change
  scrollBehavior() {
    return { top: 0 };
  },
});

// Global guard: auth + provider role
router.beforeEach((to) => {
  const auth = useAuth();
  // ensure session is loaded on hard refresh
  auth.loadFromStorage();

  // must be logged in?
  if (to.meta?.requiresAuth && !auth.isLogged) {
    return {
      path: '/customer-login',
      query: { r: to.fullPath }, // so we can redirect back after login
    };
  }

  // must be provider?
  if (to.meta?.requiresProvider && !auth.isProvider) {
    // if logged in but not provider, send home (or to a "no access" page)
    return { path: '/', replace: true };
  }

  // allow navigation
  return true;
});

export default router;
