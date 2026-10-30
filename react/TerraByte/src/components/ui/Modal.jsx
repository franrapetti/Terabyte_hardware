import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

/** Modal controlado para detalles, avisos y confirmaciones.
 * onConfirm administra la acción y el cierre, incluso si abre otro modal.
 */
export default function Modal({
  open = false,
  onClose,
  title,
  message,
  status,
  producto,
  confirmText,
  cancelText,
  onConfirm,
  variant = 'product',
  children,
}) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const messageId = useId()
  const confirmation = variant === 'confirmation'
  const buttonClass = 'cursor-pointer rounded-lg border px-4 py-[0.65rem] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]'

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    dialog.showModal()
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${Number.parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`
    document.body.style.overflow = 'hidden'

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [open])

  if (!open) return null

  const price = typeof producto?.precio === 'number'
    ? `$${producto.precio.toLocaleString('es-AR')}`
    : producto?.precio

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={message ? messageId : undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose?.()
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose?.()
      }}
      className={`fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border-0 bg-[#e9edef] p-6 text-center font-[Inter,Arial,Helvetica,sans-serif] text-[#273137] shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop:bg-black/65 ${confirmation ? 'dark:bg-[#364147] dark:text-white' : 'dark:bg-[#2b353b] dark:text-[#f3f3f3]'}`}
    >
      <button type="button" aria-label="Cerrar" onClick={onClose} className="absolute top-3 right-3 grid size-8 cursor-pointer place-items-center rounded-lg bg-transparent text-xl hover:bg-[#596870] hover:text-white focus-visible:outline-2 focus-visible:outline-[#007aff]">×</button>
      {status && <p className={`mx-auto my-2 inline-flex rounded-full px-[0.7rem] py-[0.35rem] text-[0.8rem] font-bold uppercase ${confirmation ? 'bg-[#dce8ef] text-action dark:bg-[#2b353b] dark:text-[#38bdf8]' : 'bg-[#435058] text-white'}`}>{status}</p>}
      <h3 id={titleId} className="my-2 px-6 text-xl font-bold">{title}</h3>
      {producto && (
        <>
          {producto.imagen && <img src={producto.imagen} alt={producto.alt || producto.nombre} className="my-2 h-40 w-full rounded-lg bg-white p-2 object-contain" />}
          <h4 className="my-2 font-semibold">{producto.nombre}</h4>
          {price != null && <p className="my-2 text-[1.1rem] font-bold">{price}</p>}
        </>
      )}
      {message && <p id={messageId} className="my-2">{message}</p>}
      {children}
      {(cancelText || confirmText) && (
        <div className="mt-4 flex justify-center gap-3 max-[480px]:flex-col">
          {cancelText && <button type="button" onClick={onClose} className={`${buttonClass} border-[#879299] bg-transparent hover:bg-[#596870] hover:text-white`}>{cancelText}</button>}
          {confirmText && <button type="button" onClick={onConfirm || onClose} className={`${buttonClass} text-white ${confirmation ? 'border-action bg-action hover:bg-action-hover' : 'border-[#435058] bg-[#435058] hover:bg-[#596870]'}`}>{confirmText}</button>}
        </div>
      )}
    </dialog>,
    document.body,
  )
}
