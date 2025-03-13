export function checkFinlandDefaults() {
  const tempInput = document.getElementById('tempInput');
  const humidityInput = document.getElementById('humidityInput');
  const finlandModal = document.getElementById('finlandModal');
  const acceptBtn = document.getElementById('acceptDefaultsBtn');
  const rejectBtn = document.getElementById('rejectDefaultsBtn');
  const closeBtn = document.getElementById('finlandModalClose');

  const FINLAND_DEFAULT_TEMP = 5;
  const FINLAND_DEFAULT_HUMIDITY = 40;

  if (tempInput.value.trim() && humidityInput.value.trim()) {
    return;
  }

  finlandModal.style.display = 'block';

  acceptBtn.addEventListener('click', () => {
    tempInput.value = FINLAND_DEFAULT_TEMP;
    humidityInput.value = FINLAND_DEFAULT_HUMIDITY;
    finlandModal.style.display = 'none';
  });

  rejectBtn.addEventListener('click', () => {
    finlandModal.style.display = 'none';
  });

  closeBtn.addEventListener('click', () => {
    finlandModal.style.display = 'none';
  });
}
