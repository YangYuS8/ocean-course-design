/**
 * 检测结果页面。
 *
 * 负责给样本录入、修改和删除检测指标。是否异常不由前端决定，
 * 而是提交给后端 ResultController，由 PHP 根据 standard_min / standard_max 统一判断。
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
  const [busyResultId, setBusyResultId] = useState<number | null>(null)
  const [editingResultId, setEditingResultId] = useState<number | null>(null)

  const editingResult = editingResultId ? results.find((item) => item.id === editingResultId) : null

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    setSubmitting(true)
    setNotice('')
    try {
      const form = new FormData(formElement)
      const sampleId = Number(form.get('sample_id'))
      const data = Object.fromEntries(form.entries())
      const result = editingResult ? await api.updateResult(editingResult.id, data) : await api.addResult(sampleId, data)
      formElement.reset()
      setEditingResultId(null)
      await onChanged()
      setNotice(`${editingResult ? '已修改' : '已保存'}检测结果：${result.indicator}，判断结果为${result.is_abnormal ? '异常' : '正常'}。`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '检测结果保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  const editResult = (result: SampleResult) => {
    setEditingResultId(result.id)
    setNotice(`正在修改检测结果：${result.indicator}`)
  }

  const cancelEdit = () => {
    setEditingResultId(null)
    setNotice('已取消修改检测结果')
  }

  const deleteResult = async (result: SampleResult) => {
    if (!window.confirm(`确定删除检测结果“${result.indicator}”吗？`)) return

    setBusyResultId(result.id)
    setNotice('')
    try {
      await api.deleteResult(result.id)
      if (editingResultId === result.id) setEditingResultId(null)
      await onChanged()
      setNotice(`已删除检测结果：${result.indicator}`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '检测结果删除失败')
    } finally {
      setBusyResultId(null)
    }
  }

  return (
    <section className="two-column align-start">
      <DataCard title={editingResult ? '修改检测结果' : '录入检测结果'} eyebrow="Lab Result">
        <form className="form-grid" key={editingResult?.id ?? 'create-result'} onSubmit={submit}>
          <SelectField name="sample_id" label="样本" defaultValue={editingResult?.sample_id ?? samples[0]?.id}>{samples.map((sample) => <option key={sample.id} value={sample.id}>{sample.code} · {sample.location}</option>)}</SelectField>
          <Input name="indicator" label="检测指标" required defaultValue={editingResult?.indicator ?? ''} placeholder="溶解氧" />
          <Input name="value" label="检测值" required defaultValue={editingResult?.value ?? ''} placeholder="3.2" type="number" step="0.01" />
          <Input name="unit" label="单位" defaultValue={editingResult?.unit ?? ''} placeholder="mg/L" />
          <Input name="standard_min" label="参考下限" defaultValue={editingResult?.standard_min ?? ''} placeholder="5" type="number" step="0.01" />
          <Input name="standard_max" label="参考上限" defaultValue={editingResult?.standard_max ?? ''} placeholder="8.5" type="number" step="0.01" />
          <Input name="tested_at" label="检测时间" required defaultValue={editingResult?.tested_at?.replace(' ', 'T') ?? ''} type="datetime-local" />
          <Input name="tester" label="检测人" required defaultValue={editingResult?.tester ?? ''} placeholder="陈一鸣" />
          <div className="actions">
            <button className="primary-button" disabled={submitting} type="submit">{submitting ? '保存中…' : editingResult ? '保存修改' : '保存结果'}</button>
            {editingResult ? <button className="ghost-button" disabled={submitting} onClick={cancelEdit} type="button">取消修改</button> : null}
          </div>
          {notice ? <p className="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">{notice}</p> : null}
        </form>
      </DataCard>
      <DataCard title="结果列表" eyebrow="Indicators">
        <DataTable
          headers={['样本', '指标', '数值', '参考范围', '检测人', '是否异常', '操作']}
          rows={results.map((item) => [
            item.sample?.code ?? `#${item.sample_id}`,
            item.indicator,
            `${item.value}${item.unit ?? ''}`,
            `${item.standard_min ?? '-'} ~ ${item.standard_max ?? '-'}`,
            item.tester ?? '-',
            <Badge tone={item.is_abnormal ? 'warning' : 'success'}>{item.is_abnormal ? '异常' : '正常'}</Badge>,
            <div className="actions">
              <button className="ghost-button" disabled={busyResultId === item.id} onClick={() => editResult(item)} type="button">修改</button>
              <button className="ghost-button" disabled={busyResultId === item.id} onClick={() => deleteResult(item)} type="button">{busyResultId === item.id ? '处理中…' : '删除'}</button>
            </div>,
          ])}
        />
      </DataCard>
    </section>
  )
}
