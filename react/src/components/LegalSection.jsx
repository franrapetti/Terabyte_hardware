// Un bloque de una página legal: un subtítulo (h2) y su contenido.
export default function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="mt-7 mb-2 text-[1.1rem] font-bold text-[#273137] dark:text-white">{title}</h2>
      {children}
    </section>
  )
}
