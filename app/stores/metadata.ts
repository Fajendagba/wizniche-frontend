import { defineStore } from 'pinia'
import type { JobMetadata } from '~/types'

interface MetadataState {
  statuses: string[]
  jobTypes: string[]
  isLoaded: boolean
}

export const useMetadataStore = defineStore('metadata', {
  state: (): MetadataState => ({
    statuses: [],
    jobTypes: [],
    isLoaded: false
  }),

  actions: {
    async fetchMetadata() {
      if (this.isLoaded) return

      try {
        const { fetchMetadata } = useJobs()
        const data = await fetchMetadata()

        if (data) {
          this.statuses = data.statuses
          this.jobTypes = data.job_types
          this.isLoaded = true
        }
      } catch (err) {
        console.error('Failed to load metadata', err)
      }
    },

    async forceRefresh() {
      this.isLoaded = false
      await this.fetchMetadata()
    }
  }
})
