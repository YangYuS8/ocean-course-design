import type { ReactNode } from 'react'

export function DataTable({ headers, rows, emptyText = '暂无数据' }: { headers: string[]; rows: ReactNode[][]; emptyText?: string }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>
          {rows.length > 0 ? rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell ?? '-'}</td>)}</tr>) : (
            <tr><td className="empty-cell" colSpan={headers.length}>{emptyText}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
