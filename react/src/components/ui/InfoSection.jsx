import { useId } from 'react'

export default function InfoSection({ title, headingLevel = 2, children }) {
  const titleId = useId()
  const Heading = headingLevel === 1 ? 'h1' : 'h2'

  return (
    <section aria-labelledby={titleId} className="rounded-2xl bg-white p-[clamp(1.25rem,3vw,2.5rem)] shadow-[0_6px_16px_rgba(24,32,36,0.12)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] motion-reduce:transform-none motion-reduce:transition-none dark:bg-[#435058] dark:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
      <Heading id={titleId} className="mt-0 mb-4 text-center text-[clamp(1.4rem,3vw,1.8rem)] leading-tight font-semibold tracking-normal">{title}</Heading>
      {children}
    </section>
  )
}
