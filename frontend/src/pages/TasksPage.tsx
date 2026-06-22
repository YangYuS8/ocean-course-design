/**
 * 巡检任务页面。
 *
 * 负责新建任务、开始任务、提交任务和删除任务。
 * 表单提交后会调用 api.createTask()；操作成功后调用 onChanged() 重新刷新后端数据。
 */
import type { FormEvent } from 'react'
import { Fragment, useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { DataCard } from '../components/ui/DataCard'
import { Input, TextareaField } from '../components/ui/FormField'
import { statusText } from '../constants/status'
import { api } from '../api'
import type { InspectionTask } from '../types'
import { formToObject } from '../utils/form'

export function TasksPage({ tasks, onChanged }: { tasks: InspectionTask[]; onChanged: () => Promise<void> }) {
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [busyTaskId, setBusyTaskId] = useState<number | null>(null)
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null)

  const formatDateTime = (value?: string | null) => value || '未记录'

  const nextStatusAction = (task: InspectionTask): 'start' | 'submit' | null => {
    if (task.status === '待开始') return 'start'
    if (task.status === '进行中') return 'submit'
    return null
  }

  const nextStatusLabel = (task: InspectionTask) => {
    const action = nextStatusAction(task)
    if (action === 'start') return '开始任务'
    if (action === 'submit') return '提交任务'
    return '已完成'
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    setSubmitting(true)
    setNotice('')
    try {
      const task = await api.createTask(formToObject(formElement))
      formElement.reset()
      await onChanged()
      setNotice(`已保存任务：${task.title}`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '任务保存失败')
    } finally {
      setSubmitting(false)
    }
  }

  const changeStatus = async (task: InspectionTask, action: 'start' | 'submit') => {
    setBusyTaskId(task.id)
    setNotice('')
    try {
      const updated = action === 'start' ? await api.startTask(task.id) : await api.submitTask(task.id)
      await onChanged()
      setNotice(`任务“${updated.title}”状态已更新为：${updated.status}`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '任务状态更新失败')
    } finally {
      setBusyTaskId(null)
    }
  }

  const advanceStatus = async (task: InspectionTask) => {
    const action = nextStatusAction(task)
    if (!action) return
    await changeStatus(task, action)
  }

  const deleteTask = async (task: InspectionTask) => {
    const sampleCount = task.samples_count ?? 0
    const warning = sampleCount > 0 ? `，并同步删除下面的 ${sampleCount} 个样本及其检测/异常/分析记录` : ''
    if (!window.confirm(`确定删除巡检任务“${task.title}”吗？${warning}`)) return

    setBusyTaskId(task.id)
    setNotice('')
    try {
      await api.deleteTask(task.id)
      await onChanged()
      setNotice(`已删除任务：${task.title}`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '任务删除失败')
    } finally {
      setBusyTaskId(null)
    }
  }

  return (
    <section className="two-column align-start">
      <DataCard title="新建巡检任务" eyebrow="Mission Form">
        <form className="form-grid" onSubmit={submit}>
          <Input name="title" label="任务名称" required placeholder="例如：近岸水质巡检" />
          <Input name="area" label="巡检区域" required placeholder="例如：东湾 A 区" />
          <Input name="inspector" label="负责人" required placeholder="巡检人员姓名" />
          <Input name="planned_date" label="计划日期" required type="date" />
          <TextareaField name="description" label="任务说明" placeholder="说明本次巡检关注的海域、指标或现场目标" />
          <button className="primary-button" disabled={submitting} type="submit">{submitting ? '保存中…' : '保存任务'}</button>
          {notice ? <p className="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">{notice}</p> : null}
        </form>
      </DataCard>
      <DataCard title="任务列表" eyebrow="Mission Board">
        <div className="table-wrap">
          <table>
            <thead><tr><th>名称</th><th>区域</th><th>负责人</th><th>样本数</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>
              {tasks.map((task) => {
                const expanded = expandedTaskId === task.id
                const canAdvance = nextStatusAction(task) !== null

                return (
                  <Fragment key={task.id}>
                    <tr
                      className="cursor-pointer"
                      onClick={() => setExpandedTaskId(expanded ? null : task.id)}
                      title="点击查看任务详情"
                    >
                      <td>{task.title}</td><td>{task.area}</td><td>{task.inspector}</td><td>{task.samples_count ?? 0}</td>
                      <td><Badge>{statusText[task.status] ?? task.status}</Badge></td>
                      <td className="actions" onClick={(event) => event.stopPropagation()}>
                        <button disabled={busyTaskId === task.id || !canAdvance} onClick={() => advanceStatus(task)} type="button">{busyTaskId === task.id ? '处理中…' : nextStatusLabel(task)}</button>
                        <button className="ghost-button" disabled={busyTaskId === task.id} onClick={() => deleteTask(task)} type="button">{busyTaskId === task.id ? '处理中…' : '删除'}</button>
                      </td>
                    </tr>
                    {expanded ? (
                      <tr>
                        <td colSpan={6}>
                          <div className="detail-grid">
                            <span><strong>任务编号</strong>#{task.id}</span>
                            <span><strong>计划日期</strong>{task.planned_date || '未设置'}</span>
                            <span><strong>开始时间</strong>{formatDateTime(task.started_at)}</span>
                            <span><strong>提交时间</strong>{formatDateTime(task.submitted_at)}</span>
                            <span><strong>创建时间</strong>{formatDateTime(task.created_at)}</span>
                            <span><strong>更新时间</strong>{formatDateTime(task.updated_at)}</span>
                            <span><strong>当前状态</strong>{statusText[task.status] ?? task.status}</span>
                            <span><strong>样本数量</strong>{task.samples_count ?? 0} 个</span>
                          </div>
                          <p className="mt-3 rounded-2xl border border-ocean-line bg-ocean-soft px-4 py-3 text-sm leading-6 text-ocean-ink">
                            <strong className="mb-1 block text-[11px] font-black uppercase tracking-[0.14em] text-ocean-muted">任务说明</strong>
                            {task.description || '暂无任务说明'}
                          </p>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </DataCard>
    </section>
  )
}
