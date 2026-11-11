import { formatearPrecio } from '../../utils/cart.js'

// Tarjeta de un producto: imagen, nombre y precio.
// La tarjeta conserva una superficie clara en ambos temas y define el texto que heredan sus botones.
// Los botones u otras acciones llegan como "children", así la misma tarjeta sirve en distintas páginas.
export default function ProductCard({ producto, children }) {
  return (
    <article className="flex flex-col items-center gap-[0.6rem] rounded-2xl bg-[#e9edef] p-5 text-center text-[#273137] scheme-light shadow-[0_3px_8px_rgba(24,32,36,0.12)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.4)] motion-reduce:transform-none motion-reduce:transition-none dark:bg-[#d9d9d9] dark:text-[#1b1b1b] dark:shadow-[0_3px_8px_rgba(0,0,0,0.3)]">
      <img src={producto.imagen} alt={producto.nombre} className="h-48 w-full object-contain" />
      <h3 className="m-0 flex grow items-center text-[0.95rem] leading-[1.35] font-semibold text-[#4a565c] dark:text-[#3b464c]">{producto.nombre}</h3>
      <p className="m-0 text-2xl font-extrabold text-[#273137] dark:text-[#1b1b1b]">{formatearPrecio(producto.precio)}</p>
      {children}
    </article>
  )
}
