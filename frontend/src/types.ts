export type TaskStatus = 'draft' | 'started' | 'submitted' | 'completed' | string

export type ExceptionStatus = 'open' | 'resolved' | string

export interface InspectionTask {
  id: number
  title: string
  area: string
  inspector: string
  status: TaskStatus
  planned_date?: string | null
  started_at?: string | null
  submitted_at?: string | null
}

export interface Sample {
  id: number
  inspection_task_id?: number | null
  code: string
  location: string
  water_type?: string | null
  collected_at?: string | null
  task?: InspectionTask
}

export interface SampleResult {
  id: number
  sample_id: number
  indicator: string
  value: number | string
  unit: string
  standard_limit?: number | string | null
  is_abnormal?: boolean | number
  tested_at?: string | null
  sample?: Sample
}

export interface ExceptionRecord {
  id: number
  sample_id?: number | null
  title: string
  level: '低' | '中' | '高' | 'low' | 'medium' | 'high' | string
  status: ExceptionStatus
  description?: string | null
  suggestion?: string | null
  resolved_at?: string | null
  sample?: Sample
}

export interface AnalysisJob {
  id: number
  sample_id: number
  status: string
  conclusion?: string | null
  suggestion?: string | null
  created_at?: string | null
  sample?: Sample
}

export interface DashboardData {
  stats?: {
    tasks?: number
    samples?: number
    results?: number
    exceptions?: number
    pending_exceptions?: number
    analysis_jobs?: number
  }
  recent_tasks?: InspectionTask[]
  abnormal_results?: SampleResult[]
  exceptions?: ExceptionRecord[]
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
