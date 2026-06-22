/**
 * 用户管理页面。
 *
 * 这是简化版账号管理界面：管理员可以创建用户、修改用户信息、切换角色、删除用户。
 * 具体权限判断仍由后端 UserController 完成，前端只负责展示按钮和提交请求。
 */
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { api } from '../api'
import { Badge } from '../components/ui/Badge'
import { DataCard } from '../components/ui/DataCard'
import { DataTable } from '../components/ui/DataTable'
import { Input, SelectField } from '../components/ui/FormField'
import type { User } from '../types'

export function UsersPage({ currentUser }: { currentUser: User }) {
  const [users, setUsers] = useState<User[]>([])
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [busyUserId, setBusyUserId] = useState<number | null>(null)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)

  const editingUser = editingUserId ? users.find((user) => user.id === editingUserId) : null

  const loadUsers = async () => {
    try {
      setUsers(await api.getUsers())
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '用户列表加载失败')
    }
  }

  useEffect(() => { void loadUsers() }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const data = Object.fromEntries(new FormData(formElement).entries())
    setSubmitting(true)
    setNotice('')
    try {
      const user = editingUser ? await api.updateUser(editingUser.id, data) : await api.createUser(data)
      formElement.reset()
      setEditingUserId(null)
      await loadUsers()
      setNotice(editingUser ? `已修改用户：${user.name}` : `已创建用户：${user.name}`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : editingUser ? '用户修改失败' : '用户创建失败')
    } finally {
      setSubmitting(false)
    }
  }

  const editUser = (user: User) => {
    setEditingUserId(user.id)
    setNotice(`正在修改用户：${user.name}`)
  }

  const cancelEdit = () => {
    setEditingUserId(null)
    setNotice('已取消修改用户')
  }

  const toggleRole = async (user: User) => {
    setBusyUserId(user.id)
    setNotice('')
    try {
      const updated = await api.updateUser(user.id, { role: user.role === 'admin' ? 'user' : 'admin' })
      await loadUsers()
      setNotice(`用户“${updated.name}”角色已更新为：${updated.role === 'admin' ? '管理员' : '普通用户'}`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '角色更新失败')
    } finally {
      setBusyUserId(null)
    }
  }

  const removeUser = async (user: User) => {
    if (user.id === currentUser.id) return
    if (!window.confirm(`确定删除用户“${user.name}”吗？`)) return

    setBusyUserId(user.id)
    setNotice('')
    try {
      await api.deleteUser(user.id)
      if (editingUserId === user.id) setEditingUserId(null)
      await loadUsers()
      setNotice(`已删除用户：${user.name}`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '用户删除失败')
    } finally {
      setBusyUserId(null)
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
      <DataCard title={editingUser ? '修改用户' : '创建用户'} eyebrow="Account Provisioning">
        <form className="grid gap-4" key={editingUser?.id ?? 'create-user'} onSubmit={submit}>
          <Input label="姓名" name="name" defaultValue={editingUser?.name ?? ''} placeholder="巡检员姓名" required />
          <Input label="邮箱" name="email" defaultValue={editingUser?.email ?? ''} placeholder="user@example.com" required type="email" />
          <Input label={editingUser ? '新密码（留空则不修改）' : '初始密码'} name="password" placeholder="至少 6 位" required={!editingUser} type="password" />
          <SelectField label="角色" name="role" defaultValue={editingUser?.role ?? 'user'}><option value="user">普通用户</option><option value="admin">管理员</option></SelectField>
          <div className="actions">
            <button className="rounded-xl bg-slate-950 px-4 py-3 font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting} type="submit">{submitting ? '保存中…' : editingUser ? '保存修改' : '创建用户'}</button>
            {editingUser ? <button className="ghost-button" disabled={submitting} onClick={cancelEdit} type="button">取消修改</button> : null}
          </div>
          {notice ? <p className="rounded-xl bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800">{notice}</p> : null}
        </form>
      </DataCard>
      <DataCard title="用户列表" eyebrow="Access Control">
        <DataTable
          headers={['姓名', '邮箱', '角色', '操作']}
          rows={users.map((user) => [
            user.name,
            user.email,
            <Badge tone={user.role === 'admin' ? 'info' : 'neutral'}>{user.role === 'admin' ? '管理员' : '普通用户'}</Badge>,
            <div className="flex flex-wrap gap-2">
              <button className="ghost-button" disabled={busyUserId === user.id} onClick={() => editUser(user)} type="button">修改</button>
              <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={busyUserId === user.id} onClick={() => void toggleRole(user)} type="button">{busyUserId === user.id ? '处理中…' : '切换角色'}</button>
              <button className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40" disabled={busyUserId === user.id || user.id === currentUser.id} onClick={() => void removeUser(user)} type="button">{busyUserId === user.id ? '处理中…' : '删除'}</button>
            </div>,
          ])}
        />
      </DataCard>
    </section>
  )
}
