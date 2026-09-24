import { useEffect, useState } from 'react'
import { AuthNav } from '../components/AuthNav'
import { Masthead } from '../components/Masthead'
import { PatchIllustration } from '../components/PatchIllustration'
import { RoutingBoard } from '../components/RoutingBoard'
import { SectionMarker } from '../components/SectionMarker'
import { usuariosApi, type Usuario } from '../lib/api'
import { getAccessUuid } from '../lib/auth'

export function HomePage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    const uuid = getAccessUuid()
    if (!uuid) return
    usuariosApi
      .me(uuid)
      .then(setUsuario)
      .catch(() => setUsuario(null))
  }, [])

  return (
    <div className="app-shell">
      <Masthead
        meta={usuario ? `SIGNED IN · ${usuario.nome.toUpperCase()}` : 'OPERATOR DESK · ONLINE'}
      />
      <AuthNav />

      <section className="section">
        <SectionMarker line="LINE 01" title="Painel de serviços" />
        <div className="hero-grid">
          <div>
            <p className="page-title display">Seu painel de serviços</p>
            <p className="deck">
              Escolha um serviço para executar. Navegue pelos serviços disponíveis no grafo abaixo. 
            </p>
          </div>
          <PatchIllustration />
        </div>
      </section>

      <section className="section">
        <SectionMarker line="LINE 02" title="Serviços disponíveis" />
        <RoutingBoard
          channels={[
            {
              id: 'aulas',
              name: 'Gerenciar aulas',
              description:
                'Gerencie as aulas disponíveis para os alunos, registrando créditos ou baixas de aulas.',
              status: 'IN SERVICE',
              to: '/aulas',
            },
            {
              id: 'historico-baixas',
              name: 'Histórico de baixas',
              description:
                'Consulte baixas por nome do aluno e intervalo de datas, com paginação.',
              status: 'IN SERVICE',
              to: '/historico-baixas',
            },
          ]}
        />
      </section>
    </div>
  )
}
