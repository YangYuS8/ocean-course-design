/**
 * 页面导航配置。
 *
 * App.tsx 和 Sidebar.tsx 都使用这里的 pages 数组，避免菜单文字和页面 key 分散在多个文件。
 */
export type PageKey = 'dashboard' | 'tasks' | 'samples' | 'results' | 'exceptions' | 'users' | 'about'

export interface PageMeta {
  key: PageKey
  label: string
  subtitle: string
  marker: string
}

export const pages: PageMeta[] = [
  { key: 'dashboard', label: '运营总览', subtitle: 'Overview', marker: '01' },
  { key: 'tasks', label: '巡检任务', subtitle: 'Mission', marker: '02' },
  { key: 'samples', label: '样本管理', subtitle: 'Samples', marker: '03' },
  { key: 'results', label: '检测结果', subtitle: 'Results', marker: '04' },
  { key: 'exceptions', label: '异常分析', subtitle: 'Risk', marker: '05' },
  { key: 'users', label: '用户管理', subtitle: 'Users', marker: '06' },
  { key: 'about', label: '系统说明', subtitle: 'Guide', marker: '07' },
]
