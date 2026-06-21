/**
 * 异常处理与分析页面。
 *
 * 负责手动上报异常、标记异常已处理，以及触发后端生成分析建议。
 * 检测结果超标时后端也会自动生成异常，这里则提供人工补充和处理入口。
 */
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { DataCard } from '../components/ui/DataCard'
import { Input, SelectField, TextareaField } from '../components/ui/FormField'
import { api } from '../api'
import { statusText } from '../constants/status'
import type { AnalysisJob, ExceptionRecord, Sample } from '../types'
import { formToObject } from '../utils/form'

export function ExceptionsPage({ exceptions, samples, onChanged }: { exceptions: ExceptionRecord[]; samples: Sample[]; onChanged: () => Promise<void> }) {
  const [latestAnalysis, setLatestAnalysis] = useState<AnalysisJob | null>(null)
  const [analyzingSampleId, setAnalyzingSampleId] = useState<number | null>(null)
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resolvingId, setResolvingId] = useState<number | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    setSubmitting(true)
    setNotice('')
    try {
      const exception = await api.createException(formToObject(formElement))
      formElement.reset()
      await onChanged()
      setNotice(`已提交异常：${exception.title}`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '异常提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  const resolve = async (id: number) => {
    setResolvingId(id)
    setNotice('')
    try {
      const exception = await api.resolveException(id, '已完成现场复核并记录处置结果。')
      await onChanged()
      setNotice(`异常“${exception.title}”已标记为已处理。`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '异常处理失败')
    } finally {
      setResolvingId(null)
    }
  }

  const analyze = async (sample: Sample) => {
    setAnalyzingSampleId(sample.id)
    try {
      const analysis = await api.analyzeSample(sample.id)
      setLatestAnalysis(analysis)
      await onChanged()
    } finally {
      setAnalyzingSampleId(null)
    }
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
            <button className="primary-button" disabled={submitting} type="submit">{submitting ? '提交中…' : '提交异常'}</button>
            {notice ? <p className="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">{notice}</p> : null}
          </form>
        </DataCard>
        <DataCard title="分析建议" eyebrow="Analysis">
          <div className="analysis-list">
            {samples.map((sample) => (
              <div className="analysis-row" key={sample.id}>
                <div><strong>{sample.code}</strong><span>{sample.location}</span></div>
                <button disabled={analyzingSampleId === sample.id} onClick={() => analyze(sample)} type="button">{analyzingSampleId === sample.id ? '生成中…' : '生成建议'}</button>
              </div>
            ))}
          </div>
          {latestAnalysis ? (
            <div className="mt-5 rounded-3xl border border-teal-100 bg-teal-50/70 p-5 text-sm leading-7 text-slate-700">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge tone="success">已生成</Badge>
                <strong className="text-slate-950">{latestAnalysis.sample?.code ?? `样本 #${latestAnalysis.sample_id}`}</strong>
              </div>
              <p><strong>报告摘要：</strong>{latestAnalysis.report_summary ?? latestAnalysis.summary ?? '-'}</p>
              <p><strong>处置建议：</strong>{latestAnalysis.suggestion ?? '-'}</p>
              <p className="mt-2 text-xs text-slate-500">这条记录已保存到分析记录表，也会出现在首页“近期分析建议”和样本详情中。</p>
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">点击“生成建议”后，系统会根据该样本的检测结果和待处理异常生成分析记录。</p>
          )}
        </DataCard>
      </div>
      <DataCard title="异常处理列表" eyebrow="Resolution">
        <div className="table-wrap">
          <table>
            <thead><tr><th>标题</th><th>样本</th><th>等级</th><th>状态</th><th>处理说明</th><th>操作</th></tr></thead>
            <tbody>{exceptions.map((item) => <tr key={item.id}><td>{item.title}</td><td>{item.sample?.code ?? '-'}</td><td><Badge tone={item.level === '高' ? 'danger' : 'warning'}>{item.level}</Badge></td><td><Badge>{statusText[item.status] ?? item.status}</Badge></td><td>{item.resolution ?? item.description ?? '-'}</td><td><button className="ghost-button" disabled={resolvingId === item.id || item.status === '已处理'} onClick={() => resolve(item.id)} type="button">{resolvingId === item.id ? '处理中…' : '标记解决'}</button></td></tr>)}</tbody>
          </table>
        </div>
      </DataCard>
    </section>
  )
}
