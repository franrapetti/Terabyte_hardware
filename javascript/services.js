document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('nas-form');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.form-step'));
  let currentStep = 0;

  const showStep = (index) => {
    steps.forEach((step, i) => step.classList.toggle('active', i === index));
    currentStep = index;
  };

  form.addEventListener('click', (e) => {
    if (e.target.matches('.btn-next') && currentStep < steps.length - 1) {
      showStep(currentStep + 1);
    } else if (e.target.matches('.btn-prev') && currentStep > 0) {
      showStep(currentStep - 1);
    }
  });

  form.addEventListener('change', (e) => {
    const step = e.target.closest('.form-step');
    if (!step) return;
    const checked = Array.from(step.querySelectorAll('input:checked')).map(i => i.value);
    const selSpan = step.querySelector('.step-selection span');
    if (selSpan) {
      selSpan.textContent = checked.length ? checked.join(', ') : 'Ninguno';
    }
    updateTotal();
  });

  const totalEl = document.getElementById('total-price');
  const updateTotal = () => {
    const total = Array.from(form.querySelectorAll('input:checked')).reduce((sum, i) => {
      const val = (i.value.match(/\$([0-9.]+)/) || [])[1];
      return sum + (val ? parseInt(val.replaceAll('.', ''), 10) : 0);
    }, 0);
    if (totalEl) totalEl.textContent = '$' + total.toLocaleString('es-AR');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`¡Tu configuración de NAS personalizada fue agregada al carrito con éxito!\nTotal: ${totalEl ? totalEl.textContent : '$0'}`);
  });

  showStep(0);
});
