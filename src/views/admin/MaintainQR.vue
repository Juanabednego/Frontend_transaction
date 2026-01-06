<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">Maintain Rekening</h1>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="card shadow mb-4 p-4">
      <div class="maintain-toolbar mb-3 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
          <input v-model="search" class="form-control form-control-sm" placeholder="Cari metode atau Bank..." />
          <button class="btn btn-sm btn-outline-secondary" @click="resetFilters">Reset</button>
        </div>
        <div>
          <button class="btn btn-sm btn-primary me-2" @click="saveChanges" :disabled="loading">Simpan Perubahan</button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-4">Memuat data...</div>
      <div v-else>
        <div class="table-responsive">
        <table class="table table-bordered table-hover align-middle">
          <thead>
            <tr>
              <th>Tipe</th>
              <th>Kode</th>
              <th>No. Rekening / VA</th>
              <th>Bank</th>
                          <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredData" :key="index">
              <td>
                <span v-if="item.type === 'QRIS'" class="badge bg-success">QRIS</span>
                <span v-else class="badge bg-info">VA</span>
              </td>
              <td class="fw-semibold">{{ item.code }}</td>
              <td>
                <select v-model="item.rekening" class="form-select form-select-sm">
                  <option value="">-- Pilih Rekening --</option>
                  <option v-for="acc in getAccountsByBank(item.bank)" :key="acc.number" :value="acc.number">
                    {{ acc.number }} — {{ acc.name || acc.bank }}
                  </option>
                </select>
              </td>
              <td>{{ item.bank }}</td>
                          <td>
                            <div class="form-check form-switch">
                              <input 
                                class="form-check-input" 
                                type="checkbox" 
                                v-model="item.status" 
                                :id="'status-' + index"
                                @change="toggleStatus(item)"
                              />
                              <label class="form-check-label" :for="'status-' + index">
                                <span v-if="item.status" class="badge bg-success">Aktif</span>
                                <span v-else class="badge bg-secondary">Nonaktif</span>
                              </label>
                            </div>
                          </td>
            </tr>
            <tr v-if="data.length === 0 && !loading">
              <td colspan="5" class="text-center">Belum ada data</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>

    <div v-if="toastVisible" class="toast-notice shadow rounded p-2">{{ toastMessage }}</div>
  </div>
</template>

<script>
export default {
  name: 'AdminMaintainQR',
  data() {
    return {
      data: [],
      accounts: [],
      loading: true,
      error: '',
      search: '',
      toastVisible: false,
      toastMessage: ''
    }
  },
  async mounted() {
    try {
      const resQR = await fetch('/data/maintain-qr.json')
      if (!resQR.ok) throw new Error(`QR fetch failed: ${resQR.status}`)
      this.data = (await resQR.json()).map(item => ({
        ...item,
        status: item.status !== undefined ? item.status : true
      }))

      const resAcc = await fetch('/data/accounts.json')
      if (!resAcc.ok) throw new Error(`Accounts fetch failed: ${resAcc.status}`)
      this.accounts = await resAcc.json()
      
      const saved = localStorage.getItem('maintainQRData')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const map = {}
          parsed.forEach(p => { if (p.code) map[p.code] = p })
          this.data = this.data.map(item => ({
            ...item,
            ...(map[item.code] || {}),
            status: (map[item.code] && map[item.code].status !== undefined) ? map[item.code].status : item.status
          }))
        } catch (e) {
          console.warn('Saved maintain data invalid', e)
        }
      }
    } catch (e) {
      console.error(e)
      this.error = 'Gagal memuat data: ' + e.message
    } finally {
      this.loading = false
    }
  },
  computed: {
    filteredData() {
      if (!this.search) return this.data
      const q = this.search.toLowerCase()
      return this.data.filter(d => 
        (d.type && d.type.toLowerCase().includes(q)) || 
        (d.code && d.code.toLowerCase().includes(q)) || 
        (d.bank && d.bank.toLowerCase().includes(q))
      )
    }
  },
  methods: {
    getAccountsByBank(bank) {
      // Untuk QRIS, tampilkan semua akun
      if (bank === 'QRIS') {
        return this.accounts
      }
      // Untuk VA, filter berdasarkan bank yang sesuai
      return this.accounts.filter(acc => acc.bank === bank)
    },
    resetFilters() {
      this.search = ''
    },
    toggleStatus(item) {
      this.showToast(`${item.code} status: ${item.status ? 'Aktif' : 'Nonaktif'}`)
    },
    saveChanges() {
      try {
        localStorage.setItem('maintainQRData', JSON.stringify(this.data))
        this.showToast('Perubahan disimpan ke browser (localStorage).')
      } catch (e) {
        console.error(e)
        this.showToast('Gagal menyimpan: ' + e.message)
      }
    },
    showToast(msg, ms = 2500) {
      this.toastMessage = msg
      this.toastVisible = true
      setTimeout(() => { this.toastVisible = false }, ms)
    }
  }
}
</script>
