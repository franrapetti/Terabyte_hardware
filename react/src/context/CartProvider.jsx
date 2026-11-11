import { useEffect, useState } from 'react'
import CartContext from './CartContext.js'
import { actualizarCantidad, agregarItem, calcularTotal, leerCarrito } from '../utils/cart.js'

const CLAVE_CARRITO = 'terrabyte-cart'

export default function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(leerCarrito)
  const [errorGuardado, setErrorGuardado] = useState('')

  useEffect(() => {
    try {
      const datos = JSON.stringify(carrito)
      // Evita volver a escribir al recibir los mismos datos desde otra pestaña.
      if (localStorage.getItem(CLAVE_CARRITO) !== datos) localStorage.setItem(CLAVE_CARRITO, datos)
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Informa un fallo del almacenamiento externo; no deriva el estado del carrito.
      setErrorGuardado('No se pudo guardar el carrito. Los cambios se conservarán solo mientras esta página siga abierta.')
    }
  }, [carrito])

  useEffect(() => {
    function sincronizarCarrito(event) {
      if (event.key === CLAVE_CARRITO || event.key === null) setCarrito(leerCarrito())
    }
    window.addEventListener('storage', sincronizarCarrito)
    return () => window.removeEventListener('storage', sincronizarCarrito)
  }, [])

  function actualizarCarrito(actualizar) {
    setErrorGuardado('')
    setCarrito(actualizar)
  }

  function agregar(item) {
    // El id se crea fuera del actualizador, que React puede ejecutar más de una vez.
    const nuevo = { ...item, id: crypto.randomUUID() }
    // Validar antes del actualizador permite mostrar el error desde el formulario.
    agregarItem([], nuevo)
    actualizarCarrito((actual) => agregarItem(actual, nuevo))
  }

  function quitar(id) {
    actualizarCarrito((actual) => actual.filter((item) => item.id !== id))
  }

  function vaciar() {
    actualizarCarrito([])
  }

  function cambiarCantidad(id, cambio) {
    actualizarCarrito((actual) => actualizarCantidad(actual, id, cambio))
  }

  return (
    <CartContext.Provider value={{ carrito, agregar, quitar, vaciar, cambiarCantidad, total: calcularTotal(carrito), cantidad: carrito.reduce((sum, item) => sum + item.cantidad, 0), errorGuardado }}>
      {children}
    </CartContext.Provider>
  )
}
