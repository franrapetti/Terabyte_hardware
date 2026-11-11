import { Link, Navigate, useLocation } from 'react-router-dom'
import ActionButton from '../../components/ui/ActionButton.jsx'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import FormField from '../../components/ui/FormField.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useAuthForm } from '../../hooks/useAuthForm.js'

export default function Login() {
  const { user, login } = useAuth()
  const location = useLocation()
  const { valores, cambiar, enviar, cargando, error } = useAuthForm({ email: '', password: '' }, login)

  // Con la sesión iniciada vuelve a la página que se pidió antes de ingresar (o al inicio).
  if (user) return <Navigate to={location.state?.from || '/'} replace />
  return (
    <AuthLayout title="Iniciar sesión" eyebrow="QUÉ BUENO VERTE DE NUEVO" description="Ingresá tus datos para continuar.">
      <form onSubmit={enviar} aria-busy={cargando} className="flex flex-col gap-5">
        <FormField id="login-email" label="Correo electrónico" type="email" name="email" value={valores.email} onChange={cambiar} autoComplete="email" placeholder="nombre@ejemplo.com" required disabled={cargando} />
        <FormField id="login-password" label="Contraseña" type="password" name="password" value={valores.password} onChange={cambiar} autoComplete="current-password" placeholder="Ingresá tu contraseña" required disabled={cargando} />
        <ActionButton type="submit" disabled={cargando}>{cargando ? 'Ingresando…' : 'Ingresar'}</ActionButton>
        <p role="alert" className="min-h-5 text-center text-sm text-red-700 dark:text-red-300">{error}</p>
      </form>
      <p className="mt-6 text-center text-sm">¿Todavía no tenés cuenta? <Link to="/register" state={location.state} className="font-bold text-[#0065cc] underline underline-offset-4 dark:text-[#75b8ff]">Crear una cuenta</Link></p>
    </AuthLayout>
  )
}
