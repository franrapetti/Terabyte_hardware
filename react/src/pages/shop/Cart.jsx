import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CartItem from '../../components/cart/CartItem.jsx'
import ActionButton from '../../components/ui/ActionButton.jsx'
import { useCarrito } from '../../hooks/useCarrito.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { formatearPrecio } from '../../utils/cart.js'

export default function Cart() {
  usePageTitle('Carrito')
  const { carrito, total, cantidad, quitar, vaciar, cambiarCantidad, errorGuardado } = useCarrito()
  const [confirmation, setConfirmation] = useState(null)
  const [message, setMessage] = useState('')
  const dialog = useRef(null)
  const empty = carrito.length === 0

  useEffect(() => {
    if (confirmation) dialog.current.showModal()
    else dialog.current.close()
  }, [confirmation])

  function confirm() {
    vaciar()
    setMessage(confirmation === 'checkout' ? '¡Gracias por tu compra! La compra fue simulada y el carrito quedó vacío.' : 'El carrito quedó vacío.')
    setConfirmation(null)
  }

  return (
    <main className="mx-auto w-full max-w-[76rem] flex-1 px-4 py-8 text-[#273137] dark:text-[#d9d9d9]">
      <section aria-labelledby="cart-title" className="rounded-2xl border border-[#dde2e5] bg-white p-[clamp(1.25rem,4vw,2.5rem)] shadow-lg dark:border-[#435058] dark:bg-black/45">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 id="cart-title" className="text-3xl font-bold">Carrito</h1>
            <p className="mt-2">Productos y configuraciones guardadas para tu compra.</p>
          </div>
          <ActionButton variant="secondary" disabled={empty} onClick={() => setConfirmation('clear')}>Vaciar carrito</ActionButton>
        </div>

        {errorGuardado && <p role="alert" className="mb-4 rounded-lg bg-red-100 p-3 text-red-800 dark:bg-red-950 dark:text-red-200">{errorGuardado}</p>}
        <p role="status" className="mb-4">{message}</p>

        {empty ? (
          <div className="rounded-xl border border-dashed border-[#879299] px-4 py-12 text-center">
            <p>Todavía no agregaste productos al carrito.</p>
            <Link to="/products" className="mt-3 inline-block font-bold text-action underline underline-offset-4 dark:text-[#75b8ff]">Ver productos</Link>
          </div>
        ) : (
          <ul className="space-y-4">{carrito.map((item) => <CartItem key={item.id} item={item} onChangeQuantity={cambiarCantidad} onRemove={quitar} />)}</ul>
        )}

        <div aria-live="polite" aria-atomic="true" className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#dde2e5] pt-6 dark:border-[#435058]">
          <span>{cantidad} {cantidad === 1 ? 'artículo' : 'artículos'}</span>
          <p className="text-xl">Total: <strong>{formatearPrecio(total)}</strong></p>
        </div>
        <ActionButton className="mt-5 w-full sm:w-auto" disabled={empty} onClick={() => setConfirmation('checkout')}>Finalizar compra</ActionButton>
      </section>

      <dialog ref={dialog} onCancel={() => setConfirmation(null)} aria-labelledby="cart-confirm-title" aria-describedby="cart-confirm-description" className="m-auto w-[calc(100%_-_2rem)] max-w-lg rounded-2xl border border-[#dde2e5] bg-white p-6 text-[#273137] shadow-xl backdrop:bg-black/60 dark:border-[#435058] dark:bg-[#364147] dark:text-[#d9d9d9]">
        <h2 id="cart-confirm-title" className="text-2xl font-bold">{confirmation === 'checkout' ? '¿Finalizar compra?' : '¿Vaciar carrito?'}</h2>
        <p id="cart-confirm-description" className="mt-3">{confirmation === 'checkout' ? `El total es ${formatearPrecio(total)}. La confirmación simula una compra y vacía el carrito.` : 'Se eliminarán todos los productos y configuraciones guardadas.'}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <ActionButton variant="secondary" autoFocus onClick={() => setConfirmation(null)}>Cancelar</ActionButton>
          <ActionButton disabled={empty} onClick={confirm}>{confirmation === 'checkout' ? 'Confirmar compra' : 'Vaciar carrito'}</ActionButton>
        </div>
      </dialog>
    </main>
  )
}
