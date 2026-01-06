<template>
  <div class="pga-monitor">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-primary text-white">
        <h6 class="mb-0">
          <i class="bi bi-speedometer2 me-2"></i>
          PGA Load Balancing Monitor
        </h6>
      </div>
      <div class="card-body">
        <!-- Real-time Status -->
        <div class="row g-3 mb-4">
          <div v-for="account in accounts" :key="account.pg_merchant_id" class="col-md-6">
            <div class="card border-0" :class="getStatusClass(account.status)">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 class="fw-bold mb-1">{{ account.name }}</h6>
                    <small class="text-muted">{{ account.pg_merchant_id }}</small>
                  </div>
                  <div class="text-end">
                    <div class="h5 mb-0">{{ account.utilization_percent }}%</div>
                    <small>Utilization</small>
                  </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="progress mt-3" style="height: 8px;">
                  <div 
                    class="progress-bar" 
                    :class="getProgressClass(account.status)"
                    :style="{ width: account.utilization_percent + '%' }"
                  ></div>
                </div>
                
                <!-- Limit Info -->
                <div class="row mt-3 text-center">
                  <div class="col-4">
                    <div class="small text-muted">Used</div>
                    <div class="fw-semibold">{{ formatCurrency(account.limit_used) }}</div>
                  </div>
                  <div class="col-4">
                    <div class="small text-muted">Remaining</div>
                    <div class="fw-semibold text-success">{{ formatCurrency(account.remaining_limit) }}</div>
                  </div>
                  <div class="col-4">
                    <div class="small text-muted">Max</div>
                    <div class="fw-semibold">{{ formatCurrency(account.limit_max) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Test PGA Selection -->
        <div class="card bg-light border-0">
          <div class="card-body">
            <h6 class="fw-bold mb-3">
              <i class="bi bi-gear me-2"></i>
              Test PGA Selection
            </h6>
            <div class="row g-3">
              <div class="col-md-8">
                <div class="input-group">
                  <span class="input-group-text">Rp</span>
                  <input 
                    v-model="testAmount" 
                    type="number" 
                    class="form-control" 
                    placeholder="Enter amount to test"
                  >
                  <button @click="testPGASelection" class="btn btn-primary" :disabled="!testAmount || testing">
                    <span v-if="testing" class="spinner-border spinner-border-sm me-2"></span>
                    Test Selection
                  </button>
                </div>
              </div>
              <div class="col-md-4">
                <button @click="loadUtilization" class="btn btn-outline-secondary w-100" :disabled="loading">
                  <i class="bi bi-arrow-clockwise me-2"></i>
                  Refresh
                </button>
              </div>
            </div>
            
            <!-- Test Result -->
            <div v-if="testResult" class="alert mt-3" :class="testResult.success ? 'alert-success' : 'alert-warning'">
              <div class="fw-bold">{{ testResult.success ? '✅' : '⚠️' }} Test Result:</div>
              <div>{{ testResult.message }}</div>
              <div v-if="testResult.data" class="mt-2">
                <small>
                  Selected: <strong>{{ testResult.data.selected_account }}</strong> | 
                  Remaining: <strong>{{ formatCurrency(testResult.data.remaining_limit) }}</strong> |
                  Can Handle: <strong>{{ testResult.data.can_handle ? 'Yes' : 'No' }}</strong>
                </small>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Rebalance Alert -->
        <div v-if="rebalanceNeeded" class="alert alert-warning mt-3">
          <h6><i class="bi bi-exclamation-triangle me-2"></i>Rebalancing Recommended</h6>
          <p class="mb-2">Some PGAs are over-utilized while others are under-utilized.</p>
          <div class="row">
            <div class="col-md-6">
              <strong>Over-utilized (>90%):</strong>
              <ul class="mb-0">
                <li v-for="acc in rebalanceInfo.over_utilized" :key="acc.pg_merchant_id">
                  {{ acc.name }} ({{ acc.utilization_percent }}%)
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <strong>Under-utilized (<50%):</strong>
              <ul class="mb-0">
                <li v-for="acc in rebalanceInfo.under_utilized" :key="acc.pg_merchant_id">
                  {{ acc.name }} ({{ acc.utilization_percent }}%)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'PGAMonitor',
  setup() {
    const accounts = ref([])
    const loading = ref(false)
    const testAmount = ref('')
    const testing = ref(false)
    const testResult = ref(null)
    const rebalanceInfo = ref(null)
    const rebalanceNeeded = ref(false)
    
    let refreshInterval

    const loadUtilization = async () => {
      loading.value = true
      try {
        const response = await fetch('http://localhost:3000/api/admin/pga-utilization')
        const result = await response.json()
        
        if (result.success) {
          accounts.value = result.data
        }
        
        // Check rebalance status
        const rebalanceResponse = await fetch('http://localhost:3000/api/admin/rebalance-check')
        const rebalanceResult = await rebalanceResponse.json()
        
        if (rebalanceResult.success) {
          rebalanceInfo.value = rebalanceResult.data
          rebalanceNeeded.value = rebalanceResult.data.needed
        }
        
      } catch (error) {
        console.error('Failed to load PGA utilization:', error)
      } finally {
        loading.value = false
      }
    }

    const testPGASelection = async () => {
      if (!testAmount.value) return
      
      testing.value = true
      testResult.value = null
      
      try {
        const response = await fetch('http://localhost:3000/api/admin/test-pga-selection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: parseFloat(testAmount.value) })
        })
        
        const result = await response.json()
        testResult.value = result
        
      } catch (error) {
        testResult.value = {
          success: false,
          message: 'Test failed: ' + error.message
        }
      } finally {
        testing.value = false
      }
    }

    const getStatusClass = (status) => {
      switch (status) {
        case 'critical': return 'bg-danger-subtle border-danger'
        case 'warning': return 'bg-warning-subtle border-warning'
        default: return 'bg-success-subtle border-success'
      }
    }

    const getProgressClass = (status) => {
      switch (status) {
        case 'critical': return 'bg-danger'
        case 'warning': return 'bg-warning'
        default: return 'bg-success'
      }
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    }

    onMounted(() => {
      loadUtilization()
      // Auto refresh every 30 seconds
      refreshInterval = setInterval(loadUtilization, 30000)
    })

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    })

    return {
      accounts,
      loading,
      testAmount,
      testing,
      testResult,
      rebalanceInfo,
      rebalanceNeeded,
      loadUtilization,
      testPGASelection,
      getStatusClass,
      getProgressClass,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.pga-monitor .progress {
  border-radius: 10px;
}

.pga-monitor .card {
  transition: transform 0.2s;
}

.pga-monitor .card:hover {
  transform: translateY(-2px);
}
</style>