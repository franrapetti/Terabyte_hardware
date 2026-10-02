document.addEventListener("DOMContentLoaded", function () {
  iniciarCarruselProductos();
  iniciarModalesProductos();
});

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

  prev.addEventListener("click", function () {
    index = Math.max(0, index - 1);
    update();
  });

  next.addEventListener("click", function () {
    index += 1;
    update();
  });

  window.addEventListener("resize", update);
  update();
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
