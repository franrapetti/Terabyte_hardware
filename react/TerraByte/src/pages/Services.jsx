import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { nasSteps } from '../data/nasSteps.js'
import { agregarAlCarrito, extraerPrecio, formatearPrecio } from '../functions/CartFuncion.jsx'
import ActionButton from '../components/ActionButton.jsx'
import Modal from '../components/Modal.jsx'
import NasStep from '../components/NasStep.jsx'
import ShopPage from '../components/ShopPage.jsx'

export default function Services() {
  const [index, setIndex] = useState(0)
  const [selections, setSelections] = useState({})
  const [modal, setModal] = useState(null)
  const navigate = useNavigate()
  const step = nasSteps[index]
  const selected = selections[step.name] || []
  const componentes = nasSteps.flatMap((entry) => entry.options.filter((option) => (selections[entry.name] || []).includes(option.value)).map((option) => option.value))
  const total = componentes.reduce((sum, value) => sum + extraerPrecio(value), 0)

  function select(value) {
    setSelections((current) => ({ ...current, [step.name]: step.multiple ? (selected.includes(value) ? selected.filter((entry) => entry !== value) : [...selected, value]) : [value] }))
  }

  function submit(event) {
    event.preventDefault()
    if (index < nasSteps.length - 1) {
      setIndex(index + 1)
      return
    }
    if (!componentes.length) {
      setModal({ title: 'Configuración incompleta', message: 'Elegí al menos un componente para agregar tu NAS al carrito.' })
      return
    }
    try {
      agregarAlCarrito({ tipo: 'Servicio', nombre: 'NAS personalizado', precio: total === 0 ? 'Gratis' : formatearPrecio(total), componentes })
      setModal({ success: true, title: 'NAS agregado al carrito', message: 'Tu configuración personalizada fue guardada con éxito.' })
    } catch (error) {
      setModal({ title: 'No se pudo guardar la configuración', message: error.message })
    }
  }

  return (
    <ShopPage title="Armá tu NAS" subtitle="Elegí los componentes que quieras y armá el NAS a medida de tus necesidades de almacenamiento en casa.">
      <form onSubmit={submit} className="mx-auto w-full max-w-[45rem]">
        <NasStep step={step} selected={selected} onChange={select} onClear={() => setSelections((current) => ({ ...current, [step.name]: [] }))}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {index > 0 && <ActionButton variant="secondary" onClick={() => setIndex(index - 1)}>Anterior</ActionButton>}
            {index < nasSteps.length - 1 ? <ActionButton key="next" className="ml-auto" onClick={(event) => { event.preventDefault(); setIndex(index + 1) }}>Siguiente</ActionButton> : <ActionButton key="submit" type="submit">Agregar al carrito</ActionButton>}
          </div>
        </NasStep>
        <p className="mt-5 text-right text-lg" aria-live="polite">Total de la configuración: <strong>{formatearPrecio(total)}</strong></p>
      </form>
      <Modal open={modal !== null} onClose={() => setModal(null)} variant="confirmation" status="Armá tu NAS" title={modal?.title} message={modal?.message} confirmText={modal?.success ? 'Ir al carrito' : 'Entendido'} cancelText={modal?.success ? 'Seguir configurando' : undefined} onConfirm={() => modal?.success ? navigate('/cart') : setModal(null)} />
    </ShopPage>
  )
}
