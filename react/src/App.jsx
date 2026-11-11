import { Link, Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/layout/SiteLayout.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import AboutUs from './pages/info/AboutUs.jsx'

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
        <Route index element={<Placeholder title="Inicio"><p>Esta página todavía no fue migrada.</p></Placeholder>} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="aboutus" element={<AboutUs />} />

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
