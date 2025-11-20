import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap + SB Admin 2 CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Custom styles (override bootstrap)
import './style.css'

// Optional: SB Admin 2 CSS (if needed, but may conflict)
// import './assets/css/sb-admin-2.min.css'

createApp(App).use(router).mount('#app')