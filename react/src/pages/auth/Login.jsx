import { Link, Navigate } from 'react-router-dom'
import { loginUser, useAuth } from '../../functions/Auth.jsx'
import ActionButton from '../../components/ui/ActionButton.jsx'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import FormField from '../../components/ui/FormField.jsx'
import { useAuthForm } from '../../functions/useAuthForm.js'

export default function Login() {
  const session = useAuth()
  const { busy, error, submit } = useAuthForm((fields, options) => loginUser({ email: fields.get('email'), password: fields.get('password') }, options))

  if (session) return <Navigate to="/" replace />
  return (
    <AuthLayout title="Iniciar sesión" eyebrow="QUÉ BUENO VERTE DE NUEVO" description="Ingresá tus datos para continuar.">
      <form onSubmit={submit} aria-busy={busy} className="flex flex-col gap-5">
        <FormField label="Correo electrónico" type="email" name="email" autoComplete="email" placeholder="nombre@ejemplo.com" required disabled={busy} />
        <FormField label="Contraseña" type="password" name="password" autoComplete="current-password" placeholder="Ingresá tu contraseña" required disabled={busy} />
        <ActionButton type="submit" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</ActionButton>
        <p role="alert" className="min-h-5 text-center text-sm text-red-700 dark:text-red-300">{error}</p>
      </form>
      <p className="mt-6 text-center text-sm">¿Todavía no tenés cuenta? <Link to="/register" className="font-bold text-[#0065cc] underline underline-offset-4 dark:text-[#75b8ff]">Crear una cuenta</Link></p>
    </AuthLayout>
  )
}
