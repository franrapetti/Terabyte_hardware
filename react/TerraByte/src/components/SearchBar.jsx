import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export default function SearchBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const isCatalog = pathname.replace(/\/+$/, '') === '/products'

  function searchProducts(event) {
    event.preventDefault()
    const query = event.currentTarget.elements.q.value.trim()
    navigate(`/products${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  function changeSearch(event) {
    const value = event.target.value
    if (!isCatalog) {
      setSearch(value)
      return
    }
    setParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set('q', value)
      else next.delete('q')
      return next
    }, { replace: true })
  }
  const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]'

  return (
    <form role="search" action="/products" method="get" onSubmit={searchProducts} className={`col-span-2 row-start-2 flex h-12 min-w-0 items-center rounded-[0.65rem] border border-[#bdc5c9] bg-[#f4f6f7] p-[0.3rem] shadow-[0_3px_12px_rgba(24,32,36,0.12)] focus-within:border-action dark:border-[#3a4348] dark:bg-[#1f2427] dark:shadow-none min-[1360px]:col-span-1 min-[1360px]:col-start-3 min-[1360px]:row-start-1 min-[1360px]:h-[3.1rem]`}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mx-[0.65rem] size-[1.35rem] shrink-0 text-[#435058] dark:text-[#9aa4a9] max-[480px]:mr-1 max-[480px]:ml-[0.4rem]">
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 5 5" />
      </svg>
      <input type="search" name="q" value={isCatalog ? params.get('q') || '' : search} onChange={changeSearch} aria-label="Buscar productos" placeholder="¿Qué estás buscando?" className="h-full w-full min-w-0 border-0 bg-transparent px-[0.4rem] py-1 text-base text-[#1b1b1b] outline-none placeholder:text-[#687177] dark:text-[#f3f3f3] dark:placeholder:text-[#9aa4a9]" />
      <button type="submit" aria-label="Buscar" className={`min-w-22 shrink-0 cursor-pointer self-stretch rounded-[0.45rem] border-0 bg-[#435058] text-base font-bold text-white transition-colors hover:bg-[#596870] max-[480px]:min-w-17 max-[480px]:text-[0.85rem] ${focus}`}>Buscar</button>
    </form>
  )
}
