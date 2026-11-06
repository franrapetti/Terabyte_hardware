// Inicializa la vista y los controles del carrito cuando el HTML esta listo.
document.addEventListener("DOMContentLoaded", function () {
  const contenedorItems = document.getElementById("cart-items");
  const totalElemento = document.getElementById("cart-total");
  const botonVaciar = document.getElementById("clear-cart");
  const botonFinalizar = document.getElementById("checkout");

  if (!contenedorItems || !totalElemento || !botonVaciar || !botonFinalizar) {
    return;
  }

  // Lee los datos guardados y actualiza items, total y botones de la pagina.
  function renderizarCarrito() {
    const carrito = obtenerCarrito();
    contenedorItems.textContent = "";
    totalElemento.textContent = formatearPrecio(calcularTotal(carrito));
    botonVaciar.disabled = carrito.length === 0;
    botonFinalizar.disabled = carrito.length === 0;

    if (carrito.length === 0) {
      contenedorItems.appendChild(crearMensajeCarritoVacio());
      return;
    }

    carrito.forEach(
      // Convierte cada registro del carrito en un elemento visible.
      function (item) {
        contenedorItems.appendChild(crearItemCarrito(item));
      },
    );
  }

  // Construye el bloque visual y las acciones para un producto o servicio.
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

      item.componentes.forEach(
        // Agrega a la lista cada componente de una configuracion NAS.
        function (componente) {
          const li = document.createElement("li");
          li.textContent = componente;
          lista.appendChild(li);
        },
      );

      info.appendChild(lista);
    }

    const acciones = document.createElement("div");
    acciones.className = "cart-item-actions";

    const cantidad = document.createElement("div");
    cantidad.className = "cart-quantity";

    const botonMenos = crearBotonCantidad("−", "Restar una unidad", item.id, -1);
    const valorCantidad = document.createElement("span");
    valorCantidad.className = "cart-quantity-value";
    valorCantidad.textContent = item.cantidad || 1;
    const botonMas = crearBotonCantidad("+", "Sumar una unidad", item.id, 1);

    cantidad.append(botonMenos, valorCantidad, botonMas);

    const botonQuitar = document.createElement("button");
    botonQuitar.className = "cart-remove";
    botonQuitar.type = "button";
    botonQuitar.textContent = "Quitar";
    // Quita este item y vuelve a dibujar el carrito.
    botonQuitar.addEventListener("click", function () {
      quitarDelCarrito(item.id);
      renderizarCarrito();
    });

    acciones.append(cantidad, botonQuitar);
    articulo.append(info, acciones);
    return articulo;
  }

  // Crea un boton accesible para cambiar la cantidad de un item.
  function crearBotonCantidad(texto, etiqueta, id, cambio) {
    const boton = document.createElement("button");
    boton.className = "cart-quantity-button";
    boton.type = "button";
    boton.textContent = texto;
    boton.setAttribute("aria-label", etiqueta);
    // Aplica el cambio de cantidad y refresca la vista.
    boton.addEventListener("click", function () {
      cambiarCantidad(id, cambio);
      renderizarCarrito();
    });
    return boton;
  }

  // Construye el mensaje y el enlace que se muestran con el carrito vacio.
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

  // Pide confirmacion antes de borrar todos los items.
  botonVaciar.addEventListener("click", function () {
    if (obtenerCarrito().length === 0) {
      return;
    }

    abrirModalConfirmacion({
      titulo: "¿Vaciar carrito?",
      mensaje: "Se eliminarán todos los productos y configuraciones guardadas.",
      textoConfirmar: "Vaciar carrito",
      textoCancelar: "Cancelar",
      // Vacía los datos guardados y actualiza la pagina tras confirmar.
      alConfirmar: function () {
        guardarCarrito([]);
        renderizarCarrito();
      },
    });
  });

  // Muestra el total y solicita confirmacion para simular la compra.
  botonFinalizar.addEventListener("click", function () {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
      return;
    }

    abrirModalConfirmacion({
      titulo: "¿Finalizar compra?",
      mensaje: "El total de tu compra es " + formatearPrecio(calcularTotal(carrito)) + ".",
      textoConfirmar: "Confirmar compra",
      textoCancelar: "Volver",
      // Limpia el carrito y muestra el mensaje final de compra.
      alConfirmar: function () {
        guardarCarrito([]);
        renderizarCarrito();
        // Abrir otro modal borra el anterior, así que no hace falta cerrarlo antes.
        abrirModalConfirmacion({
          titulo: "¡Gracias por tu compra!",
          mensaje: "Recibimos tu pedido y el carrito quedó vacío.",
          textoConfirmar: "Entendido",
          // No requiere una accion adicional al cerrar el mensaje final.
          alConfirmar: function () {},
        });
      },
    });
  });

  renderizarCarrito();
});

// opciones: titulo, mensaje, textoConfirmar, alConfirmar y (opcional) textoCancelar.
// Si no hay textoCancelar, el modal muestra un solo botón.
// Crea un modal de confirmacion con las acciones indicadas en opciones.
function abrirModalConfirmacion(opciones) {
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
  titulo.textContent = opciones.titulo;

  const mensaje = document.createElement("p");
  mensaje.textContent = opciones.mensaje;

  const acciones = document.createElement("div");
  acciones.className = "cart-modal-actions";

  const confirmar = document.createElement("button");
  confirmar.className = "cart-modal-action cart-modal-primary";
  confirmar.type = "button";
  confirmar.textContent = opciones.textoConfirmar;

  if (opciones.textoCancelar) {
    const cancelar = document.createElement("button");
    cancelar.className = "cart-modal-action cart-modal-secondary";
    cancelar.type = "button";
    cancelar.textContent = opciones.textoCancelar;
    // Cierra el modal sin ejecutar la accion de confirmacion.
    cancelar.addEventListener("click", cerrarModal);
    acciones.appendChild(cancelar);
  }

  acciones.appendChild(confirmar);
  contenido.append(cerrar, estado, titulo, mensaje, acciones);
  modal.appendChild(contenido);
  document.body.appendChild(modal);

  // Quita el modal actual del documento.
  function cerrarModal() {
    modal.remove();
  }

  cerrar.addEventListener("click", cerrarModal);

  // Ejecuta la accion elegida y despues cierra el modal.
  confirmar.addEventListener("click", function () {
    opciones.alConfirmar();
    cerrarModal();
  });

  // Cierra el modal si se hace clic sobre el fondo exterior.
  modal.addEventListener("click", function (event) {
    if (event.target.classList.contains("cart-modal-overlay")) {
      cerrarModal();
    }
  });
}

// Elimina del almacenamiento el item que coincida con el id indicado.
function quitarDelCarrito(id) {
  const carritoActualizado = obtenerCarrito().filter(
    // Mantiene los items distintos al que se desea quitar.
    function (item) {
      return item.id !== id;
    },
  );

  guardarCarrito(carritoActualizado);
}

// Suma precio por cantidad para obtener el total del carrito.
function calcularTotal(carrito) {
  return carrito.reduce(
    // Acumula el subtotal de cada item.
    function (total, item) {
      return total + extraerPrecio(item.precio) * (item.cantidad || 1);
    },
    0,
  );
}
