// Funciones compartidas por todas las páginas que usan el carrito.
// Se carga con <script> antes de cart.js, products.js y services.js.

const CLAVE_CARRITO = "terrabyte-cart";

function obtenerCarrito() {
  const carritoGuardado = localStorage.getItem(CLAVE_CARRITO);

  if (!carritoGuardado) {
    return [];
  }

  try {
    const carrito = JSON.parse(carritoGuardado);
    return Array.isArray(carrito) ? carrito : [];
  } catch (error) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function agregarAlCarrito(item) {
  const carrito = obtenerCarrito();

  item.id = Date.now().toString() + "-" + Math.random().toString(16).slice(2);
  item.cantidad = 1;
  carrito.push(item);

  guardarCarrito(carrito);
}

function extraerPrecio(precio) {
  if (!precio || precio === "Gratis") {
    return 0;
  }

  return Number(String(precio).replace(/[^\d]/g, "")) || 0;
}

function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-AR");
}
