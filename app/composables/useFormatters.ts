/**
 * Formatters Composable
 *
 * Centralized formatting utilities for the application.
 *
 * Usage:
 * const { formatCurrency, formatStatus } = useFormatters()
 */

import type { JobStatus } from '~/types'

export const useFormatters = () => {
  /**
   * Format a number as currency with 2 decimal places
   *
   * @param value - Number to format
   * @returns Formatted string (e.g., "1,234.56")
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  /**
   * Format job status for display
   * Converts snake_case to Title Case
   *
   * @param status - Job status
   * @returns Formatted status string (e.g., "In Progress")
   */
  const formatStatus = (status: JobStatus): string => {
    return status
      .replace('_', ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   * Get status badge CSS classes
   *
   * @param status - Job status
   * @returns Tailwind CSS classes for status badge
   */
  const getStatusClass = (status: JobStatus): string => {
    const classes: Record<JobStatus, string> = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-orange-100 text-orange-800',
      pending: 'bg-gray-100 text-gray-800'
    }
    return classes[status] || classes.pending
  }

  /**
   * Get profit margin color class
   *
   * @param margin - Profit margin percentage
   * @returns Tailwind CSS class for margin color
   */
  const getMarginClass = (margin: number): string => {
    if (margin >= 50) return 'text-green-600'
    if (margin >= 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  return {
    formatCurrency,
    formatStatus,
    getStatusClass,
    getMarginClass
  }
}
