/**
 * 通用表格组件。
 *
 * 接收表头 headers 和行数据 rows，用于任务、样本、结果、异常、用户等列表展示。
 */
import type { ReactNode } from 'react'

export function DataTable({ headers, rows, emptyText = '暂无数据' }: { headers: string[]; rows: ReactNode[][]; emptyText?: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-[0.14em] text-teal-900">
          <tr>{headers.map((header) => <th className="border-b border-slate-200 px-4 py-3.5" key={header}>{header}</th>)}</tr>
        </thead>
        <tbody className="text-sm text-slate-700">
          {rows.length > 0 ? rows.map((row, index) => <tr className="border-b border-slate-100 last:border-0" key={index}>{row.map((cell, cellIndex) => <td className="px-4 py-4 align-middle" key={cellIndex}>{cell ?? '-'}</td>)}</tr>) : (
            <tr><td className="px-4 py-8 text-center text-slate-500" colSpan={headers.length}>{emptyText}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
