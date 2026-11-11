import { useEffect, useState } from 'react'

const SEPARACION = 2 // rem. Tiene que coincidir con la clase gap-8 del contenedor de las tarjetas.
const ESPERA = 7500 // milisegundos entre avances automáticos

// Cuántas tarjetas entran según el ancho de la pantalla.
function calcularPorVista() {
  if (window.innerWidth >= 1100) return 3
  if (window.innerWidth > 700) return 2
  return 1
}

function Flecha({ imagen, etiqueta, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={etiqueta}
      className="shrink-0 cursor-pointer border-0 bg-transparent p-0 drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)] transition duration-200 enabled:hover:scale-120 disabled:cursor-default disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff] motion-reduce:transition-none"
    >
      <img src={imagen} alt="" className="block h-auto w-10 max-[700px]:w-6" />
    </button>
  )
}

// Carrusel: muestra algunas tarjetas a la vez y las desplaza con las flechas o solo.
// "slides" es un array de elementos de React (cada uno con su "key"); "label" lo lee el lector de pantalla.
export default function Carousel({ label, slides }) {
  // Todo el carrusel se reduce a dos números: el índice de la primera tarjeta visible
  // y cuántas tarjetas entran en pantalla.
  const [indice, setIndice] = useState(0)
  const [porVista, setPorVista] = useState(calcularPorVista)

  // Valores calculados en cada render a partir de los dos estados. No se guardan aparte.
  const maxIndice = Math.max(0, slides.length - porVista)
  const indiceActual = Math.min(indice, maxIndice) // si la ventana se agranda, el índice no se pasa del final
  const sePuedeMover = maxIndice > 0

  function anterior() {
    setIndice(indiceActual - 1)
  }

  function siguiente() {
    // En la última posición vuelve al principio.
    setIndice(indiceActual >= maxIndice ? 0 : indiceActual + 1)
  }

  // Vuelve a calcular cuántas tarjetas entran cuando cambia el ancho de la ventana.
  useEffect(() => {
    function actualizar() {
      setPorVista(calcularPorVista())
    }

    window.addEventListener('resize', actualizar)
    return () => window.removeEventListener('resize', actualizar)
  }, [])

  // Avance automático. Como el efecto depende de "indiceActual", cada vez que el índice cambia
  // (también con un clic en las flechas) React cancela el temporizador anterior y arranca uno nuevo.
  useEffect(() => {
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!sePuedeMover || reducirMovimiento) return

    const temporizador = setTimeout(() => {
      setIndice(indiceActual >= maxIndice ? 0 : indiceActual + 1)
    }, ESPERA)
    return () => clearTimeout(temporizador)
  }, [indiceActual, maxIndice, sePuedeMover])

  return (
    <section
      aria-roledescription="carrusel"
      aria-label={label}
      className="flex w-full items-center gap-2 rounded-2xl bg-[#435058] px-4 py-8 shadow-[0_6px_16px_rgba(0,0,0,0.4)] max-[700px]:gap-1 max-[700px]:px-1 max-[700px]:py-3"
    >
      <Flecha imagen="/products/arrow-left.png" etiqueta="Anterior" onClick={anterior} disabled={indiceActual === 0} />

      <div className="min-w-0 flex-1 overflow-hidden">
        <ul
          className="m-0 grid list-none grid-flow-col gap-8 p-0 transition-transform duration-[400ms] ease-in-out motion-reduce:transition-none"
          style={{
            // Ancho de cada tarjeta: el espacio disponible menos las separaciones, dividido por las que entran.
            gridAutoColumns: `calc((100% - ${(porVista - 1) * SEPARACION}rem) / ${porVista})`,
            // Desplazamiento: una tarjeta más una separación por cada posición avanzada.
            transform: `translateX(calc(${indiceActual} * (100% + ${SEPARACION}rem) / ${porVista} * -1))`,
          }}
        >
          {slides.map((slide) => (
            // *:flex-1 hace que la tarjeta ocupe todo el ancho de su columna; sin eso se ajusta al largo del nombre.
            <li key={slide.key} className="flex *:min-w-0 *:flex-1">
              {slide}
            </li>
          ))}
        </ul>
      </div>

      <Flecha imagen="/products/arrow-right.png" etiqueta="Siguiente" onClick={siguiente} disabled={!sePuedeMover} />
    </section>
  )
}
