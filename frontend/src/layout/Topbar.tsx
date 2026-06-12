import type { PageMeta } from '../constants/navigation'

export function Topbar({ page, connected, loading, notice }: { page: PageMeta; connected: boolean; loading: boolean; notice: string }) {
  return (
    <header className="mb-7 flex items-center justify-between gap-5">
      <div><span className="mb-2 inline-flex text-[11px] font-black uppercase tracking-[0.18em] text-teal-700">海洋环境巡检管理</span><h1 className="text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl">{page.label}</h1></div>
      <div className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-sm text-slate-500 backdrop-blur ${connected ? 'text-emerald-700' : 'text-amber-700'}`}>
        <span className={`h-2.5 w-2.5 rounded-full ${loading ? 'bg-amber-500' : connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <span>{notice}</span>
      </div>
    </header>
  )
}
