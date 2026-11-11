import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/products/ProductCard.jsx'
import ActionButton from '../../components/ui/ActionButton.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { categorias, marcas, productos } from '../../data/productos.js'
import { useCarrito } from '../../hooks/useCarrito.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { formatearPrecio } from '../../utils/cart.js'

// Franja de logos que se desplaza sola. Se dibuja la lista dos veces: cuando la primera sale de
// pantalla, la segunda ocupa su lugar y el movimiento parece continuo (animación en index.css).
function CarruselMarcas() {
  return (
    <div className="flex overflow-hidden rounded-2xl bg-[#435058] shadow-[0_4px_10px_rgba(0,0,0,0.35)]">
      {[false, true].map((esCopia) => (
        <ul
          key={esCopia ? 'copia' : 'original'}
          aria-hidden={esCopia || undefined}
          className="m-0 flex min-w-full shrink-0 animate-marquee list-none items-center justify-around p-0 motion-reduce:animate-none"
        >
          {marcas.map((marca) => (
            <li key={marca.nombre} className="px-6">
              <img src={marca.imagen} alt={esCopia ? '' : marca.nombre} className="my-6 max-h-[15rem] w-24 object-contain" />
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

// Contenido de las dos ventanas: el detalle de un producto y la confirmación de que se agregó.
function ModalProducto({ modal, onClose, onIrAlCarrito }) {
  const { tipo, producto } = modal
  const agregado = tipo === 'agregado'

  return (
    <Modal label={agregado ? 'Producto agregado al carrito' : 'Detalle del producto'} onClose={onClose}>
      {agregado && <p className="m-0 inline-flex rounded-full bg-[#435058] px-3 py-1 text-[0.8rem] font-bold text-white uppercase">Producto agregado</p>}
      <h2 className="my-2 text-xl font-bold">{agregado ? 'Se añadió al carrito' : 'Detalle del producto'}</h2>
      <img src={producto.imagen} alt={producto.nombre} className="h-40 w-full object-contain" />
      <h3 className="my-2 text-base font-semibold">{producto.nombre}</h3>
      <p className="my-2 text-[1.1rem] font-bold">{formatearPrecio(producto.precio)}</p>
      <p className="my-2">
        {agregado
          ? 'Ya podés revisar tu carrito o seguir explorando el catálogo.'
          : 'Producto destacado de TerraByte, ideal para ampliar almacenamiento y rendimiento.'}
      </p>
      {agregado && (
        <div className="mt-4 flex justify-center gap-3 max-[700px]:flex-col">
          <ActionButton variant="secondary" onClick={onClose}>Seguir comprando</ActionButton>
          <ActionButton onClick={onIrAlCarrito}>Ir al carrito</ActionButton>
        </div>
      )}
    </Modal>
  )
}

export default function Products() {
  usePageTitle('Productos')
  const navigate = useNavigate()
  const { agregar: agregarAlCarrito } = useCarrito()
  const [params] = useSearchParams()
  const [categoria, setCategoria] = useState('')
  const [modal, setModal] = useState(null)
  const [error, setError] = useState('')

  // El texto de búsqueda no se guarda en un estado: ya está en la URL (?q=...) y SearchBar la actualiza.
  const busqueda = (params.get('q') || '').trim().toLowerCase()

  // Lista visible: se calcula en cada render a partir de la búsqueda y la categoría elegida.
  const visibles = productos.filter(
    (producto) => producto.nombre.toLowerCase().includes(busqueda) && (categoria === '' || producto.categoria === categoria),
  )

  function agregar(producto) {
    try {
      agregarAlCarrito({ tipo: 'Producto', nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen, alt: producto.nombre })
      setError('')
      setModal({ tipo: 'agregado', producto })
    } catch (failure) {
      setError(failure.message)
    }
  }

  function irAlCarrito() {
    navigate('/cart')
  }

  return (
    <main className="mx-auto w-full max-w-[90rem] flex-1 px-[clamp(1rem,4vw,3rem)] pt-8 pb-12 text-left text-[#273137] dark:text-[#f3f3f3]">
      <div className="mb-8 px-4 text-center">
        <h1 className="m-0 text-[clamp(1.8rem,4vw,2.5rem)] leading-tight font-extrabold">
          La tecnología que estás buscando, al alcance de tu mano.
        </h1>
        <h2 className="mt-3 mb-0 text-[clamp(1.1rem,2.5vw,1.5rem)] font-semibold text-[#59656b] dark:text-[#b7bdc0]">
          En nuestra página podés ver productos de las siguientes marcas.
        </h2>
      </div>

      <CarruselMarcas />

      <section aria-label="Catálogo de productos" className="mt-8 grid w-full grid-cols-[minmax(12rem,16rem)_1fr] items-start gap-4 rounded-2xl bg-white p-4 shadow-[0_6px_16px_rgba(24,32,36,0.14)] max-[700px]:grid-cols-1 dark:bg-[#435058] dark:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
        <div role="radiogroup" aria-labelledby="categorias-titulo" className="flex flex-col gap-3 rounded-2xl bg-[#e9edef] p-4 text-[#273137] shadow-[0_3px_8px_rgba(24,32,36,0.12)] max-[700px]:flex-row max-[700px]:flex-wrap dark:bg-[#d9d9d9] dark:text-[#1b1b1b] dark:shadow-[0_3px_8px_rgba(0,0,0,0.3)]">
          <h3 id="categorias-titulo" className="m-0 mb-1 font-bold max-[700px]:basis-full">Categorías</h3>
          {categorias.map((opcion) => (
            <label key={opcion.nombre} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="categoria"
                value={opcion.valor}
                checked={categoria === opcion.valor}
                onChange={() => setCategoria(opcion.valor)}
                className="size-4 accent-[#007aff]"
              />
              {opcion.nombre}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 max-[1050px]:grid-cols-2 max-[700px]:grid-cols-1">
          {error && <p role="alert" className="col-span-full m-0 text-center text-sm text-red-700 dark:text-red-300">{error}</p>}
          {visibles.map((producto) => (
            <ProductCard key={producto.id} producto={producto}>
              <div className="mt-auto flex w-full gap-2 pt-2 max-[700px]:flex-wrap max-[700px]:justify-center">
                <ActionButton variant="secondary" onClick={() => setModal({ tipo: 'detalle', producto })} className="flex-1 text-[0.9rem]">Ver Más</ActionButton>
                <ActionButton onClick={() => agregar(producto)} className="flex-1 text-[0.9rem]">Agregar al carrito</ActionButton>
              </div>
            </ProductCard>
          ))}
          {visibles.length === 0 && (
            <p role="status" className="col-span-full my-6 text-center">
              No encontramos productos que coincidan con los filtros seleccionados.
            </p>
          )}
        </div>
      </section>

      {modal && <ModalProducto modal={modal} onClose={() => setModal(null)} onIrAlCarrito={irAlCarrito} />}
    </main>
  )
}
