import { usePageTitle } from '../../hooks/usePageTitle.js'

// "aviso" es un mensaje opcional que se muestra arriba del formulario (por ejemplo, por qué se pidió iniciar sesión).
export default function AuthLayout({ title, eyebrow, description, aviso, wide = false, children }) {
  usePageTitle(title)

  return (
    <main className="flex w-full flex-1 items-center justify-center px-4 pt-8 pb-12 text-left text-[#273137] dark:text-[#d9d9d9]">
      <section aria-labelledby="auth-title" className={`w-full rounded-2xl border border-[#dde2e5] bg-white px-[clamp(1.5rem,5vw,3rem)] py-10 shadow-lg dark:border-[#435058] dark:bg-[#364147] ${wide ? 'max-w-[45rem]' : 'max-w-[32rem]'}`}>
        <div className="mb-8 text-center">
          <span className="text-xs font-bold text-[#59656b] dark:text-[#b7bdc0]">{eyebrow}</span>
          <h1 id="auth-title" className="my-2 text-3xl leading-tight font-bold tracking-normal text-[#273137] dark:text-white">{title}</h1>
          <p>{description}</p>
        </div>
        {aviso && <p role="status" className="mb-6 rounded-lg border border-action/30 bg-[#e8f1fb] p-3 text-center text-sm font-semibold text-[#0b4f99] dark:border-[#38bdf8]/30 dark:bg-[#1c3550] dark:text-[#cfe4ff]">{aviso}</p>}
        {children}
      </section>
    </main>
  )
}
