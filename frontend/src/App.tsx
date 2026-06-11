import { useState } from 'react'
import { pages, type PageKey } from './constants/navigation'
import { useOceanData } from './hooks/useOceanData'
import { AppLayout } from './layout/AppLayout'
import { AboutPage } from './pages/AboutPage'
import { DashboardPage } from './pages/DashboardPage'
import { ExceptionsPage } from './pages/ExceptionsPage'
import { ResultsPage } from './pages/ResultsPage'
import { SamplesPage } from './pages/SamplesPage'
import { TasksPage } from './pages/TasksPage'

function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard')
  const currentPage = pages.find((item) => item.key === activePage) ?? pages[0]
  const oceanData = useOceanData()

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
      loading={oceanData.loading}
      notice={oceanData.notice}
      onNavigate={setActivePage}
    >
      {renderPage()}
    </AppLayout>
  )
}

export default App
