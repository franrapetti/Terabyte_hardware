import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

// Muestra la página que lleva adentro (children) solo si hay una sesión iniciada.
// Si no la hay, redirige a /login y guarda la ruta pedida para volver ahí después de ingresar.
// Es una protección de la interfaz: no hay servidor, así que no es seguridad real.
export default function RutaProtegida({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}
