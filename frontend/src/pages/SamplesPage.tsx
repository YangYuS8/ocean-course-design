/**
 * 样本管理页面。
 *
 * 负责把现场采集的水样登记到某个巡检任务下面。
 * 这里体现了前端表单字段必须和 Laravel 后端校验字段保持一致：inspection_task_id、code、location、collector 等。
 */
import type { FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { DataCard } from '../components/ui/DataCard'
import { DataTable } from '../components/ui/DataTable'
import { Input, SelectField, TextareaField } from '../components/ui/FormField'
import { api } from '../api'
import type { InspectionTask, Sample } from '../types'
import { formToObject } from '../utils/form'

export function SamplesPage({ samples, tasks, onChanged }: { samples: Sample[]; tasks: InspectionTask[]; onChanged: () => Promise<void> }) {
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await api.createSample(formToObject(event.currentTarget))
    event.currentTarget.reset()
    await onChanged()
  }

  return (
    <section className="two-column align-start">
      <DataCard title="登记样本" eyebrow="Sample Registry">
        <form className="form-grid" onSubmit={submit}>
          <SelectField name="inspection_task_id" label="关联任务">{tasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}</SelectField>
          <Input name="code" label="样本编号" required placeholder="S-202606-004" />
          <Input name="location" label="采样点位" required placeholder="东湾 A3 点位" />
          <Input name="collector" label="采样人" required placeholder="李珊" />
          <Input name="water_type" label="水体类型" placeholder="近岸海水" />
          <Input name="collected_at" label="采样时间" required type="datetime-local" />
          <TextareaField name="notes" label="现场备注" placeholder="记录天气、水体气味、颜色等现场情况" />
          <button className="primary-button" type="submit">登记样本</button>
        </form>
      </DataCard>
      <DataCard title="样本列表" eyebrow="Sample Archive">
        <DataTable headers={['编号', '点位', '采样人', '类型', '状态', '所属任务']} rows={samples.map((item) => [item.code, item.location, item.collector ?? '-', item.water_type ?? '-', <Badge>{item.status ?? '已登记'}</Badge>, item.task?.title ?? '-'])} />
      </DataCard>
    </section>
  )
}
