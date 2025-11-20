<template>
  <div class="row mt-4">
    <div class="col-12">
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h5 class="mb-0">History Transaksi</h5>
              <small class="text-muted">Riwayat pembayaran terakhir</small>
            </div>
            <div class="d-flex gap-2">
              <input class="form-control form-control-sm" placeholder="Cari (tanggal, metode, jumlah)" />
              <button class="btn btn-sm btn-outline-secondary">Filter</button>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>Tanggal</th>
                  <th>Metode</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>17 Nov 2025</td>
                  <td>QRIS</td>
                  <td>Rp 125.000</td>
                  <td><span class="badge bg-success">Success</span></td>
                </tr>
                <tr>
                  <td>16 Nov 2025</td>
                  <td>Bank Transfer</td>
                  <td>Rp 200.000</td>
                  <td><span class="badge bg-danger">Failed</span></td>
                </tr>
                <tr>
                  <td>15 Nov 2025</td>
                  <td>QRIS</td>
                  <td>Rp 75.000</td>
                  <td><span class="badge bg-warning text-dark">Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
