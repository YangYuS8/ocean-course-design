/**
 * 检测结果页面。
 *
 * 负责给样本录入检测指标、检测值、单位、参考范围和检测人。
 * 是否异常不由前端决定，而是提交给后端 ResultController，由 PHP 根据 standard_min / standard_max 统一判断。
 */
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { DataCard } from '../components/ui/DataCard'
import { DataTable } from '../components/ui/DataTable'
import { Input, SelectField } from '../components/ui/FormField'
import { api } from '../api'
import type { Sample, SampleResult } from '../types'

export function ResultsPage({ results, samples, onChanged }: { results: SampleResult[]; samples: Sample[]; onChanged: () => Promise<void> }) {
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    setSubmitting(true)
    setNotice('')
    try {
      const form = new FormData(formElement)
      const sampleId = Number(form.get('sample_id'))
      form.delete('sample_id')
      const result = await api.addResult(sampleId, Object.fromEntries(form.entries()))
      formElement.reset()
      await onChanged()
      setNotice(`已保存检测结果：${result.indicator}，判断结果为${result.is_abnormal ? '异常' : '正常'}。`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '检测结果保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="two-column align-start">
      <DataCard title="录入检测结果" eyebrow="Lab Result">
        <form className="form-grid" onSubmit={submit}>
          <SelectField name="sample_id" label="样本">{samples.map((sample) => <option key={sample.id} value={sample.id}>{sample.code} · {sample.location}</option>)}</SelectField>
          <Input name="indicator" label="检测指标" required placeholder="溶解氧" />
          <Input name="value" label="检测值" required placeholder="3.2" type="number" step="0.01" />
          <Input name="unit" label="单位" placeholder="mg/L" />
          <Input name="standard_min" label="参考下限" placeholder="5" type="number" step="0.01" />
          <Input name="standard_max" label="参考上限" placeholder="8.5" type="number" step="0.01" />
          <Input name="tested_at" label="检测时间" required type="datetime-local" />
          <Input name="tester" label="检测人" required placeholder="陈一鸣" />
          <button className="primary-button" disabled={submitting} type="submit">{submitting ? '保存中…' : '保存结果'}</button>
          {notice ? <p className="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">{notice}</p> : null}
        </form>
      </DataCard>
      <DataCard title="结果列表" eyebrow="Indicators">
        <DataTable headers={['样本', '指标', '数值', '参考范围', '检测人', '是否异常']} rows={results.map((item) => [item.sample?.code ?? `#${item.sample_id}`, item.indicator, `${item.value}${item.unit ?? ''}`, `${item.standard_min ?? '-'} ~ ${item.standard_max ?? '-'}`, item.tester ?? '-', <Badge tone={item.is_abnormal ? 'warning' : 'success'}>{item.is_abnormal ? '异常' : '正常'}</Badge>])} />
      </DataCard>
    </section>
  )
}
