/**
 * 异常处理与分析页面。
 *
 * 负责手动上报异常、标记异常已处理，以及触发后端生成分析建议。
 * 检测结果超标时后端也会自动生成异常，这里则提供人工补充和处理入口。
 */
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

  const resolve = async (id: number) => {
    await api.resolveException(id, '已完成现场复核并记录处置结果。')
    await onChanged()
  }

  return (
    <section className="page-stack">
      <div className="two-column align-start">
        <DataCard title="上报异常" eyebrow="Risk Report">
          <form className="form-grid" onSubmit={submit}>
            <SelectField name="sample_id" label="样本">{samples.map((sample) => <option key={sample.id} value={sample.id}>{sample.code} · {sample.location}</option>)}</SelectField>
            <Input name="title" label="异常标题" required placeholder="溶解氧低于参考下限" />
            <SelectField name="level" label="等级"><option>低</option><option>中</option><option>高</option></SelectField>
            <TextareaField name="description" label="描述" required placeholder="说明异常现象和现场情况" />
            <button className="primary-button" type="submit">提交异常</button>
          </form>
        </DataCard>
        <DataCard title="分析建议" eyebrow="Analysis">
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
            <thead><tr><th>标题</th><th>样本</th><th>等级</th><th>状态</th><th>处理说明</th><th>操作</th></tr></thead>
            <tbody>{exceptions.map((item) => <tr key={item.id}><td>{item.title}</td><td>{item.sample?.code ?? '-'}</td><td><Badge tone={item.level === '高' ? 'danger' : 'warning'}>{item.level}</Badge></td><td><Badge>{statusText[item.status] ?? item.status}</Badge></td><td>{item.resolution ?? item.description ?? '-'}</td><td><button className="ghost-button" disabled={item.status === '已处理'} onClick={() => resolve(item.id)} type="button">标记解决</button></td></tr>)}</tbody>
          </table>
        </div>
      </DataCard>
    </section>
  )
}
