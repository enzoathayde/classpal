import type { ReactNode } from 'react'

export type DataTableColumn<T> = {
  id: string
  header: string
  render: (row: T) => ReactNode
}

type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  emptyMessage?: string
  loading?: boolean
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = 'Nenhum registro.',
  loading = false,
}: DataTableProps<T>) {
  if (loading) {
    return <p className="typewriter">Carregando canal…</p>
  }

  return (
    <table className="sheet-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.id}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={columns.length}>{emptyMessage}</td>
          </tr>
        )}
        {rows.map((row) => (
          <tr key={rowKey(row)}>
            {columns.map((col) => (
              <td key={col.id}>{col.render(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
