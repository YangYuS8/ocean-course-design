import type { DashboardData, ExceptionRecord, InspectionTask, Sample, SampleResult } from '../types'

export interface DashboardStats {
  tasks: number
  samples: number
  results: number
  pending: number
  analysis: number
}

export function getDashboardStats(
  dashboard: DashboardData,
  tasks: InspectionTask[],
  samples: Sample[],
  results: SampleResult[],
  exceptions: ExceptionRecord[],
): DashboardStats {
  return {
    tasks: dashboard.stats?.tasks ?? tasks.length,
    samples: dashboard.stats?.samples ?? samples.length,
    results: dashboard.stats?.results ?? results.length,
    pending: dashboard.stats?.pending_exceptions ?? exceptions.filter((item) => item.status !== 'resolved').length,
    analysis: dashboard.stats?.analysis_jobs ?? 0,
  }
}

export function getAbnormalResults(dashboard: DashboardData, results: SampleResult[]) {
  return dashboard.abnormal_results ?? results.filter((item) => Boolean(item.is_abnormal))
}

export function getRecentExceptions(dashboard: DashboardData, exceptions: ExceptionRecord[]) {
  return dashboard.exceptions ?? exceptions
}
