import '@/core/assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './core/router'
import { createPinia } from 'pinia'

const app = createApp(App)

// IMPORTANT: Pinia must be installed BEFORE the router 
// so that the router guards can access the stores.
app.use(createPinia())
app.use(router)

app.mount('#app')
