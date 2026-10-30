import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SiteLayout from './components/SiteLayout.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import Services from './pages/Services.jsx'
import Cart from './pages/Cart.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import LegalPage from './components/LegalPage.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Sitemap from './pages/Sitemap.jsx'
import Terms from './pages/Terms.jsx'
import Refunds from './pages/Refunds.jsx'
import Legal from './pages/Legal.jsx'
import Privacy from './pages/Privacy.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="products" element={<Products />} />
        <Route path="services" element={<Services />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="aboutus" element={<AboutUs />} />
        <Route path="sitemap" element={<Sitemap />} />
        <Route path="terms" element={<Terms />} />
        <Route path="refunds" element={<Refunds />} />
        <Route path="legal" element={<Legal />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="home.html" element={<Navigate to="/" replace />} />
        {['login', 'register', 'products', 'services', 'cart', 'aboutus', 'sitemap', 'terms', 'refunds', 'legal', 'privacy'].map((page) => (
          <Route key={page} path={`${page}.html`} element={<LegacyRedirect to={`/${page}`} />} />
        ))}
        <Route path="*" element={
          <LegalPage title="Página no encontrada">
            <p>La página que buscás no está disponible en esta versión del sitio.</p>
            <p><Link to="/">Volver al inicio</Link></p>
          </LegalPage>
        } />
      </Route>
    </Routes>
  )
}

function LegacyRedirect({ to }) {
  const { search } = useLocation()
  return <Navigate to={`${to}${search}`} replace />
}
