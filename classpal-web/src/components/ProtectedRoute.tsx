import { Navigate, Outlet } from 'react-router-dom'
import { getAccessUuid } from '../lib/auth'

export function ProtectedRoute() {
  const uuid = getAccessUuid()
  if (!uuid) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
