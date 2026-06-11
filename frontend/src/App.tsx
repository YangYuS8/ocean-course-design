import { type FormEvent, type InputHTMLAttributes, type ReactNode, useEffect, useMemo, useState } from 'react'
import { API_BASE_URL, api } from './api'
import {
  mockDashboard,
  mockExceptions,
  mockResults,
  mockSamples,
  mockTasks,
} from './mockData'
import type { DashboardData, ExceptionRecord, InspectionTask, Sample, SampleResult } from './types'

type PageKey = 'dashboard' | 'tasks' | 'samples' | 'results' | 'exceptions' | 'about'

const pages: { key: PageKey; label: string; hint: string }[] = [
  { key: 'dashboard', label: '首页统计', hint: '总览' },
  { key: 'tasks', label: '巡检任务', hint: '任务' },
  { key: 'samples', label: '样本登记', hint: '样本' },
  { key: 'results', label: '检测结果', hint: '结果' },
  { key: 'exceptions', label: '异常与分析', hint: '处置' },
  { key: 'about', label: '答辩说明', hint: '指南' },
]

const statusText: Record<string, string> = {
  draft: '待开始',
  started: '进行中',
  submitted: '已提交',
  completed: '已完成',
  open: '待处理',
  resolved: '已解决',
  done: '已完成',
}

function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard')
  const [tasks, setTasks] = useState<InspectionTask[]>(mockTasks)
  const [samples, setSamples] = useState<Sample[]>(mockSamples)
  const [results, setResults] = useState<SampleResult[]>(mockResults)
  const [exceptions, setExceptions] = useState<ExceptionRecord[]>(mockExceptions)
  const [dashboard, setDashboard] = useState<DashboardData>(mockDashboard)
  const [notice, setNotice] = useState('已载入演示数据；连接后端后会自动显示真实数据。')
  const [loading, setLoading] = useState(false)

  const currentPage = pages.find((item) => item.key === activePage) ?? pages[0]

  const refreshAll = async () => {
    setLoading(true)
    try {
      const [dashboardData, taskData, sampleData, resultData, exceptionData] = await Promise.all([
        api.getDashboard(),
        api.getTasks(),
        api.getSamples(),
        api.getResults(),
        api.getExceptions(),
      ])
      setDashboard(dashboardData)
      setTasks(taskData)
      setSamples(sampleData)
      setResults(resultData)
      setExceptions(exceptionData)
      setNotice(`已连接接口：${API_BASE_URL}`)
    } catch {
      setNotice('当前使用前端演示数据。启动 Laravel 后端后刷新页面即可联调。')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshAll()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const stats = useMemo(
    () => ({
      tasks: dashboard.stats?.tasks ?? tasks.length,
      samples: dashboard.stats?.samples ?? samples.length,
      results: dashboard.stats?.results ?? results.length,
      pending: dashboard.stats?.pending_exceptions ?? exceptions.filter((item) => item.status !== 'resolved').length,
      analysis: dashboard.stats?.analysis_jobs ?? 0,
    }),
    [dashboard, exceptions, results, samples, tasks],
  )

  const renderPage = () => {
    switch (activePage) {
      case 'tasks':
        return <TasksPage tasks={tasks} onChanged={refreshAll} />
      case 'samples':
        return <SamplesPage samples={samples} tasks={tasks} onChanged={refreshAll} />
      case 'results':
        return <ResultsPage results={results} samples={samples} onChanged={refreshAll} />
      case 'exceptions':
        return <ExceptionsPage exceptions={exceptions} samples={samples} onChanged={refreshAll} />
      case 'about':
        return <AboutPage />
      default:
        return <DashboardPage stats={stats} dashboard={dashboard} results={results} exceptions={exceptions} />
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">海</div>
          <div>
            <strong>海洋巡检</strong>
            <span>课程设计系统</span>
          </div>
        </div>
        <nav className="nav-list" aria-label="主导航">
          {pages.map((page) => (
            <button
              className={page.key === activePage ? 'nav-item active' : 'nav-item'}
              key={page.key}
              onClick={() => setActivePage(page.key)}
              type="button"
            >
              <span>{page.label}</span>
              <small>{page.hint}</small>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">业务链：巡检任务 → 样本 → 结果 → 异常 → 分析 → 统计</div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <span className="eyebrow">Ocean Monitoring Admin</span>
            <h1>{currentPage.label}</h1>
          </div>
          <div className="topbar-actions">
            <span className={loading ? 'status-dot loading' : 'status-dot'} />
            <span>{notice}</span>
          </div>
        </header>
        {renderPage()}
      </main>
    </div>
  )
}

function DashboardPage({
  stats,
  dashboard,
  results,
  exceptions,
}: {
  stats: { tasks: number; samples: number; results: number; pending: number; analysis: number }
  dashboard: DashboardData
  results: SampleResult[]
  exceptions: ExceptionRecord[]
}) {
  const abnormal = dashboard.abnormal_results ?? results.filter((item) => Boolean(item.is_abnormal))
  const recentExceptions = dashboard.exceptions ?? exceptions

  return (
    <section className="page-stack">
      <div className="hero-card">
        <div>
          <span className="eyebrow">简化业务闭环</span>
          <h2>从巡检任务到分析建议，一屏看清海洋样本状态。</h2>
          <p>界面保留课程答辩需要的核心功能，避免复杂权限、队列和过度抽象，便于讲解。</p>
        </div>
        <div className="flow-line">
          {['任务', '样本', '结果', '异常', '分析'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="巡检任务" value={stats.tasks} accent="teal" />
        <StatCard label="登记样本" value={stats.samples} accent="blue" />
        <StatCard label="检测结果" value={stats.results} accent="green" />
        <StatCard label="待处理异常" value={stats.pending} accent="orange" />
        <StatCard label="分析记录" value={stats.analysis} accent="violet" />
      </div>

      <div className="two-column">
        <DataCard title="异常检测结果">
          <SimpleTable
            headers={['样本', '指标', '数值', '标准']}
            rows={abnormal.map((item) => [item.sample?.code ?? `#${item.sample_id}`, item.indicator, `${item.value}${item.unit}`, item.standard_limit ?? '-'])}
          />
        </DataCard>
        <DataCard title="近期异常处理">
          <SimpleTable
            headers={['标题', '等级', '状态']}
            rows={recentExceptions.map((item) => [item.title, item.level, statusText[item.status] ?? item.status])}
          />
        </DataCard>
      </div>
    </section>
  )
}

function TasksPage({ tasks, onChanged }: { tasks: InspectionTask[]; onChanged: () => Promise<void> }) {
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    await api.createTask(Object.fromEntries(form.entries()))
    event.currentTarget.reset()
    await onChanged()
  }

  return (
    <section className="two-column align-start">
      <DataCard title="新建巡检任务">
        <form className="form-grid" onSubmit={submit}>
          <Input name="title" label="任务名称" required placeholder="例如：近岸水质巡检" />
          <Input name="area" label="巡检区域" required placeholder="例如：东湾 A 区" />
          <Input name="inspector" label="负责人" required placeholder="巡检人员姓名" />
          <Input name="planned_date" label="计划日期" type="date" />
          <button className="primary-button" type="submit">保存任务</button>
        </form>
      </DataCard>
      <DataCard title="任务列表">
        <div className="table-wrap">
          <table>
            <thead><tr><th>名称</th><th>区域</th><th>负责人</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td><td>{task.area}</td><td>{task.inspector}</td>
                  <td><Badge>{statusText[task.status] ?? task.status}</Badge></td>
                  <td className="actions">
                    <button onClick={async () => { await api.startTask(task.id); await onChanged() }} type="button">开始</button>
                    <button onClick={async () => { await api.submitTask(task.id); await onChanged() }} type="button">提交</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
    </section>
  )
}

function SamplesPage({ samples, tasks, onChanged }: { samples: Sample[]; tasks: InspectionTask[]; onChanged: () => Promise<void> }) {
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    await api.createSample(Object.fromEntries(form.entries()))
    event.currentTarget.reset()
    await onChanged()
  }

  return (
    <section className="two-column align-start">
      <DataCard title="登记样本">
        <form className="form-grid" onSubmit={submit}>
          <label>关联任务<select name="inspection_task_id">{tasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}</select></label>
          <Input name="code" label="样本编号" required placeholder="S-202606-004" />
          <Input name="location" label="采样点位" required placeholder="东湾 A3 点位" />
          <Input name="water_type" label="水体类型" placeholder="近岸海水" />
          <Input name="collected_at" label="采样时间" type="datetime-local" />
          <button className="primary-button" type="submit">登记样本</button>
        </form>
      </DataCard>
      <DataCard title="样本列表">
        <SimpleTable headers={['编号', '点位', '类型', '时间']} rows={samples.map((item) => [item.code, item.location, item.water_type ?? '-', item.collected_at ?? '-'])} />
      </DataCard>
    </section>
  )
}

function ResultsPage({ results, samples, onChanged }: { results: SampleResult[]; samples: Sample[]; onChanged: () => Promise<void> }) {
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const sampleId = Number(form.get('sample_id'))
    form.delete('sample_id')
    await api.addResult(sampleId, Object.fromEntries(form.entries()))
    event.currentTarget.reset()
    await onChanged()
  }

  return (
    <section className="two-column align-start">
      <DataCard title="录入检测结果">
        <form className="form-grid" onSubmit={submit}>
          <label>样本<select name="sample_id">{samples.map((sample) => <option key={sample.id} value={sample.id}>{sample.code}</option>)}</select></label>
          <Input name="indicator" label="检测指标" required placeholder="溶解氧" />
          <Input name="value" label="检测值" required placeholder="3.2" />
          <Input name="unit" label="单位" placeholder="mg/L" />
          <Input name="standard_limit" label="标准限值" placeholder="5" />
          <Input name="tested_at" label="检测时间" type="datetime-local" />
          <button className="primary-button" type="submit">保存结果</button>
        </form>
      </DataCard>
      <DataCard title="结果列表">
        <SimpleTable headers={['样本', '指标', '数值', '是否异常']} rows={results.map((item) => [`#${item.sample_id}`, item.indicator, `${item.value}${item.unit}`, item.is_abnormal ? '异常' : '正常'])} />
      </DataCard>
    </section>
  )
}

function ExceptionsPage({ exceptions, samples, onChanged }: { exceptions: ExceptionRecord[]; samples: Sample[]; onChanged: () => Promise<void> }) {
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await api.createException(Object.fromEntries(new FormData(event.currentTarget).entries()))
    event.currentTarget.reset()
    await onChanged()
  }

  return (
    <section className="page-stack">
      <div className="two-column align-start">
        <DataCard title="上报异常">
          <form className="form-grid" onSubmit={submit}>
            <label>样本<select name="sample_id">{samples.map((sample) => <option key={sample.id} value={sample.id}>{sample.code}</option>)}</select></label>
            <Input name="title" label="异常标题" required placeholder="溶解氧低于标准" />
            <label>等级<select name="level"><option>低</option><option>中</option><option>高</option></select></label>
            <label>描述<textarea name="description" placeholder="说明异常现象和现场情况" /></label>
            <button className="primary-button" type="submit">提交异常</button>
          </form>
        </DataCard>
        <DataCard title="简易分析操作">
          <div className="analysis-list">
            {samples.map((sample) => (
              <div className="analysis-row" key={sample.id}>
                <div><strong>{sample.code}</strong><span>{sample.location}</span></div>
                <button onClick={async () => { await api.analyzeSample(sample.id); await onChanged() }} type="button">生成建议</button>
              </div>
            ))}
          </div>
        </DataCard>
      </div>
      <DataCard title="异常处理列表">
        <div className="table-wrap">
          <table>
            <thead><tr><th>标题</th><th>等级</th><th>状态</th><th>建议</th><th>操作</th></tr></thead>
            <tbody>{exceptions.map((item) => <tr key={item.id}><td>{item.title}</td><td>{item.level}</td><td><Badge>{statusText[item.status] ?? item.status}</Badge></td><td>{item.suggestion ?? '-'}</td><td><button onClick={async () => { await api.resolveException(item.id); await onChanged() }} type="button">标记解决</button></td></tr>)}</tbody>
          </table>
        </div>
      </DataCard>
    </section>
  )
}

function AboutPage() {
  return (
    <section className="page-stack">
      <DataCard title="答辩演示流程">
        <ol className="guide-list">
          <li>打开首页，说明“巡检任务 → 样本 → 结果 → 异常 → 分析 → 统计”的业务闭环。</li>
          <li>新建并开始一个巡检任务，展示任务状态变化。</li>
          <li>登记样本并录入检测结果，说明样本与结果的关联。</li>
          <li>对异常指标上报异常，随后标记处理完成。</li>
          <li>点击生成分析建议，返回首页查看统计更新。</li>
        </ol>
      </DataCard>
      <DataCard title="实现说明">
        <p className="muted-text">前端使用 React + TypeScript + Vite，没有引入复杂状态库；接口地址默认指向 http://127.0.0.1:8000/api，也可通过 VITE_API_BASE_URL 修改。页面结构保持“侧边栏 + 顶部标题 + 卡片/表格/表单”，便于课程答辩讲解。</p>
      </DataCard>
    </section>
  )
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return <div className={`stat-card ${accent}`}><span>{label}</span><strong>{value}</strong></div>
}

function DataCard({ title, children }: { title: string; children: ReactNode }) {
  return <section className="data-card"><h3>{title}</h3>{children}</section>
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: (string | number | null | undefined)[][] }) {
  return <div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell ?? '-'}</td>)}</tr>)}</tbody></table></div>
}

function Input({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label>{label}<input {...props} /></label>
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="badge">{children}</span>
}

export default App
