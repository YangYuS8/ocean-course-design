import type { FormEvent } from 'react'
import { Badge } from '../components/ui/Badge'
import { DataCard } from '../components/ui/DataCard'
import { DataTable } from '../components/ui/DataTable'
import { Input, SelectField } from '../components/ui/FormField'
import { api } from '../api'
import type { Sample, SampleResult } from '../types'

export function ResultsPage({ results, samples, onChanged }: { results: SampleResult[]; samples: Sample[]; onChanged: () => Promise<void> }) {
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
      <DataCard title="录入检测结果" eyebrow="Lab Result">
        <form className="form-grid" onSubmit={submit}>
          <SelectField name="sample_id" label="样本">{samples.map((sample) => <option key={sample.id} value={sample.id}>{sample.code}</option>)}</SelectField>
          <Input name="indicator" label="检测指标" required placeholder="溶解氧" />
          <Input name="value" label="检测值" required placeholder="3.2" />
          <Input name="unit" label="单位" placeholder="mg/L" />
          <Input name="standard_limit" label="标准限值" placeholder="5" />
          <Input name="tested_at" label="检测时间" type="datetime-local" />
          <button className="primary-button" type="submit">保存结果</button>
        </form>
      </DataCard>
      <DataCard title="结果列表" eyebrow="Indicators">
        <DataTable headers={['样本', '指标', '数值', '是否异常']} rows={results.map((item) => [`#${item.sample_id}`, item.indicator, `${item.value}${item.unit}`, <Badge tone={item.is_abnormal ? 'warning' : 'success'}>{item.is_abnormal ? '异常' : '正常'}</Badge>])} />
      </DataCard>
    </section>
  )
}
