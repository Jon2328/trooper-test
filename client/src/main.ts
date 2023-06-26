import './assets/sass/main.sass'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'

const app = createApp(App)

const axiosInstance = axios.create({
  baseURL: '/api'
});

app.use(createPinia())
app.use(router)

app.mount('#app')

app.config.globalProperties.$axios = axiosInstance
