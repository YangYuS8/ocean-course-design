import { useEffect, useState } from 'react'
import { api, clearStoredToken, getStoredToken } from './api'
import { pages, type PageKey } from './constants/navigation'
import { useOceanData } from './hooks/useOceanData'
import { AppLayout } from './layout/AppLayout'
import { AboutPage } from './pages/AboutPage'
import { DashboardPage } from './pages/DashboardPage'
import { ExceptionsPage } from './pages/ExceptionsPage'
import { LoginPage } from './pages/LoginPage'
import { ResultsPage } from './pages/ResultsPage'
import { SamplesPage } from './pages/SamplesPage'
import { TasksPage } from './pages/TasksPage'
import { UsersPage } from './pages/UsersPage'
import type { User } from './types'

/**
 * App 是整个前端应用的总控组件。
 *
 * 它主要负责三件事：
 * 1. 判断用户是否已经登录；
 * 2. 控制当前显示哪个页面；
 * 3. 把从后端加载到的数据传给具体业务页面。
 */
function App() {
  // activePage 保存当前菜单页面，例如 dashboard、tasks、samples。
  const [activePage, setActivePage] = useState<PageKey>('dashboard')

  // currentUser 为 null 表示未登录；有值表示已经登录。
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // 如果本地存过 token，页面打开时需要先向后端确认 token 是否仍有效。
  const [checkingSession, setCheckingSession] = useState(Boolean(getStoredToken()))

  const currentPage = pages.find((item) => item.key === activePage) ?? pages[0]

  // 登录后才加载业务数据；未登录时不请求 dashboard/tasks 等受保护接口。
  const oceanData = useOceanData(Boolean(currentUser))

  useEffect(() => {
    if (!getStoredToken()) return

    // 页面刷新后，使用本地 token 调用 /api/me 恢复登录状态。
    api.me()
      .then(setCurrentUser)
      .catch(() => clearStoredToken())
      .finally(() => setCheckingSession(false))
  }, [])

  /** 退出登录：通知后端清空 token，同时清理前端本地状态。 */
  const logout = async () => {
    try { await api.logout() } catch { /* 后端已断开时也允许前端清理登录状态 */ }
    clearStoredToken()
    setCurrentUser(null)
    setActivePage('dashboard')
  }

  if (checkingSession) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 text-cyan-50">正在恢复会话…</div>
  }

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />
  }

  /** 根据当前菜单 key 渲染不同页面。 */
  const renderPage = () => {
    switch (activePage) {
      case 'tasks':
        return <TasksPage tasks={oceanData.tasks} onChanged={oceanData.refreshAll} />
      case 'samples':
        return <SamplesPage samples={oceanData.samples} tasks={oceanData.tasks} onChanged={oceanData.refreshAll} />
      case 'results':
        return <ResultsPage results={oceanData.results} samples={oceanData.samples} onChanged={oceanData.refreshAll} />
      case 'exceptions':
        return <ExceptionsPage exceptions={oceanData.exceptions} samples={oceanData.samples} onChanged={oceanData.refreshAll} />
      case 'users':
        return <UsersPage currentUser={currentUser} />
      case 'about':
        return <AboutPage />
      default:
        return <DashboardPage stats={oceanData.stats} dashboard={oceanData.dashboard} results={oceanData.results} exceptions={oceanData.exceptions} />
    }
  }

  return (
    <AppLayout
      activePage={activePage}
      connected={oceanData.connected}
      currentPage={currentPage}
      currentUser={currentUser}
      loading={oceanData.loading}
      notice={oceanData.notice}
      onLogout={logout}
      onNavigate={setActivePage}
    >
      {renderPage()}
    </AppLayout>
  )
}

export default App
