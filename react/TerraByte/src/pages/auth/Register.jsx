import { Link, Navigate } from 'react-router-dom'
import { registerUser, useAuth } from '../../functions/Auth.jsx'
import ActionButton from '../../components/ui/ActionButton.jsx'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import FormField from '../../components/ui/FormField.jsx'
import { useAuthForm } from '../../functions/useAuthForm.js'

export default function Register() {
  const session = useAuth()
  const { busy, error, submit } = useAuthForm((fields, options) => registerUser({ firstName: fields.get('first-name'), lastName: fields.get('last-name'), email: fields.get('email'), password: fields.get('password'), confirmation: fields.get('confirm-password'), terms: fields.has('terms') }, options))

  if (session) return <Navigate to="/" replace />
  return (
    <AuthLayout title="Crear cuenta" eyebrow="BIENVENIDO A TERRABYTE" description="Completá tus datos para empezar." wide>
      <form onSubmit={submit} aria-busy={busy} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4 max-[480px]:grid-cols-1">
          <FormField label="Nombre" name="first-name" autoComplete="given-name" placeholder="Lucía" required disabled={busy} />
          <FormField label="Apellido" name="last-name" autoComplete="family-name" placeholder="Gómez" required disabled={busy} />
        </div>
        <FormField label="Correo electrónico" type="email" name="email" autoComplete="email" placeholder="nombre@ejemplo.com" required disabled={busy} />
        <div className="grid grid-cols-2 gap-4 max-[480px]:grid-cols-1">
          <FormField label="Contraseña" type="password" name="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" minLength={8} required disabled={busy} />
          <FormField label="Repetir contraseña" type="password" name="confirm-password" autoComplete="new-password" placeholder="Volvé a escribirla" minLength={8} required disabled={busy} />
        </div>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="terms" required disabled={busy} className="mt-1 size-4 shrink-0 accent-[#007aff]" /><span>Acepto los <Link to="/terms" className="font-bold text-[#0065cc] underline underline-offset-4 dark:text-[#75b8ff]">términos y condiciones</Link></span></label>
        <ActionButton type="submit" disabled={busy}>{busy ? 'Creando cuenta…' : 'Crear mi cuenta'}</ActionButton>
        <p role="alert" className="min-h-5 text-center text-sm text-red-700 dark:text-red-300">{error}</p>
      </form>
      <p className="mt-6 text-center text-sm">¿Ya tenés cuenta? <Link to="/login" className="font-bold text-[#0065cc] underline underline-offset-4 dark:text-[#75b8ff]">Iniciá sesión</Link></p>
    </AuthLayout>
  )
}
