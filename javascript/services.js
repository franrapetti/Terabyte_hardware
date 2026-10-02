document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-form-btn');
  const form = document.getElementById('nas-form');

  if (toggleBtn && form) {
    toggleBtn.addEventListener('click', () => {
      form.classList.toggle('form-hidden');
    });
  }
});
