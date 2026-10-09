// ========================================================
// CONFIGURADOR NAS (services.js)
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("nas-form");
  if (!form) return;

  const pasos = Array.from(form.querySelectorAll(".form-step"));
  const totalEl = document.getElementById("total-price");
  let pasoActual = 0;

  // 1. Muestra el paso solicitado y oculta los demás
  const mostrarPaso = (indice) => {
    pasos.forEach((paso, i) => {
      paso.classList.toggle("active", i === indice);
    });
    pasoActual = indice;
  };

  // 2. Actualiza el texto de resumen del paso ("Ninguno (opcional)" o lo que eligió)
  const actualizarPaso = (paso) => {
    const seleccionados = Array.from(paso.querySelectorAll("input:checked")).map((i) => i.value);
    const textoResumen = paso.querySelector(".step-selection span");
    const botonQuitar = paso.querySelector(".btn-clear-step");

    if (textoResumen) {
      textoResumen.textContent = seleccionados.length ? seleccionados.join(", ") : "Ninguno (opcional)";
    }
    if (botonQuitar) {
      botonQuitar.style.display = seleccionados.length ? "inline-block" : "none";
    }
  };

  // 3. Calcula la suma de lo seleccionado y actualiza el total en pantalla
  const actualizarTotal = () => {
    const seleccionados = form.querySelectorAll("input:checked");
    let total = 0;
    seleccionados.forEach((input) => {
      total += extraerPrecio(input.value);
    });
    if (totalEl) {
      totalEl.textContent = formatearPrecio(total);
    }
  };

  // 4. Permite deseleccionar opciones con un clic adicional
  let radioPrevio = null;

  form.addEventListener("mousedown", (e) => {
    const radio = e.target.closest(".card-option")?.querySelector('input[type="radio"]');
    radioPrevio = radio?.checked ? radio : null;
  });

  // 5. Clicks: navegación, botón de limpiar y deselección de radio
  form.addEventListener("click", (e) => {
    // Si hace clic sobre la opción que ya estaba marcada, la desmarca
    const radio = e.target.closest(".card-option")?.querySelector('input[type="radio"]');
    if (radio && radio === radioPrevio) {
      radio.checked = false;
      actualizarPaso(radio.closest(".form-step"));
      actualizarTotal();
    }

    // Botón "Quitar selección" para vaciar el paso actual
    if (e.target.matches(".btn-clear-step")) {
      const paso = e.target.closest(".form-step");
      if (paso) {
        paso.querySelectorAll("input:checked").forEach((i) => (i.checked = false));
        actualizarPaso(paso);
        actualizarTotal();
      }
    }

    // Botones Siguiente y Anterior
    if (e.target.matches(".btn-next") && pasoActual < pasos.length - 1) {
      mostrarPaso(pasoActual + 1);
    } else if (e.target.matches(".btn-prev") && pasoActual > 0) {
      mostrarPaso(pasoActual - 1);
    }
  });

  // 6. Al marcar o desmarcar cualquier opción, refresca el paso y el total
  form.addEventListener("change", (e) => {
    const paso = e.target.closest(".form-step");
    if (paso) {
      actualizarPaso(paso);
      actualizarTotal();
    }
  });

  // 7. Envío del formulario: valida y guarda la configuración en el carrito
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const seleccionados = Array.from(form.querySelectorAll("input:checked")).map((i) => i.value);

    // Validación: al menos un componente en cualquier paso
    if (seleccionados.length === 0) {
      abrirModalServicio({
        titulo: "Configuración incompleta",
        mensaje: "Seleccioná al menos un componente en cualquiera de los pasos para armar tu NAS.",
        principal: "Entendido",
      });
      return;
    }

    const total = seleccionados.reduce((suma, item) => suma + extraerPrecio(item), 0);

    agregarAlCarrito({
      tipo: "Servicio",
      nombre: "NAS personalizado",
      precio: total === 0 ? "Gratis" : formatearPrecio(total),
      componentes: seleccionados,
    });

    abrirModalServicio({
      titulo: "NAS agregado al carrito",
      mensaje: "Tu configuración personalizada ya está guardada y lista para revisar.",
      principal: "Ir al carrito",
      secundaria: "Seguir configurando",
      irAlCarrito: true,
    });
  });

  // Inicializa cada paso y muestra el paso 1
  pasos.forEach(actualizarPaso);
  mostrarPaso(0);
});

// ========================================================
// MODAL DE CONFIRMACIÓN O AVISO
// ========================================================
function abrirModalServicio(opciones) {
  const modalViejo = document.querySelector(".service-modal-overlay");
  if (modalViejo) modalViejo.remove();

  const modal = document.createElement("div");
  modal.className = "service-modal-overlay";
  modal.innerHTML = `
    <div class="service-modal">
      <button class="service-modal-close" type="button" aria-label="Cerrar">x</button>
      <p class="service-modal-status">Armá tu NAS</p>
      <h3>${opciones.titulo}</h3>
      <p>${opciones.mensaje}</p>
      <div class="service-modal-actions">
        ${opciones.secundaria ? `<button class="service-modal-action service-modal-secondary" type="button">${opciones.secundaria}</button>` : ""}
        <button class="service-modal-action service-modal-primary" type="button">${opciones.principal}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".service-modal-close").addEventListener("click", () => modal.remove());

  const btnSecundario = modal.querySelector(".service-modal-secondary");
  if (btnSecundario) {
    btnSecundario.addEventListener("click", () => modal.remove());
  }

  modal.querySelector(".service-modal-primary").addEventListener("click", () => {
    if (opciones.irAlCarrito) {
      window.location.href = "./cart.html";
    } else {
      modal.remove();
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}
