import { Badge } from '../components/ui/Badge'
import { DataCard } from '../components/ui/DataCard'
import { DataTable } from '../components/ui/DataTable'
import { MetricCard } from '../components/ui/MetricCard'
import { statusText } from '../constants/status'
import type { DashboardData, ExceptionRecord, SampleResult } from '../types'
import type { DashboardStats } from '../utils/dashboard'
import { getAbnormalResults, getRecentExceptions } from '../utils/dashboard'

export function DashboardPage({ stats, dashboard, results, exceptions }: { stats: DashboardStats; dashboard: DashboardData; results: SampleResult[]; exceptions: ExceptionRecord[] }) {
  const abnormal = getAbnormalResults(dashboard, results)
  const recentExceptions = getRecentExceptions(dashboard, exceptions)

  return (
    <section className="page-stack">
      <div className="hero-panel">
        <div className="hero-content">
          <span className="eyebrow">课程答辩驾驶舱</span>
          <h2>把海洋样本巡检流程，整理成一条能讲清、能演示的业务闭环。</h2>
          <p>保留任务、样本、检测、异常、分析五个核心环节，让答辩时每一步都有数据支撑。</p>
        </div>
        <div className="flow-board" aria-label="业务流程">
          {['巡检任务', '样本登记', '结果录入', '异常处置', '分析建议'].map((item, index) => (
            <span key={item}><small>{String(index + 1).padStart(2, '0')}</small>{item}</span>
          ))}
        </div>
      </div>

      <div className="metric-grid">
        <MetricCard label="巡检任务" value={stats.tasks} hint="任务总数" tone="teal" />
        <MetricCard label="登记样本" value={stats.samples} hint="样本库" tone="blue" />
        <MetricCard label="检测结果" value={stats.results} hint="指标记录" tone="green" />
        <MetricCard label="待处理异常" value={stats.pending} hint="风险关注" tone="amber" />
        <MetricCard label="分析记录" value={stats.analysis} hint="建议产出" tone="violet" />
      </div>

      <div className="two-column dashboard-columns">
        <DataCard title="异常检测结果" eyebrow="Risk Signals">
          <DataTable headers={['样本', '指标', '数值', '状态']} rows={abnormal.map((item) => [item.sample?.code ?? `#${item.sample_id}`, item.indicator, `${item.value}${item.unit}`, <Badge tone="warning">异常</Badge>])} />
        </DataCard>
        <DataCard title="近期异常处理" eyebrow="Exception Queue">
          <DataTable headers={['标题', '等级', '状态']} rows={recentExceptions.map((item) => [item.title, <Badge tone={item.level === '高' ? 'danger' : 'warning'}>{item.level}</Badge>, <Badge>{statusText[item.status] ?? item.status}</Badge>])} />
        </DataCard>
      </div>
    </section>
  )
}
