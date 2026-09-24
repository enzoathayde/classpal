import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { AuthNav } from '../components/AuthNav'
import { Masthead } from '../components/Masthead'
import { Modal } from '../components/Modal'
import { SectionMarker } from '../components/SectionMarker'
import { DataTable, type DataTableColumn } from '../components/ui/DataTable'
import { DEFAULT_PAGER_LIMIT, Pager, type PagerLimit } from '../components/ui/Pager'
import { alunosApi, type Aluno } from '../lib/api'
import { getAccessUuid } from '../lib/auth'
import {
  isFutureBrDate,
  isFutureLocalDateTime,
  isValidBrDate,
  isValidTime24h,
  localDateAndTimeToIso,
  maskDateBr,
  maskTime24h,
  todayBrDate,
} from '../lib/datetime'
import { useDebouncedCallback } from '../lib/useDebouncedCallback'

type Draft = {
  nome: string
  aulasDisponiveis: string
}

type AlertState = { title: string; message: string } | null

export function AulasPage() {
  const accessUuid = getAccessUuid()!
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [drafts, setDrafts] = useState<Record<number, Draft>>({})
  const [limit, setLimit] = useState<PagerLimit>(DEFAULT_PAGER_LIMIT)
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingHint, setSavingHint] = useState('')
  const [alert, setAlert] = useState<AlertState>(null)
  const [baixaTarget, setBaixaTarget] = useState<Aluno | null>(null)
  const [baixaBusy, setBaixaBusy] = useState(false)
  const [baixaAgora, setBaixaAgora] = useState(true)
  const [baixaData, setBaixaData] = useState('')
  const [baixaHora, setBaixaHora] = useState('')

  const [novoNome, setNovoNome] = useState('')
  const [novasAulas, setNovasAulas] = useState('4')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const page = await alunosApi.listar(accessUuid, { limit, offset })
      setAlunos(page.items)
      setTotal(page.total)
      const next: Record<number, Draft> = {}
      for (const a of page.items) {
        next[a.id] = {
          nome: a.nome,
          aulasDisponiveis: String(a.aulasDisponiveis),
        }
      }
      setDrafts(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar alunos')
    } finally {
      setLoading(false)
    }
  }, [accessUuid, limit, offset])

  useEffect(() => {
    void load()
  }, [load])

  const persist = useDebouncedCallback(async (id: number, patch: Draft) => {
    if (!patch.nome.trim()) {
      setAlert({ title: 'Nome inválido', message: 'O nome do aluno não pode ficar em branco.' })
      setSavingHint('')
      return
    }
    const aulas = Number(patch.aulasDisponiveis)
    if (Number.isNaN(aulas) || !Number.isInteger(aulas) || aulas < 0) {
      setAlert({
        title: 'Aulas inválidas',
        message: 'Informe um número inteiro maior ou igual a zero nas aulas disponíveis.',
      })
      setSavingHint('')
      return
    }
    setSavingHint('Salvando…')
    try {
      const updated = await alunosApi.atualizar(accessUuid, id, {
        nome: patch.nome.trim(),
        aulasDisponiveis: aulas,
      })
      setAlunos((prev) => prev.map((a) => (a.id === id ? updated : a)))
      setDrafts((prev) => ({
        ...prev,
        [id]: {
          nome: updated.nome,
          aulasDisponiveis: String(updated.aulasDisponiveis),
        },
      }))
      setSavingHint('Salvo')
    } catch (err) {
      setSavingHint(err instanceof Error ? err.message : 'Erro ao salvar')
    }
  }, 500)

  function updateDraft(id: number, field: keyof Draft, value: string) {
    setDrafts((prev) => {
      const current = prev[id] ?? { nome: '', aulasDisponiveis: '0' }
      const next = { ...current, [field]: value }
      persist(id, next)
      return { ...prev, [id]: next }
    })
  }

  async function onAdd(e: FormEvent) {
    e.preventDefault()
    if (!novoNome.trim()) {
      setAlert({ title: 'Nome obrigatório', message: 'Informe o nome do novo aluno.' })
      return
    }
    const rawAulas = novasAulas.trim()
    if (rawAulas === '') {
      setAlert({
        title: 'Aulas obrigatórias',
        message: 'Informe a quantidade de aulas disponíveis (zero ou mais).',
      })
      return
    }
    if (rawAulas.startsWith('-') || Number(rawAulas) < 0) {
      setAlert({
        title: 'Aulas negativas',
        message: 'Não é permitido cadastrar aluno com aulas disponíveis negativas.',
      })
      return
    }
    const aulas = Number(rawAulas)
    if (Number.isNaN(aulas) || !Number.isInteger(aulas)) {
      setAlert({
        title: 'Aulas inválidas',
        message: 'Informe um número inteiro de aulas maior ou igual a zero.',
      })
      return
    }
    setError(null)
    try {
      await alunosApi.criar(accessUuid, novoNome.trim(), aulas)
      setNovoNome('')
      setNovasAulas('4')
      setOffset(0)
      if (offset === 0) {
        await load()
      }
    } catch (err) {
      setAlert({
        title: 'Falha ao criar',
        message: err instanceof Error ? err.message : 'Não foi possível adicionar o aluno.',
      })
    }
  }

  function openBaixa(aluno: Aluno) {
    setBaixaTarget(aluno)
    setBaixaAgora(true)
    setBaixaData(todayBrDate())
    setBaixaHora('')
  }

  async function confirmBaixa() {
    if (!baixaTarget) return

    let baixaEm: string
    if (baixaAgora) {
      baixaEm = new Date().toISOString()
    } else {
      const dataTrim = baixaData.trim()
      if (!dataTrim) {
        setAlert({ title: 'Data obrigatória', message: 'Informe a data em que a aula foi dada.' })
        return
      }
      if (dataTrim.length < 10) {
        setAlert({
          title: 'Data incompleta',
          message: 'Complete a data no formato DD/MM/AAAA.',
        })
        return
      }
      if (!isValidBrDate(dataTrim)) {
        setAlert({
          title: 'Data inválida',
          message: 'Informe uma data válida no formato DD/MM/AAAA.',
        })
        return
      }
      if (isFutureBrDate(dataTrim)) {
        setAlert({
          title: 'Data futura',
          message: 'Não é possível registrar uma aula em data futura.',
        })
        return
      }
      if (!baixaHora.trim()) {
        setAlert({
          title: 'Hora obrigatória',
          message: 'Informe a hora no formato 24h, por exemplo 14:30.',
        })
        return
      }
      if (!isValidTime24h(baixaHora)) {
        setAlert({
          title: 'Hora incompleta',
          message: 'Complete a hora no formato 24h HH:mm, por exemplo 14:30.',
        })
        return
      }
      if (isFutureLocalDateTime(dataTrim, baixaHora)) {
        setAlert({
          title: 'Data futura',
          message: 'Não é possível registrar uma aula em data ou horário no futuro.',
        })
        return
      }
      try {
        baixaEm = localDateAndTimeToIso(dataTrim, baixaHora)
      } catch {
        setAlert({ title: 'Data/hora inválida', message: 'Revise a data e a hora informadas.' })
        return
      }
    }

    setBaixaBusy(true)
    try {
      const updated = await alunosApi.darBaixa(accessUuid, baixaTarget.id, baixaEm)
      setAlunos((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
      setDrafts((prev) => ({
        ...prev,
        [updated.id]: {
          nome: updated.nome,
          aulasDisponiveis: String(updated.aulasDisponiveis),
        },
      }))
      setBaixaTarget(null)
    } catch (err) {
      setBaixaTarget(null)
      setAlert({
        title: 'Falha na baixa',
        message: err instanceof Error ? err.message : 'Não foi possível dar baixa.',
      })
    } finally {
      setBaixaBusy(false)
    }
  }

  const columns = useMemo<DataTableColumn<Aluno>[]>(
    () => [
      {
        id: 'nome',
        header: 'Nome',
        render: (aluno) => {
          const draft = drafts[aluno.id] ?? {
            nome: aluno.nome,
            aulasDisponiveis: String(aluno.aulasDisponiveis),
          }
          return (
            <input
              className="cell-input"
              value={draft.nome}
              onChange={(e) => updateDraft(aluno.id, 'nome', e.target.value)}
              aria-label={`Nome de ${aluno.nome}`}
            />
          )
        },
      },
      {
        id: 'aulas',
        header: 'Aulas disponíveis',
        render: (aluno) => {
          const draft = drafts[aluno.id] ?? {
            nome: aluno.nome,
            aulasDisponiveis: String(aluno.aulasDisponiveis),
          }
          return (
            <input
              className="cell-input numeric"
              type="number"
              min={0}
              step={1}
              value={draft.aulasDisponiveis}
              onChange={(e) => updateDraft(aluno.id, 'aulasDisponiveis', e.target.value)}
              aria-label={`Aulas de ${aluno.nome}`}
            />
          )
        },
      },
      {
        id: 'acao',
        header: 'Ação',
        render: (aluno) => {
          const draft = drafts[aluno.id] ?? {
            nome: aluno.nome,
            aulasDisponiveis: String(aluno.aulasDisponiveis),
          }
          return (
            <button
              type="button"
              className="btn-inline"
              onClick={() => openBaixa(aluno)}
              disabled={Number(draft.aulasDisponiveis) <= 0}
            >
              Dar baixa
            </button>
          )
        },
      },
    ],
    [drafts],
  )

  return (
    <div className="app-shell">
      <Masthead meta="CHANNEL · GERENCIAR AULAS" />
      <AuthNav />

      <section className="section">
        <SectionMarker line="LINE 01" title="Alunos" />
        <p className="deck" style={{ marginBottom: '1rem' }}>
          Visualize as aulas disponíveis para os alunos, registrando créditos ou baixas de aulas.
        </p>
        <p className="saving-hint" aria-live="polite">
          {savingHint}
        </p>
        {error && <p className="flash error">{error}</p>}
        <DataTable
          columns={columns}
          rows={alunos}
          rowKey={(a) => a.id}
          loading={loading}
          emptyMessage="Nenhum aluno encontrado — use a linha abaixo para adicionar um novo aluno."
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

        <form className="add-row teletype" onSubmit={onAdd} noValidate style={{ marginTop: '1.25rem' }}>
          <div>
            <label className="typewriter" htmlFor="novo-nome">
              Novo aluno
            </label>
            <input
              id="novo-nome"
              className="cell-input"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              placeholder="Nome"
            />
          </div>
          <div>
            <label className="typewriter" htmlFor="novas-aulas">
              Aulas
            </label>
            <input
              id="novas-aulas"
              className="cell-input numeric"
              type="text"
              inputMode="numeric"
              placeholder="9"
              value={novasAulas}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, '')
                setNovasAulas(digitsOnly)
              }}
            />
          </div>
          <button className="btn" type="submit">
            Adicionar
          </button>
        </form>
      </section>

      {baixaTarget && (
        <Modal
          title="Confirmar baixa"
          onClose={() => setBaixaTarget(null)}
          onConfirm={() => void confirmBaixa()}
          confirmLabel="Aula dada (−1)"
          busy={baixaBusy}
        >
          <p>
            Confirma que a aula de <strong>{baixaTarget.nome}</strong> foi dada? O crédito cai
            de {baixaTarget.aulasDisponiveis} para {baixaTarget.aulasDisponiveis - 1}.
          </p>
          <fieldset className="baixa-quando">
            <legend className="typewriter">Essa aula foi dada agora?</legend>
            <label className="radio-line">
              <input
                type="radio"
                name="baixa-agora"
                checked={baixaAgora}
                onChange={() => setBaixaAgora(true)}
              />
              Sim
            </label>
            <label className="radio-line">
              <input
                type="radio"
                name="baixa-agora"
                checked={!baixaAgora}
                onChange={() => setBaixaAgora(false)}
              />
              Não
            </label>
            {!baixaAgora && (
              <div className="baixa-datetime">
                <div className="teletype-field">
                  <label htmlFor="baixa-data" className="typewriter">
                    Data
                  </label>
                  <input
                    id="baixa-data"
                    type="text"
                    inputMode="numeric"
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    autoComplete="off"
                    spellCheck={false}
                    value={baixaData}
                    onChange={(e) => setBaixaData(maskDateBr(e.target.value))}
                  />
                </div>
                <div className="teletype-field">
                  <label htmlFor="baixa-hora" className="typewriter">
                    Hora (24h)
                  </label>
                  <input
                    id="baixa-hora"
                    type="text"
                    inputMode="numeric"
                    placeholder="14:30"
                    maxLength={5}
                    autoComplete="off"
                    spellCheck={false}
                    value={baixaHora}
                    onChange={(e) => setBaixaHora(maskTime24h(e.target.value))}
                  />
                </div>
              </div>
            )}
          </fieldset>
        </Modal>
      )}

      {alert && (
        <Modal title={alert.title} onClose={() => setAlert(null)} alertOnly>
          <p>{alert.message}</p>
        </Modal>
      )}
    </div>
  )
}
