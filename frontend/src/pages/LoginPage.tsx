import type { FormEvent } from 'react'
import { useState } from 'react'
import { Input } from '../components/ui/FormField'
import { api, storeToken } from '../api'
import type { User } from '../types'

export function LoginPage({ onLogin }: { onLogin: (user: User) => void }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = Object.fromEntries(new FormData(event.currentTarget).entries())
      const response = await api.login(payload)
      storeToken(response.token)
      onLogin(response.user)
    } catch (e) {
      setError(e instanceof Error ? e.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-[1.05fr_0.95fr] bg-slate-950 text-white">
      <section className="relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.28),transparent_28rem),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.18),transparent_24rem)]" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-2xl border border-teal-100/30 bg-teal-300/10 font-black">汐</div><div><strong>Ocean Atelier</strong><span className="block text-sm text-cyan-50/50">海洋巡检管理平台</span></div></div>
          <div className="max-w-2xl"><span className="text-xs font-black uppercase tracking-[0.2em] text-teal-200">Operational Console</span><h1 className="mt-5 text-6xl font-black leading-none tracking-[-0.065em]">让巡检、样本、异常与分析在一个平台里闭环。</h1><p className="mt-6 text-lg leading-8 text-cyan-50/62">以清晰的业务链路组织数据、协作与处置流程。</p></div>
          <div className="grid grid-cols-3 gap-3 text-sm text-cyan-50/65"><span>任务调度</span><span>样本追踪</span><span>异常处置</span></div>
        </div>
      </section>
      <section className="grid place-items-center bg-slate-50 px-10 text-slate-950">
        <form className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-950/10" onSubmit={submit}>
          <span className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Secure Login</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight">登录管理平台</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">请使用管理员账户登录后进入工作台。</p>
          <div className="mt-7 grid gap-4"><Input defaultValue="demo@example.com" label="邮箱" name="email" type="email" /><Input defaultValue="password" label="密码" name="password" type="password" /></div>
          {error ? <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
          <button className="mt-7 w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white transition hover:bg-teal-800" disabled={loading} type="submit">{loading ? '登录中…' : '进入系统'}</button>
        </form>
      </section>
    </main>
  )
}
