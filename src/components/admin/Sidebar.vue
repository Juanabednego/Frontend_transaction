<template>
  <aside class="app-sidebar bg-white shadow-sm">
    <div class="sidebar-brand d-flex align-items-center px-3 py-3">
      <div class="me-2 brand-icon bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style="width:36px;height:36px">
        <i class="bi bi-shield-lock"></i>
      </div>
      <div class="brand-text ms-2">Admin Panel</div>
    </div>

    <nav class="nav flex-column px-2 pb-3">
      <router-link to="/admin/dashboard" class="nav-link d-flex align-items-center" active-class="active">
        <i class="bi bi-speedometer2 me-2"></i>
        <span>Dashboard</span>
      </router-link>

      <router-link to="/admin/maintain-qr" class="nav-link d-flex align-items-center" active-class="active">
        <i class="bi bi-bank me-2"></i>
        <span>Maintain Rekening</span>

         
      </router-link>
   <router-link to="/admin/master-account" class="nav-link d-flex align-items-center" active-class="active">
              <i class="bi bi-folder me-2"></i>
              <span>Maintain PGA</span>
            </router-link>
      <router-link to="/admin/reports" class="nav-link d-flex align-items-center" active-class="active">
        <i class="bi bi-graph-up me-2"></i>
        <span>Laporan</span>
      </router-link>

      <router-link to="/admin/settings" class="nav-link d-flex align-items-center" active-class="active">
        <i class="bi bi-gear me-2"></i>
        <span>Pengaturan</span>
      </router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'AdminSidebar'
}
</script>
