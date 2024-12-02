import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import './socket';

createApp(App).use(router).mount('#app')
