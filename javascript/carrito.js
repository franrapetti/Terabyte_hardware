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

// Dos items son "el mismo producto" si coinciden tipo, nombre, precio y componentes.
function esMismoItem(a, b) {
  return (
    a.tipo === b.tipo &&
    a.nombre === b.nombre &&
    a.precio === b.precio &&
    JSON.stringify(a.componentes || []) === JSON.stringify(b.componentes || [])
  );
}

function agregarAlCarrito(item) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(function (enCarrito) {
    return esMismoItem(enCarrito, item);
  });

  if (existente) {
    existente.cantidad = (existente.cantidad || 1) + 1;
  } else {
    item.id = Date.now().toString() + "-" + Math.random().toString(16).slice(2);
    item.cantidad = 1;
    carrito.push(item);
  }

  guardarCarrito(carrito);
}

// Suma o resta unidades. Si la cantidad llega a 0, el item se quita del carrito.
function cambiarCantidad(id, cambio) {
  const carrito = obtenerCarrito();
  const item = carrito.find(function (enCarrito) {
    return enCarrito.id === id;
  });

  if (!item) {
    return;
  }

  item.cantidad = (item.cantidad || 1) + cambio;

  guardarCarrito(
    carrito.filter(function (enCarrito) {
      return enCarrito.cantidad > 0;
    }),
  );
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
