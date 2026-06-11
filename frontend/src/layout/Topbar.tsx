import type { PageMeta } from '../constants/navigation'

export function Topbar({ page, connected, loading, notice }: { page: PageMeta; connected: boolean; loading: boolean; notice: string }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">海洋环境巡检管理</span>
        <h1>{page.label}</h1>
      </div>
      <div className={`connection-pill ${connected ? 'online' : 'offline'}`}>
        <span className={loading ? 'status-dot loading' : 'status-dot'} />
        <span>{notice}</span>
      </div>
    </header>
  )
}
