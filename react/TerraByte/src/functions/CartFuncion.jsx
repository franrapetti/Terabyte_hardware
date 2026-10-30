import { useMemo, useSyncExternalStore } from 'react'

export const CLAVE_CARRITO = 'terrabyte-cart'
const changeEvent = 'terrabyte-cart-change'

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

function readSnapshot() {
  try {
    return localStorage.getItem(CLAVE_CARRITO)
  } catch {
    return null
  }
}

function normalizeCart(items) {
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

function parseCart(raw) {
  try {
    return normalizeCart(JSON.parse(raw || '[]'))
  } catch {
    return []
  }
}

export function obtenerCarrito() {
  return parseCart(readSnapshot())
}

export function guardarCarrito(carrito) {
  if (!Array.isArray(carrito)) throw new TypeError('El carrito debe ser una lista.')
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(normalizeCart(carrito)))
  } catch {
    throw new Error('No se pudo guardar el carrito. Revisá el almacenamiento del navegador e intentá nuevamente.')
  }
  window.dispatchEvent(new Event(changeEvent))
}

export function agregarAlCarrito(item) {
  if (!item || typeof item.nombre !== 'string' || !item.nombre.trim() || !['string', 'number'].includes(typeof item.precio) || (typeof item.precio === 'number' && !Number.isFinite(item.precio))) throw new TypeError('El producto no es válido.')
  const carrito = obtenerCarrito()
  const tipo = item.tipo === 'Servicio' ? 'Servicio' : 'Producto'
  const componentes = Array.isArray(item.componentes) ? item.componentes.filter((entry) => typeof entry === 'string') : []
  const existing = carrito.find((entry) => entry.tipo === tipo && entry.nombre === item.nombre.trim() && extraerPrecio(entry.precio) === extraerPrecio(item.precio) && JSON.stringify([...entry.componentes].sort()) === JSON.stringify([...componentes].sort()))
  if (existing) {
    if (!Number.isSafeInteger(existing.cantidad + 1)) throw new Error('La cantidad supera el límite permitido.')
    existing.cantidad += 1
  } else carrito.push({ ...item, tipo, componentes: [...componentes], id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`, cantidad: 1 })
  guardarCarrito(carrito)
}

export function cambiarCantidad(id, cambio) {
  if (!Number.isSafeInteger(cambio)) return
  const carrito = obtenerCarrito()
  const item = carrito.find((entry) => entry.id === id)
  if (!item || cambio === 0) return
  if (!Number.isSafeInteger(item.cantidad + cambio)) throw new Error('La cantidad supera el límite permitido.')
  guardarCarrito(carrito.map((entry) => entry.id === id ? { ...entry, cantidad: entry.cantidad + cambio } : entry).filter((entry) => entry.cantidad > 0))
}

export function quitarDelCarrito(id) {
  guardarCarrito(obtenerCarrito().filter((item) => item.id !== id))
}

export function vaciarCarrito() {
  guardarCarrito([])
}

export function calcularTotal(carrito) {
  return carrito.reduce((total, item) => total + extraerPrecio(item.precio) * (item.cantidad || 1), 0)
}

function subscribe(listener) {
  const onStorage = (event) => {
    if (event.key === CLAVE_CARRITO || event.key === null) listener()
  }
  window.addEventListener(changeEvent, listener)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(changeEvent, listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Actualiza consumidores en esta pestaña y al cambiar localStorage en otra. */
export function useCarrito() {
  const raw = useSyncExternalStore(subscribe, readSnapshot, () => null)
  const carrito = useMemo(() => parseCart(raw), [raw])
  return { carrito, total: calcularTotal(carrito), cantidad: carrito.reduce((sum, item) => sum + item.cantidad, 0) }
}
