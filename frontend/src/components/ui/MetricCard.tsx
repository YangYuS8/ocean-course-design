export function MetricCard({ label, value, hint, tone }: { label: string; value: number; hint: string; tone: 'teal' | 'blue' | 'green' | 'amber' | 'violet' }) {
  return (
    <article className={`metric-card ${tone}`}>
      <span className="metric-kicker">{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  )
}
