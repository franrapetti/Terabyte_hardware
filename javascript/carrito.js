// Funciones compartidas por todas las páginas que usan el carrito.
// Se carga con <script> antes de cart.js, products.js y services.js.

const CLAVE_CARRITO = "terrabyte-cart";

// Recupera el carrito guardado; devuelve una lista vacia si no existe o no es valido.
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

// Serializa y guarda la lista del carrito en localStorage.
function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// Dos items son "el mismo producto" si coinciden tipo, nombre, precio y componentes.
// Compara los datos que identifican un item del carrito.
function esMismoItem(a, b) {
  return (
    a.tipo === b.tipo &&
    a.nombre === b.nombre &&
    a.precio === b.precio &&
    JSON.stringify(a.componentes || []) === JSON.stringify(b.componentes || [])
  );
}

// Agrega un item nuevo o incrementa la cantidad si ya estaba en el carrito.
function agregarAlCarrito(item) {
  const carrito = obtenerCarrito();
  const existente = carrito.find(
    // Busca si ya existe un item equivalente.
    function (enCarrito) {
      return esMismoItem(enCarrito, item);
    },
  );

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
// Actualiza la cantidad de un item identificado por su id.
function cambiarCantidad(id, cambio) {
  const carrito = obtenerCarrito();
  const item = carrito.find(
    // Encuentra el item cuya cantidad se debe modificar.
    function (enCarrito) {
      return enCarrito.id === id;
    },
  );

  if (!item) {
    return;
  }

  item.cantidad = (item.cantidad || 1) + cambio;

  guardarCarrito(
    carrito.filter(
      // Conserva solo los items que todavia tienen unidades.
      function (enCarrito) {
        return enCarrito.cantidad > 0;
      },
    ),
  );
}

// Convierte un precio mostrado en texto a un numero entero.
function extraerPrecio(precio) {
  if (!precio || precio === "Gratis") {
    return 0;
  }

  if (typeof precio === "number") {
    return precio;
  }

  // Extrae el valor numérico después del signo $ (evita sumar números del nombre como '32 GB', '500W' o '2 bahías')
  const coincidencia = String(precio).match(/\$([0-9.]+)/);
  if (coincidencia) {
    return Number(coincidencia[1].replaceAll(".", "")) || 0;
  }

  return Number(String(precio).replace(/[^\d]/g, "")) || 0;
}

// Formatea un numero como precio con separadores regionales argentinos.
function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-AR");
}
