export default function AuthLayout({ title, eyebrow, description, wide = false, children }) {
  return (
    <main className="flex w-full flex-1 items-center justify-center px-4 pt-8 pb-12 text-left text-[#273137] dark:text-[#d9d9d9]">
      <title>{`${title} | TerraByte`}</title>
      <section aria-labelledby="auth-title" className={`w-full rounded-2xl border border-[#dde2e5] bg-white px-[clamp(1.5rem,5vw,3rem)] py-10 shadow-lg dark:border-[#435058] dark:bg-[#364147] ${wide ? 'max-w-[45rem]' : 'max-w-[32rem]'}`}>
        <div className="mb-8 text-center">
          <span className="text-xs font-bold text-[#59656b] dark:text-[#b7bdc0]">{eyebrow}</span>
          <h1 id="auth-title" className="my-2 text-3xl leading-tight font-bold tracking-normal text-[#273137] dark:text-white">{title}</h1>
          <p>{description}</p>
        </div>
        {children}
      </section>
    </main>
  )
}
