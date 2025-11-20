<template>
  <div class="d-flex justify-content-center mt-5">
    <div class="card shadow-sm p-4" style="max-width:420px; width:100%">
      <h5 class="mb-3">Login</h5>

      <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

      <div class="mb-2">
        <label class="form-label small">Username</label>
        <input v-model="username" class="form-control" placeholder="admin" />
      </div>
      <div class="mb-3">
        <label class="form-label small">Password</label>
        <input v-model="password" type="password" class="form-control" placeholder="••••••" />
      </div>

      <div class="d-flex justify-content-between align-items-center">
        <button class="btn btn-primary" @click="login">Masuk</button>
        <router-link to="/" class="text-muted small">Kembali</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { findUser } from '../data/users'

export default {
  data() {
    return { username: '', password: '', error: '' }
  },
  methods: {
    login() {
      this.error = ''
      const user = findUser(this.username, this.password)
      if (user) {
        const authData = { username: user.username, role: user.role, name: user.name, token: 'token-demo-123' }
        localStorage.setItem('authUser', JSON.stringify(authData))
        const redirect = this.$route.query.redirect || '/'
        this.$router.replace({ path: redirect })
      } else {
        this.error = 'Username atau password salah'
      }
    }
  }
}
</script>

<style scoped>
.card { border-radius: 8px }
</style>
