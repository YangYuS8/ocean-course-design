import { DataCard } from '../components/ui/DataCard'

export function AboutPage() {
  return (
    <section className="page-stack">
      <DataCard title="答辩演示流程" eyebrow="Presentation Script">
        <ol className="guide-list">
          <li>打开首页，说明“巡检任务 → 样本 → 结果 → 异常 → 分析 → 统计”的业务闭环。</li>
          <li>新建并开始一个巡检任务，展示任务状态变化。</li>
          <li>登记样本并录入检测结果，说明样本与结果的关联。</li>
          <li>对异常指标上报异常，随后标记处理完成。</li>
          <li>点击生成分析建议，返回首页查看统计更新。</li>
        </ol>
      </DataCard>
      <DataCard title="实现说明" eyebrow="Architecture">
        <p className="muted-text">前端保持 React + TypeScript + Vite，没有引入复杂状态库或 UI 库；页面按业务模块拆分，接口地址可通过 VITE_API_BASE_URL 修改。</p>
      </DataCard>
    </section>
  )
}
