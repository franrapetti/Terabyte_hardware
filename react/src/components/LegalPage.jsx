import { usePageTitle } from '../hooks/usePageTitle.js'

// Marco común de las páginas legales: tarjeta centrada con título, fecha y contenido.
// Lo que se escribe entre <LegalPage> y </LegalPage> llega como "children".
export default function LegalPage({ title, updated, children }) {
  usePageTitle(title)

  return (
    <main className="flex w-full flex-1 justify-center px-4 py-[clamp(1.5rem,4vw,3rem)] text-left text-[#273137] dark:text-[#d9d9d9]">
      <article className="h-fit w-full max-w-[48rem] rounded-2xl border border-[#dde2e5] bg-white p-[clamp(1.5rem,4vw,2.75rem)] shadow-[0_6px_16px_rgba(24,32,36,0.12)] dark:border-[#2c2c2c] dark:bg-black/45 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <h1 className="mb-1 text-[clamp(1.75rem,4vw,2.25rem)] font-extrabold text-[#273137] dark:text-white">{title}</h1>
        {updated && (
          <p className="mb-7 border-b border-[#dde2e5] pb-5 text-[0.85rem] text-[#6b767c] dark:border-[#2c2c2c] dark:text-[#8f989d]">
            Última actualización: {updated}
          </p>
        )}
        {/* Los selectores [&_p], [&_li] y [&_a] estilan los <p>, <li> y <a> de adentro, para no repetir clases en cada página. */}
        <div className="[&_a]:text-[#007aff] [&_a]:hover:underline dark:[&_a]:text-[#4da3ff] [&_li]:leading-[1.7] [&_p]:leading-[1.7]">
          {children}
        </div>
      </article>
    </main>
  )
}
