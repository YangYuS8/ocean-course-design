import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const controlClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10'
const labelClass = 'grid gap-2 text-sm font-bold text-slate-700'

export function Input({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className={labelClass}><span>{label}</span><input className={controlClass} {...props} /></label>
}

export function SelectField({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  return <label className={labelClass}><span>{label}</span><select className={controlClass} {...props}>{children}</select></label>
}

export function TextareaField({ label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return <label className={labelClass}><span>{label}</span><textarea className={`${controlClass} min-h-28 resize-y`} {...props} /></label>
}
