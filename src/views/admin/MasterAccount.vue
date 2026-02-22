<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold mb-0">Payment Gateway</h4>
      <button @click="showAddModal = true" class="btn btn-primary">
        <i class="bi bi-plus-circle me-2"></i>Tambah Gateway
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Memuat data payment gateway...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <h6>Terjadi Kesalahan</h6>
      <p>{{ error }}</p>
      <button @click="loadAccounts" class="btn btn-outline-danger btn-sm">Coba Lagi</button>
    </div>

    <!-- Accounts Table -->
    <div v-else class="card shadow-sm border-0">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th class="small">Nama Gateway</th>
                <th class="small">Merchant ID</th>
                <th class="small">Limit Harian</th>
                <th class="small">Terpakai</th>
                <th class="small">Sisa Limit</th>
                <th class="small">Priority</th>
                <th class="small">Status</th>
                <th class="small">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="account in accounts" :key="account._id">
                <td class="fw-semibold">{{ account.name }}</td>
                <td><code class="small">{{ account.pg_merchant_id }}</code></td>
                <td>
  {{ formatCurrency(parseFloat(account?.limit_max?.$numberDecimal ?? account?.limit_max ?? 0)) }}
</td>
<td>
  {{ formatCurrency(parseFloat(account?.limit_used?.$numberDecimal ?? account?.limit_used ?? 0)) }}
</td>
                <td>
                  <span :class="getRemainingLimitClass(account)">
                    {{ formatCurrency(getRemaining(account)) }}
                  </span>
                </td>
                <td>
                  <span class="badge bg-info">{{ account.priority }}</span>
                </td>
                <td>
                  <span v-if="account.is_active" class="badge bg-success">Aktif</span>
                  <span v-else class="badge bg-secondary">Nonaktif</span>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button @click="editAccount(account)" class="btn btn-sm btn-outline-primary" title="Edit">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button @click="toggleAccountStatus(account)" 
                            :class="account.is_active ? 'btn btn-sm btn-outline-warning' : 'btn btn-sm btn-outline-success'" 
                            :title="account.is_active ? 'Nonaktifkan' : 'Aktifkan'">
                      <i :class="account.is_active ? 'bi bi-pause' : 'bi bi-play'"></i>
                    </button>
                    <button @click="viewAccountStats(account)" class="btn btn-sm btn-outline-info" title="Statistik">
                      <i class="bi bi-graph-up"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="accounts.length === 0">
                <td colspan="8" class="text-center text-muted py-4">
                  Belum ada data payment gateway
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ showEditModal ? 'Edit Payment Gateway' : 'Tambah Payment Gateway' }}
            </h5>
            <button @click="closeModal" type="button" class="btn-close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveAccount">
              <div class="mb-3">
                <label class="form-label">Nama Gateway</label>
                <input v-model="formData.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Merchant ID</label>
                <input v-model="formData.pg_merchant_id" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Limit Harian (Rp)</label>
                <input v-model="formData.limit_max" type="number" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Priority (1 = Tertinggi)</label>
                <input v-model="formData.priority" type="number" class="form-control" min="1" required>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input v-model="formData.is_active" class="form-check-input" type="checkbox" id="isActive">
                  <label class="form-check-label" for="isActive">
                    Gateway Aktif
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button @click="closeModal" type="button" class="btn btn-secondary">Batal</button>
            <button @click="saveAccount" type="button" class="btn btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              {{ showEditModal ? 'Update' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Modal -->
    <div v-if="showStatsModal" class="modal show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Statistik {{ selectedAccount?.name }}
            </h5>
            <button @click="showStatsModal = false" type="button" class="btn-close"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="card bg-primary bg-opacity-10">
                  <div class="card-body text-center">
                    <h6 class="text-primary">Total Transaksi Hari Ini</h6>
                    <h4 class="fw-bold">{{ accountStats.todayTransactions || 0 }}</h4>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card bg-success bg-opacity-10">
                  <div class="card-body text-center">
                    <h6 class="text-success">Total Revenue Hari Ini</h6>
                    <h4 class="fw-bold">{{ formatCurrency(accountStats.todayRevenue || 0) }}</h4>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="card">
                  <div class="card-body">
                    <h6>Penggunaan Limit</h6>
                    <div class="progress mb-2" style="height: 20px;">
                      <div class="progress-bar" 
                           :style="{ width: getLimitPercentage(selectedAccount) + '%' }"
                           :class="getLimitProgressClass(selectedAccount)">
                        {{ getLimitPercentage(selectedAccount).toFixed(1) }}%
                      </div>
                    </div>
                    <small class="text-muted">
                      {{ formatCurrency(parseFloat(selectedAccount?.limit_used || 0)) }} / 
                      {{ formatCurrency(parseFloat(selectedAccount?.limit_max || 0)) }}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { fetchAdminAccounts, updateAdminAccount, toggleAccountStatus } from '../../services/paymentService'

export default {
  name: 'AdminMasterAccount',
  setup() {
    const accounts = ref([])
    const loading = ref(true)
    const error = ref('')
    const saving = ref(false)
    
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const showStatsModal = ref(false)
    
    const selectedAccount = ref(null)
    const accountStats = ref({})
    
    const formData = ref({
      name: '',
      pg_merchant_id: '',
      limit_max: 0,
      priority: 1,
      is_active: true
    })

    const loadAccounts = async () => {
      loading.value = true
      error.value = ''
      
      try {
        const data = await fetchAdminAccounts()
        accounts.value = data || []
      } catch (err) {
        console.error('Failed to load accounts:', err)
        error.value = 'Gagal memuat data payment gateway'
      } finally {
        loading.value = false
      }
    }

    const editAccount = (account) => {
      selectedAccount.value = account
      formData.value = {
        name: account.name,
        pg_merchant_id: account.pg_merchant_id,
        limit_max: parseFloat(account.limit_max),
        priority: account.priority,
        is_active: account.is_active
      }
      showEditModal.value = true
    }

    const saveAccount = async () => {
      saving.value = true
      
      try {
        if (showEditModal.value && selectedAccount.value) {
          await updateAdminAccount(selectedAccount.value._id, formData.value)
        }
        
        await loadAccounts()
        closeModal()
      } catch (err) {
        console.error('Failed to save account:', err)
        error.value = 'Gagal menyimpan data payment gateway'
      } finally {
        saving.value = false
      }
    }

    const toggleStatus = async (account) => {
      try {
        await toggleAccountStatus(account._id)
        await loadAccounts()
      } catch (err) {
        console.error('Failed to toggle account status:', err)
        error.value = 'Gagal mengubah status payment gateway'
      }
    }

    const viewAccountStats = (account) => {
      selectedAccount.value = account
      // Mock stats - in real app, fetch from API
      accountStats.value = {
        todayTransactions: Math.floor(Math.random() * 50),
        todayRevenue: Math.floor(Math.random() * 5000000)
      }
      showStatsModal.value = true
    }

    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      selectedAccount.value = null
      formData.value = {
        name: '',
        pg_merchant_id: '',
        limit_max: 0,
        priority: 1,
        is_active: true
      }
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(value)
    }

    const getRemaining = (account) => {
      const max = parseFloat(account.limit_max.$numberDecimal || account.limit_max)
      const used = parseFloat(account.limit_used.$numberDecimal || account.limit_used)
      return max - used
    }

    const getRemainingLimitClass = (account) => {
      const max = parseFloat(account.limit_max.$numberDecimal || account.limit_max)
      const used = parseFloat(account.limit_used.$numberDecimal || account.limit_used)
      const remaining = max - used
      const percentage = (remaining / max) * 100
      
      if (percentage < 20) return 'text-danger fw-bold'
      if (percentage < 50) return 'text-warning fw-bold'
      return 'text-success fw-bold'
    }

    const getLimitPercentage = (account) => {
      if (!account) return 0
      const max = parseFloat(account.limit_max.$numberDecimal || account.limit_max)
      const used = parseFloat(account.limit_used.$numberDecimal || account.limit_used)
      return (used / max) * 100
    }

    const getLimitProgressClass = (account) => {
      const percentage = getLimitPercentage(account)
      if (percentage >= 80) return 'bg-danger'
      if (percentage >= 60) return 'bg-warning'
      return 'bg-success'
    }

    onMounted(() => {
      loadAccounts()
    })

    return {
      accounts,
      loading,
      error,
      saving,
      showAddModal,
      showEditModal,
      showStatsModal,
      selectedAccount,
      accountStats,
      formData,
      loadAccounts,
      editAccount,
      saveAccount,
      toggleAccountStatus: toggleStatus,
      viewAccountStats,
      closeModal,
      formatCurrency,
      getRemaining,
      getRemainingLimitClass,
      getLimitPercentage,
      getLimitProgressClass
    }
  }
}
</script>

<style scoped>
.modal {
  z-index: 1050;
}

.progress {
  background-color: #e9ecef;
}

.btn-group .btn {
  border-radius: 0.375rem;
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

code {
  background-color: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}
</style>