/**
 * 状态标签组件。
 *
 * 用于展示“进行中、异常、已处理、管理员”等短状态文字。
 * tone 参数控制颜色风格，使页面状态表达保持统一。
 */
import type { ReactNode } from 'react'
import { getStatusTone, statusText } from '../../constants/status'

const tones = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
}

export function Badge({ children, tone }: { children: ReactNode; tone?: keyof typeof tones }) {
  const value = String(children)
  const actualTone = tone ?? getStatusTone(value)
  return <span className={`inline-flex min-w-max items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones[actualTone]}`}>{statusText[value] ?? children}</span>
}
