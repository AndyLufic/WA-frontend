import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'mapbox-gl/dist/mapbox-gl.css';

// Create the app instance and use the router
createApp(App).use(router).mount('#app');
