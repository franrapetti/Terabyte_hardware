import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoDark from '../../../../assets/Logo.png'
import logoLight from '../../../../assets/Logo_claro.png'
import cartDark from '../../../../assets/shopping-cart_claro.png'
import cartLight from '../../../../assets/shopping-cart.png'
import { useCarrito } from '../functions/CartFuncion.jsx'
import { logout, useAuth } from '../functions/Auth.jsx'
import { toggleTheme, useTheme } from '../functions/Theme.jsx'
import SearchBar from './SearchBar.jsx'

export default function Header() {
  const navigate = useNavigate()
  const { cantidad } = useCarrito()
  const theme = useTheme()
  const session = useAuth()
  const [authError, setAuthError] = useState('')
  const isLight = theme === 'light'
  const themeLabel = isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'
  const focus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]'
  const accountClass = `inline-flex min-h-[2.55rem] items-center justify-center rounded-lg border border-transparent px-4 py-2 text-[0.9rem] font-semibold whitespace-nowrap no-underline transition-colors hover:bg-[#e2e6e8] dark:hover:bg-white/10 max-[480px]:min-h-[2.3rem] max-[480px]:px-[0.55rem] max-[480px]:py-[0.4rem] max-[480px]:text-[0.76rem] ${focus}`
  const linkClass = `font-semibold no-underline transition-colors hover:text-action dark:hover:text-[#b8c4ca] ${focus}`

  function handleLogout() {
    try {
      logout()
      setAuthError('')
      navigate('/')
    } catch (error) {
      setAuthError(error.message)
    }
  }

  return (
    <header className="sticky top-0 z-10 w-full shrink-0 bg-white text-left font-[Inter,Arial,Helvetica,sans-serif] text-[#273137] shadow-[0_2px_10px_rgba(24,32,36,0.12)] dark:bg-black dark:text-[#f3f3f3] dark:shadow-none">
      <nav aria-label="Navegación principal" className="mx-auto grid min-h-[5.5rem] w-full max-w-[90rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-[0.65rem] px-5 pt-[0.65rem] max-[480px]:px-[0.85rem] min-[1360px]:min-h-[4.75rem] min-[1360px]:grid-cols-[auto_auto_minmax(14rem,1fr)_auto_auto] min-[1360px]:gap-x-8 min-[1360px]:gap-y-0 min-[1360px]:px-[clamp(1rem,3vw,2.5rem)] min-[1360px]:pb-[0.65rem]">
        <Link to="/" aria-label="TerraByte, inicio" className={`col-start-1 row-start-1 flex items-center ${focus}`}>
          <img src={isLight ? logoLight : logoDark} alt="TerraByte" className="block h-auto w-36 max-[480px]:w-[clamp(7.5rem,36vw,9rem)] max-[360px]:w-30 min-[1360px]:w-34" />
        </Link>

        <SearchBar />

        <div className="col-start-2 row-start-1 flex min-w-0 flex-wrap items-center justify-end justify-self-end max-[480px]:max-w-[calc(100vw-10rem)] gap-[0.55rem] max-[480px]:gap-[0.35rem] min-[1360px]:col-start-4">
          {session ? (
            <>
              <span title={session.email} className={`${accountClass} max-w-40 truncate max-[480px]:max-w-24`}>Hola, {session.firstName || session.email}</span>
              <button type="button" onClick={handleLogout} className={`${accountClass} cursor-pointer bg-transparent`}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className={accountClass}>Ingresar</Link>
              <Link to="/register" className={`inline-flex min-h-[2.55rem] items-center justify-center rounded-lg border border-action bg-action px-4 py-2 text-[0.9rem] font-semibold whitespace-nowrap text-white no-underline transition-colors hover:bg-action-hover max-[480px]:min-h-[2.3rem] max-[480px]:px-[0.55rem] max-[480px]:py-[0.4rem] max-[480px]:text-[0.76rem] ${focus}`}>Registrarse</Link>
            </>
          )}
        </div>

        <div className="col-start-1 row-start-3 flex min-h-[2.6rem] items-center gap-[clamp(1rem,2.5vw,2rem)] border-t border-[#d5dade] text-[0.95rem] dark:border-[#363636] max-[480px]:gap-3 max-[480px]:text-[0.78rem] max-[360px]:gap-2 max-[360px]:text-[0.72rem] min-[1360px]:col-start-2 min-[1360px]:row-start-1 min-[1360px]:min-h-[2.8rem] min-[1360px]:border-0">
          <Link to="/products" className={linkClass}>Productos</Link>
          <Link to="/services" className={linkClass}>Armá tu NAS</Link>
        </div>

        <div className="col-start-2 row-start-3 flex min-h-[2.6rem] items-center justify-end gap-4 border-t border-[#d5dade] text-[0.95rem] dark:border-[#363636] max-[480px]:gap-[0.55rem] max-[480px]:text-[0.78rem] max-[360px]:gap-[0.35rem] max-[360px]:text-[0.72rem] min-[1360px]:col-start-5 min-[1360px]:row-start-1 min-[1360px]:min-h-[2.8rem] min-[1360px]:border-0">
          <Link to="/cart" aria-label={`Carrito, ${cantidad} artículos`} className={`relative inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-transparent transition-colors hover:border-[#aab5ba] hover:bg-[#e2e6e8] dark:hover:bg-[#435058] ${focus}`}>
            <img src={isLight ? cartLight : cartDark} alt="" className="size-[1.35rem] object-contain" />
            {cantidad > 0 && <span aria-hidden="true" className="absolute -top-1 -right-1 min-w-5 rounded-full bg-action px-1 text-center text-xs font-bold text-white">{cantidad}</span>}
          </Link>
          <Link to="/aboutus" className={`text-[#59656b] dark:text-[#b7bdc0] ${linkClass}`}>Nosotros</Link>
          <button type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel} aria-pressed={isLight} className={`grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg border border-transparent bg-transparent transition-colors hover:bg-[#e2e6e8] dark:hover:bg-[#435058] max-[480px]:size-[2.35rem] ${focus}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
              {isLight ? <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>}
            </svg>
          </button>
        </div>
      </nav>
      {authError && <p role="alert" className="px-4 py-2 text-center text-sm text-red-700 dark:text-red-300">{authError}</p>}
    </header>
  )
}
