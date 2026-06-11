import type { ReactNode } from 'react'

export function DataCard({ title, eyebrow, children, className = '' }: { title: string; eyebrow?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`data-card ${className}`}>
      <div className="card-heading">
        {eyebrow ? <span>{eyebrow}</span> : null}
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  )
}
