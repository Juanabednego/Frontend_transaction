/**
 * Midtrans Payment Service
 * Handles all Midtrans API transactions
 */

import { MIDTRANS_CONFIG, getMidtransAuth } from '../config/midtrans'

/**
 * Create Snap Token for Payment
 * @param {Object} transactionData - Transaction details
 * @returns {Promise<string>} Snap Token
 */
export const createSnapToken = async(transactionData) => {
    try {
        const payload = {
            transaction_details: {
                order_id: transactionData.orderId,
                gross_amount: transactionData.amount
            },
            customer_details: {
                first_name: transactionData.customerName || 'Customer',
                email: transactionData.email || 'customer@example.com',
                phone: transactionData.phone || ''
            },
            item_details: [{
                id: transactionData.itemId || 'ITEM-001',
                price: transactionData.amount,
                quantity: 1,
                name: transactionData.description || 'Payment'
            }]
        }

        const response = await fetch(`${MIDTRANS_CONFIG.apiBaseUrl}/v2/snap/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getMidtransAuth()
            },
            body: JSON.stringify(payload)
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to create snap token')
        }

        return result.token
    } catch (error) {
        console.error('Create snap token error:', error)
        throw error
    }
}

/**
 * Get Transaction Status
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Transaction status
 */
export const getTransactionStatus = async(orderId) => {
    try {
        const response = await fetch(
            `${MIDTRANS_CONFIG.apiBaseUrl}/v2/${orderId}/status`, {
                method: 'GET',
                headers: {
                    'Authorization': getMidtransAuth()
                }
            }
        )

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to get transaction status')
        }

        return result
    } catch (error) {
        console.error('Get transaction status error:', error)
        throw error
    }
}

/**
 * Process Transaction After Payment
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Transaction result
 */
export const processTransaction = async(orderId) => {
    try {
        const status = await getTransactionStatus(orderId)

        return {
            orderId: status.order_id,
            transactionId: status.transaction_id,
            amount: status.gross_amount,
            status: status.transaction_status, // settlement, pending, deny
            paymentMethod: status.payment_type,
            timestamp: status.transaction_time
        }
    } catch (error) {
        console.error('Process transaction error:', error)
        throw error
    }
}

/**
 * Cancel Transaction
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelTransaction = async(orderId) => {
    try {
        const response = await fetch(
            `${MIDTRANS_CONFIG.apiBaseUrl}/v2/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': getMidtransAuth()
                }
            }
        )

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to cancel transaction')
        }

        return result
    } catch (error) {
        console.error('Cancel transaction error:', error)
        throw error
    }
}

/**
 * Refund Transaction
 * @param {string} orderId - Order ID
 * @param {number} amount - Refund amount (optional)
 * @returns {Promise<Object>} Refund result
 */
export const refundTransaction = async(orderId, amount = null) => {
    try {
        const payload = {}
        if (amount) {
            payload.refund_amount = amount
        }

        const response = await fetch(
            `${MIDTRANS_CONFIG.apiBaseUrl}/v2/${orderId}/refund`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getMidtransAuth()
                },
                body: JSON.stringify(payload)
            }
        )

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Failed to refund transaction')
        }

        return result
    } catch (error) {
        console.error('Refund transaction error:', error)
        throw error
    }
}

/**
 * Handle Midtrans Notification (Webhook)
 * @param {Object} notification - Webhook notification from Midtrans
 * @returns {Object} Processed notification
 */
export const handleMidtransNotification = (notification) => {
    return {
        orderId: notification.order_id,
        transactionId: notification.transaction_id,
        transactionStatus: notification.transaction_status,
        fraudStatus: notification.fraud_status,
        paymentType: notification.payment_type,
        grossAmount: notification.gross_amount,
        signatureKey: notification.signature_key,
        timestamp: notification.transaction_time
    }
}