import { useEffect, useRef, useState } from 'react'

// Ventana emergente hecha con el <dialog> nativo del navegador. Al abrirse con showModal() el navegador
// mueve el foco adentro, deja el resto de la página inactiva (el Tab no sale) y cierra con la tecla Escape.
// "label" es el nombre que leen los lectores de pantalla; "onClose" avisa que hay que cerrarlo.
export default function Modal({ label, onClose, children }) {
  const dialog = useRef(null)
  // El botón que tenía el foco cuando se abrió el modal. Se anota una sola vez, antes de que el modal tome el foco.
  const [botonQueLoAbrio] = useState(() => document.activeElement)

  useEffect(() => {
    const abierto = dialog.current
    const overflowAnterior = document.body.style.overflow

    if (!abierto.open) abierto.showModal()
    document.body.style.overflow = 'hidden' // la página de atrás no hace scroll

    // Al cerrarse el modal, el foco vuelve al botón que lo abrió y la página recupera el scroll.
    return () => {
      document.body.style.overflow = overflowAnterior
      if (botonQueLoAbrio instanceof HTMLElement) botonQueLoAbrio.focus()
    }
  }, [botonQueLoAbrio])

  function cerrarSiEsElFondo(event) {
    // El fondo oscuro es parte del <dialog>: un clic ahí tiene como destino al propio <dialog>.
    if (event.target === event.currentTarget) dialog.current.close()
  }

  return (
    // onClose del <dialog> se dispara con cualquier cierre (Escape, la X o el fondo) y se lo pasa a quien usa el Modal.
    <dialog
      ref={dialog}
      aria-label={label}
      onClose={onClose}
      onClick={cerrarSiEsElFondo}
      className="m-auto w-[calc(100%_-_2rem)] max-w-[28rem] rounded-2xl border-0 bg-[#e9edef] p-0 text-[#273137] scheme-light shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop:bg-black/65 dark:bg-[#d9d9d9] dark:text-[#1b1b1b]"
    >
      <div className="relative p-6 text-center">
        <button type="button" onClick={() => dialog.current.close()} aria-label="Cerrar" className="absolute top-3 right-3 grid size-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-xl leading-none transition-colors hover:bg-[#596870] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]">
          ×
        </button>
        {children}
      </div>
    </dialog>
  )
}
