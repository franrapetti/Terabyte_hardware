document.addEventListener("DOMContentLoaded", function () {
  iniciarCarruselProductos();
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
