import { Link, Navigate, useLocation } from 'react-router-dom'
import ActionButton from '../../components/ui/ActionButton.jsx'
import AuthLayout from '../../components/layout/AuthLayout.jsx'
import FormField from '../../components/ui/FormField.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useAuthForm } from '../../hooks/useAuthForm.js'

const valoresIniciales = { firstName: '', lastName: '', email: '', password: '', confirmation: '', terms: false }

export default function Register() {
  const { user, register } = useAuth()
  const location = useLocation()
  const { valores, cambiar, enviar, cargando, error } = useAuthForm(valoresIniciales, register)

  // Al crear la cuenta se inicia sesión: vuelve a la página que se pidió antes (o al inicio).
  if (user) return <Navigate to={location.state?.from || '/'} replace />
  return (
    <AuthLayout title="Crear cuenta" eyebrow="BIENVENIDO A TERRABYTE" description="Completá tus datos para empezar." aviso={location.state?.mensaje} wide>
      <form onSubmit={enviar} aria-busy={cargando} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4 max-[480px]:grid-cols-1">
          <FormField id="register-first-name" label="Nombre" name="firstName" value={valores.firstName} onChange={cambiar} autoComplete="given-name" placeholder="Lucía" required disabled={cargando} />
          <FormField id="register-last-name" label="Apellido" name="lastName" value={valores.lastName} onChange={cambiar} autoComplete="family-name" placeholder="Gómez" required disabled={cargando} />
        </div>
        <FormField id="register-email" label="Correo electrónico" type="email" name="email" value={valores.email} onChange={cambiar} autoComplete="email" placeholder="nombre@ejemplo.com" required disabled={cargando} />
        <div className="grid grid-cols-2 gap-4 max-[480px]:grid-cols-1">
          <FormField id="register-password" label="Contraseña" type="password" name="password" value={valores.password} onChange={cambiar} autoComplete="new-password" placeholder="Mínimo 8 caracteres" minLength={8} required disabled={cargando} />
          <FormField id="register-confirmation" label="Repetir contraseña" type="password" name="confirmation" value={valores.confirmation} onChange={cambiar} autoComplete="new-password" placeholder="Volvé a escribirla" minLength={8} required disabled={cargando} />
        </div>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="terms" checked={valores.terms} onChange={cambiar} required disabled={cargando} className="mt-1 size-4 shrink-0 accent-[#007aff]" /><span>Acepto los <Link to="/terms" className="font-bold text-[#0065cc] underline underline-offset-4 dark:text-[#75b8ff]">términos y condiciones</Link></span></label>
        <ActionButton type="submit" disabled={cargando}>{cargando ? 'Creando cuenta…' : 'Crear mi cuenta'}</ActionButton>
        <p role="alert" className="min-h-5 text-center text-sm text-red-700 dark:text-red-300">{error}</p>
      </form>
      <p className="mt-6 text-center text-sm">¿Ya tenés cuenta? <Link to="/login" state={location.state} className="font-bold text-[#0065cc] underline underline-offset-4 dark:text-[#75b8ff]">Iniciá sesión</Link></p>
    </AuthLayout>
  )
}
