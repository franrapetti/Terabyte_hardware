import { Children, useCallback, useEffect, useId, useRef, useState } from 'react'
import arrowLeft from '../assets/products/arrow-left.png'
import arrowRight from '../assets/products/arrow-right.png'

/** Recibe Cards o imágenes como children. variant: 'products' | 'brands'. */
export default function Carrousel({ children, ...props }) {
  const slides = Children.toArray(children)
  // Reinicia la posición si cambia la cantidad de elementos (por ejemplo, al filtrar).
  return <CarouselTrack key={slides.length} slides={slides} {...props} />
}

function CarouselTrack({
  slides,
  variant = 'products',
  label,
  autoPlay = true,
  interval,
  className = '',
}) {
  const brands = variant === 'brands'
  const count = slides.length
  const trackId = useId()
  const trackRef = useRef(null)
  const [layout, setLayout] = useState({ perView: 1, step: 0 })
  const [position, setPosition] = useState({ index: 0, moving: false })
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [stopped, setStopped] = useState(false)
  const canMove = count > (brands ? 1 : layout.perView)
  const activeIndex = canMove ? position.index : 0
  const duration = brands ? 2400 : 400
  const delay = interval ?? (brands ? 4200 : 7500)
  const finishMove = useCallback(() => {
    setPosition((current) => current.moving ? { index: current.index >= count ? 0 : current.index, moving: false } : current)
  }, [count])

  useEffect(() => {
    const track = trackRef.current
    if (!track || !count) return

    function measure() {
      const styles = getComputedStyle(track)
      const perView = Math.min(count, Number.parseInt(styles.getPropertyValue('--visible-slides'), 10) || 1)
      const gap = Number.parseFloat(styles.columnGap) || 0
      setLayout({ perView, step: track.firstElementChild.getBoundingClientRect().width + gap })
    }

    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [count])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const update = () => setHidden(document.visibilityState !== 'visible')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    if (!autoPlay || stopped || hovered || focused || hidden || reduceMotion || !canMove || position.moving || delay <= 0) return
    const timer = window.setTimeout(() => {
      setPosition((current) => ({ index: current.index + 1, moving: true }))
    }, delay)
    return () => window.clearTimeout(timer)
  }, [autoPlay, stopped, hovered, focused, hidden, reduceMotion, canMove, position, delay])

  useEffect(() => {
    if (!position.moving) return
    // También termina si el navegador omite transitionend (pestaña oculta o resize).
    const timer = window.setTimeout(finishMove, reduceMotion ? 0 : duration + 80)
    return () => window.clearTimeout(timer)
  }, [position.moving, finishMove, duration, reduceMotion])

  if (!count) return null

  const arrowClass = 'shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0 drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)] transition-transform hover:scale-110 disabled:cursor-default disabled:opacity-40 disabled:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff] motion-reduce:transition-none'
  const copies = canMove ? slides.slice(0, Math.min(layout.perView, count)) : []
  const slideClass = brands ? 'flex min-w-0 items-center justify-center py-10 [&_img]:max-h-60 [&_img]:max-w-[min(6rem,100%)] [&_img]:object-contain [&_img]:rounded-lg [&_img]:bg-white [&_img]:p-2' : 'min-w-0'
  function move(delta) {
    if (!canMove || position.moving || activeIndex + delta < 0) return
    setPosition({ index: activeIndex + delta, moving: true })
  }

  return (
    <section
      role="region"
      aria-roledescription="carrusel"
      aria-label={label || (brands ? 'Marcas' : 'Productos destacados')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
      className={`relative w-full rounded-2xl bg-[#e2e6e8] dark:bg-[#435058] font-[Inter,Arial,Helvetica,sans-serif] shadow-[0_6px_16px_rgba(0,0,0,0.4)] ${brands ? 'overflow-hidden' : 'flex items-center gap-2 px-4 pt-10 pb-8 max-[700px]:gap-1 max-[700px]:px-1 max-[700px]:pb-3'} ${className}`}
    >
      {autoPlay && canMove && !reduceMotion && <button type="button" onClick={() => setStopped((current) => !current)} aria-controls={trackId} aria-pressed={stopped} className="absolute top-1 right-3 z-1 cursor-pointer rounded px-2 py-1 text-xs font-semibold text-[#273137] hover:underline focus-visible:outline-2 focus-visible:outline-[#007aff] dark:text-white">{stopped ? 'Reanudar carrusel' : 'Pausar carrusel'}</button>}
      {!brands && <button type="button" aria-label="Anterior" aria-controls={trackId} disabled={!canMove || activeIndex === 0} aria-disabled={position.moving} onClick={() => move(-1)} className={arrowClass}><img src={arrowLeft} alt="" className="h-auto w-10 max-[700px]:w-6 dark:invert" /></button>}
      <div className="min-w-0 flex-1 overflow-hidden">
        <div
          ref={trackRef}
          id={trackId}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && event.propertyName === 'transform') finishMove()
          }}
          className={`grid grid-flow-col items-stretch auto-cols-[calc((100%-(var(--per-view)-1)*var(--gap))/var(--per-view))] gap-(--gap) [--per-view:min(var(--visible-slides),var(--slide-count))] ${brands ? '[--gap:0rem]' : '[--gap:2rem] [--visible-slides:2] max-[700px]:[--visible-slides:1] min-[1100px]:[--visible-slides:3]'}`}
          style={{
            '--slide-count': count,
            ...(brands ? { '--visible-slides': count } : {}),
            transform: `translateX(-${activeIndex * layout.step}px)`,
            transition: position.moving && !reduceMotion ? `transform ${duration}ms ${brands ? 'linear' : 'ease-in-out'}` : 'none',
          }}
        >
          {slides.map((slide, index) => (
            <div key={slide.key} role="group" aria-roledescription="diapositiva" aria-label={`${index + 1} de ${count}`} inert={!brands && (index < activeIndex || index >= activeIndex + layout.perView)} className={slideClass}>{slide}</div>
          ))}
          {copies.map((slide) => <div key={`copy-${slide.key}`} aria-hidden="true" inert className={slideClass}>{slide}</div>)}
        </div>
      </div>
      {!brands && <button type="button" aria-label="Siguiente" aria-controls={trackId} disabled={!canMove} aria-disabled={position.moving} onClick={() => move(1)} className={arrowClass}><img src={arrowRight} alt="" className="h-auto w-10 max-[700px]:w-6 dark:invert" /></button>}
    </section>
  )
}
