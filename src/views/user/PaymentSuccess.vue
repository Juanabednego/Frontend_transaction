<template>
  <div class="row justify-content-center mt-4">
    <div class="col-lg-7">
      <div class="card shadow-sm mb-4">
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
              <p class="mb-0 fw-semibold text-success fs-5">{{ formatCurrency(parsedAmount) }}</p>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserPaymentSuccess',
  computed: {
    paymentMethod() {
      return this.$route.query.method || 'QRIS'
    },
    orderId() {
      return this.$route.query.order_id || '-'
    },
    parsedAmount() {
      return parseInt(this.$route.query.amount) || 0
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value)
    },
    formatPaymentMethod(method) {
      const methodNames = {
        'QRIS': 'QRIS',
        'VA_MANDIRI': 'Virtual Account Mandiri',
        'VA_BRI': 'Virtual Account BRI',
        'VA_BNI': 'Virtual Account BNI',
        'VA_BCA': 'Virtual Account BCA'
      }
      return methodNames[method] || method
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
