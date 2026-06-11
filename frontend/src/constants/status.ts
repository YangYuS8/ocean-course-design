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
