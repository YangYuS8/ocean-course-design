/**
 * 样本管理页面。
 *
 * 负责把现场采集的水样登记到某个巡检任务下面，并通过样本详情展示检测结果、异常记录和分析报告摘要。
 * 这里体现了前端表单字段必须和 Laravel 后端校验字段保持一致：inspection_task_id、code、location、collector 等。
 */
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { DataCard } from '../components/ui/DataCard'
import { DataTable } from '../components/ui/DataTable'
import { Input, SelectField, TextareaField } from '../components/ui/FormField'
import { api } from '../api'
import type { InspectionTask, Sample } from '../types'
import { formToObject } from '../utils/form'

export function SamplesPage({ samples, tasks, onChanged }: { samples: Sample[]; tasks: InspectionTask[]; onChanged: () => Promise<void> }) {
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    setSubmitting(true)
    setNotice('')
    try {
      const sample = await api.createSample(formToObject(formElement))
      formElement.reset()
      await onChanged()
      setNotice(`已登记样本：${sample.code}`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '样本登记失败')
    } finally {
      setSubmitting(false)
    }
  }

  const loadDetail = async (id: number) => {
    setDetailLoading(true)
    setNotice('')
    try {
      setSelectedSample(await api.getSample(id))
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '样本详情加载失败')
    } finally {
      setDetailLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedSample) return
    const stillExists = samples.some((item) => item.id === selectedSample.id)
    if (!stillExists) setSelectedSample(null)
  }, [samples, selectedSample])

  return (
    <section className="page-stack">
      <section className="two-column align-start">
        <DataCard title="登记样本" eyebrow="Sample Registry">
          <form className="form-grid" onSubmit={submit}>
            <SelectField name="inspection_task_id" label="关联任务">{tasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}</SelectField>
            <Input name="code" label="样本编号" required placeholder="S-202606-004" />
            <Input name="location" label="采样点位" required placeholder="东湾 A3 点位" />
            <Input name="collector" label="采样人" required placeholder="李珊" />
            <Input name="water_type" label="水体类型" placeholder="近岸海水" />
            <Input name="weather" label="现场天气" placeholder="晴 / 多云 / 小雨" />
            <Input name="coordinate" label="采样坐标" placeholder="121.48,38.92" />
            <Input name="collected_at" label="采样时间" required type="datetime-local" />
            <TextareaField name="notes" label="现场备注" placeholder="记录天气、水体气味、颜色等现场情况" />
            <button className="primary-button" disabled={submitting} type="submit">{submitting ? '登记中…' : '登记样本'}</button>
            {notice ? <p className="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">{notice}</p> : null}
          </form>
        </DataCard>
        <DataCard title="样本列表" eyebrow="Sample Archive">
          <DataTable
            headers={['编号', '点位', '采样人', '天气', '坐标', '状态', '操作']}
            rows={samples.map((item) => [
              item.code,
              item.location,
              item.collector ?? '-',
              item.weather ?? '-',
              item.coordinate ?? '-',
              <Badge>{item.status ?? '已登记'}</Badge>,
              <button className="ghost-button" disabled={detailLoading && selectedSample?.id === item.id} onClick={() => loadDetail(item.id)} type="button">{detailLoading && selectedSample?.id === item.id ? '加载中…' : '查看详情'}</button>,
            ])}
          />
        </DataCard>
      </section>

      <DataCard title="样本详情" eyebrow="Sample Detail">
        {selectedSample ? (
          <div className="grid gap-5">
            <div className="detail-grid">
              <span><strong>样本编号</strong>{selectedSample.code}</span>
              <span><strong>采样点位</strong>{selectedSample.location}</span>
              <span><strong>所属任务</strong>{selectedSample.task?.title ?? '-'}</span>
              <span><strong>采样人</strong>{selectedSample.collector ?? '-'}</span>
              <span><strong>水体类型</strong>{selectedSample.water_type ?? '-'}</span>
              <span><strong>现场天气</strong>{selectedSample.weather ?? '-'}</span>
              <span><strong>采样坐标</strong>{selectedSample.coordinate ?? '-'}</span>
              <span><strong>采样时间</strong>{selectedSample.collected_at ?? '-'}</span>
            </div>
            <DataTable
              emptyText="暂无检测结果"
              headers={['指标', '检测值', '参考范围', '状态', '检测人']}
              rows={(selectedSample.results ?? []).map((item) => [
                item.indicator,
                `${item.value}${item.unit ?? ''}`,
                `${item.standard_min ?? '不限'} ~ ${item.standard_max ?? '不限'}`,
                item.is_abnormal ? <Badge tone="warning">异常</Badge> : <Badge tone="success">正常</Badge>,
                item.tester ?? '-',
              ])}
            />
            <DataTable
              emptyText="暂无异常记录"
              headers={['标题', '等级', '状态', '说明']}
              rows={(selectedSample.exceptions ?? []).map((item) => [item.title, item.level, <Badge>{item.status}</Badge>, item.resolution ?? item.description ?? '-'])}
            />
            <DataTable
              emptyText="暂无分析报告"
              headers={['报告摘要', '处置建议']}
              rows={(selectedSample.analyses ?? []).map((item) => [item.report_summary ?? item.summary ?? '-', item.suggestion ?? '-'])}
            />
          </div>
        ) : (
          <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">请在样本列表中选择一条记录查看详情。</p>
        )}
      </DataCard>
    </section>
  )
}
