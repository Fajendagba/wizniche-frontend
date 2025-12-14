<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          WIZniche Job Costing Analyzer
        </h1>
        <p class="mt-2 text-gray-600">
          Radon mitigation profit analysis dashboard
        </p>
      </div>

      <div v-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <p class="text-sm text-gray-600 mb-1">Total Jobs</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.total_jobs }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p class="text-2xl font-bold text-gray-900">${{ formatCurrency(stats.total_revenue) }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 mb-1">Total Profit</p>
          <p class="text-2xl font-bold text-primary">${{ formatCurrency(stats.total_profit) }}</p>
        </div>
        <div class="card">
          <p class="text-sm text-gray-600 mb-1">Average Margin</p>
          <p class="text-2xl font-bold text-primary">{{ stats.average_margin }}%</p>
        </div>
      </div>

      <div class="card mb-8">
        <h2 class="text-xl font-semibold mb-4">Profit Margin by Job Type</h2>
        <ProfitChart :jobs="jobs" />
      </div>

      <div>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 class="text-xl font-semibold">Recent Jobs</h2>

          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search jobs..."
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            <select
              v-model="statusFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option v-for="status in metadataStore.statuses" :key="status" :value="status">
                {{ status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }}
              </option>
            </select>

            <select
              v-model="jobTypeFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Job Types</option>
              <option v-for="jobType in metadataStore.jobTypes" :key="jobType" :value="jobType">
                {{ jobType }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="mt-4 text-gray-600">Loading jobs...</p>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <div class="inline-block w-12 h-12 mb-4">
            <svg class="w-full h-full text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-red-600 font-semibold">{{ error }}</p>
          <button @click="location.reload()" class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
            Retry
          </button>
        </div>

        <div v-else-if="jobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <JobCard
            v-for="job in jobs"
            :key="job.id"
            :job="job"
          />
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-600">No jobs found</p>
        </div>

        <div v-if="pagination && pagination.last_page > 1" class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <div class="text-sm text-gray-600">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} jobs
          </div>

          <div class="flex gap-2">
            <button
              @click="goToPage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div class="hidden sm:flex gap-1">
              <template v-for="page in visiblePages" :key="page">
                <span
                  v-if="page === -1"
                  class="px-4 py-2"
                >
                  ...
                </span>
                <button
                  v-else
                  @click="goToPage(page)"
                  :class="[
                    'px-4 py-2 border rounded-lg',
                    page === pagination.current_page
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
              </template>
            </div>

            <div class="sm:hidden text-sm text-gray-600 px-4 py-2">
              Page {{ pagination.current_page }} of {{ pagination.last_page }}
            </div>

            <button
              @click="goToPage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Job, JobStats, PaginationMeta } from '~/types'

const { fetchJobs, fetchStats } = useJobs()
const { formatCurrency } = useFormatters()
const metadataStore = useMetadataStore()

const jobs = ref<Job[]>([])
const stats = ref<JobStats | null>(null)
const pagination = ref<PaginationMeta | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const searchQuery = ref('')
const statusFilter = ref('')
const jobTypeFilter = ref('')
const currentPage = ref(1)

const visiblePages = computed(() => {
  if (!pagination.value) return []

  const total = pagination.value.last_page
  const current = pagination.value.current_page
  const pages: number[] = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push(-1)
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push(-1)
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push(-1)
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push(-1)
      pages.push(total)
    }
  }

  return pages
})

const loadJobs = async () => {
  loading.value = true
  error.value = null

  try {
    const jobsResponse = await fetchJobs({
      page: currentPage.value,
      search: searchQuery.value || undefined,
      status: statusFilter.value || undefined,
      job_type: jobTypeFilter.value || undefined
    })

    jobs.value = jobsResponse.jobs
    pagination.value = jobsResponse.meta
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load jobs'
  } finally {
    loading.value = false
  }
}

const goToPage = (page: number) => {
  if (page < 1 || !pagination.value || page > pagination.value.last_page) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let debounceTimer: NodeJS.Timeout | null = null

watch([searchQuery, statusFilter, jobTypeFilter], () => {
  currentPage.value = 1

  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    loadJobs()
  }, 800)
})

watch(currentPage, () => {
  loadJobs()
})

onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    const [jobsResponse, statsData] = await Promise.all([
      fetchJobs(),
      fetchStats()
    ])

    jobs.value = jobsResponse.jobs
    pagination.value = jobsResponse.meta
    stats.value = statsData
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load data'
  } finally {
    loading.value = false
  }
})
</script>
