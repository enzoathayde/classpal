import { Link, useNavigate } from 'react-router-dom'
import { clearAccessUuid, getAccessUuid } from '../lib/auth'

export function AuthNav() {
  const navigate = useNavigate()
  const loggedIn = Boolean(getAccessUuid())

  function logout() {
    clearAccessUuid()
    navigate('/login')
  }

  return (
    <nav className="nav-links" aria-label="Navegação">
      {loggedIn ? (
        <>
          <Link to="/">Home</Link>
          <Link to="/aulas">Aulas</Link>
          <Link to="/historico-baixas">Histórico</Link>
          <a
            href="#sair"
            onClick={(e) => {
              e.preventDefault()
              logout()
            }}
          >
            Sair
          </a>
        </>
      ) : (
        <>
          <Link to="/cadastro">Cadastro</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  )
}
