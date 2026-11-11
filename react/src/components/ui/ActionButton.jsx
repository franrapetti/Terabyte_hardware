export default function ActionButton({ variant = 'primary', size = 'default', className = '', ...props }) {
  return <button type="button" {...props} className={`cursor-pointer rounded-lg border font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff] ${size === 'small' ? 'px-3 py-1' : 'px-4 py-3'} ${variant === 'primary' ? 'border-action bg-action text-white enabled:hover:bg-action-hover' : 'border-[#879299] bg-transparent text-inherit enabled:hover:bg-[#879299]/20'} ${className}`} />
}
