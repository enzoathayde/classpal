import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthNav } from '../components/AuthNav'
import { Masthead } from '../components/Masthead'
import { Modal } from '../components/Modal'
import { SectionMarker } from '../components/SectionMarker'
import { usuariosApi } from '../lib/api'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type AlertState = { title: string; message: string } | null

export function CadastroPage() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState<string | null>(null)
  const [alert, setAlert] = useState<AlertState>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setAlert({ title: 'Email obrigatório', message: 'Informe um email para receber o código de acesso.' })
      return
    }
    if (!EMAIL_RE.test(trimmed)) {
      setAlert({ title: 'Email inválido', message: 'Use um endereço de email válido, por exemplo nome@dominio.com.' })
      return
    }
    setBusy(true)
    setOk(null)
    try {
      const res = await usuariosApi.cadastro(trimmed)
      setOk(res.mensagem)
      setEmail('')
    } catch (err) {
      setAlert({
        title: 'Falha no cadastro',
        message: err instanceof Error ? err.message : 'Não foi possível concluir o cadastro.',
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="app-shell">
      <Masthead meta="NEW OPERATOR · REQUEST ACCESS" />
      <AuthNav />

      <section className="section">
        <SectionMarker line="LINE 01" title="Cadastro" />
        <div className="hero-grid">
          <div>
            <p className="page-title display">Peça seu código</p>
            <p className="deck">
              Informe o email. O ClassPal envia uma chave de acesso único — cole-a na tela de
              login para entrar no desk do professor.
            </p>
          </div>
          <form className="teletype" onSubmit={onSubmit} noValidate>
            <div className="teletype-header">
              <p className="typewriter">Message form · access request</p>
            </div>
            <div className="teletype-field">
              <label htmlFor="to">TO</label>
              <input id="to" value="classpal@local" readOnly tabIndex={-1} />
            </div>
            <div className="teletype-field">
              <label htmlFor="re">RE</label>
              <input
                id="re"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            {ok && <p className="flash ok">{ok}</p>}
            <div className="teletype-actions">
              <button className="btn" type="submit" disabled={busy}>
                {busy ? 'Enviando…' : 'Enviar'}
              </button>
              <Link className="btn btn-ghost" to="/login">
                Já tenho UUID
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
