import CryptoJS from 'crypto-js'
import { SECRET_KEY } from '../config/api'

/**
 * Generate signature for payment validation
 * Must match the backend ValidateSignature.js logic
 * @param {string} orderId - Unique order ID
 * @param {number} amount - Payment amount
 * @param {string} secretKey - Secret key for signing
 * @returns {string} Generated signature
 */
export const generateSignature = (orderId, amount, secretKey = SECRET_KEY) => {
    // Convert amount to string with 2 decimal places
    const amountStr = parseFloat(amount).toFixed(2)

    // Create signature string: order_id + amount + secret_key
    const signatureString = `${orderId}${amountStr}${secretKey}`

    // Generate SHA256 hash
    const signature = CryptoJS.SHA256(signatureString).toString(CryptoJS.enc.Hex)

    return signature
}

/**
 * Validate signature
 * @param {string} orderId - Order ID
 * @param {number} amount - Amount
 * @param {string} receivedSignature - Signature to validate
 * @param {string} secretKey - Secret key
 * @returns {boolean} True if valid
 */
export const validateSignature = (orderId, amount, receivedSignature, secretKey = SECRET_KEY) => {
    const expectedSignature = generateSignature(orderId, amount, secretKey)
    return expectedSignature === receivedSignature
}