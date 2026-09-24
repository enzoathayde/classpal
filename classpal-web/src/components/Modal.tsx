import type { ReactNode } from 'react'

type ModalProps = {
  title: string
  children: ReactNode
  onClose: () => void
  confirmLabel?: string
  onConfirm?: () => void
  busy?: boolean
  /** Alert-only: single dismiss button, visual identity preserved */
  alertOnly?: boolean
}

export function Modal({
  title,
  children,
  onClose,
  confirmLabel = 'Confirmar',
  onConfirm,
  busy = false,
  alertOnly = false,
}: ModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="typewriter modal-kicker">{alertOnly ? 'AVISO · VALIDAÇÃO' : 'CONFIRMAÇÃO'}</p>
        <h3 id="modal-title">{title}</h3>
        {children}
        <div className="modal-actions">
          {alertOnly ? (
            <button type="button" className="btn" onClick={onClose}>
              Entendi
            </button>
          ) : (
            <>
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
                Cancelar
              </button>
              <button type="button" className="btn" onClick={onConfirm} disabled={busy}>
                {busy ? 'Aguarde…' : confirmLabel}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
