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
    <section className="grid gap-6">
      <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_18px_42px_rgba(9,58,67,0.10)] xl:grid-cols-[1fr_360px]">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Operation Overview</span>
          <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight tracking-[-0.055em] text-slate-950 md:text-5xl">海洋巡检业务，从任务到异常处置形成闭环。</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500">集中管理巡检任务、样本登记、检测结果、异常处置与分析建议，帮助团队快速掌握现场状态。</p>
        </div>
        <div className="grid gap-2 rounded-3xl border border-slate-200 bg-slate-50/80 p-5" aria-label="业务流程">
          {['巡检任务', '样本登记', '结果录入', '异常处置', '分析建议'].map((item, index) => (
            <span className="flex items-center gap-3 rounded-2xl border border-teal-900/10 bg-white/80 px-4 py-3 text-sm font-bold text-teal-950" key={item}><small className="font-mono text-xs text-teal-600">{String(index + 1).padStart(2, '0')}</small>{item}</span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="巡检任务" value={stats.tasks} hint="任务总数" tone="teal" />
        <MetricCard label="登记样本" value={stats.samples} hint="样本库" tone="blue" />
        <MetricCard label="检测结果" value={stats.results} hint="指标记录" tone="green" />
        <MetricCard label="待处理异常" value={stats.pending} hint="风险关注" tone="amber" />
        <MetricCard label="分析记录" value={stats.analysis} hint="建议产出" tone="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
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
