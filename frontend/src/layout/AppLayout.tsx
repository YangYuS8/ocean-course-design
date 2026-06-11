import type { ReactNode } from 'react'
import type { PageKey, PageMeta } from '../constants/navigation'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout({ activePage, currentPage, connected, loading, notice, onNavigate, children }: { activePage: PageKey; currentPage: PageMeta; connected: boolean; loading: boolean; notice: string; onNavigate: (page: PageKey) => void; children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <main className="main-panel">
        <Topbar page={currentPage} connected={connected} loading={loading} notice={notice} />
        {children}
      </main>
    </div>
  )
}
