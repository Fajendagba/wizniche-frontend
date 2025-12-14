<template>
  <NuxtLink
    :to="`/jobs/${job.id}`"
    class="card hover:shadow-md transition-shadow cursor-pointer"
  >
    <!-- Header: Job type and status -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ job.job_type }}</h3>
        <p class="text-sm text-gray-600">{{ job.client_name }}</p>
      </div>
      <span
        :class="getStatusClass(job.status)"
        class="px-3 py-1 rounded-full text-xs font-medium"
      >
        {{ formatStatus(job.status) }}
      </span>
    </div>

    <!-- Financial metrics -->
    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Invoice Amount:</span>
        <span class="font-semibold">${{ formatCurrency(job.invoice_amount) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Gross Profit:</span>
        <span class="font-semibold text-primary">${{ formatCurrency(job.gross_profit) }}</span>
      </div>
    </div>

    <!-- Profit margin (hero metric) -->
    <div class="mt-4 pt-4 border-t border-gray-100">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Profit Margin:</span>
        <span
          :class="getMarginClass(job.profit_margin)"
          class="text-2xl font-bold"
        >
          {{ job.profit_margin }}%
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
/**
 * JobCard Component
 *
 * Displays a summary card for a single job with profit metrics.
 * Card is clickable and navigates to the job detail page.
 *
 * Props:
 * - job: Job object with profit calculations
 */

import type { Job } from '~/types'

// Props definition with strict typing
interface Props {
  job: Job
}

defineProps<Props>()

// Use formatters composable (Dependency Inversion)
const { formatCurrency, formatStatus, getStatusClass, getMarginClass } = useFormatters()
</script>
