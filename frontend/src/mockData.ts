import type { AnalysisJob, DashboardData, ExceptionRecord, InspectionTask, Sample, SampleResult } from './types'

export const mockTasks: InspectionTask[] = [
  { id: 1, title: '近岸养殖区水质巡检', area: '东湾 A 区', inspector: '张海宁', status: 'started', planned_date: '2026-06-12' },
  { id: 2, title: '码头排口例行检查', area: '三号码头', inspector: '李珊', status: 'draft', planned_date: '2026-06-14' },
  { id: 3, title: '滨海浴场采样复核', area: '月湾浴场', inspector: '王越', status: 'submitted', planned_date: '2026-06-10' },
]

export const mockSamples: Sample[] = [
  { id: 1, inspection_task_id: 1, code: 'S-202606-001', location: '东湾 A1 点位', water_type: '近岸海水', collected_at: '2026-06-11 09:20' },
  { id: 2, inspection_task_id: 1, code: 'S-202606-002', location: '东湾 A2 点位', water_type: '养殖水体', collected_at: '2026-06-11 10:05' },
  { id: 3, inspection_task_id: 3, code: 'S-202606-003', location: '月湾西侧', water_type: '浴场海水', collected_at: '2026-06-10 15:30' },
]

export const mockResults: SampleResult[] = [
  { id: 1, sample_id: 1, indicator: 'pH', value: 8.1, unit: '', standard_limit: '7.8-8.5', is_abnormal: false, tested_at: '2026-06-11 11:00' },
  { id: 2, sample_id: 2, indicator: '溶解氧', value: 3.2, unit: 'mg/L', standard_limit: 5, is_abnormal: true, tested_at: '2026-06-11 11:30' },
  { id: 3, sample_id: 3, indicator: '浊度', value: 12, unit: 'NTU', standard_limit: 10, is_abnormal: true, tested_at: '2026-06-10 16:20' },
]

export const mockExceptions: ExceptionRecord[] = [
  { id: 1, sample_id: 2, title: '溶解氧低于标准', level: '高', status: 'open', description: '东湾 A2 点位溶解氧偏低，可能影响养殖生物。', suggestion: '建议复采并排查增氧设备。' },
  { id: 2, sample_id: 3, title: '浴场浊度偏高', level: '中', status: 'resolved', description: '雨后短时浊度升高。', suggestion: '已复测恢复正常。', resolved_at: '2026-06-11 08:40' },
]

export const mockAnalysisJobs: AnalysisJob[] = [
  { id: 1, sample_id: 2, status: 'done', conclusion: '存在缺氧风险', suggestion: '加强夜间监测，必要时临时增氧。' },
]

export const mockDashboard: DashboardData = {
  stats: {
    tasks: mockTasks.length,
    samples: mockSamples.length,
    results: mockResults.length,
    exceptions: mockExceptions.length,
    pending_exceptions: mockExceptions.filter((item) => item.status === 'open').length,
    analysis_jobs: mockAnalysisJobs.length,
  },
  recent_tasks: mockTasks,
  abnormal_results: mockResults.filter((item) => Boolean(item.is_abnormal)),
  exceptions: mockExceptions,
}
