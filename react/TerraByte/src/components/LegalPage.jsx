/** Marco compartido por las páginas informativas y legales. */
export default function LegalPage({ title, updated, children }) {
  return (
    <main className="flex w-full flex-1 justify-center px-4 py-[clamp(1.5rem,4vw,3rem)] text-left">
      <title>{`${title} | TerraByte`}</title>
      <article className="w-full max-w-[48rem] self-start rounded-2xl border border-[#dde2e5] bg-white p-[clamp(1.5rem,4vw,2.75rem)] text-[#273137] shadow-[0_6px_16px_rgba(24,32,36,0.12)] dark:border-[#2c2c2c] dark:bg-black/45 dark:text-[#d9d9d9] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] [&_h2]:mt-7 [&_h2]:mb-2 [&_h2]:text-[1.1rem] [&_h2]:font-bold [&_h2]:tracking-normal [&_h2]:text-[#273137] dark:[&_h2]:text-white [&_p]:leading-[1.7] [&_li]:leading-[1.7] [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-action [&_a]:no-underline hover:[&_a]:underline focus-visible:[&_a]:outline-2 focus-visible:[&_a]:outline-offset-2 focus-visible:[&_a]:outline-[#007aff] dark:[&_a]:text-[#4da3ff]">
        <h1 className="mt-0 mb-[0.35rem] text-[clamp(1.75rem,4vw,2.25rem)] leading-tight font-extrabold tracking-normal text-[#273137] dark:text-white">{title}</h1>
        {updated && <p className="mb-7 border-b border-[#dde2e5] pb-5 text-[0.85rem] text-[#6b767c] dark:border-[#2c2c2c] dark:text-[#8f989d]">Última actualización: {updated}</p>}
        {children}
      </article>
    </main>
  )
}
