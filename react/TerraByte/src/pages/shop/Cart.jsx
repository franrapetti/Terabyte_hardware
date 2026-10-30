import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cambiarCantidad, formatearPrecio, quitarDelCarrito, useCarrito, vaciarCarrito } from '../../functions/CartFuncion.jsx'
import ActionButton from '../../components/ui/ActionButton.jsx'
import CartItem from '../../components/cart/CartItem.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ShopPage from '../../components/layout/ShopPage.jsx'

export default function Cart() {
  const { carrito, total } = useCarrito()
  const [modal, setModal] = useState(null)
  const [error, setError] = useState('')
  function run(action) {
    try {
      action()
      setError('')
    } catch (failure) {
      setError(failure.message)
      setModal(null)
    }
  }
  function confirm() {
    if (modal === 'success') {
      setModal(null)
      return
    }
    if (!carrito.length) {
      setModal(null)
      return
    }
    run(() => {
      vaciarCarrito()
      setModal(modal === 'checkout' ? 'success' : null)
    })
  }
  const titles = { clear: '¿Vaciar carrito?', checkout: '¿Finalizar compra?', success: '¡Gracias por tu compra!' }
  const messages = { clear: 'Se eliminarán todos los productos y configuraciones guardadas.', checkout: `El total de tu compra es ${formatearPrecio(total)}.`, success: 'Recibimos tu pedido y el carrito quedó vacío.' }
  return (
    <ShopPage title="Carrito" subtitle="Productos y configuraciones guardadas para tu compra." narrow>
      <section aria-label="Productos del carrito" className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-lg dark:bg-[#364147]">
        <ActionButton variant="secondary" className="self-end" disabled={!carrito.length} onClick={() => setModal('clear')}>Vaciar carrito</ActionButton>
        {error && <p role="alert" className="text-red-700 dark:text-red-300">{error}</p>}
        <div className="flex flex-col gap-4" aria-live="polite">
          {carrito.map((item) => <CartItem key={item.id} item={item} onQuantityChange={(id, change) => run(() => cambiarCantidad(id, change))} onRemove={(id) => run(() => quitarDelCarrito(id))} />)}
          {!carrito.length && <div className="rounded-xl bg-[#e9edef] p-8 text-center text-[#273137] dark:bg-[#2b353b] dark:text-[#f3f3f3]"><p>Todavía no agregaste productos al carrito.</p><Link to="/products" className="mt-4 inline-flex rounded-lg bg-action px-4 py-3 font-bold text-white hover:bg-action-hover">Ver productos</Link></div>}
        </div>
        <div className="flex justify-between gap-4 border-t border-[#879299] pt-4 text-xl" aria-live="polite"><span>Total</span><strong>{formatearPrecio(total)}</strong></div>
        <ActionButton className="self-end" disabled={!carrito.length} onClick={() => setModal('checkout')}>Finalizar compra</ActionButton>
      </section>
      <Modal open={modal !== null} onClose={() => setModal(null)} variant="confirmation" status="Carrito" title={titles[modal]} message={messages[modal]} confirmText={modal === 'success' ? 'Entendido' : modal === 'clear' ? 'Vaciar carrito' : 'Confirmar compra'} cancelText={modal === 'success' ? undefined : modal === 'clear' ? 'Cancelar' : 'Volver'} onConfirm={confirm} />
    </ShopPage>
  )
}
