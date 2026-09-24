type SectionMarkerProps = {
  line: string
  title: string
}

export function SectionMarker({ line, title }: SectionMarkerProps) {
  return (
    <div className="section-head">
      <span className="patch-label">{line}</span>
      <h2>{title}</h2>
      <span className="section-rule" aria-hidden="true" />
    </div>
  )
}
