export default function ShopPage({ title, subtitle, children, narrow = false }) {
  return (
    <main className={`mx-auto w-full flex-1 px-[clamp(1rem,4vw,3rem)] pt-8 pb-12 text-left text-[#273137] dark:text-[#d9d9d9] ${narrow ? 'max-w-[72rem]' : 'max-w-[90rem]'}`}>
      <title>{`${title} | TerraByte`}</title>
      <h1 className="mt-0 mb-3 text-center text-[clamp(1.8rem,4vw,2.5rem)] leading-tight font-bold tracking-normal text-[#273137] dark:text-white">{title}</h1>
      {subtitle && <p className="mb-8 text-center">{subtitle}</p>}
      {children}
    </main>
  )
}
