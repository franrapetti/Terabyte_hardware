import { products } from '../../data/catalog.js'
import { extraerPrecio, formatearPrecio } from '../../functions/CartFuncion.jsx'
import ActionButton from '../ui/ActionButton.jsx'

export default function CartItem({ item, onQuantityChange, onRemove }) {
  // Resolver los productos conocidos desde el catálogo actual también recupera
  // las imágenes de carritos guardados antes de reorganizar los assets.
  const product = item.tipo === 'Producto' ? products.find((entry) => entry.nombre === item.nombre && extraerPrecio(entry.precio) === extraerPrecio(item.precio)) : undefined
  const image = product?.imagen || item.imagen
  return (
    <article className="grid grid-cols-[7rem_1fr_auto] items-center gap-4 rounded-xl bg-[#e9edef] p-4 text-[#273137] shadow-md dark:bg-[#2b353b] dark:text-[#f3f3f3] max-[600px]:grid-cols-1">
      {image ? <img src={image} alt={item.alt || item.nombre} className="size-28 rounded-lg bg-white p-2 object-contain" /> : <div className="grid size-28 place-items-center rounded-lg bg-[#2b353b] text-3xl font-bold text-[#38bdf8]">NAS</div>}
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#435058] dark:text-[#b7bdc0] uppercase">{item.tipo}</p>
        <h2 className="mt-1 mb-2 text-lg font-semibold tracking-normal text-[#273137] dark:text-white">{item.nombre}</h2>
        <p className="font-bold">{typeof item.precio === 'number' ? formatearPrecio(item.precio) : item.precio}</p>
        {!!item.componentes.length && <ul className="mt-3 list-disc pl-5">{item.componentes.map((component, index) => <li key={`${index}-${component}`}>{component}</li>)}</ul>}
        <p className="mt-2 text-sm">Subtotal: {formatearPrecio(extraerPrecio(item.precio) * item.cantidad)}</p>
      </div>
      <div className="flex flex-col gap-3 max-[600px]:max-w-52">
        <div className="flex items-center justify-between gap-3">
          <ActionButton aria-label={`Restar una unidad de ${item.nombre}`} variant="secondary" onClick={() => onQuantityChange(item.id, -1)} size="small">−</ActionButton>
          <span aria-label={`Cantidad de ${item.nombre}`}>{item.cantidad}</span>
          <ActionButton aria-label={`Sumar una unidad de ${item.nombre}`} variant="secondary" onClick={() => onQuantityChange(item.id, 1)} size="small">+</ActionButton>
        </div>
        <ActionButton onClick={() => onRemove(item.id)}>Quitar</ActionButton>
      </div>
    </article>
  )
}
