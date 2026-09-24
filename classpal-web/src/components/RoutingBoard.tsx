import { Link } from 'react-router-dom'

export type RoutingChannel = {
  id: string
  name: string
  description: string
  status: 'IN SERVICE' | 'NEW TODAY'
  to?: string
}

type RoutingBoardProps = {
  channels: RoutingChannel[]
}

export function RoutingBoard({ channels }: RoutingBoardProps) {
  return (
    <div className="routing-board">
      <div className="routing-jack">
        <span className="bullseye" aria-hidden="true" />
        <span className="typewriter">RAIZ </span>
      </div>
      <div className="routing-trunk">
        {channels.map((channel) => {
          const body = (
            <>
              <h3>{channel.name}</h3>
              <span
                className={`status-tag ${channel.status === 'NEW TODAY' ? 'new-today' : 'in-service'}`}
              >
                {channel.status}
              </span>
              <p>{channel.description}</p>
            </>
          )

          if (channel.to) {
            return (
              <Link key={channel.id} to={channel.to} className="routing-row">
                {body}
              </Link>
            )
          }

          return (
            <div key={channel.id} className="routing-row" aria-disabled="true">
              {body}
            </div>
          )
        })}
      </div>
    </div>
  )
}
