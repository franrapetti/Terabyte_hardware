import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

// Muestra la página que lleva adentro (children) solo si hay una sesión iniciada.
// Si no la hay, redirige a /login y guarda la ruta pedida (para volver ahí después de ingresar)
// y un "mensaje" que explica por qué se pidió iniciar sesión.
// Es una protección de la interfaz: no hay servidor, así que no es seguridad real.
export default function RutaProtegida({ mensaje, children }) {
  const { user } = useAuth()
  const location = useLocation()
  // Si la persona entró con la sesión iniciada y la cierra mientras mira esta página, vuelve al inicio.
  // Si entró sin sesión, se le pide iniciar sesión.
  const [entroConSesion] = useState(Boolean(user))

  if (!user && entroConSesion) return <Navigate to="/" replace />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname, mensaje }} />
  return children
}
