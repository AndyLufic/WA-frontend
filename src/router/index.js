import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import CustomerLogin from '../views/CustomerLogin.vue'; // Import CustomerLogin component
import ProviderLogin from '../views/ProviderLogin.vue'; // Import ProviderLogin component
import SignUp from '../views/SignUp.vue'; // Import SignUp component




const routes = [
  { path: '/', name: "HomePage", component: HomePage },
  { path: '/customer-login', name: "CustomerLogin", component: CustomerLogin },
  { path: '/provider-login', name: "ProviderLogin", component: ProviderLogin },
  { path: '/sign-up', name: "SignUp", component: SignUp }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;