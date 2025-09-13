import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia).use(router).mount('#app');

// load saved auth after pinia is ready
import { useAuth } from '@/stores/auth';
useAuth().loadFromStorage();
