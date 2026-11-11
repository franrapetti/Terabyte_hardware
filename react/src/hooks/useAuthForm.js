import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/** Comparte el envío y cancela sus efectos si se abandona el formulario. */
export function useAuthForm(authenticate) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const request = useRef(null)
  const navigate = useNavigate()

  useEffect(() => () => request.current?.abort(), [])

  async function submit(event) {
    event.preventDefault()
    if (request.current) return
    const fields = new FormData(event.currentTarget)
    const controller = new AbortController()
    request.current = controller
    setError('')
    setBusy(true)
    try {
      await authenticate(fields, { signal: controller.signal })
      if (!controller.signal.aborted) navigate('/', { replace: true })
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure.message)
    } finally {
      if (!controller.signal.aborted) setBusy(false)
      if (request.current === controller) request.current = null
    }
  }

  return { busy, error, submit }
}
