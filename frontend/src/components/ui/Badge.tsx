import type { ReactNode } from 'react'
import { getStatusTone, statusText } from '../../constants/status'

export function Badge({ children, tone }: { children: ReactNode; tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' }) {
  const value = String(children)
  const actualTone = tone ?? getStatusTone(value)
  return <span className={`badge ${actualTone}`}>{statusText[value] ?? children}</span>
}
