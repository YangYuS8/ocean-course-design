/**
 * 首页数据整理工具。
 *
 * 后端 dashboard 接口会返回统计数据；如果某些字段缺失，这里会用列表长度做兜底，
 * 避免页面因为 undefined 报错。
 */
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
    tasks: dashboard.statistics?.tasks_total ?? tasks.length,
    samples: dashboard.statistics?.samples_total ?? samples.length,
    results: dashboard.statistics?.results_total ?? results.length,
    pending: dashboard.statistics?.open_exceptions ?? exceptions.filter((item) => item.status === '待处理').length,
    analysis: dashboard.statistics?.analysis_total ?? 0,
  }
}

export function getAbnormalResults(dashboard: DashboardData, results: SampleResult[]) {
  return dashboard.abnormal_results ?? results.filter((item) => Boolean(item.is_abnormal))
}

export function getRecentExceptions(dashboard: DashboardData, exceptions: ExceptionRecord[]) {
  return dashboard.recent_exceptions ?? exceptions
}

export function getRecentAnalyses(dashboard: DashboardData) {
  return dashboard.recent_analyses ?? []
}
