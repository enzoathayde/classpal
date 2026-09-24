export function PatchIllustration() {
  return (
    <div>
      <div className="illustration-plate">
        <svg
          viewBox="0 0 320 220"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          {/* paper plate */}
          <rect width="320" height="220" fill="#F4EBD3" />
          <rect
            x="14"
            y="14"
            width="292"
            height="192"
            fill="#1B3242"
            stroke="#1B3242"
            strokeWidth="1.5"
          />

          {/* MAIN JACK · bullseye */}
          <circle cx="48" cy="42" r="11" fill="none" stroke="#F4EBD3" strokeWidth="2" />
          <circle cx="48" cy="42" r="4.5" fill="#CF512B" />
          {/* meta line (abstract) */}
          <rect x="68" y="38" width="88" height="6" rx="1" fill="#F4EBD3" opacity="0.55" />

          {/* vertical trunk */}
          <line
            x1="48"
            y1="54"
            x2="48"
            y2="188"
            stroke="#F4EBD3"
            strokeWidth="2"
            opacity="0.55"
          />

          {/* ROW 1 — active channel */}
          <path
            className="cord-path"
            d="M48 88 L48 102 Q48 118 64 118 L92 118"
            fill="none"
            stroke="#F4EBD3"
            strokeWidth="2"
            opacity="0.55"
          />
          <circle cx="96" cy="118" r="5" fill="#CF512B" />
          <rect x="112" y="104" width="120" height="10" rx="1" fill="#F4EBD3" />
          <rect
            x="248"
            y="102"
            width="42"
            height="14"
            fill="none"
            stroke="#F4EBD3"
            strokeWidth="1.5"
          />
          <rect x="112" y="122" width="160" height="5" rx="1" fill="#F4EBD3" opacity="0.35" />

          {/* ROW 2 — spare / muted */}
          <path
            className="cord-path"
            d="M48 140 L48 154 Q48 170 64 170 L92 170"
            fill="none"
            stroke="#F4EBD3"
            strokeWidth="2"
            opacity="0.35"
            style={{ animationDelay: '140ms' }}
          />
          <circle cx="96" cy="170" r="5" fill="#CF512B" opacity="0.7" />
          <rect x="112" y="156" width="96" height="10" rx="1" fill="#F4EBD3" opacity="0.45" />  
          <rect x="248" y="154" width="42" height="14" fill="#CF512B" />
          <rect x="112" y="174" width="130" height="5" rx="1" fill="#F4EBD3" opacity="0.25" />
        </svg>
      </div>
      <p className="typewriter plate-caption">Fig. 01 — Ilustração do painel de serviços </p>
    </div>
  )
}