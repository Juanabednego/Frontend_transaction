<template>
  <div id="wrapper">
    <SidebarUser v-if="authData && authData.role === 'user'" />
    <SidebarAdmin v-if="authData && authData.role === 'admin'" />
    <div id="content-wrapper" class="d-flex flex-column">
      <div id="content">
        <TopbarUser v-if="authData && authData.role === 'user'" />
        <TopbarAdmin v-if="authData && authData.role === 'admin'" />
        <div class="container-fluid mt-3">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarUser from './components/SidebarUser.vue'
import SidebarAdmin from './components/SidebarAdmin.vue'
import TopbarUser from './components/TopbarUser.vue'
import TopbarAdmin from './components/TopbarAdmin.vue'

export default {
  components: { SidebarUser, SidebarAdmin, TopbarUser, TopbarAdmin },
  data() {
    return {
      authData: null
    }
  },
  mounted() {
    this.updateAuth()
    // Listen to storage changes (logout/login from other tabs)
    window.addEventListener('storage', this.updateAuth)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.updateAuth)
  },
  watch: {
    '$route'() {
      this.updateAuth()
    }
  },
  methods: {
    updateAuth() {
      const auth = localStorage.getItem('authUser')
      if (auth) {
        this.authData = JSON.parse(auth)
      } else {
        this.authData = null
      }
    }
  }
}
</script>
