<template>
  <div class="row justify-content-center mt-4">
    <div class="col-lg-8">
      <!-- Total Pembayaran -->
      <div class="card shadow-sm mb-4 border-primary">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col">
              <small class="text-muted d-block">Total Pembayaran</small>
              <h3 class="mb-0 text-primary fw-bold">{{ formatCurrency(amount) }}</h3>
            </div>
            <div class="col-auto">
              <div class="display-5 text-primary">
                <i class="bi bi-credit-card"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pilih Metode Pembayaran -->
      <div class="card shadow-sm p-4">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h5 class="mb-0">Pilih Metode Pembayaran</h5>
            <small class="text-muted">Pilih metode yang Anda inginkan untuk menyelesaikan pembayaran.</small>
          </div>
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-if="loading" class="text-center py-4">Memuat metode pembayaran...</div>

        <div v-else-if="processing" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Memproses pembayaran...</p>
        </div>

        <div v-else class="payment-methods">
          <div
            v-for="method in paymentMethods"
            :key="method.id"
            @click="handlePaymentSelect(method)"
            class="payment-card-item mb-3 p-4"
          >
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <div :class="`text-${method.color}`" style="font-size: 2.5rem;">
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

        <div v-if="showCountdown" class="mt-4 text-center">
          <span class="badge bg-warning text-dark fs-6 p-2">
            Waktu pembayaran tersisa: {{ countdown }} detik
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { processPayment } from '../../services/paymentService'

export default {
  name: 'UserPaymentMethod',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const paymentMethods = ref([])
    const loading = ref(true)
    const processing = ref(false)
    const countdown = ref(180)
    const showCountdown = ref(true)
    const error = ref('')
    const amount = ref(150000)
    const orderId = ref('')
    let timer

    onMounted(async () => {
      // Get data from URL params (from web utama)
      if (route.query.order_id) {
        orderId.value = route.query.order_id
        amount.value = parseFloat(route.query.amount) || 150000
      }
      
      try {
        const response = await fetch('/data/payment-methods.json')
        if (response.ok) {
          paymentMethods.value = await response.json()
        }
      } catch (e) {
        console.error('Failed to load payment methods', e)
        error.value = 'Gagal memuat metode pembayaran'
      } finally {
        loading.value = false
      }

      timer = setInterval(() => {
        if (countdown.value > 0) countdown.value--
        else showCountdown.value = false
      }, 1000)
    })

    onUnmounted(() => clearInterval(timer))

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value)
    }

    const handlePaymentSelect = async (method) => {
      if (processing.value) return
      
      processing.value = true
      error.value = ''
      
      try {
        // Use existing order ID or generate new one
        const currentOrderId = orderId.value || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        
        // Process payment through API
        const result = await processPayment({
          order_id: currentOrderId,
          amount: amount.value,
          payment_method: method.code,
          customer_details: {
            first_name: 'Customer',
            last_name: 'Name',
            email: 'customer@example.com',
            phone: '081234567890'
          },
          item_details: [{
            id: 'ITEM001',
            price: amount.value,
            quantity: 1,
            name: 'Payment Item'
          }]
        })
        
        if (result.success) {
          // Navigate to payment page with instructions
          router.push({
            path: '/user/payment-return',
            query: {
              order_id: currentOrderId,
              amount: amount.value,
              payment_method: method.code,
              status: 'processing'
            }
          })
        } else {
          throw new Error(result.message || 'Gagal memproses pembayaran')
        }
      } catch (err) {
        console.error('Payment error:', err)
        error.value = err.message || 'Gagal memproses pembayaran. Silakan coba lagi.'
        processing.value = false
      }
    }

    return { 
      paymentMethods, 
      loading, 
      processing,
      countdown, 
      showCountdown,
      error,
      amount,
      handlePaymentSelect,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.payment-card-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-card-item:hover {
  background: #fff;
  border-color: #0d6efd;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
  transform: translateX(4px);
}

.payment-card-item:active {
  transform: translateX(2px);
}

.payment-methods {
  margin-top: 1.5rem;
}
</style>
