<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <!-- Transaction Details Card -->
        <div v-if="transactionData.order_id" class="card shadow-sm mb-4 border-primary">
          <div class="card-header bg-primary text-white">
            <h6 class="mb-0">
              <i class="bi bi-receipt me-2"></i>
              Detail Transaksi dari Web Utama
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
            
            <div class="mt-3 d-flex gap-2">
              <router-link :to="{ path: '/user/payment-method', query: transactionData }" class="btn btn-primary">
                <i class="bi bi-credit-card me-2"></i>Lanjut Pembayaran
              </router-link>
              <button @click="clearTransaction" class="btn btn-outline-secondary">
                <i class="bi bi-x-circle me-2"></i>Batal
              </button>
            </div>
          </div>
        </div>
        
        <!-- Default Dashboard -->
        <div v-else class="card shadow-sm p-4">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <h4 class="mb-1">Dashboard Pembayaran</h4>
              <div class="text-muted">Belum ada transaksi aktif</div>
            </div>
            <div>
              <router-link to="/user/payment-method" class="btn btn-primary btn-lg">Buat Transaksi</router-link>
            </div>
          </div>
          <div class="mt-3 text-muted small">
            Untuk memulai pembayaran, Anda dapat membuat transaksi baru atau menunggu data dari web utama.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'UserDashboard',
  setup() {
    const route = useRoute()
    const transactionData = ref({})
    
    const loadTransactionFromQuery = () => {
      const { order_id, amount } = route.query
      
      if (order_id && amount) {
        transactionData.value = {
          order_id,
          amount: parseFloat(amount)
        }
      }
    }
    const clearTransaction = () => {
      transactionData.value = {}
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value)
    }
    
    onMounted(() => {
      loadTransactionFromQuery()
    })
    
    return {
      transactionData,
      clearTransaction,
      formatCurrency
    }
  }
}
</script>
