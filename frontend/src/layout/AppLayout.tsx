import type { ReactNode } from 'react'
import type { PageKey, PageMeta } from '../constants/navigation'
import type { User } from '../types'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout({ activePage, children, connected, currentPage, currentUser, loading, notice, onLogout, onNavigate }: { activePage: PageKey; children: ReactNode; connected: boolean; currentPage: PageMeta; currentUser: User; loading: boolean; notice: string; onLogout: () => void; onNavigate: (page: PageKey) => void }) {
  return (
    <div className="grid min-h-screen grid-cols-[248px_1fr] bg-[radial-gradient(circle_at_84%_8%,rgba(20,184,166,0.18),transparent_30rem),linear-gradient(135deg,#eef5f4_0%,#f8fbfa_52%,#e8f1f0_100%)]">
      <Sidebar activePage={activePage} currentUser={currentUser} onLogout={onLogout} onNavigate={onNavigate} />
      <main className="min-w-0 px-8 py-8 xl:px-11">
        <Topbar connected={connected} loading={loading} notice={notice} page={currentPage} />
        {children}
      </main>
    </div>
  )
}
