export function showModal(content) {
  const modal = document.getElementById('resultModal');
  const resultContent = document.getElementById('resultContent');
  resultContent.innerHTML = content;
  modal.style.display = 'block';
}

export function bindModalEvents() {
  const modal = document.getElementById('resultModal');
  const closeBtn = document.getElementById('modalClose');
  closeBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}
