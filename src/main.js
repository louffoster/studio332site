import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'


app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
})

app.use(createPinia())
app.mount('#app')
