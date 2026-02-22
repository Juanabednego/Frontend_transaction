<template>
  <div class="row justify-content-center mt-4">
    <div class="col-lg-7">
      <div class="card shadow-sm mb-4" v-if="loading">
        <div class="card-body text-center py-5">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="text-muted">Memeriksa status pembayaran...</p>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="paymentStatus === 'SUCCESS'" class="card shadow-sm mb-4">
        <div class="card-header bg-success bg-opacity-10 border-success">
          <div class="d-flex align-items-center">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 2rem;"></i>
            <div class="ms-3">
              <h5 class="mb-0 text-success">Pembayaran Berhasil!</h5>
              <small class="text-muted">Transaksi Anda telah diproses</small>
            </div>
          </div>
        </div>
        <div class="card-body">
          <!-- Info Pembayaran -->
          <div class="row mb-4">
            <div class="col-md-6 mb-3">
              <small class="text-muted d-block">Nomor Order</small>
              <p class="mb-0 fw-semibold">{{ orderId }}</p>
            </div>
            <div class="col-md-6 mb-3">
              <small class="text-muted d-block">Total Pembayaran</small>
              <p class="mb-0 fw-semibold text-success fs-5">{{ formatCurrency(amount) }}</p>
            </div>
            <div class="col-md-6 mb-3">
              <small class="text-muted d-block">Metode Pembayaran</small>
              <p class="mb-0 fw-semibold">{{ formatPaymentMethod(paymentMethod) }}</p>
            </div>
            <div class="col-md-6 mb-3">
              <small class="text-muted d-block">Status</small>
              <p class="mb-0"><span class="badge bg-success">Berhasil</span></p>
            </div>
          </div>

          <!-- QR Code -->
          <div class="text-center my-4">
            <p class="text-muted small mb-2">Kode Referensi</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=transaksi"
                 class="img-fluid rounded shadow-sm" style="max-width: 250px;" />
          </div>

          <!-- Deskripsi -->
          <div class="alert alert-info alert-sm mb-4">
            <i class="bi bi-info-circle me-2"></i>
            <small>Simpan nomor order Anda untuk keperluan referensi atau pertanyaan lebih lanjut.</small>
          </div>

          <!-- Action Buttons -->
          <div class="d-grid gap-2">
            <router-link to="/user/dashboard" class="btn btn-primary">
              <i class="bi bi-house me-2"></i>Kembali ke Home
            </router-link>
            <router-link to="/user/history" class="btn btn-outline-primary">
              <i class="bi bi-clock-history me-2"></i>Lihat Riwayat Transaksi
            </router-link>
          </div>
        </div>
      </div>

      <!-- Failed State -->
      <div v-else-if="paymentStatus === 'FAILED'" class="card shadow-sm mb-4">
        <div class="card-header bg-danger bg-opacity-10 border-danger">
          <div class="d-flex align-items-center">
            <i class="bi bi-x-circle-fill text-danger" style="font-size: 2rem;"></i>
            <div class="ms-3">
              <h5 class="mb-0 text-danger">Pembayaran Gagal</h5>
              <small class="text-muted">Transaksi tidak dapat diselesaikan</small>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="alert alert-danger mb-4">
            <small>{{ errorMessage || 'Pembayaran Anda ditolak. Silakan coba dengan metode lain.' }}</small>
          </div>

          <div class="row mb-4">
            <div class="col-md-6 mb-3">
              <small class="text-muted d-block">Nomor Order</small>
              <p class="mb-0 fw-semibold">{{ orderId }}</p>
            </div>
            <div class="col-md-6 mb-3">
              <small class="text-muted d-block">Total Pembayaran</small>
              <p class="mb-0 fw-semibold">{{ formatCurrency(amount) }}</p>
            </div>
          </div>

          <div class="d-grid gap-2">
            <router-link to="/user/payment-method" class="btn btn-warning">
              <i class="bi bi-arrow-clockwise me-2"></i>Coba Lagi
            </router-link>
            <router-link to="/user/dashboard" class="btn btn-outline-secondary">
              <i class="bi bi-house me-2"></i>Kembali ke Home
            </router-link>
          </div>
        </div>
      </div>

      <!-- Processing/Pending State -->
      <div v-else-if="paymentStatus === 'PENDING' || paymentStatus === 'processing'" class="card shadow-sm mb-4">
        <div class="card-header bg-warning bg-opacity-10 border-warning">
          <div class="d-flex align-items-center">
            <i class="bi bi-clock-history text-warning" style="font-size: 2rem;"></i>
            <div class="ms-3">
              <h5 class="mb-0 text-warning">Menunggu Pembayaran</h5>
              <small class="text-muted">Transaksi sedang diproses</small>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-md-6 mb-3">
              <small class="text-muted d-block">Nomor Order</small>
              <p class="mb-0 fw-semibold">{{ orderId }}</p>
            </div>
            <div class="col-md-6 mb-3">
              <small class="text-muted d-block">Total Pembayaran</small>
              <p class="mb-0 fw-semibold">{{ formatCurrency(amount) }}</p>
            </div>
            <div class="col-md-6 mb-3">
              <small class="text-muted d-block">Metode Pembayaran</small>
              <p class="mb-0 fw-semibold">{{ formatPaymentMethod(paymentMethod) }}</p>
            </div>
            <div class="col-md-6 mb-3">
              <small class="text-muted d-block">Status</small>
              <p class="mb-0"><span class="badge bg-warning text-dark">Menunggu</span></p>
            </div>
          </div>

          <div class="alert alert-info alert-sm mb-4">
            <i class="bi bi-info-circle me-2"></i>
            <small>Transaksi Anda sedang diproses. Silakan tunggu beberapa saat.</small>
          </div>

          <!-- Payment Instructions -->
          <div v-if="paymentInstructions" class="mb-4" v-html="paymentInstructions"></div>
          
          <div class="alert alert-info mb-3">
            <h6><i class="bi bi-info-circle me-2"></i>Testing Payment</h6>
            <p class="mb-2">Untuk testing, gunakan Midtrans Payment Simulator:</p>
            <a href="https://simulator.sandbox.midtrans.com/" target="_blank" class="btn btn-sm btn-outline-info">
              <i class="bi bi-box-arrow-up-right me-1"></i>
              Buka Payment Simulator
            </a>
          </div>

          <div class="d-grid gap-2">
            <button @click="syncWithMidtrans" class="btn btn-primary" :disabled="checking">
              <span v-if="checking" class="spinner-border spinner-border-sm me-2"></span>
              <i class="bi bi-arrow-repeat me-2"></i>
              {{ checking ? 'Syncing...' : 'Sync dengan Midtrans' }}
            </button>
            <button @click="checkStatus" class="btn btn-info" :disabled="checking">
              <i class="bi bi-search me-2"></i>
              Cek Status
            </button>
            <router-link to="/user/dashboard" class="btn btn-outline-secondary">
              <i class="bi bi-house me-2"></i>Kembali ke Home
            </router-link>
          </div>
        </div>
      </div>

      <!-- Error/Unknown State -->
      <div v-else class="card shadow-sm mb-4">
        <div class="card-header bg-secondary bg-opacity-10 border-secondary">
          <div class="d-flex align-items-center">
            <i class="bi bi-exclamation-triangle-fill text-secondary" style="font-size: 2rem;"></i>
            <div class="ms-3">
              <h5 class="mb-0 text-secondary">Status Tidak Diketahui</h5>
              <small class="text-muted">Silakan hubungi support</small>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="alert alert-warning mb-4">
            <small>{{ errorMessage || 'Tidak dapat memverifikasi status pembayaran Anda.' }}</small>
          </div>

          <div class="d-grid gap-2">
            <button @click="checkStatus" class="btn btn-secondary" :disabled="checking">
              <span v-if="checking" class="spinner-border spinner-border-sm me-2"></span>
              {{ checking ? 'Memeriksa...' : 'Coba Lagi' }}
            </button>
            <router-link to="/user/dashboard" class="btn btn-outline-secondary">
              <i class="bi bi-house me-2"></i>Kembali ke Home
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { checkPaymentStatus } from '../../services/paymentService'

export default {
  name: 'PaymentReturn',
  setup() {
    const route = useRoute()
    const loading = ref(true)
    const checking = ref(false)
    const paymentStatus = ref(null)
    const orderId = ref('')
    const paymentMethod = ref('')
    const amount = ref(0)
    const errorMessage = ref('')
    const paymentInstructions = ref('')
    const virtualAccount = ref('')

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value)
    }

    const formatPaymentMethod = (method) => {
      const methodNames = {
        'QRIS': 'QRIS',
        'VA_MANDIRI': 'Virtual Account Mandiri',
        'VA_BRI': 'Virtual Account BRI',
        'VA_BNI': 'Virtual Account BNI',
        'VA_BCA': 'Virtual Account BCA'
      }
      return methodNames[method] || method
    }

    const generatePaymentInstructions = () => {
      const vaNumber = virtualAccount.value || 'Loading...'
      const amountFormatted = formatCurrency(amount.value)
      
      const instructions = {
        'bca_va': `
          <div class="alert alert-primary">
            <h6>Virtual Account BCA:</h6>
            <h4 class="fw-bold">${vaNumber}</h4>
            <p class="mb-0">Total: ${amountFormatted}</p>
          </div>
        `,
        'bni_va': `
          <div class="alert alert-warning">
            <h6>Virtual Account BNI:</h6>
            <h4 class="fw-bold">${vaNumber}</h4>
            <p class="mb-0">Total: ${amountFormatted}</p>
          </div>
        `,
        'bri_va': `
          <div class="alert alert-info">
            <h6>Virtual Account BRI:</h6>
            <h4 class="fw-bold">${vaNumber}</h4>
            <p class="mb-0">Total: ${amountFormatted}</p>
          </div>
        `,
        'mandiri_va': `
          <div class="alert alert-danger">
            <h6>Virtual Account Mandiri:</h6>
            <h4 class="fw-bold">${vaNumber}</h4>
            <p class="mb-0">Total: ${amountFormatted}</p>
          </div>
        `
      }
      
      return instructions[paymentMethod.value] || ''
    }

    const checkStatus = async () => {
      if (!orderId.value) return
      
      checking.value = true
      errorMessage.value = ''
      
      try {
        const result = await checkPaymentStatus(orderId.value)
        
        if (result.success) {
          paymentStatus.value = result.data.status
          amount.value = result.data.amount || amount.value
          paymentMethod.value = result.data.payment_method || paymentMethod.value
        } else {
          errorMessage.value = result.message
        }
      } catch (error) {
        console.error('Check status error:', error)
        errorMessage.value = error.message
      } finally {
        checking.value = false
      }
    }

    const syncWithMidtrans = async () => {
      if (!orderId.value) return
      
      checking.value = true
      
      try {
        const response = await fetch(`https://smeruu.com/api/sync-status/${orderId.value}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        const result = await response.json()
        
        if (result.success) {
          paymentStatus.value = result.data.status
          alert(`Status berhasil disync dari Midtrans: ${result.data.status}`)
        } else {
          alert(`Sync gagal: ${result.error || result.message}`)
        }
      } catch (error) {
        console.error('Sync error:', error)
        alert('Gagal sync dengan Midtrans: ' + error.message)
      } finally {
        checking.value = false
      }
    }

    onMounted(async () => {
      // Get parameters from URL
      orderId.value = route.query.order_id || ''
      paymentMethod.value = route.query.payment_method || route.query.method || ''
      amount.value = parseInt(route.query.amount || 0)
      paymentStatus.value = route.query.status || 'processing'
      
      // Get VA number if available
      if (orderId.value) {
        try {
          const response = await fetch(`https://smeruu.com/api/transaction-status/${orderId.value}`)
          const result = await response.json()
          if (result.success && result.data.pg_response) {
            virtualAccount.value = result.data.pg_response.va_numbers?.[0]?.va_number || 
                                 result.data.pg_response.bca_va_number ||
                                 result.data.pg_response.permata_va_number || ''
          }
        } catch (error) {
          console.error('Failed to get VA:', error)
        }
      }
      
      // Generate payment instructions
      paymentInstructions.value = generatePaymentInstructions()
      
      loading.value = false
    })

    return {
      loading,
      checking,
      paymentStatus,
      orderId,
      paymentMethod,
      amount,
      errorMessage,
      formatCurrency,
      formatPaymentMethod,
      checkStatus,
      syncWithMidtrans,
      paymentInstructions
    }
  }
}
</script>

<style scoped>
.alert-sm {
  padding: 0.75rem 1rem;
  margin-bottom: 0;
}

.btn {
  font-weight: 500;
}
</style>
