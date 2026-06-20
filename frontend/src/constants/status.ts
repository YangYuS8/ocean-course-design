/**
 * 状态文字和颜色映射。
 *
 * 后端返回的状态可能是中文，也可能在某些前端旧数据中是英文；这里统一转换为适合展示的文字和颜色。
 */
export const statusText: Record<string, string> = {
  draft: '待开始',
  started: '进行中',
  submitted: '已提交',
  completed: '已完成',
  open: '待处理',
  resolved: '已解决',
  done: '已完成',
}

export function getStatusTone(status: string): 'neutral' | 'info' | 'success' | 'warning' | 'danger' {
  if (['completed', 'done', 'resolved', '已完成', '已解决'].includes(status)) return 'success'
  if (['started', '进行中'].includes(status)) return 'info'
  if (['open', '待处理', '异常待处理', '中'].includes(status)) return 'warning'
  if (['high', '高', 'danger'].includes(status)) return 'danger'
  return 'neutral'
}
