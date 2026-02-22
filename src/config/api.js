// API Configuration
export const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'https://testingbe.smeruu.com'
export const SECRET_KEY =
    import.meta.env.VITE_SECRET_KEY || 'your-secret-key-here'

// API Endpoints
export const ENDPOINTS = {
    PROCESS_PAYMENT: '/api/process-payment',
    CHECK_STATUS: '/api/check-status',
    ADMIN_ACCOUNTS: '/api/admin/accounts',
    ADMIN_TRANSACTIONS: '/api/admin/transactions',
    ADMIN_AUDIT_LOGS: '/api/admin/audit-logs'
}