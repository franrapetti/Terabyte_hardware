// Campo de formulario: etiqueta + input. El "id" es obligatorio y une la etiqueta con el input.
// El resto de las props (name, value, onChange, type...) pasan directo al input.
export default function FormField({ label, id, ...props }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-[#273137] dark:text-white">{label}</label>
      <input id={id} {...props} className="min-h-11 w-full min-w-0 rounded-lg border border-[#bdc5c9] bg-[#f4f6f7] px-3 py-2 text-base text-[#273137] outline-none placeholder:text-[#687177] focus:border-action focus:ring-2 focus:ring-[#007aff]/30 disabled:opacity-60 dark:border-[#77838a] dark:bg-[#20292e] dark:text-white dark:placeholder:text-[#9aa4a9]" />
    </div>
  )
}
