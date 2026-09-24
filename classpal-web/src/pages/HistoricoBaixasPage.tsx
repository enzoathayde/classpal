import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { AuthNav } from '../components/AuthNav'
import { Masthead } from '../components/Masthead'
import { Modal } from '../components/Modal'
import { SectionMarker } from '../components/SectionMarker'
import { DataTable, type DataTableColumn } from '../components/ui/DataTable'
import { DEFAULT_PAGER_LIMIT, Pager, type PagerLimit } from '../components/ui/Pager'
import { baixasApi, type BaixaItem } from '../lib/api'
import { getAccessUuid } from '../lib/auth'
import {
  brDateToIso,
  compareBrDates,
  isFutureBrDate,
  isValidBrDate,
  maskDateBr,
} from '../lib/datetime'

function formatBaixaEm(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

type AlertState = { title: string; message: string } | null

export function HistoricoBaixasPage() {
  const accessUuid = getAccessUuid()!
  const [nome, setNome] = useState('')
  const [de, setDe] = useState('')
  const [ate, setAte] = useState('')
  const [applied, setApplied] = useState({ nome: '', deIso: '', ateIso: '' })
  const [limit, setLimit] = useState<PagerLimit>(DEFAULT_PAGER_LIMIT)
  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState<BaixaItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [alert, setAlert] = useState<AlertState>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const page = await baixasApi.listar(accessUuid, {
        nome: applied.nome || undefined,
        de: applied.deIso || undefined,
        ate: applied.ateIso || undefined,
        limit,
        offset,
      })
      setItems(page.items)
      setTotal(page.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar histórico')
    } finally {
      setLoading(false)
    }
  }, [accessUuid, applied, limit, offset])

  useEffect(() => {
    void load()
  }, [load])

  function onFilter(e: FormEvent) {
    e.preventDefault()
    const deTrim = de.trim()
    const ateTrim = ate.trim()

    if (deTrim && deTrim.length < 10) {
      setAlert({
        title: 'Data incompleta',
        message: 'Complete a data inicial no formato DD/MM/AAAA.',
      })
      return
    }
    if (ateTrim && ateTrim.length < 10) {
      setAlert({
        title: 'Data incompleta',
        message: 'Complete a data final no formato DD/MM/AAAA.',
      })
      return
    }
    if ((deTrim && !isValidBrDate(deTrim)) || (ateTrim && !isValidBrDate(ateTrim))) {
      setAlert({
        title: 'Data inválida',
        message: 'Informe uma data válida no formato DD/MM/AAAA.',
      })
      return
    }
    if ((deTrim && isFutureBrDate(deTrim)) || (ateTrim && isFutureBrDate(ateTrim))) {
      setAlert({
        title: 'Data futura',
        message: 'Não é permitido filtrar por datas futuras. Informe hoje ou uma data anterior.',
      })
      return
    }
    if (deTrim && ateTrim && compareBrDates(deTrim, ateTrim) > 0) {
      setAlert({
        title: 'Intervalo inválido',
        message: 'A data inicial (De) não pode ser posterior à data final (Até).',
      })
      return
    }

    setOffset(0)
    setApplied({
      nome: nome.trim(),
      deIso: deTrim ? brDateToIso(deTrim) : '',
      ateIso: ateTrim ? brDateToIso(ateTrim) : '',
    })
  }

  function onClear() {
    setNome('')
    setDe('')
    setAte('')
    setOffset(0)
    setApplied({ nome: '', deIso: '', ateIso: '' })
  }

  const columns = useMemo<DataTableColumn<BaixaItem>[]>(
    () => [
      {
        id: 'alunoNome',
        header: 'Nome do aluno',
        render: (item) => item.alunoNome,
      },
      {
        id: 'baixaEm',
        header: 'Horário da baixa',
        render: (item) => formatBaixaEm(item.baixaEm),
      },
    ],
    [],
  )

  return (
    <div className="app-shell">
      <Masthead meta="CHANNEL · HISTÓRICO DE BAIXAS" />
      <AuthNav />

      <section className="section">
        <SectionMarker line="LINE 01" title="Filtros" />
        <form className="filter-row teletype" onSubmit={onFilter} noValidate>
          <div>
            <label className="typewriter" htmlFor="filtro-nome">
              Nome
            </label>
            <input
              id="filtro-nome"
              className="cell-input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Buscar aluno"
            />
          </div>
          <div>
            <label className="typewriter" htmlFor="filtro-de">
              De
            </label>
            <input
              id="filtro-de"
              className="cell-input"
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              maxLength={10}
              autoComplete="off"
              spellCheck={false}
              value={de}
              onChange={(e) => setDe(maskDateBr(e.target.value))}
            />
          </div>
          <div>
            <label className="typewriter" htmlFor="filtro-ate">
              Até
            </label>
            <input
              id="filtro-ate"
              className="cell-input"
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              maxLength={10}
              autoComplete="off"
              spellCheck={false}
              value={ate}
              onChange={(e) => setAte(maskDateBr(e.target.value))}
            />
          </div>
          <div className="filter-actions">
            <button className="btn" type="submit">
              Filtrar
            </button>
            <button className="btn btn-ghost" type="button" onClick={onClear}>
              Limpar
            </button>
          </div>
        </form>
      </section>

      <section className="section">
        <SectionMarker line="LINE 02" title="Baixas" />
        {error && <p className="flash error">{error}</p>}
        <DataTable
          columns={columns}
          rows={items}
          rowKey={(item) => item.id}
          loading={loading}
          emptyMessage="Nenhuma baixa encontrada neste intervalo."
        />
        {!loading && (
          <Pager
            total={total}
            limit={limit}
            offset={offset}
            onPrev={() => setOffset((o) => Math.max(0, o - limit))}
            onNext={() => setOffset((o) => o + limit)}
            onLimitChange={(next) => {
              setLimit(next)
              setOffset(0)
            }}
          />
        )}
      </section>

      {alert && (
        <Modal title={alert.title} onClose={() => setAlert(null)} alertOnly>
          <p>{alert.message}</p>
        </Modal>
      )}
    </div>
  )
}
