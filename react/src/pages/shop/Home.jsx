import { Link } from 'react-router-dom'
import heroImagen from '../../assets/NAS0-removebg-preview.png'
import ProductCard from '../../components/products/ProductCard.jsx'
import Carousel from '../../components/ui/Carousel.jsx'
import { productos } from '../../data/productos.js'
import { usePageTitle } from '../../hooks/usePageTitle.js'

const beneficios = ['Envíos en 24h', 'Garantía de 12 meses']

export default function Home() {
  usePageTitle('Inicio')

  return (
    <main className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col items-center gap-12 px-12 pt-16 pb-28 text-left text-[#273137] max-[800px]:px-6 max-[800px]:pt-12 max-[800px]:pb-16 max-[480px]:px-4 max-[480px]:pt-6 max-[480px]:pb-8 dark:text-[#f3f3f3]">
      <section className="flex w-full flex-1 items-center justify-between gap-20 pb-20 max-[800px]:flex-col max-[800px]:justify-center max-[800px]:gap-12 max-[800px]:pb-8">
        <div className="flex w-1/2 flex-col items-start gap-8 max-[800px]:w-full">
          <h1 className="m-0 text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1] font-bold max-[480px]:text-[clamp(2rem,10vw,2.75rem)]">
            Todo para armar
            <br />
            Tu NAS <em className="text-action not-italic dark:text-[#3395ff]">en casa</em>
          </h1>

          <p className="m-0 max-w-[34rem] text-[1.15rem] leading-[1.6]">
            Chasis hot-swap, racks compactos y hardware optimizado para homelabs e inferencia de IA local.
          </p>

          <Link
            to="/services"
            className="rounded-[0.6rem] bg-action px-9 py-3.5 text-[1.05rem] font-bold text-white no-underline shadow-[0_4px_14px_rgba(0,122,255,0.35)] transition-colors hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
          >
            Armá tu NAS
          </Link>

          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {beneficios.map((beneficio) => (
              <li key={beneficio} className="font-semibold">
                <span aria-hidden="true" className="mr-[0.6rem] font-extrabold text-action dark:text-[#3395ff]">✓</span>
                {beneficio}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-1/2 justify-center max-[800px]:w-full">
          <img src={heroImagen} alt="Servidores NAS" className="h-auto w-full object-contain max-[800px]:max-w-[34rem]" />
        </div>
      </section>

      <h2 className="m-0 w-full text-[1.75rem] font-extrabold">Productos destacados</h2>

      <Carousel
        label="Productos destacados"
        slides={productos.map((producto) => <ProductCard key={producto.id} producto={producto} />)}
      />
    </main>
  )
}
