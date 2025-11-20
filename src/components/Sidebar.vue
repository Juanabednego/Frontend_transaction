<template>
  <aside class="app-sidebar bg-white shadow-sm">
    <div class="sidebar-brand d-flex align-items-center px-3 py-3">
      <div class="me-2 brand-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width:36px;height:36px">
        <i class="bi bi-wallet2"></i>
      </div>
      <div class="brand-text ms-2">Transaksi</div>
    </div>

    <nav class="nav flex-column px-2 pb-3">
      <router-link to="/" class="nav-link d-flex align-items-center" active-class="active">
        <i class="bi bi-house-door me-2"></i>
        <span>Home</span>
      </router-link>

      <router-link to="/history" class="nav-link d-flex align-items-center" active-class="active">
        <i class="bi bi-clock-history me-2"></i>
        <span>History</span>
      </router-link>

      <router-link to="/maintain-qr" class="nav-link d-flex align-items-center" active-class="active">
        <i class="bi bi-qr-code me-2"></i>
        <span>Maintain QR</span>
      </router-link>
      <router-link to="/admin" class="nav-link d-flex align-items-center" active-class="active">
        <i class="bi bi-shield-lock me-2"></i>
        <span>Admin</span>
      </router-link>
    </nav>
  </aside>
</template>
