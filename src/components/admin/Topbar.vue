<template>
  <nav class="topbar navbar navbar-expand bg-white shadow-sm mb-4">
    <div class="container-fluid d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-sm btn-light d-md-none" @click="$emit('toggleSidebar')">
          <i class="bi bi-list"></i>
        </button>
        <div class="page-title">
          <h5 class="mb-0">{{ title }}</h5>
          <small class="text-muted d-block">{{ breadcrumb }}</small>
        </div>
      </div>

      <div class="d-flex align-items-center gap-3">
        <div class="me-2 d-none d-md-block text-muted small">Hello, {{ userName }} (Admin)</div>
        <div class="avatar bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style="width:36px;height:36px">{{ userInitial }}</div>
        <button class="btn btn-sm btn-outline-danger" @click="logout">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AdminTopbar',
  computed: {
    userName() {
      const auth = localStorage.getItem('authUser')
      if (auth) {
        return JSON.parse(auth).name || 'Admin'
      }
      return 'Admin'
    },
    userInitial() {
      const auth = localStorage.getItem('authUser')
      if (auth) {
        const name = JSON.parse(auth).name || 'A'
        return name.charAt(0).toUpperCase()
      }
      return 'A'
    },
    title() {
      const path = this.$route.path
      if (path.includes('/admin/dashboard')) return 'Dashboard Admin'
      if (path.includes('/admin/maintain-qr')) return 'Maintain QR'
      if (path.includes('/admin/reports')) return 'Laporan Transaksi'
      if (path.includes('/admin/settings')) return 'Pengaturan Admin'
      return 'Admin Panel'
    },
    breadcrumb() {
      return this.$route.path.replace('/admin/', '') || 'Dashboard'
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('authUser')
      this.$router.replace({ path: '/login' })
    }
  }
}
</script>
