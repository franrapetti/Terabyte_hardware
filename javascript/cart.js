document.addEventListener("DOMContentLoaded", function () {
  const contenedorItems = document.getElementById("cart-items");
  const totalElemento = document.getElementById("cart-total");
  const botonVaciar = document.getElementById("clear-cart");

  if (!contenedorItems || !totalElemento || !botonVaciar) {
    return;
  }

  function renderizarCarrito() {
    const carrito = obtenerCarrito();
    contenedorItems.textContent = "";
    totalElemento.textContent = formatearPrecio(calcularTotal(carrito));
    botonVaciar.disabled = carrito.length === 0;

    if (carrito.length === 0) {
      contenedorItems.appendChild(crearMensajeCarritoVacio());
      return;
    }

    carrito.forEach(function (item) {
      contenedorItems.appendChild(crearItemCarrito(item));
    });
  }

  function crearItemCarrito(item) {
    const articulo = document.createElement("article");
    articulo.className = "cart-item";

    if (item.imagen) {
      const imagen = document.createElement("img");
      imagen.className = "cart-item-image";
      imagen.src = item.imagen;
      imagen.alt = item.alt || item.nombre;
      articulo.appendChild(imagen);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "cart-item-placeholder";
      placeholder.textContent = "NAS";
      articulo.appendChild(placeholder);
    }

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const tipo = document.createElement("p");
    tipo.className = "cart-item-type";
    tipo.textContent = item.tipo || "Producto";

    const nombre = document.createElement("h2");
    nombre.className = "cart-item-title";
    nombre.textContent = item.nombre;

    const precio = document.createElement("p");
    precio.className = "cart-item-price";
    precio.textContent = item.precio;

    info.append(tipo, nombre, precio);

    if (Array.isArray(item.componentes) && item.componentes.length > 0) {
      const lista = document.createElement("ul");
      lista.className = "cart-components";

      item.componentes.forEach(function (componente) {
        const li = document.createElement("li");
        li.textContent = componente;
        lista.appendChild(li);
      });

      info.appendChild(lista);
    }

    const botonQuitar = document.createElement("button");
    botonQuitar.className = "cart-remove";
    botonQuitar.type = "button";
    botonQuitar.textContent = "Quitar";
    botonQuitar.addEventListener("click", function () {
      quitarDelCarrito(item.id);
      renderizarCarrito();
    });

    articulo.append(info, botonQuitar);
    return articulo;
  }

  function crearMensajeCarritoVacio() {
    const contenedor = document.createElement("div");
    contenedor.className = "cart-empty";

    const texto = document.createElement("p");
    texto.textContent = "Todavía no agregaste productos al carrito.";

    const link = document.createElement("a");
    link.href = "./products.html";
    link.textContent = "Ver productos";

    contenedor.append(texto, link);
    return contenedor;
  }

  botonVaciar.addEventListener("click", function () {
    if (obtenerCarrito().length === 0) {
      return;
    }

    abrirModalConfirmacion(function () {
      localStorage.removeItem("terrabyte-cart");
      renderizarCarrito();
    });
  });

  renderizarCarrito();
});

function abrirModalConfirmacion(alConfirmar) {
  const modalAnterior = document.querySelector(".cart-modal-overlay");

  if (modalAnterior) {
    modalAnterior.remove();
  }

  const modal = document.createElement("div");
  modal.className = "cart-modal-overlay";

  const contenido = document.createElement("div");
  contenido.className = "cart-modal";

  const cerrar = document.createElement("button");
  cerrar.className = "cart-modal-close";
  cerrar.type = "button";
  cerrar.setAttribute("aria-label", "Cerrar");
  cerrar.textContent = "x";

  const estado = document.createElement("p");
  estado.className = "cart-modal-status";
  estado.textContent = "Carrito";

  const titulo = document.createElement("h2");
  titulo.textContent = "¿Vaciar carrito?";

  const mensaje = document.createElement("p");
  mensaje.textContent =
    "Se eliminarán todos los productos y configuraciones guardadas.";

  const acciones = document.createElement("div");
  acciones.className = "cart-modal-actions";

  const cancelar = document.createElement("button");
  cancelar.className = "cart-modal-action cart-modal-secondary";
  cancelar.type = "button";
  cancelar.textContent = "Cancelar";

  const confirmar = document.createElement("button");
  confirmar.className = "cart-modal-action cart-modal-primary";
  confirmar.type = "button";
  confirmar.textContent = "Vaciar carrito";

  acciones.append(cancelar, confirmar);
  contenido.append(cerrar, estado, titulo, mensaje, acciones);
  modal.appendChild(contenido);
  document.body.appendChild(modal);

  function cerrarModal() {
    modal.remove();
  }

  cancelar.addEventListener("click", cerrarModal);
  cerrar.addEventListener("click", cerrarModal);

  confirmar.addEventListener("click", function () {
    alConfirmar();
    cerrarModal();
  });

  modal.addEventListener("click", function (event) {
    if (event.target.classList.contains("cart-modal-overlay")) {
      cerrarModal();
    }
  });
}

function obtenerCarrito() {
  const carritoGuardado = localStorage.getItem("terrabyte-cart");

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

function quitarDelCarrito(id) {
  const carritoActualizado = obtenerCarrito().filter(function (item) {
    return item.id !== id;
  });

  localStorage.setItem("terrabyte-cart", JSON.stringify(carritoActualizado));
}

function calcularTotal(carrito) {
  return carrito.reduce(function (total, item) {
    return total + extraerPrecio(item.precio);
  }, 0);
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
