<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="mb-4 text-center fw-bold">Admin Login</h2>
      <p class="text-center text-muted mb-4">Login khusus untuk administrator</p>

      <div v-if="error" class="alert alert-danger mb-3">
        {{ error }}
      </div>

      <form @submit.prevent="login">
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            placeholder="admin"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="loading">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </form>

      <hr class="my-3">

     
    </div>
  </div>
</template>

<script>
import { findUser } from '../data/users'

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
      showPassword: false,
      loading: false
    }
  },
  methods: {
    async login() {
      this.error = ''
      this.loading = true

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const user = findUser(this.username, this.password)
      if (user) {
        // Only allow admin login
        if (user.role !== 'admin') {
          this.error = 'Akses ditolak. Login ini hanya untuk administrator.'
          this.loading = false
          return
        }
        
        const authData = {
          username: user.username,
          role: user.role,
          name: user.name,
          token: 'token-demo-123'
        }
        localStorage.setItem('authUser', JSON.stringify(authData))

        // Redirect to admin dashboard
        this.$router.replace({ path: '/admin/dashboard' })
      } else {
        this.error = 'Username atau password salah'
      }

      this.loading = false
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.form-control {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.6rem;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.6rem;
  border-radius: 4px;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  border-radius: 4px;
  border: none;
}

hr {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid #eee;
}
</style>

