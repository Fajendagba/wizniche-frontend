import type { Job, JobStats, JobMetadata, ApiResponse, PaginatedApiResponse } from '~/types'

export interface JobsQueryParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  job_type?: string
}

export interface JobsResponse {
  jobs: Job[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    from: number
    to: number
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

export const useJobs = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const fetchJobs = async (params?: JobsQueryParams): Promise<JobsResponse> => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.per_page) query.append('per_page', params.per_page.toString())
    if (params?.search) query.append('search', params.search)
    if (params?.status) query.append('status', params.status)
    if (params?.job_type) query.append('job_type', params.job_type)

    const queryString = query.toString()
    const url = `${apiBase}/jobs${queryString ? `?${queryString}` : ''}`

    const response = await $fetch<PaginatedApiResponse<Job[]>>(url)

    return {
      jobs: response.data,
      meta: response.meta,
      links: response.links
    }
  }

  const fetchJob = async (id: string): Promise<Job | null> => {
    const response = await $fetch<ApiResponse<Job>>(`${apiBase}/jobs/${id}`)
    return response.data
  }

  const fetchStats = async (): Promise<JobStats | null> => {
    const response = await $fetch<ApiResponse<JobStats>>(`${apiBase}/jobs/stats/summary`)
    return response.data
  }

  const fetchMetadata = async (): Promise<JobMetadata | null> => {
    const response = await $fetch<ApiResponse<JobMetadata>>(`${apiBase}/jobs/metadata`)
    return response.data
  }

  return {
    fetchJobs,
    fetchJob,
    fetchStats,
    fetchMetadata
  }
}
