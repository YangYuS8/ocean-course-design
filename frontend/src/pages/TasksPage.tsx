/**
 * 巡检任务页面。
 *
 * 负责新建任务、开始任务和提交任务。
 * 表单提交后会调用 api.createTask()；操作成功后调用 onChanged() 重新刷新后端数据。
 */
import type { FormEvent } from 'react'
import { useState } from 'react'
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
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td><td>{task.area}</td><td>{task.inspector}</td><td>{task.samples_count ?? 0}</td>
                  <td><Badge>{statusText[task.status] ?? task.status}</Badge></td>
                  <td className="actions">
                    <button disabled={busyTaskId === task.id || task.status === '进行中'} onClick={() => changeStatus(task, 'start')} type="button">{busyTaskId === task.id ? '处理中…' : '开始'}</button>
                    <button className="ghost-button" disabled={busyTaskId === task.id || task.status === '已提交'} onClick={() => changeStatus(task, 'submit')} type="button">{busyTaskId === task.id ? '处理中…' : '提交'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
    </section>
  )
}
