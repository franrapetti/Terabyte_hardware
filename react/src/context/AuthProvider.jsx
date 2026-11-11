import { useEffect, useState } from 'react'
import AuthContext from './AuthContext.js'
import { autenticarUsuario, borrarSesion, crearUsuario, leerSesion, SESSION_KEY } from '../utils/auth.js'

// Guarda quién tiene la sesión iniciada y se lo ofrece a toda la app (se consume con useAuth).
export default function AuthProvider({ children }) {
  // Estado inicial: la sesión que haya quedado guardada en localStorage.
  const [user, setUser] = useState(leerSesion)

  // Si en otra pestaña se inicia o se cierra sesión, esta pestaña se entera por el evento "storage".
  useEffect(() => {
    function sincronizarSesion(event) {
      if (event.key === SESSION_KEY || event.key === null) setUser(leerSesion())
    }

    window.addEventListener('storage', sincronizarSesion)
    return () => window.removeEventListener('storage', sincronizarSesion)
  }, [])

  // Las acciones guardan en localStorage (dentro de utils/auth.js) y actualizan el estado.
  // Si algo falla lanzan un Error con un mensaje para mostrar en el formulario.
  async function login(datos) {
    setUser(await autenticarUsuario(datos))
  }

  async function register(datos) {
    setUser(await crearUsuario(datos))
  }

  function logout() {
    borrarSesion()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}
