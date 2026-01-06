<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">Laporan Transaksi</h4>
    </div>

    <div class="row g-4">
      <div class="col-md-3">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Total Transaksi</p>
                <h5 class="fw-bold mb-0">{{ stats.totalTransactions }}</h5>
              </div>
              <i class="bi bi-receipt-cutoff fs-3 text-primary"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Sukses</p>
                <h5 class="fw-bold mb-0 text-success">{{ stats.successTransactions }}</h5>
              </div>
              <i class="bi bi-check-circle fs-3 text-success"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Pending</p>
                <h5 class="fw-bold mb-0 text-warning">{{ stats.pendingTransactions }}</h5>
              </div>
              <i class="bi bi-clock-history fs-3 text-warning"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <p class="text-muted small mb-1">Gagal</p>
                <h5 class="fw-bold mb-0 text-danger">{{ stats.failedTransactions }}</h5>
              </div>
              <i class="bi bi-x-circle fs-3 text-danger"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0 mt-4">
      <div class="card-body">
        <h6 class="fw-bold mb-3">Filter Laporan</h6>
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label small">Tanggal Mulai</label>
            <input v-model="filters.start_date" type="date" class="form-control" />
          </div>
          <div class="col-md-3">
            <label class="form-label small">Tanggal Akhir</label>
            <input v-model="filters.end_date" type="date" class="form-control" />
          </div>
          <div class="col-md-3">
            <label class="form-label small">Metode Pembayaran</label>
            <select v-model="filters.payment_method" class="form-select">
              <option value="">Semua</option>
              <option value="qris">QRIS</option>
              <option value="bri_va">VA BRI</option>
              <option value="mandiri_va">VA Mandiri</option>
              <option value="bni_va">VA BNI</option>
              <option value="bca_va">VA BCA</option>
              <option value="gopay">GoPay</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label small">Status</label>
            <select v-model="filters.status" class="form-select">
              <option value="">Semua Status</option>
              <option value="SUCCESS">Sukses</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Gagal</option>
            </select>
          </div>
        </div>
        <div class="row g-3 mt-2">
          <div class="col-md-12">
            <button @click="applyFilters" class="btn btn-primary">
              <i class="bi bi-funnel me-2"></i>Terapkan Filter
            </button>
            <button @click="filters = { start_date: '', end_date: '', payment_method: '', status: '' }; loadTransactions()" class="btn btn-outline-secondary ms-2">
              <i class="bi bi-arrow-clockwise me-2"></i>Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0 mt-4">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-bold mb-0">Transaksi Terbaru ({{ totalRecords }} data)</h6>
          <div class="btn-group">
            <button @click="exportCSV" class="btn btn-sm btn-outline-success">
              <i class="bi bi-file-earmark-spreadsheet me-1"></i>CSV
            </button>
            <button @click="exportPDF" class="btn btn-sm btn-outline-danger">
              <i class="bi bi-file-earmark-pdf me-1"></i>PDF
            </button>
          </div>
        </div>
        
        <div v-if="loading" class="text-center py-4">Memuat data transaksi...</div>
        <div v-else-if="error" class="alert alert-warning">{{ error }}</div>
        <div v-else class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th class="small">Order ID</th>
                <th class="small">Customer</th>
                <th class="small">Tanggal</th>
                <th class="small">Metode</th>
                <th class="small">Nominal</th>
                <th class="small">Status</th>
                <th class="small">Gateway</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trx in transactions" :key="trx.id">
                <td><code class="small">{{ trx.id }}</code></td>
                <td class="small">
                  <div v-if="trx.user_info">
                    <strong>{{ trx.user_info.full_name }}</strong><br>
                    <small class="text-muted">{{ trx.user_info.email }}</small><br>
                    <small class="text-muted">{{ trx.user_info.phone }}</small>
                  </div>
                  <span v-else class="text-muted">Guest User</span>
                </td>
                <td class="small">{{ trx.date }}</td>
                <td class="small">{{ trx.method }}</td>
                <td class="small">Rp {{ formatAmount(trx.amount) }}</td>
                <td>
                  <span v-if="trx.status === 'SUCCESS'" class="badge bg-success">Sukses</span>
                  <span v-else-if="trx.status === 'PENDING'" class="badge bg-warning">Pending</span>
                  <span v-else-if="trx.status === 'FAILED'" class="badge bg-danger">Gagal</span>
                  <span v-else class="badge bg-secondary">{{ trx.status }}</span>
                </td>
                <td class="small">{{ trx.pg_merchant_id }}</td>
              </tr>
              <tr v-if="transactions.length === 0">
                <td colspan="7" class="text-center text-muted">Tidak ada data transaksi</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-3">
          <div class="text-muted small">
            Menampilkan {{ ((currentPage - 1) * pageSize) + 1 }} - {{ Math.min(currentPage * pageSize, totalRecords) }} dari {{ totalRecords }} data
          </div>
          <nav>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                <button class="page-link" @click="changePage(page)">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { fetchAdminTransactions, fetchFinancialReport, fetchDashboardStats } from '../../services/paymentService'

export default {
  name: 'AdminReports',
  setup() {
    const transactions = ref([])
    const loading = ref(true)
    const error = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalRecords = ref(0)
    const totalPages = ref(0)
    const stats = ref({
      totalTransactions: 0,
      successTransactions: 0,
      pendingTransactions: 0,
      failedTransactions: 0
    })
    const filters = ref({
      start_date: '',
      end_date: '',
      payment_method: '',
      status: ''
    })
    const financialReport = ref([])

    const loadTransactions = async () => {
      loading.value = true
      error.value = ''
      
      try {
        // Build filter object with pagination
        const filterParams = {
          page: currentPage.value,
          limit: pageSize.value
        }
        if (filters.value.start_date) filterParams.start_date = filters.value.start_date
        if (filters.value.end_date) filterParams.end_date = filters.value.end_date
        if (filters.value.payment_method) filterParams.payment_method = filters.value.payment_method
        if (filters.value.status) filterParams.status = filters.value.status
        
        const response = await fetchAdminTransactions(filterParams)
        const data = response.data || response
        
        transactions.value = (Array.isArray(data) ? data : []).map(trx => ({
          id: trx.order_id,
          date: new Date(trx.createdAt).toLocaleString('id-ID'),
          method: getPaymentMethodName(trx.payment_method),
          amount: parseFloat(trx.amount.$numberDecimal || trx.amount),
          status: trx.status,
          pg_merchant_id: trx.pg_merchant_id,
          user_info: trx.user_info
        }))
        
        // Update pagination info
        totalRecords.value = response.total || transactions.value.length
        totalPages.value = Math.ceil(totalRecords.value / pageSize.value)
        
        // Load dashboard stats for summary
        const dashboardStats = await fetchDashboardStats()
        stats.value = {
          totalTransactions: dashboardStats.todayTransactions || 0,
          successTransactions: dashboardStats.successTransactions || 0,
          pendingTransactions: dashboardStats.pendingTransactions || 0,
          failedTransactions: dashboardStats.failedTransactions || 0
        }
        
      } catch (err) {
        console.error('Failed to load transactions:', err)
        error.value = 'Gagal memuat data transaksi'
        
        // Use mock data as fallback
        stats.value = {
          totalTransactions: 3,
          successTransactions: 2,
          pendingTransactions: 1,
          failedTransactions: 0
        }
        transactions.value = [
          { id: 'TRX001', date: '2024-01-20 14:30', method: 'QRIS', amount: 150000, status: 'SUCCESS' },
          { id: 'TRX002', date: '2024-01-20 14:15', method: 'VA BRI', amount: 250000, status: 'PENDING' },
          { id: 'TRX003', date: '2024-01-20 13:45', method: 'VA Mandiri', amount: 100000, status: 'SUCCESS' }
        ]
      } finally {
        loading.value = false
      }
    }

    const loadFinancialReport = async () => {
      try {
        const filterParams = {}
        if (filters.value.start_date) filterParams.start_date = filters.value.start_date
        if (filters.value.end_date) filterParams.end_date = filters.value.end_date
        
        const data = await fetchFinancialReport(filterParams)
        financialReport.value = data
      } catch (err) {
        console.error('Failed to load financial report:', err)
      }
    }

    const getPaymentMethodName = (method) => {
      const methodNames = {
        'qris': 'QRIS',
        'bca_va': 'VA BCA',
        'bni_va': 'VA BNI',
        'bri_va': 'VA BRI',
        'mandiri_va': 'VA Mandiri',
        'gopay': 'GoPay',
        'shopeepay': 'ShopeePay'
      }
      return methodNames[method] || method
    }

    const applyFilters = () => {
      currentPage.value = 1 // Reset to first page when applying filters
      loadTransactions()
      loadFinancialReport()
    }

    const exportCSV = () => {
      const headers = ['Order ID', 'Customer', 'Email', 'Phone', 'Tanggal', 'Metode Pembayaran', 'Nominal (Rp)', 'Status', 'Gateway ID']
      const csvContent = [
        '"' + headers.join('","') + '"',
        ...transactions.value.map(trx => [
          `"${trx.id}"`,
          `"${trx.user_info?.full_name || 'Guest User'}"`,
          `"${trx.user_info?.email || '-'}"`,
          `"${trx.user_info?.phone || '-'}"`,
          `"${trx.date}"`,
          `"${trx.method}"`,
          `"${formatAmount(trx.amount)}"`,
          `"${trx.status}"`,
          `"${trx.pg_merchant_id}"`
        ].join(','))
      ].join('\n')
      
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Laporan_Transaksi_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    }

    const exportPDF = () => {
      const printWindow = window.open('', '_blank')
      const currentDate = new Date().toLocaleDateString('id-ID')
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Laporan Transaksi</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; color: #333; }
            .report-title { font-size: 18px; margin: 10px 0; }
            .report-date { color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .status-success { color: #28a745; font-weight: bold; }
            .status-pending { color: #ffc107; font-weight: bold; }
            .status-failed { color: #dc3545; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            .summary { margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">SISTEM PAYMENT GATEWAY</div>
            <div class="report-title">Laporan Transaksi</div>
            <div class="report-date">Tanggal: ${currentDate}</div>
          </div>
          
          <div class="summary">
            <h4>Ringkasan:</h4>
            <p>Total Transaksi: ${stats.value.totalTransactions} | 
               Sukses: ${stats.value.successTransactions} | 
               Pending: ${stats.value.pendingTransactions} | 
               Gagal: ${stats.value.failedTransactions}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Tanggal</th>
                <th>Metode Pembayaran</th>
                <th>Nominal</th>
                <th>Status</th>
                <th>Gateway</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.value.map(trx => `
                <tr>
                  <td>${trx.id}</td>
                  <td>${trx.user_info ? `${trx.user_info.full_name}<br><small>${trx.user_info.email}</small>` : 'Guest User'}</td>
                  <td>${trx.date}</td>
                  <td>${trx.method}</td>
                  <td>Rp ${formatAmount(trx.amount)}</td>
                  <td class="status-${trx.status.toLowerCase()}">${trx.status}</td>
                  <td>${trx.pg_merchant_id}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Laporan digenerate pada ${new Date().toLocaleString('id-ID')}</p>
            <p>Sistem Payment Gateway - Admin Dashboard</p>
          </div>
        </body>
        </html>
      `
      
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        loadTransactions()
      }
    }

    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 2)
      const end = Math.min(totalPages.value, currentPage.value + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('id-ID').format(amount)
    }

    onMounted(() => {
      loadTransactions()
      loadFinancialReport()
    })

    return {
      transactions,
      loading,
      error,
      stats,
      filters,
      financialReport,
      applyFilters,
      exportCSV,
      exportPDF,
      formatAmount,
      currentPage,
      pageSize,
      totalRecords,
      totalPages,
      changePage,
      visiblePages
    }
  }
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
