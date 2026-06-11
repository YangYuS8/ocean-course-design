import type { FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { DataCard } from '../components/ui/DataCard'
import { Input, SelectField, TextareaField } from '../components/ui/FormField'
import { api } from '../api'
import { statusText } from '../constants/status'
import type { ExceptionRecord, Sample } from '../types'
import { formToObject } from '../utils/form'

export function ExceptionsPage({ exceptions, samples, onChanged }: { exceptions: ExceptionRecord[]; samples: Sample[]; onChanged: () => Promise<void> }) {
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await api.createException(formToObject(event.currentTarget))
    event.currentTarget.reset()
    await onChanged()
  }

  return (
    <section className="page-stack">
      <div className="two-column align-start">
        <DataCard title="上报异常" eyebrow="Risk Report">
          <form className="form-grid" onSubmit={submit}>
            <SelectField name="sample_id" label="样本">{samples.map((sample) => <option key={sample.id} value={sample.id}>{sample.code}</option>)}</SelectField>
            <Input name="title" label="异常标题" required placeholder="溶解氧低于标准" />
            <SelectField name="level" label="等级"><option>低</option><option>中</option><option>高</option></SelectField>
            <TextareaField name="description" label="描述" placeholder="说明异常现象和现场情况" />
            <button className="primary-button" type="submit">提交异常</button>
          </form>
        </DataCard>
        <DataCard title="简易分析操作" eyebrow="Analysis">
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
      <DataCard title="异常处理列表" eyebrow="Resolution">
        <div className="table-wrap">
          <table>
            <thead><tr><th>标题</th><th>等级</th><th>状态</th><th>建议</th><th>操作</th></tr></thead>
            <tbody>{exceptions.map((item) => <tr key={item.id}><td>{item.title}</td><td><Badge tone={item.level === '高' ? 'danger' : 'warning'}>{item.level}</Badge></td><td><Badge>{statusText[item.status] ?? item.status}</Badge></td><td>{item.suggestion ?? '-'}</td><td><button className="ghost-button" onClick={async () => { await api.resolveException(item.id); await onChanged() }} type="button">标记解决</button></td></tr>)}</tbody>
          </table>
        </div>
      </DataCard>
    </section>
  )
}
