import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PaymentMethod from '../views/PaymentMethod.vue'
import PaymentSuccess from '../views/PaymentSuccess.vue'
import TransactionHistory from '../views/TransactionHistory.vue'
import MaintainQR from '../views/MaintainQR.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/payment-method', component: PaymentMethod },
    { path: '/payment-success', component: PaymentSuccess },
    { path: '/history', component: TransactionHistory },
    { path: '/maintain-qr', component: MaintainQR }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router