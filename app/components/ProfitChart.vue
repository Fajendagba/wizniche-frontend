<template>
  <div class="w-full h-64">
    <Bar
      v-if="chartData && hasValidData"
      :data="chartData"
      :options="chartOptions"
    />

    <div v-else class="flex items-center justify-center h-full text-gray-500">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="mt-2">No data available for chart</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import type { Job } from '~/types'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface Props {
  jobs: Job[]
}

const props = defineProps<Props>()

const hasValidData = computed(() => {
  return props.jobs && Array.isArray(props.jobs) && props.jobs.length > 0
})

const chartData = computed(() => {
  if (!hasValidData.value) return null

  const jobTypes = props.jobs.map((j: Job) => j.job_type)
  const margins = props.jobs.map((j: Job) => j.profit_margin)

  const backgroundColors = margins.map(margin => {
    if (margin >= 50) return 'rgba(5, 150, 105, 0.8)'
    if (margin >= 30) return 'rgba(251, 191, 36, 0.8)'
    return 'rgba(239, 68, 68, 0.8)'
  })

  const borderColors = backgroundColors.map(c => c.replace('0.8', '1'))

  return {
    labels: jobTypes,
    datasets: [
      {
        label: 'Profit Margin (%)',
        data: margins,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: any) => `Profit Margin: ${context.parsed.y}%`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Profit Margin (%)',
        font: { size: 12 }
      }
    },
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        font: { size: 11 }
      }
    }
  }
}
</script>
