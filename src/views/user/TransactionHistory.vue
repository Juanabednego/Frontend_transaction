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
              <input v-model="searchQuery" class="form-control form-control-sm" placeholder="Cari (tanggal, metode, jumlah)" />
              <button class="btn btn-sm btn-outline-secondary" @click="searchQuery = ''">Reset</button>
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
                <tr v-for="(transaction, index) in filteredTransactions" :key="index">
                  <td>{{ transaction.date }}</td>
                  <td>{{ transaction.method }}</td>
                  <td>{{ transaction.amount }}</td>
                  <td><span :class="`badge bg-${transaction.statusColor}`">{{ transaction.status }}</span></td>
                </tr>
                <tr v-if="filteredTransactions.length === 0">
                  <td colspan="4" class="text-center text-muted">Tidak ada transaksi ditemukan</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserTransactionHistory',
  data() {
    return {
      searchQuery: '',
      transactions: [
        { date: '20 Nov 2025', method: 'QRIS', amount: 'Rp 125.000', status: 'Success', statusColor: 'success' },
        { date: '19 Nov 2025', method: 'VA BRI', amount: 'Rp 200.000', status: 'Failed', statusColor: 'danger' },
        { date: '18 Nov 2025', method: 'VA Mandiri', amount: 'Rp 75.000', status: 'Pending', statusColor: 'warning' },
        { date: '17 Nov 2025', method: 'VA BNI', amount: 'Rp 150.000', status: 'Success', statusColor: 'success' },
        { date: '16 Nov 2025', method: 'VA BCA', amount: 'Rp 300.000', status: 'Success', statusColor: 'success' }
      ]
    }
  },
  computed: {
    filteredTransactions() {
      if (!this.searchQuery) return this.transactions
      const q = this.searchQuery.toLowerCase()
      return this.transactions.filter(t => 
        t.date.toLowerCase().includes(q) || 
        t.method.toLowerCase().includes(q) || 
        t.amount.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
      )
    }
  }
}
</script>
