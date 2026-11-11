import { useState } from 'react'

// Lógica común de Login y Register: guarda lo que se escribe en cada campo y controla el envío.
// "valoresIniciales" es un objeto con un valor por campo; "enviarDatos" recibe esos valores
// y lanza un Error con el mensaje a mostrar si algo sale mal.
export function useAuthForm(valoresIniciales, enviarDatos) {
  const [valores, setValores] = useState(valoresIniciales)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // Un solo manejador para todos los campos: el "name" de cada input es la clave del objeto.
  function cambiar(event) {
    const { name, type, value, checked } = event.target
    setValores((actuales) => ({ ...actuales, [name]: type === 'checkbox' ? checked : value }))
  }

  async function enviar(event) {
    event.preventDefault()
    if (cargando) return
    setError('')
    setCargando(true)
    try {
      await enviarDatos(valores)
    } catch (failure) {
      setError(failure.message)
    } finally {
      setCargando(false)
    }
  }

  return { valores, cambiar, enviar, cargando, error }
}
