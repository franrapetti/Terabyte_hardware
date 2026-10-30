import logoDark from '../assets/Logo.png'
import logoLight from '../assets/Logo_claro.png'
import { Link } from 'react-router-dom'

const legalLinks = [
  { href: '/privacy', label: 'Política de privacidad' },
  { href: '/terms', label: 'Términos de uso' },
  { href: '/refunds', label: 'Ventas y reembolsos' },
  { href: '/legal', label: 'Legal' },
  { href: '/sitemap', label: 'Mapa del sitio' },
]

export default function Footer() {
  return (
    <footer className="mt-auto w-full shrink-0 border-t border-[#d5dade] bg-white font-[Inter,Arial,Helvetica,sans-serif] shadow-[0_2px_10px_rgba(24,32,36,0.12)] dark:border-[#262626] dark:bg-black dark:shadow-none">
      <div className="mx-auto flex w-full max-w-[90rem] flex-wrap items-center justify-between gap-x-8 gap-y-5 px-[clamp(1rem,3vw,2.5rem)] pt-7 pb-5 max-[700px]:flex-col max-[700px]:justify-center max-[700px]:text-center">
        <Link
          to="/"
          aria-label="TerraByte, inicio"
          className="flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
        >
          <img src={logoDark} alt="TerraByte" className="hidden h-auto w-34 dark:block" />
          <img src={logoLight} alt="TerraByte" className="block h-auto w-34 dark:hidden" />
        </Link>

        <nav aria-label="Información legal" className="flex flex-wrap items-center gap-x-7 gap-y-2 max-[700px]:justify-center max-[700px]:gap-x-[1.1rem] max-[700px]:gap-y-[0.6rem]">
          {legalLinks.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className="text-[0.9rem] text-[#4a565c] no-underline transition-colors duration-150 hover:text-action focus-visible:text-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff] dark:text-[#b7bdc0] dark:hover:text-white dark:focus-visible:text-white max-[700px]:text-[0.85rem]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <p className="mx-auto w-full max-w-[90rem] border-t border-[#d5dade] px-[clamp(1rem,3vw,2.5rem)] pt-4 pb-6 text-center text-[0.8rem] text-[#6b767c] dark:border-[#262626] dark:text-[#7d868b]">
        © 2026 TerraByte Team. Todos los derechos reservados.
      </p>
    </footer>
  )
}
