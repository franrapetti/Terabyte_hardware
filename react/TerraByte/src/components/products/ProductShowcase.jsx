import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { agregarAlCarrito } from '../../functions/CartFuncion.jsx'
import Card from './Card.jsx'
import Carrousel from '../ui/Carrousel.jsx'
import Modal from '../ui/Modal.jsx'

export default function ProductShowcase({ products, carousel = false }) {
  const [modal, setModal] = useState(null)
  const navigate = useNavigate()
  function add(producto) {
    try {
      agregarAlCarrito({ ...producto, tipo: 'Producto' })
      setModal({ type: 'added', producto })
    } catch (error) {
      setModal({ type: 'error', message: error.message })
    }
  }
  const cards = products.map((producto) => <Card key={producto.id} producto={producto} variant={carousel ? 'featured' : 'catalog'} onViewDetails={() => setModal({ type: 'details', producto })} onAddToCart={add} />)
  const added = modal?.type === 'added'
  return (
    <>
      {carousel ? <Carrousel autoPlay={modal === null}>{cards}</Carrousel> : <div className="grid min-w-0 grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1">{cards}</div>}
      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modal?.type === 'error' ? 'No se pudo agregar el producto' : added ? 'Se añadió al carrito' : 'Detalle del producto'}
        status={added ? 'Producto agregado' : undefined}
        producto={modal?.producto}
        message={modal?.message || (added ? 'Ya podés revisar tu carrito o seguir explorando el catálogo.' : 'Producto destacado de TerraByte, ideal para ampliar almacenamiento y rendimiento.')}
        confirmText={added ? 'Ir al carrito' : undefined}
        cancelText={added ? 'Seguir comprando' : undefined}
        onConfirm={() => navigate('/cart')}
      />
    </>
  )
}
