export default function NasStep({ step, selected, onChange, onClear, children }) {
  return (
    <fieldset className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-lg dark:bg-[#435058]">
      <legend className="rounded-xl bg-[#e2e6e8] px-3 py-1 text-lg font-bold dark:bg-[#364147] dark:text-white">{step.title}</legend>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))] gap-4">
        {step.options.map((option) => (
          <label key={option.value} className="flex cursor-pointer flex-col gap-3 rounded-xl border-2 border-[#c5cdd1] bg-[#f4f6f7] px-4 py-5 transition-colors hover:border-action has-checked:border-action has-checked:bg-[#eaf3fc] dark:border-[#435058] dark:bg-[#2b353b] dark:has-checked:bg-[#1a2a38]">
            <input type={step.multiple ? 'checkbox' : 'radio'} name={step.name} value={option.value} checked={selected.includes(option.value)} onChange={() => onChange(option.value)} className="size-[1.1rem] accent-[#007aff]" />
            <span className="font-semibold text-[#273137] dark:text-white">{option.title}</span>
            <span className="font-bold text-action dark:text-[#38bdf8]">{option.price}</span>
          </label>
        ))}
      </div>
      <div className="text-sm" aria-live="polite">
        Seleccionado: <span className="font-bold text-action dark:text-[#38bdf8]">{selected.join(', ') || 'Ninguno (opcional)'}</span>
        {selected.length > 0 && <button type="button" onClick={onClear} className="ml-3 cursor-pointer rounded border border-red-400 px-2 py-1 text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-950">Quitar selección</button>}
      </div>
      {children}
    </fieldset>
  )
}
