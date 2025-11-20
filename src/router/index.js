import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PaymentMethod from '../views/PaymentMethod.vue'
import PaymentSuccess from '../views/PaymentSuccess.vue'
import TransactionHistory from '../views/TransactionHistory.vue'
import MaintainQR from '../views/MaintainQR.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'

const routes = [
    { path: '/login', component: Login },
    { path: '/', component: Home },
    { path: '/payment-method', component: PaymentMethod },
    { path: '/payment-success', component: PaymentSuccess },
    { path: '/history', component: TransactionHistory },
    {
        path: '/maintain-qr',
        component: MaintainQR,
        beforeEnter: (to, from, next) => {
            const authUser = localStorage.getItem('authUser')
            if (!authUser) return next({ path: '/login', query: { redirect: to.fullPath } })
            const user = JSON.parse(authUser)
            if (user.role === 'admin') return next()
            else return next({ path: '/' })
        }
    },
    {
        path: '/admin',
        component: Admin,
        beforeEnter: (to, from, next) => {
            const authUser = localStorage.getItem('authUser')
            if (!authUser) return next({ path: '/login', query: { redirect: to.fullPath } })
            const user = JSON.parse(authUser)
            if (user.role === 'admin') return next()
            else return next({ path: '/' })
        }
    },
    // Catch-all: redirect unknown routes to login if not authenticated
    { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Global guard: require auth for all routes except /login
router.beforeEach((to, from, next) => {
    const authUser = localStorage.getItem('authUser')
    
    // Allow /login route always
    if (to.path === '/login') {
        // If already logged in, redirect to home instead
        if (authUser) return next({ path: '/' })
        return next()
    }
    
    // For all other routes, check auth
    if (!authUser) {
        return next({ path: '/login', query: { redirect: to.fullPath } })
    }
    
    return next()
})

export default router