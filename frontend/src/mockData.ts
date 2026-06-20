/**
 * 空数据占位文件。
 *
 * 早期开发时这里曾用于离线预览；现在真实业务数据全部来自 Laravel 后端。
 * 保留空数组和空 dashboard，只是为了类型安全和初始渲染，不再伪造业务数据。
 */
import type { AnalysisJob, DashboardData, ExceptionRecord, InspectionTask, Sample, SampleResult } from './types'

export const mockTasks: InspectionTask[] = []
export const mockSamples: Sample[] = []
export const mockResults: SampleResult[] = []
export const mockExceptions: ExceptionRecord[] = []
export const mockAnalysisJobs: AnalysisJob[] = []

export const mockDashboard: DashboardData = {
  business_chain: ['巡检任务', '样本登记', '检测结果', '异常处理', '分析建议', '首页统计'],
  statistics: {
    tasks_total: 0,
    tasks_in_progress: 0,
    samples_total: 0,
    results_total: 0,
    open_exceptions: 0,
    analysis_total: 0,
  },
  recent_tasks: [],
  abnormal_results: [],
  recent_exceptions: [],
  recent_analyses: [],
}
