type MastheadProps = {
  meta?: string
}

export function Masthead({ meta = 'OPERATOR DESK · CLASS CONTROL' }: MastheadProps) {
  return (
    <header>
      <div className="masthead">
        <h1 className="display masthead-wordmark">ClassPal</h1>
        <p className="typewriter masthead-meta">{meta}</p>
      </div>
      <div className="masthead-rules" aria-hidden="true">
        <span className="double-rule" />
      </div>
    </header>
  )
}
