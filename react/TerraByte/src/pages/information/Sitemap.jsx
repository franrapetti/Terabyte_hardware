import { Link } from 'react-router-dom'
import LegalPage from '../../components/layout/LegalPage.jsx'

const groups = [
  { title: 'Tienda', links: [
    { to: '/', label: 'Inicio' },
    { to: '/products', label: 'Productos' },
    { to: '/services', label: 'Armá tu NAS' },
    { to: '/cart', label: 'Carrito' },
  ] },
  { title: 'Cuenta', links: [
    { to: '/login', label: 'Ingresar' },
    { to: '/register', label: 'Registrarse' },
  ] },
  { title: 'Empresa', links: [{ to: '/aboutus', label: 'Nosotros' }] },
  { title: 'Legal', links: [
    { to: '/privacy', label: 'Política de privacidad' },
    { to: '/terms', label: 'Términos de uso' },
    { to: '/refunds', label: 'Ventas y reembolsos' },
    { to: '/legal', label: 'Información legal' },
  ] },
]

export default function Sitemap() {
  return (
    <LegalPage title="Mapa del sitio">
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(10rem,100%),1fr))] gap-x-8 gap-y-4">
        {groups.map(({ title, links }) => (
          <section key={title} aria-label={title}>
            <h2>{title}</h2>
            <ul className="list-none! pl-0!">
              {links.map(({ to, href, label }) => (
                <li key={to || href} className="mb-[0.35rem]">
                  {to ? <Link to={to}>{label}</Link> : <a href={href}>{label}</a>}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </LegalPage>
  )
}
