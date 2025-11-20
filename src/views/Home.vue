<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm p-4">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <h4 class="mb-1">Total Pembayaran</h4>
              <div class="h3 fw-bold">Rp 100.000</div>
            </div>
            <div>
              <router-link to="/payment-method" class="btn btn-primary btn-lg">Pilih Metode</router-link>
            </div>
          </div>
          <div class="mt-3 text-muted small">Transaksi terbaru akan muncul di halaman riwayat.</div>
        </div>
      </div>
    </div>
  </div>
</template>
