import { Link } from 'react-router-dom'
import LegalPage from '../../components/LegalPage.jsx'
import LegalSection from '../../components/LegalSection.jsx'

// Los datos van en un array y se muestran con .map(), en vez de copiar el mismo HTML cuatro veces.
const groups = [
  {
    title: 'Tienda',
    links: [
      { to: '/', label: 'Inicio' },
      { to: '/products', label: 'Productos' },
      { to: '/services', label: 'Armá tu NAS' },
      { to: '/cart', label: 'Carrito' },
    ],
  },
  {
    title: 'Cuenta',
    links: [
      { to: '/login', label: 'Ingresar' },
      { to: '/register', label: 'Registrarse' },
    ],
  },
  {
    title: 'Empresa',
    links: [{ to: '/aboutus', label: 'Nosotros' }],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Política de privacidad' },
      { to: '/terms', label: 'Términos de uso' },
      { to: '/refunds', label: 'Ventas y reembolsos' },
      { to: '/legal', label: 'Información legal' },
    ],
  },
]

export default function Sitemap() {
  return (
    <LegalPage title="Mapa del sitio">
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-x-8 gap-y-4">
        {groups.map((group) => (
          <LegalSection key={group.title} title={group.title}>
            <ul className="flex flex-col gap-1.5">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </LegalSection>
        ))}
      </div>
    </LegalPage>
  )
}
