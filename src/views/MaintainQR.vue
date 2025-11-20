<template>
  <div>
    <h1 class="h3 mb-4 text-gray-800">Maintain No. Rekening per QR</h1>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="card shadow mb-4 p-4">
      <div class="maintain-toolbar mb-3 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
          <input v-model="search" class="form-control form-control-sm" placeholder="Cari QR atau Bank..." />
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
              <th>QR Code</th>
              <th>No. Rekening</th>
              <th>Bank</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredData" :key="index">
              <td class="fw-semibold">{{ item.qr }}</td>
              <td>
                <select v-model="item.rekening" class="form-select form-select-sm">
                  <option v-if="accounts.length === 0" disabled>Tidak ada akun</option>
                  <option v-for="acc in accounts" :key="acc.number" :value="acc.number">
                    {{ acc.number }} — {{ acc.name || acc.bank || '' }}
                  </option>
                </select>
              </td>
              <td>{{ item.bank }}</td>
            </tr>
            <tr v-if="data.length === 0 && !loading">
              <td colspan="3" class="text-center">Belum ada data</td>
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
      this.data = await resQR.json()

      const resAcc = await fetch('/data/accounts.json')
      if (!resAcc.ok) throw new Error(`Accounts fetch failed: ${resAcc.status}`)
      this.accounts = await resAcc.json()
      // Load persisted data from localStorage if present (merge by qr)
      const saved = localStorage.getItem('maintainQRData')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Merge saved mapping by QR; keep order from fetched data
          const map = {}
          parsed.forEach(p => { if (p.qr) map[p.qr] = p })
          this.data = this.data.map(item => ({ ...item, ...(map[item.qr] || {}) }))
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
  }
  ,
  computed: {
    filteredData() {
      if (!this.search) return this.data
      const q = this.search.toLowerCase()
      return this.data.filter(d => (d.qr && d.qr.toLowerCase().includes(q)) || (d.bank && d.bank.toLowerCase().includes(q)))
    }
  },
  methods: {
    resetFilters() {
      this.search = ''
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
    exportCSV() {
      const rows = [ ['qr','rekening','bank'] ]
      this.data.forEach(r => rows.push([r.qr || '', r.rekening || '', r.bank || '']))
      const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'maintain-qr-export.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      this.showToast('CSV diekspor.')
    },
    showToast(msg, ms = 2500) {
      this.toastMessage = msg
      this.toastVisible = true
      setTimeout(() => { this.toastVisible = false }, ms)
    }
  }
}
</script>
