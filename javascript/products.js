document.addEventListener("DOMContentLoaded", function () {
  iniciarCarruselMarcas();
  iniciarFiltrosCatalogo();
  iniciarModalesProductos();
});

function iniciarCarruselMarcas() {
  const track = document.querySelector(".brands-track");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cantidadMarcas = track ? track.children.length : 0;
  let moviendo = false;

  if (!track || cantidadMarcas <= 1 || reduceMotion.matches) {
    return;
  }

  function ajustarColumnas() {
    track.style.width = "calc(100% + (100% / " + cantidadMarcas + "))";
    track.style.gridTemplateColumns =
      "repeat(" + (cantidadMarcas + 1) + ", 1fr)";
  }

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

function iniciarFiltrosCatalogo() {
  const buscador = document.getElementById("catalogo-search");
  const tags = document.querySelectorAll(".catalogo-tag input");
  const items = document.querySelectorAll(".catalogo-item");

  if (!buscador || items.length === 0) {
    return;
  }

  function filtrarCatalogo() {
    const busqueda = buscador.value.trim().toLowerCase();
    const categoria = document.querySelector(".catalogo-tag input:checked").value;

    items.forEach(function (item) {
      const nombre = item.querySelector("h5").textContent.toLowerCase();
      const itemTags = item.dataset.tags.split(" ");
      const coincideBusqueda = nombre.includes(busqueda);
      const coincideTags = categoria === "" || itemTags.includes(categoria);

      item.classList.toggle("is-hidden", !coincideBusqueda || !coincideTags);
    });
  }

  buscador.addEventListener("input", filtrarCatalogo);

  tags.forEach(function (tag) {
    tag.addEventListener("change", filtrarCatalogo);
  });
}

function iniciarModalesProductos() {
  const botones = document.querySelectorAll(".catalogo-button");

  botones.forEach(function (boton) {
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
  });
}

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

function abrirModal(template) {
  const modalAnterior = document.querySelector(".modal-overlay");

  if (modalAnterior) {
    modalAnterior.remove();
  }

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = template;
  document.body.appendChild(modal);

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
