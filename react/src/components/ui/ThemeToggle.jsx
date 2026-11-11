export default function ThemeToggle({ theme, onToggle }) {
  const isLight = theme === 'light'
  const label = isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'

  return (
    <button type="button" onClick={onToggle} aria-label={label} title={label} aria-pressed={isLight} className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg border border-transparent bg-transparent transition-colors hover:bg-[#e2e6e8] dark:hover:bg-[#435058] max-[480px]:size-[2.35rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        {isLight ? <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>}
      </svg>
    </button>
  )
}
