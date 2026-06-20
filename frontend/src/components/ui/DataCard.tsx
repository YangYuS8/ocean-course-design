/**
 * 通用卡片组件。
 *
 * 多个页面都需要“标题 + 小英文说明 + 内容区域”的卡片结构，抽成组件可以减少重复 JSX。
 */
import type { ReactNode } from 'react'

export function DataCard({ title, eyebrow, children, className = '' }: { title: string; eyebrow?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_42px_rgba(9,58,67,0.10)] ${className}`}>
      <div className="mb-5 grid gap-1.5">
        {eyebrow ? <span className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{eyebrow}</span> : null}
        <h3 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h3>
      </div>
      {children}
    </section>
  )
}
