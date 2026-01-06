<template>
  <div class="payment-container">
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Memuat data pembayaran...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="alert alert-danger">
            <h5>Terjadi Kesalahan</h5>
            <p>{{ error }}</p>
            <button @click="loadTransactionData" class="btn btn-outline-danger">Coba Lagi</button>
          </div>

          <!-- Payment Content -->
          <div v-else>
            <!-- Header -->
            <div class="card shadow-sm mb-4 border-primary">
              <div class="card-body text-center">
                <h4 class="text-primary mb-3">
                  <i class="bi bi-credit-card me-2"></i>
                  Pembayaran
                </h4>
                <p class="text-muted">Silakan pilih metode pembayaran untuk menyelesaikan transaksi Anda</p>
              </div>
            </div>

            <!-- Transaction Details -->
            <div class="card shadow-sm mb-4">
              <div class="card-header bg-light">
                <h6 class="mb-0">
                  <i class="bi bi-receipt me-2"></i>
                  Detail Transaksi
                </h6>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <small class="text-muted">Order ID</small>
                    <p class="fw-bold">{{ transactionData.order_id }}</p>
                  </div>
                  <div class="col-md-6">
                    <small class="text-muted">Total Pembayaran</small>
                    <h4 class="text-primary fw-bold">{{ formatCurrency(transactionData.amount) }}</h4>
                  </div>
                </div>
                
                <!-- Item Details -->
                <div v-if="transactionData.item_details && transactionData.item_details.length > 0" class="mt-3">
                  <small class="text-muted">Detail Item</small>
                  <div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qty</th>
                          <th>Harga</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in transactionData.item_details" :key="item.id">
                          <td>{{ item.name }}</td>
                          <td>{{ item.quantity }}</td>
                          <td>{{ formatCurrency(item.price) }}</td>
                          <td>{{ formatCurrency(item.price * item.quantity) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Methods -->
            <div v-if="!showPaymentInstructions" class="card shadow-sm">
              <div class="card-header bg-light">
                <h6 class="mb-0">
                  <i class="bi bi-wallet2 me-2"></i>
                  Pilih Metode Pembayaran
                </h6>
              </div>
              <div class="card-body">
                <div v-if="processing" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-3">Memproses pembayaran...</p>
                </div>

                <div v-else class="payment-methods">
                  <div
                    v-for="method in paymentMethods"
                    :key="method.code"
                    @click="handlePaymentSelect(method)"
                    class="payment-method-item mb-3 p-3"
                  >
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="d-flex align-items-center">
                        <div :class="`text-${method.color}`" style="font-size: 2rem;">
                          <i :class="`bi bi-${method.icon}`"></i>
                        </div>
                        <div class="ms-3">
                          <div class="fw-semibold">{{ method.name }}</div>
                          <small class="text-muted">{{ method.description }}</small>
                        </div>
                      </div>
                      <div>
                        <i class="bi bi-chevron-right text-muted"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Countdown Timer -->
                <div v-if="showCountdown" class="mt-4 text-center">
                  <div class="alert alert-warning">
                    <i class="bi bi-clock me-2"></i>
                    Waktu pembayaran tersisa: <strong>{{ formatTime(countdown) }}</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Instructions -->
            <div v-if="showPaymentInstructions" class="card shadow-sm">
              <div class="card-header bg-success text-white">
                <h6 class="mb-0">
                  <i class="bi bi-check-circle me-2"></i>
                  Instruksi Pembayaran
                </h6>
              </div>
              <div class="card-body">
                <div v-html="paymentInstructions"></div>
                
                <div class="mt-4">
                  <div class="alert alert-info">
                    <h6><i class="bi bi-info-circle me-2"></i>Testing Payment</h6>
                    <p class="mb-2">Untuk testing, gunakan Midtrans Payment Simulator:</p>
                    <a href="https://simulator.sandbox.midtrans.com/" target="_blank" class="btn btn-sm btn-outline-info">
                      <i class="bi bi-box-arrow-up-right me-1"></i>
                      Buka Payment Simulator
                    </a>
                  </div>
                  
                  <div class="d-flex gap-2 flex-wrap">
                    <button @click="checkPaymentStatus" class="btn btn-primary">
                      <i class="bi bi-arrow-clockwise me-2"></i>
                      Cek Status
                    </button>
                    <button @click="syncWithMidtrans" class="btn btn-info">
                      <i class="bi bi-cloud-arrow-down me-2"></i>
                      Sync Midtrans
                    </button>
                    <button @click="simulateSuccess" class="btn btn-success">
                      <i class="bi bi-check-circle me-2"></i>
                      Force Success
                    </button>
                    <button @click="backToMethods" class="btn btn-outline-secondary">
                      <i class="bi bi-arrow-left me-2"></i>
                      Pilih Metode Lain
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { processPayment } from '../services/paymentService'

export default {
  name: 'Payment',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const loading = ref(true)
    const error = ref('')
    const processing = ref(false)
    const transactionData = ref({})
    const paymentMethods = ref([])
    const countdown = ref(900) // 15 minutes
    const showCountdown = ref(true)
    const showPaymentInstructions = ref(false)
    const paymentInstructions = ref('')
    const selectedMethod = ref(null)
    const customerInfo = ref(null)
    
    let timer

    const loadTransactionData = async () => {
      loading.value = true
      error.value = ''
      
      try {
        // Get data from URL params
        const { order_id, amount, user_id } = route.query
        
        // Check for authenticated user in localStorage
        const authToken = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')
        let authenticatedUserId = null
        
        if (authToken && userData) {
          try {
            const user = JSON.parse(userData)
            authenticatedUserId = user.id
            console.log('🔍 Payment.vue - Authenticated user found:', user)
          } catch (e) {
            console.warn('🔍 Payment.vue - Invalid user data in localStorage')
          }
        }
        
        console.log('🔍 Payment.vue - URL Params:', route.query)
        console.log('🔍 Payment.vue - User ID from URL:', user_id)
        console.log('🔍 Payment.vue - User ID from localStorage:', authenticatedUserId)
        
        if (!order_id || !amount) {
          throw new Error('Data transaksi tidak lengkap')
        }

        // Use authenticated user ID if available, otherwise use URL param
        const finalUserId = authenticatedUserId || user_id || null
        
        transactionData.value = {
          order_id,
          amount: parseFloat(amount),
          user_id: finalUserId,
          item_details: [],
          customer_details: {}
        }
        
        console.log('🔍 Payment.vue - Final user_id used:', finalUserId)

        // Load customer info if user_id is available
        if (finalUserId) {
          try {
            await loadCustomerInfo(finalUserId)
            // Update existing transaction with user_id if needed
            await updateTransactionUserId(order_id, finalUserId)
          } catch (err) {
            console.warn('🔍 Payment.vue - Failed to load customer info:', err.message)
          }
        }

        // Load payment methods
        try {
          await loadPaymentMethods()
        } catch (err) {
          throw new Error('Gagal memuat data payment gateway: ' + err.message)
        }
        
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    const loadCustomerInfo = async (userId) => {
      try {
        const response = await fetch(`http://localhost:3000/api/auth/user/${userId}`)
        const result = await response.json()
        
        if (result.success) {
          customerInfo.value = result.user
          // Save customer data to localStorage for topbar
          localStorage.setItem('user_data', JSON.stringify(result.user))
          console.log('🔍 Payment.vue - Customer info loaded:', result.user)
        } else {
          console.warn('🔍 Payment.vue - Failed to load customer info:', result.message)
        }
      } catch (err) {
        console.warn('🔍 Payment.vue - Error loading customer info:', err.message)
      }
    }

    const updateTransactionUserId = async (orderId, userId) => {
      try {
        const response = await fetch('http://localhost:3000/api/update-user-id', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_id: orderId,
            user_id: userId
          })
        })
        
        const result = await response.json()
        if (result.success) {
          console.log('🔍 Payment.vue - Transaction user_id updated:', result.data)
        } else {
          console.warn('🔍 Payment.vue - Failed to update transaction user_id:', result.message)
        }
      } catch (err) {
        console.warn('🔍 Payment.vue - Error updating transaction user_id:', err.message)
      }
    }

    const loadPaymentMethods = async () => {
      try {
        // Test backend connection first
        const testResponse = await fetch('http://localhost:3000/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (!testResponse.ok) {
          throw new Error('Backend tidak dapat diakses. Pastikan server berjalan di http://localhost:3000')
        }
        
        // Load payment methods (static data)
        paymentMethods.value = [
          {
            code: 'qris',
            name: 'QRIS',
            description: 'Bayar dengan scan QR Code',
            icon: 'qr-code',
            color: 'success'
          },
          {
            code: 'bca_va',
            name: 'Virtual Account BCA',
            description: 'Transfer melalui ATM/Mobile Banking BCA',
            icon: 'bank',
            color: 'primary'
          },
          {
            code: 'bni_va',
            name: 'Virtual Account BNI',
            description: 'Transfer melalui ATM/Mobile Banking BNI',
            icon: 'bank',
            color: 'warning'
          },
          {
            code: 'bri_va',
            name: 'Virtual Account BRI',
            description: 'Transfer melalui ATM/Mobile Banking BRI',
            icon: 'bank',
            color: 'info'
          },
          {
            code: 'mandiri_va',
            name: 'Virtual Account Mandiri',
            description: 'Transfer melalui ATM/Mobile Banking Mandiri',
            icon: 'bank',
            color: 'danger'
          },
          {
            code: 'gopay',
            name: 'GoPay',
            description: 'Bayar dengan aplikasi GoPay',
            icon: 'phone',
            color: 'success'
          }
        ]
      } catch (err) {
        console.error('Failed to load payment methods:', err)
        throw new Error('Gagal memuat data payment gateway: ' + err.message)
      }
    }

    const handlePaymentSelect = async (method) => {
      if (processing.value) return
      
      processing.value = true
      
      try {
        // Get user_id from transaction data
        const user_id = transactionData.value.user_id
        
        console.log('🔍 Payment.vue - Processing payment with user_id:', user_id)
        console.log('🔍 Payment.vue - User_id type:', typeof user_id)
        
        const result = await processPayment({
          order_id: transactionData.value.order_id,
          amount: transactionData.value.amount,
          payment_method: method.code,
          user_id: user_id,
          customer_details: transactionData.value.customer_details || {
            first_name: 'Customer',
            last_name: 'Name',
            email: 'customer@example.com',
            phone: '081234567890'
          },
          item_details: transactionData.value.item_details || [{
            id: 'ITEM001',
            price: transactionData.value.amount,
            quantity: 1,
            name: 'Payment Item'
          }]
        })
        
        if (result.success) {
          // Show payment instructions based on method
          selectedMethod.value = method
          showPaymentInstructions.value = true
          paymentInstructions.value = generatePaymentInstructions(method, result.data)
          processing.value = false
        } else {
          throw new Error(result.message || 'Gagal memproses pembayaran')
        }
      } catch (err) {
        console.error('Payment error:', err)
        error.value = err.message
        processing.value = false
      }
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value)
    }

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const generatePaymentInstructions = (method, paymentData) => {
      const orderId = transactionData.value.order_id
      const amount = formatCurrency(transactionData.value.amount)
      
      // Extract VA number with fallback
      let vaNumber = paymentData.virtual_account
      if (!vaNumber && paymentData.raw_midtrans_response) {
        const response = paymentData.raw_midtrans_response
        vaNumber = response.va_numbers?.[0]?.va_number || 
                  response.bca_va_number || 
                  response.permata_va_number ||
                  response.bill_key ||
                  'Generating...'
      }
      vaNumber = vaNumber || 'Loading...'
      
      console.log('Payment method:', method.code)
      console.log('VA Number:', vaNumber)
      console.log('Raw response:', paymentData.raw_midtrans_response)
      
      const instructions = {
        qris: `
          <div class="text-center">
            <div class="mb-3">
              <i class="bi bi-qr-code display-1 text-success"></i>
            </div>
            <h5>Scan QR Code untuk Pembayaran</h5>
            <p class="text-muted">Gunakan aplikasi mobile banking atau e-wallet untuk scan QR code</p>
            <div class="bg-light p-4 rounded mb-3">
              <div class="placeholder-qr" style="width: 200px; height: 200px; background: #f8f9fa; border: 2px dashed #dee2e6; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <span class="text-muted">QR Code: ${paymentData.midtrans_response?.qr_string || 'Generating...'}</span>
              </div>
            </div>
            <div class="alert alert-info">
              <strong>Order ID:</strong> ${orderId}<br>
              <strong>Total:</strong> ${amount}
            </div>
          </div>
        `,
        bca_va: `
          <div>
            <h5><i class="bi bi-bank text-primary me-2"></i>Virtual Account BCA</h5>
            <div class="alert alert-primary">
              <h6>Nomor Virtual Account:</h6>
              <h4 class="fw-bold text-primary">${vaNumber}</h4>
              <button onclick="navigator.clipboard.writeText('${vaNumber}')" class="btn btn-sm btn-outline-primary mt-2">
                <i class="bi bi-clipboard"></i> Copy VA Number
              </button>
            </div>
            <h6>Cara Pembayaran:</h6>
            <ol>
              <li>Login ke BCA Mobile atau KlikBCA</li>
              <li>Pilih menu Transfer > BCA Virtual Account</li>
              <li>Masukkan nomor Virtual Account: <strong>${vaNumber}</strong></li>
              <li>Masukkan nominal: <strong>${amount}</strong></li>
              <li>Konfirmasi pembayaran</li>
            </ol>
            <div class="alert alert-info">
              <small><strong>Testing:</strong> Gunakan nomor VA di atas di <a href="https://simulator.sandbox.midtrans.com/" target="_blank">Midtrans Payment Simulator</a></small>
            </div>
          </div>
        `,
        bni_va: `
          <div>
            <h5><i class="bi bi-bank text-warning me-2"></i>Virtual Account BNI</h5>
            <div class="alert alert-warning">
              <h6>Nomor Virtual Account:</h6>
              <h4 class="fw-bold text-warning">${vaNumber}</h4>
              <button onclick="navigator.clipboard.writeText('${vaNumber}')" class="btn btn-sm btn-outline-warning mt-2">
                <i class="bi bi-clipboard"></i> Copy VA Number
              </button>
            </div>
            <h6>Cara Pembayaran:</h6>
            <ol>
              <li>Login ke BNI Mobile Banking</li>
              <li>Pilih menu Transfer > Virtual Account Billing</li>
              <li>Masukkan nomor Virtual Account: <strong>${vaNumber}</strong></li>
              <li>Masukkan nominal: <strong>${amount}</strong></li>
              <li>Konfirmasi pembayaran</li>
            </ol>
            <div class="alert alert-info">
              <small><strong>Testing:</strong> Gunakan nomor VA di atas di <a href="https://simulator.sandbox.midtrans.com/" target="_blank">Midtrans Payment Simulator</a></small>
            </div>
          </div>
        `,
        bri_va: `
          <div>
            <h5><i class="bi bi-bank text-info me-2"></i>Virtual Account BRI</h5>
            <div class="alert alert-info">
              <h6>Nomor Virtual Account:</h6>
              <h4 class="fw-bold text-info">${vaNumber}</h4>
              <button onclick="navigator.clipboard.writeText('${vaNumber}')" class="btn btn-sm btn-outline-info mt-2">
                <i class="bi bi-clipboard"></i> Copy VA Number
              </button>
            </div>
            <h6>Cara Pembayaran:</h6>
            <ol>
              <li>Login ke BRImo (BRI Mobile)</li>
              <li>Pilih menu Pembayaran > BRIVA</li>
              <li>Masukkan nomor Virtual Account: <strong>${vaNumber}</strong></li>
              <li>Masukkan nominal: <strong>${amount}</strong></li>
              <li>Konfirmasi pembayaran</li>
            </ol>
            <div class="alert alert-info">
              <small><strong>Testing:</strong> Gunakan nomor VA di atas di <a href="https://simulator.sandbox.midtrans.com/" target="_blank">Midtrans Payment Simulator</a></small>
            </div>
          </div>
        `,
        mandiri_va: `
          <div>
            <h5><i class="bi bi-bank text-danger me-2"></i>Virtual Account Mandiri</h5>
            <div class="alert alert-danger">
              <h6>Nomor Virtual Account:</h6>
              <h4 class="fw-bold text-danger">${vaNumber}</h4>
              <button onclick="navigator.clipboard.writeText('${vaNumber}')" class="btn btn-sm btn-outline-danger mt-2">
                <i class="bi bi-clipboard"></i> Copy VA Number
              </button>
            </div>
            <h6>Cara Pembayaran:</h6>
            <ol>
              <li>Login ke Livin' by Mandiri</li>
              <li>Pilih menu Bayar > Multipayment</li>
              <li>Masukkan nomor Virtual Account: <strong>${vaNumber}</strong></li>
              <li>Konfirmasi pembayaran sebesar: <strong>${amount}</strong></li>
            </ol>
            <div class="alert alert-info">
              <small><strong>Testing:</strong> Gunakan nomor VA di atas di <a href="https://simulator.sandbox.midtrans.com/" target="_blank">Midtrans Payment Simulator</a></small>
            </div>
          </div>
        `,
        gopay: `
          <div class="text-center">
            <div class="mb-3">
              <i class="bi bi-phone display-1 text-success"></i>
            </div>
            <h5>Pembayaran GoPay</h5>
            <div class="alert alert-success">
              <h6>Buka aplikasi Gojek/GoPay</h6>
              <p class="mb-0">Scan QR code atau masukkan kode pembayaran</p>
            </div>
            <div class="bg-light p-4 rounded mb-3">
              <h6>Kode Pembayaran:</h6>
              <h4 class="fw-bold">${orderId}</h4>
              <p class="text-muted">Total: ${amount}</p>
            </div>
          </div>
        `
      }
      
      return instructions[method.code] || `
        <div class="alert alert-info">
          <h6>Pembayaran ${method.name}</h6>
          <p>Order ID: ${orderId}</p>
          <p>Total: ${amount}</p>
          <p>Virtual Account: ${vaNumber}</p>
          <p>Silakan lakukan pembayaran sesuai instruksi yang diberikan.</p>
        </div>
      `
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/transaction-status/${transactionData.value.order_id}`)
        const result = await response.json()
        
        if (result.success) {
          const status = result.data.status
          if (status === 'SUCCESS') {
            alert('Pembayaran berhasil! Terima kasih.')
            // Ensure user role is maintained
            const authUser = localStorage.getItem('authUser')
            if (!authUser || JSON.parse(authUser).role !== 'user') {
              localStorage.setItem('authUser', JSON.stringify({ role: 'user', username: 'payment_user' }))
            }
            router.push({
              path: '/user/payment-return',
              query: {
                status: 'success',
                order_id: transactionData.value.order_id,
                amount: transactionData.value.amount
              }
            })
          } else if (status === 'FAILED') {
            alert('Pembayaran gagal. Silakan coba metode lain.')
            backToMethods()
          } else {
            alert('Pembayaran masih pending. Silakan coba lagi dalam beberapa saat.')
          }
        } else {
          alert('Gagal mengecek status: ' + result.message)
        }
      } catch (error) {
        alert('Gagal mengecek status pembayaran: ' + error.message)
      }
    }

    const backToMethods = () => {
      showPaymentInstructions.value = false
      paymentInstructions.value = ''
      selectedMethod.value = null
    }

    const simulateCallback = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/test-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_id: transactionData.value.order_id
          })
        })
        
        const result = await response.json()
        if (result.success) {
          alert('Test callback berhasil dikirim!')
          setTimeout(() => checkPaymentStatus(), 1000)
        } else {
          alert('Gagal kirim callback: ' + result.message)
        }
      } catch (error) {
        alert('Error: ' + error.message)
      }
    }

    const syncWithMidtrans = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/sync-status/${transactionData.value.order_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        const result = await response.json()
        if (result.success) {
          alert('Status berhasil disync dengan Midtrans!')
          setTimeout(() => checkPaymentStatus(), 1000)
        } else {
          alert('Gagal sync dengan Midtrans: ' + result.message)
        }
      } catch (error) {
        alert('Error sync: ' + error.message)
      }
    }

    const simulateSuccess = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/update-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_id: transactionData.value.order_id,
            status: 'SUCCESS'
          })
        })
        
        const result = await response.json()
        if (result.success) {
          alert('Status berhasil diupdate ke SUCCESS!')
          checkPaymentStatus()
        } else {
          alert('Gagal update status: ' + result.message)
        }
      } catch (error) {
        alert('Error: ' + error.message)
      }
    }

    const startCountdown = () => {
      timer = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        } else {
          showCountdown.value = false
          clearInterval(timer)
          // Redirect to timeout page or show timeout message
          error.value = 'Waktu pembayaran telah habis. Silakan buat transaksi baru.'
        }
      }, 1000)
    }

    const loadMidtransScript = () => {
      if (!window.snap) {
        const script = document.createElement('script')
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
        script.setAttribute('data-client-key', 'Mid-client-ZxWfqZF1Q0HUjDu')
        document.head.appendChild(script)
      }
    }

    onMounted(() => {
      loadMidtransScript()
      loadTransactionData()
      startCountdown()
    })

    onUnmounted(() => {
      if (timer) clearInterval(timer)
    })

    return {
      loading,
      error,
      processing,
      transactionData,
      paymentMethods,
      countdown,
      showCountdown,
      loadTransactionData,
      handlePaymentSelect,
      formatCurrency,
      formatTime,
      showPaymentInstructions,
      paymentInstructions,
      generatePaymentInstructions,
      checkPaymentStatus,
      syncWithMidtrans,
      simulateSuccess,
      simulateCallback,
      backToMethods,
      customerInfo
    }
  }
}
</script>

<style scoped>
.payment-container {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f7f8fa 0%, #ebe9ee 100%);
  padding: 2rem 0;
  overflow-y: auto;
}

.card {
  border-radius: 12px;
  border: none;
}

.payment-method-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method-item:hover {
  background: #fff;
  border-color: #0d6efd;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
  transform: translateY(-2px);
}

.payment-method-item:active {
  transform: translateY(0);
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #6c757d;
  font-size: 0.875rem;
}

.alert-warning {
  border-left: 4px solid #ffc107;
}
</style>