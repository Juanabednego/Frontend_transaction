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
        <div class="me-2 d-none d-md-block text-muted small">Hello, {{ userName }}</div>
        <div class="avatar bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style="width:36px;height:36px">{{ userInitial }}</div>
        <button class="btn btn-sm btn-outline-danger" @click="logout">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'UserTopbar',
  computed: {
    userName() {
      // Check for customer data from payment flow
      const userData = localStorage.getItem('user_data')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          return user.full_name || user.name || 'User'
        } catch (e) {
          console.warn('Invalid user_data in localStorage')
        }
      }
      
      // Fallback to authUser
      const auth = localStorage.getItem('authUser')
      if (auth) {
        return JSON.parse(auth).name || 'User'
      }
      return 'User'
    },
    userInitial() {
      // Check for customer data from payment flow
      const userData = localStorage.getItem('user_data')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          const name = user.full_name || user.name || 'U'
          return name.charAt(0).toUpperCase()
        } catch (e) {
          console.warn('Invalid user_data in localStorage')
        }
      }
      
      // Fallback to authUser
      const auth = localStorage.getItem('authUser')
      if (auth) {
        const name = JSON.parse(auth).name || 'U'
        return name.charAt(0).toUpperCase()
      }
      return 'U'
    },
    title() {
      const path = this.$route.path
      if (path.includes('/user/dashboard')) return 'Dashboard'
      if (path.includes('/user/payment-method')) return 'Pilih Metode Pembayaran'
      if (path.includes('/user/history')) return 'History Transaksi'
      if (path.includes('/user/payment-success')) return 'Pembayaran Berhasil'
      return 'Transaksi'
    },
    breadcrumb() {
      return this.$route.path.replace('/user/', '') || 'Home'
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
