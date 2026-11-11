export function extraerPrecio(precio) {
  if (typeof precio === 'number') return Number.isFinite(precio) ? Math.max(0, precio) : 0
  if (!precio || String(precio).toLowerCase().includes('gratis')) return 0
  const matches = String(precio).match(/\$\s*[\d.,]+/g)
  const value = (matches?.at(-1) || String(precio)).replace(/[^\d.,]/g, '').replaceAll('.', '').replace(',', '.')
  return Math.max(0, Number(value) || 0)
}

export function formatearPrecio(valor) {
  return `$${valor.toLocaleString('es-AR')}`
}

export function normalizarCarrito(items) {
  if (!Array.isArray(items)) return []
  const ids = new Set()
  return items.filter((item) => item && typeof item.nombre === 'string' && item.nombre.trim() && (typeof item.precio === 'string' || (typeof item.precio === 'number' && Number.isFinite(item.precio))) && (item.cantidad == null || (Number.isSafeInteger(item.cantidad) && item.cantidad > 0)))
    .map((item, index) => ({
      id: String(item.id || `legacy-${index}`),
      nombre: item.nombre.trim(),
      precio: item.precio,
      tipo: item.tipo === 'Servicio' ? 'Servicio' : 'Producto',
      imagen: typeof item.imagen === 'string' ? item.imagen : undefined,
      alt: typeof item.alt === 'string' ? item.alt : undefined,
      cantidad: item.cantidad ?? 1,
      componentes: Array.isArray(item.componentes) ? item.componentes.filter((entry) => typeof entry === 'string') : [],
    }))
    .map((item, index) => {
      // Una clave repetida no debe hacer que Quitar elimine dos filas a la vez.
      while (ids.has(item.id)) item.id = `${item.id}-${index}`
      ids.add(item.id)
      return item
    })
}

export function leerCarrito() {
  try {
    return normalizarCarrito(JSON.parse(localStorage.getItem('terrabyte-cart') || '[]'))
  } catch {
    return []
  }
}

// Funciones puras: devuelven una lista nueva sin modificar el estado anterior.
export function agregarItem(carrito, item) {
  const [nuevo] = normalizarCarrito([item])
  if (!nuevo) throw new TypeError('El producto no es válido.')
  const existente = carrito.find((entry) => entry.tipo === nuevo.tipo
    && entry.nombre === nuevo.nombre
    && extraerPrecio(entry.precio) === extraerPrecio(nuevo.precio)
    && JSON.stringify([...entry.componentes].sort()) === JSON.stringify([...nuevo.componentes].sort()))
  if (!existente) return [...carrito, { ...nuevo, cantidad: 1 }]
  return carrito.map((entry) => entry.id === existente.id && Number.isSafeInteger(entry.cantidad + 1)
    ? { ...entry, cantidad: entry.cantidad + 1 } : entry)
}

export function actualizarCantidad(carrito, id, cambio) {
  if (!Number.isSafeInteger(cambio)) return carrito
  return carrito.map((item) => item.id === id && Number.isSafeInteger(item.cantidad + cambio)
    ? { ...item, cantidad: item.cantidad + cambio } : item)
    .filter((item) => item.cantidad > 0)
}

export function calcularTotal(carrito) {
  return carrito.reduce((total, item) => total + extraerPrecio(item.precio) * item.cantidad, 0)
}
