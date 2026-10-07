// Inicia carrusel de marcas, filtros y modales cuando la pagina esta lista.
document.addEventListener("DOMContentLoaded", function () {
  iniciarCarruselMarcas();
  iniciarFiltrosCatalogo();
  iniciarModalesProductos();
});

// Anima las marcas en ciclo continuo y respeta la preferencia de movimiento reducido.
function iniciarCarruselMarcas() {
  const track = document.querySelector(".brands-track");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cantidadMarcas = track ? track.children.length : 0;
  let moviendo = false;

  if (!track || cantidadMarcas <= 1 || reduceMotion.matches) {
    return;
  }

  // Ajusta ancho y columnas para permitir el desplazamiento de una marca.
  function ajustarColumnas() {
    track.style.width = "calc(100% + (100% / " + cantidadMarcas + "))";
    track.style.gridTemplateColumns =
      "repeat(" + (cantidadMarcas + 1) + ", 1fr)";
  }

  // Duplica la primera marca y desplaza el carrusel una posicion.
  function moverPrimeraMarca() {
    if (moviendo) {
      return;
    }

    const primeraImagen = track.children[0];
    const distancia = track.parentElement.offsetWidth / cantidadMarcas;

    if (distancia === 0 || !primeraImagen) {
      return;
    }

    const copia = primeraImagen.cloneNode(true);
    copia.classList.add("brand-image-copy");
    copia.setAttribute("aria-hidden", "true");
    track.appendChild(copia);

    moviendo = true;
    track.style.transform = "translateX(-" + distancia + "px)";
  }

  // Al terminar la animacion, rota la primera marca al final sin salto visible.
  track.addEventListener("transitionend", function (event) {
    if (event.target !== track || event.propertyName !== "transform") {
      return;
    }

    const copia = track.querySelector(".brand-image-copy");

    if (copia) {
      copia.remove();
    }

    track.appendChild(track.children[0]);
    track.style.transition = "none";
    track.style.transform = "translateX(0)";

    void track.offsetHeight;
    track.style.transition = "";
    moviendo = false;
  });

  ajustarColumnas();
  window.addEventListener("resize", ajustarColumnas);
  setInterval(moverPrimeraMarca, 4200);
}

// Conecta el buscador y las categorias para filtrar los productos visibles.
function iniciarFiltrosCatalogo() {
  // El único buscador de la página es el del navbar (el campo con name="q").
  const buscador = document.querySelector('.nav-search input[name="q"]');
  const tags = document.querySelectorAll(".catalogo-tag input");
  const items = document.querySelectorAll(".catalogo-item");

  if (!buscador || items.length === 0) {
    return;
  }

  // Muestra solo los productos que coinciden con el texto y la categoria.
  function filtrarCatalogo() {
    const busqueda = buscador.value.trim().toLowerCase();
    const categoria = document.querySelector(".catalogo-tag input:checked").value;

    items.forEach(
      // Evalua un producto y lo oculta si no coincide con los filtros.
      function (item) {
        const nombre = item.querySelector("h5").textContent.toLowerCase();
        const itemTags = item.dataset.tags.split(" ");
        const coincideBusqueda = nombre.includes(busqueda);
        const coincideTags = categoria === "" || itemTags.includes(categoria);

        item.classList.toggle("is-hidden", !coincideBusqueda || !coincideTags);
      },
    );
  }

  buscador.addEventListener("input", filtrarCatalogo);

  tags.forEach(
    // Vuelve a filtrar al cambiar una categoria.
    function (tag) {
      tag.addEventListener("change", filtrarCatalogo);
    },
  );

  // Si venimos de otra página, la dirección es products.html?q=texto.
  // Leemos "q", lo escribimos en el buscador del navbar y filtramos.
  const parametros = new URLSearchParams(window.location.search);
  buscador.value = parametros.get("q") || "";
  filtrarCatalogo();
}

// Conecta los botones del catalogo con las acciones de detalle o compra.
function iniciarModalesProductos() {
  const botones = document.querySelectorAll(".catalogo-button");

  botones.forEach(
    // Asigna a cada boton el comportamiento que le corresponde.
    function (boton) {
      // Decide si agrega el producto o muestra su informacion.
      boton.addEventListener("click", function () {
        const producto = obtenerDatosProducto(boton);

        if (boton.textContent.trim() !== "Ver Más") {
          agregarAlCarrito({
            tipo: "Producto",
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            alt: producto.alt,
          });
          abrirModal(templateComprar(producto));
        } else {
          abrirModal(templateVerMas(producto));
        }
      });
    },
  );
}

// Obtiene nombre, precio e imagen desde la tarjeta del boton seleccionado.
function obtenerDatosProducto(boton) {
  const card = boton.closest(".catalogo-item");
  const imagen = card.querySelector("img");
  const nombre = card.querySelector("h5").textContent;
  const precio = card.querySelector("h6").textContent;

  return {
    nombre: nombre,
    precio: precio,
    imagen: imagen.getAttribute("src"),
    alt: imagen.getAttribute("alt"),
  };
}

// Genera el contenido del modal que confirma que se agrego un producto.
function templateComprar(producto) {
  return `
    <div class="modal-content">
      <button class="modal-close" type="button" aria-label="Cerrar">x</button>
      <p class="modal-status">Producto agregado</p>
      <h3>Se añadió al carrito</h3>
      <img class="modal-image" src="${producto.imagen}" alt="${producto.alt}">
      <h4>${producto.nombre}</h4>
      <p class="modal-price">${producto.precio}</p>
      <p>Ya podés revisar tu carrito o seguir explorando el catálogo.</p>
      <div class="modal-actions">
        <button class="modal-action modal-action-secondary" type="button">
          Seguir comprando
        </button>
        <button class="modal-action modal-action-primary" type="button" data-go-cart>
          Ir al carrito
        </button>
      </div>
    </div>
  `;
}

// Genera el contenido del modal con informacion ampliada del producto.
function templateVerMas(producto) {
  return `
    <div class="modal-content">
      <button class="modal-close" type="button" aria-label="Cerrar">x</button>
      <h3>Detalle del producto</h3>
      <img class="modal-image" src="${producto.imagen}" alt="${producto.alt}">
      <h4>${producto.nombre}</h4>
      <p class="modal-price">${producto.precio}</p>
      <p>Producto destacado de TerraByte, ideal para ampliar almacenamiento y rendimiento.</p>
    </div>
  `;
}

// Reemplaza el modal anterior y muestra el contenido HTML recibido.
function abrirModal(template) {
  const modalAnterior = document.querySelector(".modal-overlay");

  if (modalAnterior) {
    modalAnterior.remove();
  }

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = template;
  document.body.appendChild(modal);

  // Navega al carrito o cierra el modal segun el elemento pulsado.
  modal.addEventListener("click", function (event) {
    if (event.target.hasAttribute("data-go-cart")) {
      window.location.href = "./cart.html";
      return;
    }

    if (
      event.target.classList.contains("modal-overlay") ||
      event.target.classList.contains("modal-close") ||
      event.target.classList.contains("modal-action")
    ) {
      modal.remove();
    }
  });
}
