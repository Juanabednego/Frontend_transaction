import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Payment from '../views/Payment.vue'

// User views
import UserDashboard from '../views/user/Dashboard.vue'
import UserPaymentMethod from '../views/user/PaymentMethod.vue'
import UserPaymentReturn from '../views/user/PaymentReturn.vue'
import UserTransactionHistory from '../views/user/TransactionHistory.vue'

// Admin views
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminMaintainQR from '../views/admin/MaintainQR.vue'
import AdminMasterAccount from '../views/admin/MasterAccount.vue'
import AdminReports from '../views/admin/Reports.vue'
import AdminSettings from '../views/admin/Settings.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { 
        path: '/payment', 
        component: Payment,
        beforeEnter: (to, from, next) => {
            // Check if user is authenticated from example-main-web.html
            const authToken = localStorage.getItem('auth_token')
            const userData = localStorage.getItem('user_data')
            
            if (authToken && userData) {
                // User is authenticated, preserve their data
                console.log('🔍 Payment route - Authenticated user detected')
                next()
            } else if (to.query.from_web === 'true') {
                // From external web without auth, allow as guest
                console.log('🔍 Payment route - Guest user from external web')
                next()
            } else {
                // No auth, redirect to login
                next({ path: '/login' })
            }
        }
    },

    // User routes
    {
        path: '/user/dashboard',
        component: UserDashboard,
        beforeEnter: (to, from, next) => {
            const authUser = localStorage.getItem('authUser')
            if (!authUser) return next({ path: '/login', query: { redirect: to.fullPath } })
            const user = JSON.parse(authUser)
            if (user.role === 'user') return next()
            else return next({ path: '/admin/dashboard' })
        }
    },
    {
        path: '/user/payment-method',
        component: UserPaymentMethod,
        beforeEnter: (to, from, next) => {
            const authUser = localStorage.getItem('authUser')
            if (!authUser) return next({ path: '/login', query: { redirect: to.fullPath } })
            const user = JSON.parse(authUser)
            if (user.role === 'user') return next()
            else return next({ path: '/admin/dashboard' })
        }
    },
    {
        path: '/user/payment-return',
        component: UserPaymentReturn,
        beforeEnter: (to, from, next) => {
            const authUser = localStorage.getItem('authUser')
            if (!authUser) return next({ path: '/login', query: { redirect: to.fullPath } })
            const user = JSON.parse(authUser)
            if (user.role === 'user') return next()
            else return next({ path: '/admin/dashboard' })
        }
    },
    {
        path: '/user/history',
        component: UserTransactionHistory,
        beforeEnter: (to, from, next) => {
            const authUser = localStorage.getItem('authUser')
            if (!authUser) return next({ path: '/login', query: { redirect: to.fullPath } })
            const user = JSON.parse(authUser)
            if (user.role === 'user') return next()
            else return next({ path: '/admin/dashboard' })
        }
    },

    // Admin routes
    {
        path: '/admin/dashboard',
        component: AdminDashboard,
        beforeEnter: (to, from, next) => {
            const authUser = localStorage.getItem('authUser')
            if (!authUser) return next({ path: '/login', query: { redirect: to.fullPath } })
            const user = JSON.parse(authUser)
            if (user.role === 'admin') return next()
            else return next({ path: '/user/dashboard' })
        }
    },
    {
        path: '/admin/maintain-qr',
        component: AdminMaintainQR,
        beforeEnter: (to, from, next) => {
            const authUser = localStorage.getItem('authUser')
            if (!authUser) return next({ path: '/login', query: { redirect: to.fullPath } })
            const user = JSON.parse(authUser)
            if (user.role === 'admin') return next()
            else return next({ path: '/user/dashboard' })
        }
    },
    {
        path: '/admin/master-account',
        component: AdminMasterAccount,
        beforeEnter: (to, from, next) => {
            const authUser = localStorage.getItem('authUser')
            if (!authUser) return next({ path: '/login', query: { redirect: to.fullPath } })
            const user = JSON.parse(authUser)
            if (user.role === 'admin') return next()
            else return next({ path: '/user/dashboard' })
        }
    },
    {
        path: '/admin/reports',
        component: AdminReports,
        beforeEnter: (to, from, next) => {
            const authUser = localStorage.getItem('authUser')
            if (!authUser) return next({ path: '/login', query: { redirect: to.fullPath } })
            const user = JSON.parse(authUser)
            if (user.role === 'admin') return next()
            else return next({ path: '/user/dashboard' })
        }
    },
    {
        path: '/admin/settings',
        component: AdminSettings,
        beforeEnter: (to, from, next) => {
            const authUser = localStorage.getItem('authUser')
            if (!authUser) return next({ path: '/login', query: { redirect: to.fullPath } })
            const user = JSON.parse(authUser)
            if (user.role === 'admin') return next()
            else return next({ path: '/user/dashboard' })
        }
    },

    // Catch-all: redirect unknown routes to login if not authenticated
    { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Global guard: require auth for all routes except /login and /payment
router.beforeEach((to, from, next) => {
    const authUser = localStorage.getItem('authUser')

    // Allow /login and /payment routes always
    if (to.path === '/login' || to.path === '/payment') {
        // If already logged in and accessing /login, redirect to dashboard
        if (to.path === '/login' && authUser) {
            const user = JSON.parse(authUser)
            // Don't redirect payment users to admin panel
            if (user.username === 'payment_user') {
                return next({ path: '/user/dashboard' })
            }
            const defaultPath = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'
            return next({ path: defaultPath })
        }
        return next()
    }

    // Auto redirect payment to user section or handle payment flow
    if (to.path.startsWith('/user/')) {
        if (!authUser || from.path === '/payment' || to.query.from_web === 'true') {
            localStorage.setItem('authUser', JSON.stringify({ role: 'user', username: 'payment_user' }))
            return next()
        }
        // Ensure existing user has correct role for user routes
        const user = JSON.parse(authUser)
        if (user.role !== 'user') {
            localStorage.setItem('authUser', JSON.stringify({ role: 'user', username: 'payment_user' }))
        }
        return next()
    }

    // For all other routes, check auth
    if (!authUser) {
        return next({ path: '/login', query: { redirect: to.fullPath } })
    }

    return next()
})

export default router