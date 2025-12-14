/**
 * TypeScript interfaces for the WIZniche Job Costing Analyzer
 *
 * These types ensure type safety throughout the application
 * and provide excellent IDE autocomplete support.
 */

export interface Material {
  id: string
  name: string
  cost: number
  created_at?: string
  updated_at?: string
}

export type JobStatus = 'completed' | 'in_progress' | 'pending'

export interface Job {
  id: string
  job_type: string
  client_name: string
  invoice_amount: number
  labor_hours: number
  labor_rate: number
  status: JobStatus
  created_at?: string
  updated_at?: string
  labor_cost: number
  material_cost: number
  total_cost: number
  gross_profit: number
  profit_margin: number
  materials: Material[]
}

export interface JobStats {
  total_jobs: number
  total_revenue: number
  total_profit: number
  average_margin: number
}

export interface JobMetadata {
  statuses: string[]
  job_types: string[]
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
}

export interface PaginationLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta
  links: PaginationLinks
}
