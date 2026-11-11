import { useEffect } from 'react'

// Ventana emergente. Se cierra con la X, haciendo clic en el fondo oscuro o con la tecla Escape.
// "label" es el nombre que leen los lectores de pantalla; "children" es el contenido.
export default function Modal({ label, onClose, children }) {
  useEffect(() => {
    function cerrarConEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', cerrarConEscape)
    // La función que devuelve el efecto se ejecuta al cerrarse el modal: quita el listener.
    return () => window.removeEventListener('keydown', cerrarConEscape)
  }, [onClose])

  function cerrarSiEsElFondo(event) {
    // Solo cierra si el clic fue en el fondo, no en el contenido de adentro.
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <div onClick={cerrarSiEsElFondo} className="fixed inset-0 z-20 flex items-center justify-center bg-black/65 p-4">
      <div role="dialog" aria-modal="true" aria-label={label} className="relative w-full max-w-[28rem] rounded-2xl bg-[#e9edef] p-6 text-center text-[#273137] shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:bg-[#d9d9d9] dark:text-[#1b1b1b]">
        <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute top-3 right-3 grid size-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-xl leading-none transition-colors hover:bg-[#596870] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]">
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
