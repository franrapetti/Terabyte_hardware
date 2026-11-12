import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionButton from '../../components/ui/ActionButton.jsx'
import Modal from '../../components/ui/Modal.jsx'
import { useCarrito } from '../../hooks/useCarrito.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'
import { extraerPrecio, formatearPrecio } from '../../utils/cart.js'

// Opciones de la versión simple. Los valores conservan el formato del carrito anterior.
const pasos = [
  {
    "name": "gabinete",
    "title": "Gabinete",
    "multiple": false,
    "options": [
      {
        "value": "NAS 2 bahías ($80.000)",
        "label": "Gabinete NAS 2 bahías"
      },
      {
        "value": "NAS 4 bahías ($130.000)",
        "label": "Gabinete NAS 4 bahías"
      },
      {
        "value": "NAS 8 bahías ($220.000)",
        "label": "Gabinete NAS 8 bahías"
      }
    ]
  },
  {
    "name": "placa",
    "title": "Placa base",
    "multiple": false,
    "options": [
      {
        "value": "Mini-ITX Bajo Consumo ($95.000)",
        "label": "Placa Mini-ITX Bajo Consumo"
      },
      {
        "value": "Micro-ATX Multi SATA ($150.000)",
        "label": "Placa Micro-ATX Multi SATA"
      }
    ]
  },
  {
    "name": "cpu",
    "title": "Procesador",
    "multiple": false,
    "options": [
      {
        "value": "Intel Celeron N5105 ($70.000)",
        "label": "Intel Celeron N5105"
      },
      {
        "value": "Intel Core i3 12100 ($180.000)",
        "label": "Intel Core i3 12100"
      },
      {
        "value": "AMD Ryzen 5 5600G ($210.000)",
        "label": "AMD Ryzen 5 5600G"
      }
    ]
  },
  {
    "name": "ram",
    "title": "Memoria RAM",
    "multiple": false,
    "options": [
      {
        "value": "8 GB DDR4 ($30.000)",
        "label": "8 GB DDR4"
      },
      {
        "value": "16 GB DDR4 ($55.000)",
        "label": "16 GB DDR4"
      },
      {
        "value": "32 GB DDR4 ($100.000)",
        "label": "32 GB DDR4"
      }
    ]
  },
  {
    "name": "discos",
    "title": "Discos de almacenamiento (opcional)",
    "multiple": true,
    "options": [
      {
        "value": "HDD NAS 4TB ($90.000)",
        "label": "HDD NAS 4TB"
      },
      {
        "value": "HDD NAS 8TB ($150.000)",
        "label": "HDD NAS 8TB"
      },
      {
        "value": "SSD NAS 1TB ($80.000)",
        "label": "SSD NAS 1TB"
      }
    ]
  },
  {
    "name": "fuente",
    "title": "Fuente de alimentación",
    "multiple": false,
    "options": [
      {
        "value": "Fuente 300W ($40.000)",
        "label": "Fuente 300W"
      },
      {
        "value": "Fuente 500W ($60.000)",
        "label": "Fuente 500W"
      }
    ]
  },
  {
    "name": "so",
    "title": "Sistema operativo NAS",
    "multiple": false,
    "options": [
      {
        "value": "TrueNAS (Gratis)",
        "label": "TrueNAS"
      },
      {
        "value": "Unraid ($70.000)",
        "label": "Unraid"
      }
    ]
  }
]

export default function Services() {
  usePageTitle('Armá tu NAS')
  const navigate = useNavigate()
  const { agregar, errorGuardado } = useCarrito()
  const [gabinete, setGabinete] = useState('')
  const [placa, setPlaca] = useState('')
  const [cpu, setCpu] = useState('')
  const [ram, setRam] = useState('')
  const [discos, setDiscos] = useState([])
  const [fuente, setFuente] = useState('')
  const [so, setSo] = useState('')
  const [pasoActual, setPasoActual] = useState(0)
  const [modal, setModal] = useState(null)
  const tituloPaso = useRef(null)

  const selecciones = { gabinete, placa, cpu, ram, discos, fuente, so }
  const setters = { gabinete: setGabinete, placa: setPlaca, cpu: setCpu, ram: setRam, discos: setDiscos, fuente: setFuente, so: setSo }
  const paso = pasos[pasoActual]
  const seleccion = paso.multiple ? selecciones[paso.name] : [selecciones[paso.name]].filter(Boolean)
  const ultimoPaso = pasoActual === pasos.length - 1

  // Al navegar con el teclado, el foco acompaña al nuevo paso.
  useEffect(() => {
    tituloPaso.current.focus()
  }, [pasoActual])

  function cambiarSeleccion(event) {
    const { value, checked } = event.target
    if (paso.multiple) {
      setDiscos((actuales) => checked ? [...actuales, value] : actuales.filter((disco) => disco !== value))
    } else {
      setters[paso.name](value)
    }
  }

  function quitarSeleccion() {
    setters[paso.name](paso.multiple ? [] : '')
  }

  function enviar(event) {
    event.preventDefault()
    // Enter en un paso intermedio avanza; solo el último agrega al carrito.
    if (!ultimoPaso) {
      setPasoActual((actual) => actual + 1)
      return
    }

    // Se recorre el orden de las opciones, independientemente del orden de los clics.
    const componentes = pasos.flatMap((grupo) => grupo.options
      .filter((opcion) => grupo.multiple ? discos.includes(opcion.value) : selecciones[grupo.name] === opcion.value)
      .map((opcion) => opcion.value))

    if (componentes.length === 0) {
      setModal({ tipo: 'error', titulo: 'Configuración incompleta', mensaje: 'Elegí al menos un componente para agregar tu NAS al carrito.' })
      return
    }

    const precioTotal = componentes.reduce((total, componente) => total + extraerPrecio(componente), 0)
    try {
      agregar({ tipo: 'Servicio', nombre: 'NAS personalizado', precio: precioTotal === 0 ? 'Gratis' : formatearPrecio(precioTotal), componentes })
      setModal({ tipo: 'exito', titulo: 'NAS agregado al carrito', mensaje: 'Tu configuración personalizada se agregó al carrito.' })
    } catch (error) {
      setModal({ tipo: 'error', titulo: 'No se pudo agregar el NAS', mensaje: error.message })
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-[76rem] flex-1 flex-col items-center gap-8 px-4 pt-8 pb-12 text-[#273137] dark:text-[#f3f3f3]">
      <div className="max-w-3xl text-center">
        <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold">Armá tu NAS</h1>
        <p className="mt-3 text-lg text-[#59656b] dark:text-[#b7bdc0]">Elegí los componentes que quieras y armá el NAS a medida de tus necesidades de almacenamiento en casa.</p>
        <p id="nas-instructions" className="mt-3 text-sm">Todas las selecciones son opcionales. Elegí al menos un componente para agregar la configuración al carrito.</p>
      </div>

      <form onSubmit={enviar} aria-describedby="nas-instructions" className="w-full max-w-[45rem]">
        <fieldset className="rounded-2xl bg-white p-[clamp(1rem,4vw,1.5rem)] shadow-lg dark:bg-[#435058]">
          <legend ref={tituloPaso} tabIndex={-1} className="rounded-xl bg-[#e2e6e8] px-3 py-1 text-lg font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action dark:bg-[#364147]">
            {pasoActual + 1}/{pasos.length}. {paso.title}
          </legend>

          <p className="mt-2 mb-4 text-sm text-[#59656b] dark:text-[#d9d9d9]">{paso.multiple ? 'Podés seleccionar varios discos.' : 'Podés seleccionar una opción.'}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paso.options.map((opcion) => (
              <label key={opcion.value} className="flex cursor-pointer flex-col gap-3 rounded-xl border-2 border-[#c5cdd1] bg-[#f4f6f7] p-4 transition-colors hover:border-action has-checked:border-action has-checked:bg-[#eaf3fc] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-action dark:border-[#77838a] dark:bg-[#2b353b] dark:has-checked:border-[#38bdf8] dark:has-checked:bg-[#1a2a38]">
                <input
                  type={paso.multiple ? 'checkbox' : 'radio'}
                  name={paso.name}
                  value={opcion.value}
                  checked={seleccion.includes(opcion.value)}
                  onChange={cambiarSeleccion}
                  className="size-4 cursor-pointer accent-action"
                />
                <span className="font-semibold">{opcion.label}</span>
                <span className="font-bold text-action dark:text-[#38bdf8]">{extraerPrecio(opcion.value) === 0 ? 'Gratis' : formatearPrecio(extraerPrecio(opcion.value))}</span>
              </label>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p aria-live="polite" aria-atomic="true" className="flex-1 text-sm">Seleccionado: <span className="font-semibold text-action dark:text-[#7dd3fc]">{seleccion.length > 0 ? seleccion.join(', ') : 'Ninguno (opcional)'}</span></p>
            {seleccion.length > 0 && <ActionButton variant="secondary" size="small" onClick={quitarSeleccion}>Quitar selección</ActionButton>}
          </div>

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            {pasoActual > 0 && <ActionButton variant="secondary" onClick={() => setPasoActual((actual) => actual - 1)}>Anterior</ActionButton>}
            {/* Cada botón lleva su "key" para que React los trate como botones distintos. Sin eso reutiliza el mismo
                botón y le cambia el tipo a "submit" en pleno clic, y el formulario se envía al pasar del paso 6 al 7. */}
            {ultimoPaso ? <ActionButton key="agregar" type="submit" className="ml-auto">Agregar al carrito</ActionButton> : <ActionButton key="siguiente" className="ml-auto" onClick={() => setPasoActual((actual) => actual + 1)}>Siguiente</ActionButton>}
          </div>
        </fieldset>
        {errorGuardado && <p role="alert" className="mt-4 rounded-lg bg-red-100 p-3 text-red-800 dark:bg-red-950 dark:text-red-200">{errorGuardado}</p>}
      </form>

      {modal && (
        <Modal label={modal.titulo} onClose={() => setModal(null)}>
          <p className="mb-2 text-sm font-bold text-action dark:text-action-hover">Armá tu NAS</p>
          <h2 className="text-xl font-bold">{modal.titulo}</h2>
          <p className="mt-3">{modal.mensaje}</p>
          {errorGuardado && <p role="alert" className="mt-3 text-sm text-red-700">{errorGuardado}</p>}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ActionButton variant="secondary" onClick={() => setModal(null)}>{modal.tipo === 'exito' ? 'Seguir configurando' : 'Entendido'}</ActionButton>
            {modal.tipo === 'exito' && <ActionButton onClick={() => navigate('/cart')}>Ir al carrito</ActionButton>}
          </div>
        </Modal>
      )}
    </main>
  )
}
