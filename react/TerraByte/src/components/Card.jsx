/** producto: { nombre, precio, imagen, alt?, descripcion? }.
 * Las acciones reciben el producto; la página administra el carrito y los modales.
 */
export default function Card({
  producto,
  variant = 'catalog',
  onViewDetails,
  onAddToCart,
  children,
  className = '',
}) {
  const featured = variant === 'featured'
  const price = typeof producto.precio === 'number'
    ? `$${producto.precio.toLocaleString('es-AR')}`
    : producto.precio
  const buttonClass = 'flex-1 cursor-pointer rounded-lg border px-2 py-[0.65rem] text-[0.9rem] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]'

  return (
    <article className={`flex h-full min-w-0 flex-col items-center rounded-2xl bg-[#e9edef] text-center font-[Inter,Arial,Helvetica,sans-serif] text-[#273137] shadow-[0_3px_8px_rgba(0,0,0,0.3)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.4)] motion-reduce:transform-none motion-reduce:transition-none dark:bg-[#2b353b] dark:text-[#f3f3f3] ${featured ? 'gap-4 px-6 py-8 max-[700px]:p-3' : 'gap-[0.6rem] p-5'} ${className}`}>
      {producto.imagen && (
        <img src={producto.imagen} alt={producto.alt || producto.nombre} loading="lazy" className="h-48 w-full rounded-lg bg-white p-2 object-contain" />
      )}
      <h3 className={`m-0 leading-[1.35] font-semibold ${featured ? 'text-base' : 'text-[0.95rem] text-[#3b464c] dark:text-[#d9d9d9]'}`}>{producto.nombre}</h3>
      {price != null && <p className={featured ? 'text-[1.1rem] font-bold' : 'text-2xl font-extrabold'}>{price}</p>}
      {children}
      {(onViewDetails || onAddToCart) && (
        <div className="mt-auto flex w-full flex-wrap gap-2 pt-2">
          {onViewDetails && (
            <button type="button" onClick={() => onViewDetails(producto)} className={`${buttonClass} border-[#879299] bg-transparent hover:bg-[#435058] hover:text-white`}>Ver Más</button>
          )}
          {onAddToCart && (
            <button type="button" onClick={() => onAddToCart(producto)} className={`${buttonClass} border-action bg-action text-white hover:border-[#3395ff] hover:bg-action-hover`}>Agregar al carrito</button>
          )}
        </div>
      )}
    </article>
  )
}
