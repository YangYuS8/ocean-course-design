/**
 * 前后端数据类型定义。
 *
 * TypeScript interface 用来描述 Laravel API 返回的数据结构。
 * 页面和 api.ts 使用这些类型后，字段写错时 TypeScript 会在构建阶段提醒。
 */
export type TaskStatus = '待开始' | '进行中' | '已提交' | '已完成' | string

export type ExceptionStatus = '待处理' | '已处理' | string

export interface InspectionTask {
  id: number
  title: string
  area: string
  inspector: string
  status: TaskStatus
  planned_date?: string | null
  started_at?: string | null
  submitted_at?: string | null
  samples_count?: number
}

export interface Sample {
  id: number
  inspection_task_id?: number | null
  code: string
  location: string
  collector?: string | null
  water_type?: string | null
  status?: string | null
  notes?: string | null
  collected_at?: string | null
  task?: InspectionTask
}

export interface SampleResult {
  id: number
  sample_id: number
  indicator: string
  value: number | string
  unit?: string | null
  standard_min?: number | string | null
  standard_max?: number | string | null
  is_abnormal?: boolean | number
  tested_at?: string | null
  tester?: string | null
  sample?: Sample
}

export interface ExceptionRecord {
  id: number
  sample_id?: number | null
  title: string
  level: '低' | '中' | '高' | string
  status: ExceptionStatus
  description?: string | null
  resolution?: string | null
  resolved_at?: string | null
  sample?: Sample
}

export interface AnalysisJob {
  id: number
  sample_id: number
  status: string
  summary?: string | null
  suggestion?: string | null
  created_at?: string | null
  sample?: Sample
}

export interface DashboardData {
  business_chain?: string[]
  statistics?: {
    tasks_total?: number
    tasks_in_progress?: number
    samples_total?: number
    results_total?: number
    open_exceptions?: number
    analysis_total?: number
  }
  recent_tasks?: InspectionTask[]
  abnormal_results?: SampleResult[]
  recent_exceptions?: ExceptionRecord[]
  recent_analyses?: AnalysisJob[]
}

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | string
  created_at?: string | null
  updated_at?: string | null
}

export interface AuthResponse {
  token: string
  user: User
}

export interface OptionItem {
  id: number
  label: string
}
