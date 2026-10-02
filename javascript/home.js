document.addEventListener("DOMContentLoaded", function () {
  iniciarCarruselProductos();
});

function iniciarCarruselProductos() {
  const track = document.getElementById("products-track");
  const prev = document.getElementById("products-prev");
  const next = document.getElementById("products-next");
  let index = 0;
  let estaReseteando = false;
  let estaMoviendo = false;
  let intervaloAutomatico;

  if (!track || !prev || !next) {
    return;
  }

  const productosOriginales = Array.from(track.children);
  const totalOriginales = productosOriginales.length;

  if (totalOriginales === 0) {
    return;
  }

  function perView() {
    const v = getComputedStyle(track).getPropertyValue("--per-view");
    return parseInt(v, 10) || 1;
  }

  function limpiarClones() {
    track.querySelectorAll(".products-item-clone").forEach(function (clone) {
      clone.remove();
    });
  }

  function crearClones() {
    limpiarClones();

    productosOriginales.slice(0, perView()).forEach(function (producto) {
      const clone = producto.cloneNode(true);
      clone.classList.add("products-item-clone");
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  }

  function actualizarBotones() {
    prev.disabled = estaMoviendo || index === 0;
    next.disabled = estaMoviendo || totalOriginales <= perView();
  }

  function update() {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = track.children[0].offsetWidth + gap;
    track.style.transform = "translateX(" + -index * step + "px)";

    actualizarBotones();
  }

  function siguienteProducto() {
    if (estaMoviendo || estaReseteando || totalOriginales <= perView()) {
      return false;
    }

    estaMoviendo = true;
    index += 1;
    update();
    return true;
  }

  function productoAnterior() {
    if (estaMoviendo || estaReseteando || index === 0) {
      return false;
    }

    estaMoviendo = true;
    index -= 1;
    update();
    return true;
  }

  function iniciarMovimientoAutomatico() {
    intervaloAutomatico = setInterval(siguienteProducto, 7500);
  }

  function reiniciarMovimientoAutomatico() {
    clearInterval(intervaloAutomatico);
    iniciarMovimientoAutomatico();
  }

  prev.addEventListener("click", function () {
    if (productoAnterior()) {
      reiniciarMovimientoAutomatico();
    }
  });

  next.addEventListener("click", function () {
    if (siguienteProducto()) {
      reiniciarMovimientoAutomatico();
    }
  });

  track.addEventListener("transitionend", function (event) {
    if (event.target !== track || event.propertyName !== "transform") {
      return;
    }

    if (index < totalOriginales) {
      estaMoviendo = false;
      actualizarBotones();
      return;
    }

    estaReseteando = true;
    track.style.transition = "none";
    index = 0;
    update();

    void track.offsetHeight;
    track.style.transition = "";
    estaReseteando = false;
    estaMoviendo = false;
    actualizarBotones();
  });

  window.addEventListener("resize", function () {
    crearClones();
    index = Math.min(index, totalOriginales - 1);
    estaMoviendo = false;
    update();
  });

  crearClones();
  update();
  iniciarMovimientoAutomatico();
}
