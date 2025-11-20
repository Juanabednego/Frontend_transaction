<template>
  <div class="container mt-4">
    <div class="card shadow-sm p-4">
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <h5 class="mb-0">Admin Panel</h5>
          <small class="text-muted">Kelola aplikasi dan data</small>
        </div>

        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary btn-sm" @click="$router.push('/maintain-qr')">Maintain QR</button>
          <button class="btn btn-danger btn-sm" @click="logout">Logout</button>
        </div>
      </div>

      <div class="mt-4">
        <h6>Pengguna saat ini</h6>
        <ul class="list-group mt-2">
          <li class="list-group-item">admin (hak penuh)</li>
        </ul>
        <div class="mt-3 text-muted small">Ini adalah mock admin panel. Untuk produksi, sambungkan ke backend dan implementasikan otorisasi.</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem('authUser')
      this.$router.replace({ path: '/login' })
    }
  }
}
</script>

<style scoped>
.card { border-radius: 8px }
</style>
