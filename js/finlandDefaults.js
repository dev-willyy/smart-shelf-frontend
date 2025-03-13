export function checkFinlandDefaults(onSuccess) {
  const tempInput = document.getElementById('tempInput');
  const humidityInput = document.getElementById('humidityInput');
  const finlandModal = document.getElementById('finlandModal');
  const acceptBtn = document.getElementById('acceptDefaultsBtn');
  const rejectBtn = document.getElementById('rejectDefaultsBtn');
  const closeBtn = document.getElementById('finlandModalClose');

  const FINLAND_DEFAULT_TEMP = 5;
  const FINLAND_DEFAULT_HUMIDITY = 40;

  // If storage conditions are already set, immediately invoke the callback.
  if (tempInput.value.trim() && humidityInput.value.trim()) {
    onSuccess();
    return;
  }

  finlandModal.style.display = 'block';

  // Define a helper to close the modal, remove listeners, and call the callback.
  const closeModalAndProceed = () => {
    finlandModal.style.display = 'none';
    acceptBtn.removeEventListener('click', onAccept);
    rejectBtn.removeEventListener('click', onReject);
    closeBtn.removeEventListener('click', onClose);
    onSuccess();
  };

  // Define event handlers.
  const onAccept = () => {
    tempInput.value = FINLAND_DEFAULT_TEMP;
    humidityInput.value = FINLAND_DEFAULT_HUMIDITY;
    closeModalAndProceed();
  };

  const onReject = () => {
    closeModalAndProceed();
  };

  const onClose = () => {
    closeModalAndProceed();
  };

  acceptBtn.addEventListener('click', onAccept);
  rejectBtn.addEventListener('click', onReject);
  closeBtn.addEventListener('click', onClose);
}
