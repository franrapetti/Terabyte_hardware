document.addEventListener("DOMContentLoaded", function () {
  iniciarCarruselMarcas();
  iniciarCarruselProductos();
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

function iniciarCarruselProductos() {
  const track = document.getElementById("products-track");
  const prev = document.getElementById("products-prev");
  const next = document.getElementById("products-next");
  let index = 0;

  if (!track || !prev || !next) {
    return;
  }

  function perView() {
    const v = getComputedStyle(track).getPropertyValue("--per-view");
    return parseInt(v, 10) || 1;
  }

  function update() {
    const total = track.children.length;
    const max = Math.max(0, total - perView());
    index = Math.min(index, max);

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = track.children[0].offsetWidth + gap;
    track.style.transform = "translateX(" + -index * step + "px)";

    prev.disabled = index === 0;
    next.disabled = index >= max;
  }

  function siguienteProducto() {
    const total = track.children.length;
    const max = Math.max(0, total - perView());

    if (index >= max) {
      index = 0;
    } else {
      index += 1;
    }

    update();
  }

  prev.addEventListener("click", function () {
    index = Math.max(0, index - 1);
    update();
  });

  next.addEventListener("click", function () {
    siguienteProducto();
  });

  window.addEventListener("resize", update);
  update();
  setInterval(siguienteProducto, 7500);
}

function iniciarModalesProductos() {
  const botones = document.querySelectorAll(".products-button");

  botones.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const producto = obtenerDatosProducto(boton);

      if (boton.textContent.trim() === "Comprar") {
        abrirModal(templateComprar(producto));
      } else {
        abrirModal(templateVerMas(producto));
      }
    });
  });
}

function obtenerDatosProducto(boton) {
  const card = boton.closest(".products-item");
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
      <h3>Comprar producto</h3>
      <img class="modal-image" src="${producto.imagen}" alt="${producto.alt}">
      <h4>${producto.nombre}</h4>
      <p class="modal-price">${producto.precio}</p>
      <p>El producto fue agregado al carrito correctamente.</p>
      <button class="modal-action" type="button">Finalizar compra</button>
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
    if (
      event.target.classList.contains("modal-overlay") ||
      event.target.classList.contains("modal-close") ||
      event.target.classList.contains("modal-action")
    ) {
      modal.remove();
    }
  });
}
