<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <NuxtLink
        to="/"
        class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Back to Dashboard
      </NuxtLink>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="mt-4 text-gray-600">Loading job details...</p>
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

      <div v-else-if="job" class="space-y-6">
        <div class="card">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ job.job_type }}</h1>
              <p class="text-gray-600 mt-1">{{ job.client_name }}</p>
            </div>
            <span
              :class="getStatusClass(job.status)"
              class="px-3 py-1 rounded-full text-xs font-medium"
            >
              {{ formatStatus(job.status) }}
            </span>
          </div>
        </div>

        <div class="card bg-primary/5 border-primary/20">
          <h2 class="text-lg font-semibold mb-4">Profit Analysis</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p class="text-sm text-gray-600 mb-1">Invoice Amount</p>
              <p class="text-2xl font-bold text-gray-900">${{ formatCurrency(job.invoice_amount) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Gross Profit</p>
              <p class="text-2xl font-bold text-primary">${{ formatCurrency(job.gross_profit) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-1">Profit Margin</p>
              <p
                :class="getMarginClass(job.profit_margin)"
                class="text-2xl font-bold"
              >
                {{ job.profit_margin }}%
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-semibold mb-4">Cost Breakdown</h2>

          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Labor</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Hours Worked:</span>
                <span class="font-medium">{{ job.labor_hours }} hrs</span>
              </div>
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-600">Hourly Rate:</span>
                <span class="font-medium">${{ formatCurrency(job.labor_rate) }}/hr</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200">
                <span class="font-medium">Total Labor Cost:</span>
                <span class="font-bold text-red-600">-${{ formatCurrency(job.labor_cost) }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Materials</h3>
            <div class="space-y-2">
              <div
                v-for="material in job.materials"
                :key="material.id"
                class="flex justify-between bg-gray-50 p-3 rounded-lg text-sm"
              >
                <span class="text-gray-700">{{ material.name }}</span>
                <span class="font-medium text-red-600">-${{ formatCurrency(material.cost) }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200">
                <span class="font-medium">Total Materials Cost:</span>
                <span class="font-bold text-red-600">-${{ formatCurrency(job.material_cost) }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t-2 border-gray-200">
            <div class="flex justify-between text-lg font-bold">
              <span>Total Job Cost:</span>
              <span class="text-red-600">${{ formatCurrency(job.total_cost) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-600">Job not found</p>
        <NuxtLink to="/" class="text-primary hover:text-primary/80 mt-4 inline-block">
          Return to dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Job } from '~/types'

const route = useRoute()
const { fetchJob } = useJobs()
const { formatCurrency, formatStatus, getStatusClass, getMarginClass } = useFormatters()

const job = ref<Job | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  error.value = null

  try {
    const id = route.params.id as string
    job.value = await fetchJob(id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load job'
  } finally {
    loading.value = false
  }
})
</script>
