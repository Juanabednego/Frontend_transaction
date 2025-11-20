<template>
  <div class="row justify-content-center mt-4">
    <div class="col-lg-8">
      <div class="card shadow-sm p-4">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <h5 class="mb-0">Pilih Metode Pembayaran</h5>
            <small class="text-muted">Pilih metode yang Anda inginkan untuk menyelesaikan pembayaran.</small>
          </div>
        </div>

        <div class="row mt-4 g-3">
          <div class="col-sm-4" v-for="i in 3" :key="i">
            <router-link to="/payment-success" class="card h-100 text-decoration-none text-dark p-3 d-flex flex-column align-items-center justify-content-center">
              <div class="display-6 text-success"><i class="bi bi-qr-code-scan"></i></div>
              <div class="mt-2 fw-semibold">QRIS {{ i }}</div>
              <div class="text-muted small">Scan untuk membayar</div>
            </router-link>
          </div>
        </div>

        <div v-if="showCountdown" class="mt-3 text-center">
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

export default {
  setup() {
    const countdown = ref(60)
    const showCountdown = ref(true)
    let timer

    onMounted(() => {
      timer = setInterval(() => {
        if (countdown.value > 0) countdown.value--
        else showCountdown.value = false
      }, 1000)
    })

    onUnmounted(() => clearInterval(timer))

    return { countdown, showCountdown }
  }
}
</script>
