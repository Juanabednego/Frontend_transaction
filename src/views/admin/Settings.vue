<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">Pengaturan Sistem</h4>
    </div>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h6 class="fw-bold mb-3">
              <i class="bi bi-gear-fill text-primary me-2"></i>Pengaturan Umum
            </h6>
            
            <div class="mb-3">
              <label class="form-label small">Nama Aplikasi</label>
              <input type="text" class="form-control" value="Sistem Transaksi" />
            </div>
            
            <div class="mb-3">
              <label class="form-label small">Email Admin</label>
              <input type="email" class="form-control" value="admin@transaksi.com" />
            </div>
            
            <div class="mb-3">
              <label class="form-label small">Zona Waktu</label>
              <select class="form-select">
                <option>Asia/Jakarta (WIB)</option>
                <option>Asia/Makassar (WITA)</option>
                <option>Asia/Jayapura (WIT)</option>
              </select>
            </div>
            
            <button class="btn btn-primary">
              <i class="bi bi-save me-2"></i>Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h6 class="fw-bold mb-3">
              <i class="bi bi-credit-card text-success me-2"></i>Pengaturan Pembayaran
            </h6>
            
            <div class="mb-3">
              <label class="form-label small">Batas Waktu Pembayaran</label>
              <div class="input-group">
                <input type="number" class="form-control" value="180" />
                <span class="input-group-text">detik</span>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label small">Minimal Transaksi</label>
              <div class="input-group">
                <span class="input-group-text">Rp</span>
                <input type="number" class="form-control" value="10000" />
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label small">Limit Transaksi</label>
              <div class="input-group">
                <span class="input-group-text">Rp</span>
                <input type="number" class="form-control" value="10000000" />
              </div>
            </div>
            
            <button class="btn btn-success">
              <i class="bi bi-save me-2"></i>Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h6 class="fw-bold mb-3">
              <i class="bi bi-bell text-warning me-2"></i>Notifikasi
            </h6>
            
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="emailNotif" checked />
              <label class="form-check-label" for="emailNotif">
                Email notifikasi transaksi
              </label>
            </div>
            
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="smsNotif" />
              <label class="form-check-label" for="smsNotif">
                SMS notifikasi transaksi
              </label>
            </div>
            
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="pushNotif" checked />
              <label class="form-check-label" for="pushNotif">
                Push notification
              </label>
            </div>
            
            <button class="btn btn-warning">
              <i class="bi bi-save me-2"></i>Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h6 class="fw-bold mb-3">
              <i class="bi bi-shield-lock text-danger me-2"></i>Keamanan
            </h6>
            
            <div class="mb-3">
              <label class="form-label small">Ubah Password Admin</label>
              <input type="password" class="form-control" placeholder="Password baru" />
            </div>
            
            <div class="mb-3">
              <label class="form-label small">Konfirmasi Password</label>
              <input type="password" class="form-control" placeholder="Konfirmasi password" />
            </div>
            
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="twoFactor" />
              <label class="form-check-label" for="twoFactor">
                Aktifkan Two-Factor Authentication
              </label>
            </div>
            
            <button class="btn btn-danger">
              <i class="bi bi-save me-2"></i>Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0 mt-4">
      <div class="card-body">
        <h6 class="fw-bold mb-3">
          <i class="bi bi-database text-info me-2"></i>Database & Backup
        </h6>
        
        <div class="row g-3">
          <div class="col-md-4">
            <p class="text-muted small mb-1">Backup Terakhir</p>
            <p class="fw-bold mb-0">2024-01-20 00:00:00</p>
          </div>
          <div class="col-md-4">
            <p class="text-muted small mb-1">Ukuran Database</p>
            <p class="fw-bold mb-0">245 MB</p>
          </div>
          <div class="col-md-4">
            <button class="btn btn-info">
              <i class="bi bi-cloud-arrow-down me-2"></i>Backup Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminSettings'
}
</script>

<style scoped>
.card {
  border-radius: 8px;
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-2px);
}
</style>
