import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AulasPage } from './pages/AulasPage'
import { CadastroPage } from './pages/CadastroPage'
import { HistoricoBaixasPage } from './pages/HistoricoBaixasPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { getAccessUuid } from './lib/auth'

function RootRedirect() {
  return <Navigate to={getAccessUuid() ? '/' : '/cadastro'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/aulas" element={<AulasPage />} />
          <Route path="/historico-baixas" element={<HistoricoBaixasPage />} />
        </Route>
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}
