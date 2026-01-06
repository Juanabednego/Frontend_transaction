import { API_BASE_URL, ENDPOINTS } from '../config/api'
import { generateSignature } from '../utils/signature'

/**
 * Process payment through API
 * @param {Object} orderData - Order data
 * @param {string} orderData.order_id - Unique order ID
 * @param {number} orderData.amount - Payment amount
 * @param {string} orderData.payment_method - Payment method code
 * @param {Object} orderData.customer_details - Customer details
 * @param {Array} orderData.item_details - Item details
 * @returns {Promise<Object>} API response
 */
export const processPayment = async(orderData) => {
    try {
        // Prepare request payload
        const payload = {
            order_id: orderData.order_id,
            amount: orderData.amount,
            payment_method: orderData.payment_method,
            user_id: orderData.user_id || null,
            customer_details: orderData.customer_details || {},
            item_details: orderData.item_details || []
        }

        // Send request to backend
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROCESS_PAYMENT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Payment processing failed')
        }

        return result
    } catch (error) {
        console.error('Payment processing error:', error)
        throw error
    }
}

/**
 * Create transaction from main web
 * @param {Object} transactionData - Transaction data from main web
 * @returns {Promise<Object>} API response
 */
export const createTransactionFromMainWeb = async(transactionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/create-transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to create transaction')
        }

        return result
    } catch (error) {
        console.error('Create transaction error:', error)
        throw error
    }
}

/**
 * Check payment status
 * @param {string} orderId - Order ID to check
 * @returns {Promise<Object>} Payment status
 */
export const checkPaymentStatus = async(orderId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/transaction-status/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to check payment status')
        }

        return result
    } catch (error) {
        console.error('Check status error:', error)
        throw error
    }
}

/**
 * Fetch admin accounts
 * @returns {Promise<Array>} List of accounts
 */
export const fetchAdminAccounts = async() => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/accounts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch accounts')
        }

        return result.data
    } catch (error) {
        console.error('Fetch accounts error:', error)
        throw error
    }
}

/**
 * Update admin account
 * @param {string} accountId - Account ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated account
 */
export const updateAdminAccount = async(accountId, updateData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/accounts/${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to update account')
        }

        return result.data
    } catch (error) {
        console.error('Update account error:', error)
        throw error
    }
}

/**
 * Toggle account status
 * @param {string} accountId - Account ID
 * @returns {Promise<Object>} Updated account
 */
export const toggleAccountStatus = async(accountId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/accounts/${accountId}/toggle`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to toggle account status')
        }

        return result.data
    } catch (error) {
        console.error('Toggle account status error:', error)
        throw error
    }
}

/**
 * Fetch admin transactions
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Paginated transactions response
 */
export const fetchAdminTransactions = async(filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters).toString()
        const url = `${API_BASE_URL}/api/admin/transactions${queryParams ? '?' + queryParams : ''}`
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch transactions')
        }

        return {
            data: result.data,
            total: result.pagination?.total || result.data.length,
            page: result.pagination?.page || 1,
            pages: result.pagination?.pages || 1
        }
    } catch (error) {
        console.error('Fetch transactions error:', error)
        throw error
    }
}

/**
 * Fetch dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 */
export const fetchDashboardStats = async() => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard-stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch dashboard stats')
        }

        return result.data
    } catch (error) {
        console.error('Fetch dashboard stats error:', error)
        throw error
    }
}

/**
 * Fetch financial report
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Financial report data
 */
export const fetchFinancialReport = async(filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters).toString()
        const url = `${API_BASE_URL}/api/admin/financial-report${queryParams ? '?' + queryParams : ''}`
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch financial report')
        }

        return result.data
    } catch (error) {
        console.error('Fetch financial report error:', error)
        throw error
    }
}

/**
 * Fetch admin audit logs
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of audit logs
 */
export const fetchAdminAuditLogs = async(filters = {}) => {
    try {
        const queryParams = new URLSearchParams(filters).toString()
        const url = `${API_BASE_URL}/api/admin/audit-logs${queryParams ? '?' + queryParams : ''}`
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch audit logs')
        }

        return result.data
    } catch (error) {
        console.error('Fetch audit logs error:', error)
        throw error
    }
}

/**
 * Clear all account limits (reset used_amount to 0)
 * @returns {Promise<Object>} Clear limits result
 */
export const clearAccountLimits = async() => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/clear-limits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to clear account limits')
        }

        return result
    } catch (error) {
        console.error('Clear limits error:', error)
        throw error
    }
}