import { DataCard } from '../components/ui/DataCard'

export function AboutPage() {
  return (
    <section className="grid gap-6">
      <DataCard title="系统流程" eyebrow="Workflow">
        <ol className="grid gap-3 text-slate-700">
          <li>1. 建立巡检任务，明确区域、时间与负责人。</li>
          <li>2. 登记样本，关联任务并记录采样点位。</li>
          <li>3. 录入检测指标，系统识别异常结果。</li>
          <li>4. 上报并处理异常，沉淀处置记录。</li>
          <li>5. 生成分析建议，回到总览页查看运行状态。</li>
        </ol>
      </DataCard>
      <DataCard title="平台定位" eyebrow="Product Note">
        <p className="leading-8 text-slate-600">平台聚焦海洋环境巡检业务链路，提供任务、样本、检测、异常、分析与用户管理能力，帮助团队以统一视图追踪现场数据与处置进展。</p>
      </DataCard>
    </section>
  )
}
