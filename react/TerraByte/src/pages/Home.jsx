import { Link } from 'react-router-dom'
import heroImage from '../assets/NAS0-removebg-preview.png'
import { products } from '../data/catalog.js'
import ProductShowcase from '../components/ProductShowcase.jsx'

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[90rem] flex-1 px-[clamp(1rem,4vw,4rem)] py-12 text-left text-[#273137] dark:text-white">
      <title>TerraByte</title>
      <section className="mb-12 flex items-center gap-12 max-[800px]:flex-col">
        <div className="flex-1">
          <h1 className="mt-0 mb-6 text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1] font-extrabold tracking-normal text-inherit">Todo para armar<br />Tu NAS <em className="text-action dark:text-[#38bdf8]">en casa</em></h1>
          <p className="mb-6 max-w-xl text-lg leading-relaxed">Chasis hot-swap, racks compactos y hardware optimizado para homelabs e inferencia de IA local.</p>
          <Link to="/services" className="inline-flex rounded-lg bg-action px-6 py-3 font-bold text-white hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]">Armá tu NAS</Link>
          <ul className="mt-6 flex flex-wrap gap-6 text-sm"><li>Envíos en 24h</li><li>Garantía de 12 meses</li></ul>
        </div>
        <img src={heroImage} alt="Servidores NAS Hero" className="w-1/2 max-w-[34rem] object-contain max-[800px]:w-full" />
      </section>
      <h2 className="mb-6 text-2xl font-bold text-inherit">Productos destacados</h2>
      <ProductShowcase products={products} carousel />
    </main>
  )
}
