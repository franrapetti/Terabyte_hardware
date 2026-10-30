import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { brands, products } from '../../data/catalog.js'
import Carrousel from '../../components/ui/Carrousel.jsx'
import ProductShowcase from '../../components/products/ProductShowcase.jsx'
import ShopPage from '../../components/layout/ShopPage.jsx'

export default function Products() {
  const [params] = useSearchParams()
  const [category, setCategory] = useState('')
  const query = (params.get('q') || '').trim().toLocaleLowerCase('es-AR')
  const filtered = products.filter((product) => product.nombre.toLocaleLowerCase('es-AR').includes(query) && (!category || product.tags.includes(category)))
  return (
    <ShopPage title="La tecnología que estas buscando, al alcance de tu mano." subtitle="En nuestra página puede ver productos de las siguientes marcas.">
      <Carrousel variant="brands">{brands.map((brand) => <img key={brand.nombre} src={brand.imagen} alt={brand.nombre} />)}</Carrousel>
      <section aria-label="Catálogo de Productos" className="mt-8 grid grid-cols-[minmax(12rem,16rem)_1fr] items-start gap-4 rounded-2xl bg-white p-4 shadow-lg max-[800px]:grid-cols-1 dark:bg-[#435058]">
        <fieldset className="flex flex-col gap-3 rounded-2xl bg-[#e9edef] p-4 text-[#273137] dark:bg-[#2b353b] dark:text-[#f3f3f3]">
          <legend className="px-1 font-bold">Categorías</legend>
          {[['', 'Todos'], ['qnap', 'QNAP'], ['synology', 'Synology'], ['ugreen', 'UGREEN']].map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2"><input type="radio" name="categoria" value={value} checked={category === value} onChange={() => setCategory(value)} className="accent-[#007aff]" />{label}</label>
          ))}
        </fieldset>
        <div className="min-w-0">
          <ProductShowcase products={filtered} />
          {!filtered.length && <p role="status" className="p-6">No encontramos productos que coincidan con los filtros seleccionados.</p>}
        </div>
      </section>
    </ShopPage>
  )
}
