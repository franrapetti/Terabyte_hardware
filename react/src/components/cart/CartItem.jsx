import ActionButton from '../ui/ActionButton.jsx'
import { extraerPrecio, formatearPrecio } from '../../utils/cart.js'

// Las imágenes guardadas por simple/ tienen rutas relativas que Vite debe resolver.
const productImages = import.meta.glob('../../assets/products/*', { eager: true, query: '?url', import: 'default' })

export default function CartItem({ item, onChangeQuantity, onRemove }) {
  const fileName = item.imagen?.split('/').pop()
  const image = productImages[`../../assets/products/${fileName}`] || item.imagen
  const precio = extraerPrecio(item.precio)

  return (
    <li className="rounded-xl border border-[#dde2e5] bg-white p-5 dark:border-[#435058] dark:bg-[#364147]">
      <article className="flex flex-wrap items-start gap-5">
        {image ? <img src={image} alt={item.alt || item.nombre} className="size-24 rounded-lg bg-white object-contain p-2" /> : <div aria-hidden="true" className="grid size-24 place-items-center rounded-lg bg-[#e8ebed] font-bold text-[#273137]">NAS</div>}
        <div className="min-w-0 flex-1 basis-48">
          <p className="text-sm text-[#59656b] dark:text-[#b7bdc0]">{item.tipo}</p>
          <h2 className="text-lg font-bold">{item.nombre}</h2>
          <p className="mt-1">Precio unitario: {formatearPrecio(precio)}</p>
          {item.componentes.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{item.componentes.map((componente, index) => <li key={`${index}-${componente}`}>{componente}</li>)}</ul>}
          <p className="mt-3 font-semibold">Subtotal: {formatearPrecio(precio * item.cantidad)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label={`Cantidad de ${item.nombre}`} className="flex items-center gap-3">
            <ActionButton variant="secondary" size="small" aria-label={`Restar una unidad de ${item.nombre}`} onClick={() => onChangeQuantity(item.id, -1)}>−</ActionButton>
            <span className="min-w-6 text-center">{item.cantidad}</span>
            <ActionButton variant="secondary" size="small" aria-label={`Sumar una unidad de ${item.nombre}`} disabled={item.cantidad === Number.MAX_SAFE_INTEGER} onClick={() => onChangeQuantity(item.id, 1)}>+</ActionButton>
          </div>
          <ActionButton variant="secondary" size="small" aria-label={`Quitar ${item.nombre} del carrito`} onClick={() => onRemove(item.id)}>Quitar</ActionButton>
        </div>
      </article>
    </li>
  )
}
