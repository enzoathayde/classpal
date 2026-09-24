export const PAGER_LIMIT_OPTIONS = [5, 10, 20] as const
export type PagerLimit = (typeof PAGER_LIMIT_OPTIONS)[number]
export const DEFAULT_PAGER_LIMIT: PagerLimit = 5

type PagerProps = {
  total: number
  limit: number
  offset: number
  onPrev: () => void
  onNext: () => void
  onLimitChange: (limit: PagerLimit) => void
}

export function Pager({ total, limit, offset, onPrev, onNext, onLimitChange }: PagerProps) {
  const from = total === 0 ? 0 : offset + 1
  const to = Math.min(offset + limit, total)
  const canPrev = offset > 0
  const canNext = offset + limit < total

  return (
    <div className="pager">
      <div className="pager-actions">
        <button type="button" className="btn btn-ghost" disabled={!canPrev} onClick={onPrev}>
          Anterior
        </button>
        <button type="button" className="btn btn-ghost" disabled={!canNext} onClick={onNext}>
          Próximo
        </button>
        <label className="pager-limit" htmlFor="pager-limit">
          <span className="visually-hidden">Por página</span>
          <select
            id="pager-limit"
            className="btn btn-ghost pager-limit-select"
            style={{ fontSize: '1.1rem' }}
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value) as PagerLimit)}
            aria-label="Registros por página"
          >
            {PAGER_LIMIT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="typewriter">
        {total === 0 ? '0 registros' : `${from}–${to} de ${total}`}
      </p>
    </div>
  )
}
