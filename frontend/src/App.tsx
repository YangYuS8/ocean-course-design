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

function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [checkingSession, setCheckingSession] = useState(Boolean(getStoredToken()))
  const currentPage = pages.find((item) => item.key === activePage) ?? pages[0]
  const oceanData = useOceanData(Boolean(currentUser))

  useEffect(() => {
    if (!getStoredToken()) return
    api.me()
      .then(setCurrentUser)
      .catch(() => clearStoredToken())
      .finally(() => setCheckingSession(false))
  }, [])

  const logout = async () => {
    try { await api.logout() } catch { /* ignore */ }
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
