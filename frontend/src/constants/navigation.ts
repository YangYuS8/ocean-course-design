export type PageKey = 'dashboard' | 'tasks' | 'samples' | 'results' | 'exceptions' | 'about'

export interface PageMeta {
  key: PageKey
  label: string
  subtitle: string
  marker: string
}

export const pages: PageMeta[] = [
  { key: 'dashboard', label: '首页统计', subtitle: 'Overview', marker: '01' },
  { key: 'tasks', label: '巡检任务', subtitle: 'Mission', marker: '02' },
  { key: 'samples', label: '样本登记', subtitle: 'Samples', marker: '03' },
  { key: 'results', label: '检测结果', subtitle: 'Results', marker: '04' },
  { key: 'exceptions', label: '异常与分析', subtitle: 'Risk', marker: '05' },
  { key: 'about', label: '答辩说明', subtitle: 'Guide', marker: '06' },
]
