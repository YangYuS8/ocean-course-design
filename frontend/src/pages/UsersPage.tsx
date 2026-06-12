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
  const [error, setError] = useState('')

  const loadUsers = async () => {
    try {
      setUsers(await api.getUsers())
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : '用户列表加载失败')
    }
  }

  useEffect(() => { void loadUsers() }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await api.createUser(Object.fromEntries(new FormData(event.currentTarget).entries()))
    event.currentTarget.reset()
    await loadUsers()
  }

  const toggleRole = async (user: User) => {
    await api.updateUser(user.id, { role: user.role === 'admin' ? 'user' : 'admin' })
    await loadUsers()
  }

  const removeUser = async (user: User) => {
    if (user.id === currentUser.id) return
    await api.deleteUser(user.id)
    await loadUsers()
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
      <DataCard title="创建用户" eyebrow="Account Provisioning">
        <form className="grid gap-4" onSubmit={submit}>
          <Input label="姓名" name="name" placeholder="巡检员姓名" required />
          <Input label="邮箱" name="email" placeholder="user@example.com" required type="email" />
          <Input label="初始密码" name="password" placeholder="至少 6 位" required type="password" />
          <SelectField label="角色" name="role"><option value="user">普通用户</option><option value="admin">管理员</option></SelectField>
          <button className="rounded-xl bg-slate-950 px-4 py-3 font-bold text-white transition hover:bg-teal-800" type="submit">创建用户</button>
          {error ? <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}
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
              <button className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-teal-800" onClick={() => void toggleRole(user)} type="button">切换角色</button>
              <button className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40" disabled={user.id === currentUser.id} onClick={() => void removeUser(user)} type="button">删除</button>
            </div>,
          ])}
        />
      </DataCard>
    </section>
  )
}
