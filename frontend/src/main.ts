import './styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import router from './router'
import { primeVueConfig } from './config/primeVue.config'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, primeVueConfig)

app.mount('#app')
