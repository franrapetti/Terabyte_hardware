document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("nas-form");
  if (!form) return;

  const steps = Array.from(form.querySelectorAll(".form-step"));
  let currentStep = 0;

  const showStep = (index) => {
    steps.forEach((step, i) => step.classList.toggle("active", i === index));
    currentStep = index;
  };

  form.addEventListener("click", (e) => {
    if (e.target.matches(".btn-next") && currentStep < steps.length - 1) {
      showStep(currentStep + 1);
    } else if (e.target.matches(".btn-prev") && currentStep > 0) {
      showStep(currentStep - 1);
    }
  });

  form.addEventListener("change", (e) => {
    const step = e.target.closest(".form-step");
    if (!step) return;
    const checked = Array.from(step.querySelectorAll("input:checked")).map(
      (i) => i.value,
    );
    const selSpan = step.querySelector(".step-selection span");
    if (selSpan) {
      selSpan.textContent = checked.length ? checked.join(", ") : "Ninguno";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const configuracion = obtenerConfiguracionNas(form);

    if (configuracion.componentes.length === 0) {
      abrirModalServicio({
        titulo: "Configuración incompleta",
        mensaje: "Seleccioná al menos un componente para agregarlo al carrito.",
        principal: "Entendido",
      });
      return;
    }

    guardarConfiguracionEnCarrito(configuracion);
    abrirModalServicio({
      titulo: "NAS agregado al carrito",
      mensaje:
        "Tu configuración personalizada ya está guardada y lista para revisar.",
      principal: "Ir al carrito",
      secundaria: "Seguir configurando",
      irAlCarrito: true,
    });
  });

  showStep(0);
});

function obtenerConfiguracionNas(form) {
  const seleccionados = Array.from(form.querySelectorAll("input:checked"));
  const componentes = seleccionados.map((input) => input.value);
  const total = componentes.reduce((suma, componente) => {
    return suma + extraerPrecio(componente);
  }, 0);

  return {
    nombre: "NAS personalizado",
    precio: total === 0 ? "Gratis" : formatearPrecio(total),
    componentes: componentes,
  };
}

function extraerPrecio(texto) {
  const coincidencia = texto.match(/\(\$([\d.]+)\)/);

  if (!coincidencia) {
    return 0;
  }

  return Number(coincidencia[1].replaceAll(".", ""));
}

function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-AR");
}

function obtenerCarrito() {
  const carritoGuardado = localStorage.getItem("terrabyte-cart");

  if (!carritoGuardado) {
    return [];
  }

  try {
    const carrito = JSON.parse(carritoGuardado);
    return Array.isArray(carrito) ? carrito : [];
  } catch (error) {
    return [];
  }
}

function guardarConfiguracionEnCarrito(configuracion) {
  const carrito = obtenerCarrito();

  carrito.push({
    id: Date.now().toString() + "-" + Math.random().toString(16).slice(2),
    tipo: "Servicio",
    nombre: configuracion.nombre,
    precio: configuracion.precio,
    componentes: configuracion.componentes,
    cantidad: 1,
  });

  localStorage.setItem("terrabyte-cart", JSON.stringify(carrito));
}

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
    secundaria.addEventListener("click", function () {
      modal.remove();
    });
    acciones.appendChild(secundaria);
  }

  const principal = document.createElement("button");
  principal.className = "service-modal-action service-modal-primary";
  principal.type = "button";
  principal.textContent = opciones.principal;
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

  modal.addEventListener("click", function (event) {
    if (
      event.target.classList.contains("service-modal-overlay") ||
      event.target.classList.contains("service-modal-close")
    ) {
      modal.remove();
    }
  });
}
