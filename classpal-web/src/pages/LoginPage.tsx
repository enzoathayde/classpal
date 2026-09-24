import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthNav } from '../components/AuthNav'
import { Masthead } from '../components/Masthead'
import { Modal } from '../components/Modal'
import { SectionMarker } from '../components/SectionMarker'
import { usuariosApi } from '../lib/api'
import { setAccessUuid } from '../lib/auth'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

type AlertState = { title: string; message: string } | null

export function LoginPage() {
  const navigate = useNavigate()
  const [uuid, setUuid] = useState('')
  const [busy, setBusy] = useState(false)
  const [alert, setAlert] = useState<AlertState>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = uuid.trim()
    if (!trimmed) {
      setAlert({ title: 'Código obrigatório', message: 'Cole o UUID de acesso que chegou no seu email.' })
      return
    }
    if (!UUID_RE.test(trimmed)) {
      setAlert({
        title: 'Código inválido',
        message: 'O código deve ser um UUID no formato xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.',
      })
      return
    }
    setBusy(true)
    try {
      await usuariosApi.login(trimmed)
      setAccessUuid(trimmed)
      navigate('/', { replace: true })
    } catch (err) {
      setAlert({
        title: 'Falha no login',
        message: err instanceof Error ? err.message : 'Não foi possível autenticar.',
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-shell">
      <Masthead meta="RETURNING OPERATOR · PASTE UUID" />
      <AuthNav />

      <section className="section">
        <SectionMarker line="LINE 01" title="Login" />
        <div className="hero-grid">
          <div>
            <p className="page-title display">Cole o acesso</p>
            <p className="deck">
              Cole sua chave de acesso único para acessar o sistema. Caso não se lembre, verifique seu
              email para encontrar a chave.
            </p>
          </div>
          <form className="teletype" onSubmit={onSubmit} noValidate>
            <div className="teletype-header">
              <p className="typewriter">Message form · authenticate</p>
            </div>
            <div className="teletype-field">
              <label htmlFor="to">TO</label>
              <input id="to" value="desk@classpal" readOnly tabIndex={-1} />
            </div>
            <div className="teletype-field">
              <label htmlFor="re">RE</label>
              <input
                id="re"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="teletype-actions">
              <button className="btn" type="submit" disabled={busy}>
                {busy ? 'Validando…' : 'Entrar'}
              </button>
              <Link className="btn btn-ghost" to="/cadastro">
                Criar acesso
              </Link>
            </div>
          </form>
        </div>
      </section>

      {alert && (
        <Modal title={alert.title} onClose={() => setAlert(null)} alertOnly>
          <p>{alert.message}</p>
        </Modal>
      )}
    </div>
  )
}
