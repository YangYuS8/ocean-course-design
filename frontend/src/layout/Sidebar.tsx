/**
 * 左侧导航栏组件。
 *
 * 菜单数据来自 constants/navigation.ts，点击菜单时通过 onNavigate 通知 App.tsx 切换页面。
 */
import type { PageKey } from '../constants/navigation'
import { pages } from '../constants/navigation'
import type { User } from '../types'

export function Sidebar({ activePage, currentUser, onLogout, onNavigate }: { activePage: PageKey; currentUser: User; onLogout: () => void; onNavigate: (page: PageKey) => void }) {
  return (
    <aside className="sticky top-0 flex h-screen flex-col gap-7 bg-slate-950 px-4 py-6 text-cyan-50 shadow-2xl shadow-slate-900/20">
      <div className="flex items-center gap-3 px-1">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-teal-200/30 bg-teal-400/10 font-black text-teal-100 shadow-inner shadow-teal-300/10">汐</div>
        <div><strong className="block text-sm tracking-tight">Ocean Atelier</strong><span className="mt-1 block text-xs text-cyan-100/50">巡检管理平台</span></div>
      </div>
      <nav className="grid gap-1.5" aria-label="主导航">
        {pages.map((page) => (
          <button className={`grid grid-cols-[2.25rem_1fr] items-center rounded-2xl border px-3 py-3 text-left transition ${page.key === activePage ? 'border-teal-100/20 bg-white/10 text-white shadow-inner shadow-teal-300/10' : 'border-transparent text-cyan-50/70 hover:bg-white/5 hover:text-white'}`} key={page.key} onClick={() => onNavigate(page.key)} type="button">
            <span className="font-mono text-xs text-teal-200/60">{page.marker}</span>
            <span><strong className="block text-sm font-bold">{page.label}</strong><small className="mt-0.5 block text-[11px] uppercase tracking-[0.12em] text-cyan-50/40">{page.subtitle}</small></span>
          </button>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl border border-cyan-100/10 bg-white/[0.055] p-4">
        <p className="text-sm font-bold text-white">{currentUser.name}</p>
        <p className="mt-1 text-xs text-cyan-50/50">{currentUser.role === 'admin' ? '管理员' : '普通用户'} · {currentUser.email}</p>
        <button className="mt-4 w-full rounded-xl bg-cyan-50/10 px-3 py-2 text-sm font-bold text-cyan-50 transition hover:bg-cyan-50/15" onClick={onLogout} type="button">退出登录</button>
      </div>
    </aside>
  )
}
