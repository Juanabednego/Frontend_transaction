<template>
  <div class="row justify-content-center mt-4">
    <div class="col-md-6">
      <div class="card shadow mb-4 text-center">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-success">Pembayaran Berhasil</h6>
        </div>
        <div class="card-body">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=transaksi"
               class="img-fluid mb-4 rounded shadow-sm" />
          <router-link to="/" class="btn btn-gradient btn-primary w-100">Kembali ke Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
