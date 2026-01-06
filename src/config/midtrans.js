/**
 * Midtrans Payment Gateway Configuration
 * Access Keys for Midtrans API Integration
 */

export const MIDTRANS_CONFIG = {
    // Merchant Information
    merchantId: 'G3329V111',

    // API Keys
    clientKey: 'Mid-client-ZxWfqZF1Q0HUjDu',
    serverKey: 'Mid-server-Q8lsSRhZlWDoDthqHGLEudC',

    // API Endpoints
    apiBaseUrl: 'https://api.sandbox.midtrans.com', // Sandbox for testing
    // apiBaseUrl: 'https://api.midtrans.com', // Production

    // Snap API for payment page
    snapUrl: 'https://snap.sandbox.midtrans.com/snap/snap.js',
    // snapUrl: 'https://snap.midtrans.com/snap/snap.js', // Production

    // Transaction Settings
    environment: 'sandbox', // 'sandbox' or 'production'
    isProduction: false,

    // CORS Settings
    corsHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa('Mid-server-Q8lsSRhZlWDoDthqHGLEudC:')}`
    }
}

/**
 * Get Authorization Header for API Requests
 * @returns {string} Base64 encoded server key
 */
export const getMidtransAuth = () => {
    return `Basic ${btoa(MIDTRANS_CONFIG.serverKey + ':')}`
}

/**
 * Midtrans Snap Integration Script
 * Load this in your HTML or Vue component
 */
export const loadMidtransSnap = () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = MIDTRANS_CONFIG.snapUrl
        script.async = true
        script.onload = () => resolve(window.snap)
        script.onerror = () => reject(new Error('Failed to load Midtrans Snap'))
        document.head.appendChild(script)
    })
}