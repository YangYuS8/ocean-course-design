const tones = {
  teal: 'from-teal-500 to-cyan-500',
  blue: 'from-sky-500 to-blue-600',
  green: 'from-emerald-500 to-teal-600',
  amber: 'from-amber-500 to-orange-500',
  violet: 'from-violet-500 to-indigo-500',
}

export function MetricCard({ label, value, hint, tone }: { label: string; value: number; hint: string; tone: keyof typeof tones }) {
  return (
    <article className="relative min-h-36 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_42px_rgba(9,58,67,0.10)]">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tones[tone]}`} />
      <span className="text-sm font-black text-slate-500">{label}</span>
      <strong className="mt-4 block text-4xl font-black leading-none tracking-[-0.055em] text-slate-950">{value}</strong>
      <small className="mt-3 block text-sm text-slate-500">{hint}</small>
    </article>
  )
}
