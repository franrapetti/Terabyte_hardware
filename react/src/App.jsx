import { Link, Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import AboutUs from './pages/info/AboutUs.jsx'
import Terms from './pages/legal/Terms.jsx'
import Privacy from './pages/legal/Privacy.jsx'
import Refunds from './pages/legal/Refunds.jsx'
import Legal from './pages/legal/Legal.jsx'
import Sitemap from './pages/legal/Sitemap.jsx'
import Products from './pages/shop/Products.jsx'
import Cart from './pages/shop/Cart.jsx'
import Services from './pages/shop/Services.jsx'

// Versión parcial: rutas de Login, Register, Products, Cart, Services, About us y las páginas legales.
// Cuando se migren las demás pages, agregar su <Route> acá (y sacar el placeholder de "/").

function Placeholder({ title, children }) {
  return (
    <main className="mx-auto flex w-full max-w-[48rem] flex-1 flex-col gap-3 p-8 text-left text-[#273137] dark:text-[#d9d9d9]">
      <title>{`${title} | TerraByte`}</title>
      <h1 className="text-3xl font-bold">{title}</h1>
      {children}
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        {/* TODO paso 6: reemplazar por <Home /> */}
        <Route index element={<Placeholder title="Inicio"><p>Esta página todavía no fue migrada.</p></Placeholder>} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="cart" element={<Cart />} />
        <Route path="services" element={<Services />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="products" element={<Products />} />
        <Route path="aboutus" element={<AboutUs />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="refunds" element={<Refunds />} />
        <Route path="legal" element={<Legal />} />
        <Route path="sitemap" element={<Sitemap />} />
        <Route path="*" element={
          <Placeholder title="Página no encontrada">
            <p>Esta página no existe todavía.</p>
            <p><Link to="/" className="font-bold text-action underline underline-offset-4 dark:text-[#75b8ff]">Volver al inicio</Link></p>
          </Placeholder>
        } />
      </Route>
    </Routes>
  )
}
