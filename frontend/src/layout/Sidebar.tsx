import type { PageKey } from '../constants/navigation'
import { pages } from '../constants/navigation'

export function Sidebar({ activePage, onNavigate }: { activePage: PageKey; onNavigate: (page: PageKey) => void }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">汐</div>
        <div>
          <strong>Ocean Atelier</strong>
          <span>海洋巡检课程设计</span>
        </div>
      </div>
      <nav className="nav-list" aria-label="主导航">
        {pages.map((page) => (
          <button className={page.key === activePage ? 'nav-item active' : 'nav-item'} key={page.key} onClick={() => onNavigate(page.key)} type="button">
            <span className="nav-marker">{page.marker}</span>
            <span className="nav-copy"><strong>{page.label}</strong><small>{page.subtitle}</small></span>
          </button>
        ))}
      </nav>
      <div className="sidebar-note">
        <span>Defense Flow</span>
        <p>任务 → 样本 → 结果 → 异常 → 分析 → 统计</p>
      </div>
    </aside>
  )
}
