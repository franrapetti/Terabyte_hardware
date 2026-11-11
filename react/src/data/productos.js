// Datos del catálogo. Las imágenes están en public/products/ y se piden con una ruta fija
// (/products/...). Así la URL que se guarda en el carrito no cambia al volver a compilar.

export const productos = [
  { id: 'qnap-ts-264-1', nombre: 'NAS QNAP TS-264-8G-US', precio: 1669000, imagen: '/products/Producto 1.png', categoria: 'qnap' },
  { id: 'qnap-ts-264-2', nombre: 'NAS QNAP TS-264-8G-US', precio: 1734000, imagen: '/products/Producto 2.png', categoria: 'qnap' },
  { id: 'asustor-lockerstor', nombre: 'Servidor NAS Asustor Lockerstor', precio: 1800000, imagen: '/products/Producto 3.png', categoria: '' },
  { id: 'synology-ds225', nombre: 'Synology DS225+ Private Cloud Media Server', precio: 568269, imagen: '/products/Producto 4.png', categoria: 'synology' },
  { id: 'ugreen-dxp2800', nombre: 'UGREEN NAS DXP2800 2-Bay', precio: 594734, imagen: '/products/Producto 5.png', categoria: 'ugreen' },
  { id: 'ugreen-dxp4800', nombre: 'UGREEN NAS DXP4800 GT 4-Bay', precio: 853984, imagen: '/products/Producto 6.png', categoria: 'ugreen' },
]

// valor '' significa "sin filtro": muestra todos los productos.
export const categorias = [
  { valor: '', nombre: 'Todos' },
  { valor: 'qnap', nombre: 'QNAP' },
  { valor: 'synology', nombre: 'Synology' },
  { valor: 'ugreen', nombre: 'UGREEN' },
]

export const marcas = [
  { nombre: 'Fractal', imagen: '/products/fractal.svg' },
  { nombre: 'Jonsbo', imagen: '/products/jonsbo.png' },
  { nombre: 'Nvidia', imagen: '/products/Nvidia.png' },
  { nombre: 'Rosewill', imagen: '/products/Rosewill.png' },
  { nombre: 'Seagate', imagen: '/products/Seagate.png' },
  { nombre: 'Western Digital', imagen: '/products/Western_Digital.svg' },
]
