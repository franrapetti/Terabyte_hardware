// Inicia el carrusel destacado cuando el documento ya se puede manipular.
document.addEventListener("DOMContentLoaded", function () {
  iniciarCarruselProductos();
});

// Configura controles, movimiento automatico y ciclo continuo del carrusel.
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

  // Lee desde CSS cuantos productos entran en pantalla.
  function perView() {
    const v = getComputedStyle(track).getPropertyValue("--per-view");
    return parseInt(v, 10) || 1;
  }

  // Quita las copias creadas para cerrar el ciclo del carrusel.
  function limpiarClones() {
    track.querySelectorAll(".products-item-clone").forEach(
      // Elimina una copia anterior del carrusel.
      function (clone) {
        clone.remove();
      },
    );
  }

  // Duplica los primeros productos necesarios para crear el efecto continuo.
  function crearClones() {
    limpiarClones();

    productosOriginales.slice(0, perView()).forEach(
      // Copia un producto y lo agrega al final del carrusel.
      function (producto) {
        const clone = producto.cloneNode(true);
        clone.classList.add("products-item-clone");
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      },
    );
  }

  // Habilita o deshabilita controles segun la posicion y el movimiento actual.
  function actualizarBotones() {
    prev.disabled = estaMoviendo || index === 0;
    next.disabled = estaMoviendo || totalOriginales <= perView();
  }

  // Mueve el carrusel a la posicion actual y actualiza sus botones.
  function update() {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = track.children[0].offsetWidth + gap;
    track.style.transform = "translateX(" + -index * step + "px)";

    actualizarBotones();
  }

  // Avanza una posicion si el carrusel no esta moviendose o reiniciandose.
  function siguienteProducto() {
    if (estaMoviendo || estaReseteando || totalOriginales <= perView()) {
      return false;
    }

    estaMoviendo = true;
    index += 1;
    update();
    return true;
  }

  // Retrocede una posicion cuando hay productos anteriores.
  function productoAnterior() {
    if (estaMoviendo || estaReseteando || index === 0) {
      return false;
    }

    estaMoviendo = true;
    index -= 1;
    update();
    return true;
  }

  // Programa un avance automatico cada 7.5 segundos.
  function iniciarMovimientoAutomatico() {
    intervaloAutomatico = setInterval(siguienteProducto, 7500);
  }

  // Reinicia el temporizador despues de una interaccion manual.
  function reiniciarMovimientoAutomatico() {
    clearInterval(intervaloAutomatico);
    iniciarMovimientoAutomatico();
  }

  // Mueve hacia atras y reinicia el temporizador si se pudo avanzar.
  prev.addEventListener("click", function () {
    if (productoAnterior()) {
      reiniciarMovimientoAutomatico();
    }
  });

  // Mueve hacia adelante y reinicia el temporizador si se pudo avanzar.
  next.addEventListener("click", function () {
    if (siguienteProducto()) {
      reiniciarMovimientoAutomatico();
    }
  });

  // Al terminar la animacion, libera el movimiento o reinicia el ciclo.
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

  // Recalcula las copias y la posicion cuando cambia el ancho de pantalla.
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
