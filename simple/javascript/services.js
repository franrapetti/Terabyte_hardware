// ========================================================
// CONFIGURADOR NAS (services.js)
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("nas-form");
  if (!form) return;

  const pasos = Array.from(form.querySelectorAll(".form-step"));
  let pasoActual = 0;

  // 1. Mostrar el paso actual y ocultar los demás
  function mostrarPaso(indice) {
    pasos.forEach((paso, i) => {
      paso.classList.toggle("active", i === indice);
    });
    pasoActual = indice;
  }

  // 2. Actualizar el texto del componente seleccionado en cada paso
  function actualizarPaso(paso) {
    const seleccionados = Array.from(paso.querySelectorAll("input:checked")).map((i) => i.value);
    const span = paso.querySelector(".step-selection span");
    const btnLimpiar = paso.querySelector(".btn-clear-step");

    if (span) {
      span.textContent = seleccionados.length > 0 ? seleccionados.join(", ") : "Ninguno";
    }
    if (btnLimpiar) {
      btnLimpiar.style.display = seleccionados.length > 0 ? "inline-block" : "none";
    }
  }

  // 3. Controlar los botones de Siguiente, Anterior y Limpiar
  form.addEventListener("click", (e) => {
    // Avanzar al siguiente paso
    if (e.target.matches(".btn-next") && pasoActual < pasos.length - 1) {
      mostrarPaso(pasoActual + 1);
    }
    // Volver al paso anterior
    else if (e.target.matches(".btn-prev") && pasoActual > 0) {
      mostrarPaso(pasoActual - 1);
    }
    // Quitar la selección del paso actual si el usuario se arrepiente
    else if (e.target.matches(".btn-clear-step")) {
      const paso = e.target.closest(".form-step");
      if (paso) {
        paso.querySelectorAll("input:checked").forEach((input) => (input.checked = false));
        actualizarPaso(paso);
      }
    }
  });

  // 4. Actualizar el texto cuando el usuario elige una opción
  form.addEventListener("change", (e) => {
    const paso = e.target.closest(".form-step");
    if (paso) {
      actualizarPaso(paso);
    }
  });

  // 5. Enviar el formulario y agregar al carrito
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtener todos los componentes seleccionados en todos los pasos
    const seleccionados = Array.from(form.querySelectorAll("input:checked")).map((i) => i.value);

    // Validación: que haya elegido al menos un componente
    if (seleccionados.length === 0) {
      abrirModalServicio({
        titulo: "Configuración incompleta",
        mensaje: "Elegí al menos un componente para agregar tu NAS al carrito.",
        principal: "Entendido",
      });
      return;
    }

    // Calcular precio sumando los componentes
    let precioTotal = 0;
    seleccionados.forEach((item) => {
      precioTotal += extraerPrecio(item);
    });

    // Guardar en el carrito
    agregarAlCarrito({
      tipo: "Servicio",
      nombre: "NAS personalizado",
      precio: precioTotal === 0 ? "Gratis" : formatearPrecio(precioTotal),
      componentes: seleccionados,
    });

    // Mostrar modal de éxito
    abrirModalServicio({
      titulo: "NAS agregado al carrito",
      mensaje: "Tu configuración personalizada fue guardada con éxito.",
      principal: "Ir al carrito",
      secundaria: "Seguir configurando",
      irAlCarrito: true,
    });
  });

  // Iniciar el estado de cada paso y mostrar el primero
  pasos.forEach(actualizarPaso);
  mostrarPaso(0);
});

// ========================================================
// VENTANA MODAL (aviso y confirmación)
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

  modal.querySelector(".service-modal-close").onclick = () => modal.remove();

  const btnSecundario = modal.querySelector(".service-modal-secondary");
  if (btnSecundario) {
    btnSecundario.onclick = () => modal.remove();
  }

  modal.querySelector(".service-modal-primary").onclick = () => {
    if (opciones.irAlCarrito) {
      window.location.href = "./cart.html";
    } else {
      modal.remove();
    }
  };

  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}
