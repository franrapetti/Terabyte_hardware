// Prepara los pasos del configurador NAS cuando el documento esta listo.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("nas-form");
  if (!form) return;

  const steps = Array.from(form.querySelectorAll(".form-step"));
  let currentStep = 0;

  // Activa el paso indicado y oculta los demas pasos del formulario.
  const showStep = (index) => {
    steps.forEach(
      // Mantiene activo solamente el paso solicitado.
      (step, i) => step.classList.toggle("active", i === index),
    );
    currentStep = index;
  };

  // Actualiza el texto de selección y la visibilidad del botón de limpiar del paso.
  const actualizarPaso = (step) => {
    const checked = Array.from(step.querySelectorAll("input:checked")).map(
      (i) => i.value,
    );
    const selSpan = step.querySelector(".step-selection span");
    if (selSpan) {
      selSpan.textContent = checked.length ? checked.join(", ") : "Ninguno (opcional)";
    }
    const clearBtn = step.querySelector(".btn-clear-step");
    if (clearBtn) {
      clearBtn.style.display = checked.length ? "inline-block" : "none";
    }
  };

  // Registra si el radio ya estaba marcado antes de hacer clic para permitir desmarcarlo.
  let radioQueEstabaMarcado = null;

  form.addEventListener("pointerdown", (e) => {
    const card = e.target.closest(".card-option");
    if (!card) {
      radioQueEstabaMarcado = null;
      return;
    }
    const radio = card.querySelector('input[type="radio"]');
    radioQueEstabaMarcado = radio && radio.checked ? radio : null;
  });

  // Controla los botones de navegación, limpiar paso y desmarcado de radios.
  form.addEventListener("click", (e) => {
    if (e.target.matches(".btn-clear-step")) {
      const step = e.target.closest(".form-step");
      if (step) {
        step.querySelectorAll("input:checked").forEach((input) => {
          input.checked = false;
        });
        actualizarPaso(step);
        updateTotal();
      }
      return;
    }

    const card = e.target.closest(".card-option");
    if (card) {
      const radio = card.querySelector('input[type="radio"]');
      if (radio && radioQueEstabaMarcado === radio) {
        radio.checked = false;
        radioQueEstabaMarcado = null;
        const step = card.closest(".form-step");
        if (step) {
          actualizarPaso(step);
          updateTotal();
        }
      }
    }

    if (e.target.matches(".btn-next") && currentStep < steps.length - 1) {
      showStep(currentStep + 1);
    } else if (e.target.matches(".btn-prev") && currentStep > 0) {
      showStep(currentStep - 1);
    }
  });

  // Actualiza el resumen de componentes y el total ante cada seleccion.
  form.addEventListener("change", (e) => {
    const step = e.target.closest(".form-step");
    if (!step) return;
    actualizarPaso(step);
    updateTotal();
  });

  const totalEl = document.getElementById("total-price");
  // Suma los precios seleccionados y actualiza el total visible.
  const updateTotal = () => {
    const total = Array.from(form.querySelectorAll("input:checked")).reduce(
      // Agrega al acumulado el precio de la opcion seleccionada.
      (sum, i) => {
        const val = (i.value.match(/\$([0-9.]+)/) || [])[1];
        return sum + (val ? parseInt(val.replaceAll(".", ""), 10) : 0);
      },
      0,
    );
    if (totalEl) totalEl.textContent = "$" + total.toLocaleString("es-AR");
  };

  // Valida la configuracion, la agrega al carrito y muestra el resultado.
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const configuracion = obtenerConfiguracionNas(form);

    if (configuracion.componentes.length === 0) {
      abrirModalServicio({
        titulo: "Configuración incompleta",
        mensaje:
          "Seleccioná al menos un componente en cualquiera de los pasos para armar tu NAS.",
        principal: "Entendido",
      });
      return;
    }

    agregarAlCarrito({
      tipo: "Servicio",
      nombre: configuracion.nombre,
      precio: configuracion.precio,
      componentes: configuracion.componentes,
    });
    abrirModalServicio({
      titulo: "NAS agregado al carrito",
      mensaje:
        "Tu configuración personalizada ya está guardada y lista para revisar.",
      principal: "Ir al carrito",
      secundaria: "Seguir configurando",
      irAlCarrito: true,
    });
  });

  steps.forEach(actualizarPaso);
  showStep(0);
});

// Construye el nombre, los componentes elegidos y el precio de la NAS.
function obtenerConfiguracionNas(form) {
  const seleccionados = Array.from(form.querySelectorAll("input:checked"));
  const componentes = seleccionados.map(
    // Guarda el texto de cada opcion seleccionada.
    (input) => input.value,
  );
  const total = componentes.reduce(
    // Suma el precio de cada componente para obtener el total.
    (suma, componente) => {
      return suma + extraerPrecioComponente(componente);
    },
    0,
  );

  return {
    nombre: "NAS personalizado",
    precio: total === 0 ? "Gratis" : formatearPrecio(total),
    componentes: componentes,
  };
}

// Extrae el numero de precio de una opcion o devuelve cero si no hay precio.
function extraerPrecioComponente(texto) {
  const coincidencia = texto.match(/\(\$([\d.]+)\)/);

  if (!coincidencia) {
    return 0;
  }

  return Number(coincidencia[1].replaceAll(".", ""));
}

// Construye y muestra un modal con el resultado de la configuracion.
function abrirModalServicio(opciones) {
  const modalAnterior = document.querySelector(".service-modal-overlay");

  if (modalAnterior) {
    modalAnterior.remove();
  }

  const modal = document.createElement("div");
  modal.className = "service-modal-overlay";

  const contenido = document.createElement("div");
  contenido.className = "service-modal";

  const cerrar = document.createElement("button");
  cerrar.className = "service-modal-close";
  cerrar.type = "button";
  cerrar.setAttribute("aria-label", "Cerrar");
  cerrar.textContent = "x";

  const estado = document.createElement("p");
  estado.className = "service-modal-status";
  estado.textContent = "Armá tu NAS";

  const titulo = document.createElement("h3");
  titulo.textContent = opciones.titulo;

  const mensaje = document.createElement("p");
  mensaje.textContent = opciones.mensaje;

  const acciones = document.createElement("div");
  acciones.className = "service-modal-actions";

  if (opciones.secundaria) {
    const secundaria = document.createElement("button");
    secundaria.className = "service-modal-action service-modal-secondary";
    secundaria.type = "button";
    secundaria.textContent = opciones.secundaria;
    // Cierra el modal para permitir seguir configurando.
    secundaria.addEventListener("click", function () {
      modal.remove();
    });
    acciones.appendChild(secundaria);
  }

  const principal = document.createElement("button");
  principal.className = "service-modal-action service-modal-primary";
  principal.type = "button";
  principal.textContent = opciones.principal;
  // Ejecuta la accion principal, como ir al carrito o cerrar el aviso.
  principal.addEventListener("click", function () {
    if (opciones.irAlCarrito) {
      window.location.href = "./cart.html";
      return;
    }

    modal.remove();
  });
  acciones.appendChild(principal);

  contenido.append(cerrar, estado, titulo, mensaje, acciones);
  modal.appendChild(contenido);
  document.body.appendChild(modal);

  // Cierra el modal al pulsar su fondo o el boton de cierre.
  modal.addEventListener("click", function (event) {
    if (
      event.target.classList.contains("service-modal-overlay") ||
      event.target.classList.contains("service-modal-close")
    ) {
      modal.remove();
    }
  });
}
