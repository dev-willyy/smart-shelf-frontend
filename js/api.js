import { showModal } from './modal.js';
import { checkFinlandDefaults } from './finlandDefaults.js';
import { showLoader, hideLoader } from './app.js';

/**
 * analyzeSpoilage() - calls the backend to predict expiry/spoilage.
 */
export function analyzeSpoilage(payload) {
  return fetch('https://smart-shelf-backend.onrender.com/api/predict-expiry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .catch((err) => {
      console.error('API call error:', err);
      throw new Error('Network error');
    });
}

/**
 * setupApiHandlers() - Binds form submission for spoilage analysis,
 * ensuring we do NOT show Finland defaults if barcode is N/A.
 */
export function setupApiHandlers() {
  const conditionsForm = document.getElementById('conditionsForm');
  if (!conditionsForm) return;

  conditionsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Submit event fired');

    const barcode = document.getElementById('detectedBarcode').textContent.trim();
    if (!barcode || barcode === 'N/A') {
      showModal('Error: No barcode detected. Please scan a product first.');
      return;
    }

    console.log('Calling checkFinlandDefaults');
    checkFinlandDefaults(() => {
      console.log('Finland defaults callback triggered');
      doSpoilageAnalysis();
    });
  });
}

/**
 * doSpoilageAnalysis() - Final check for temperature/humidity, then call analyzeSpoilage().
 */
function doSpoilageAnalysis() {
  const barcode = document.getElementById('detectedBarcode').textContent.trim();
  const temperature = document.getElementById('tempInput').value.trim();
  const humidity = document.getElementById('humidityInput').value.trim();

  if (!barcode || barcode === 'N/A') {
    showModal('Error: No barcode detected. Please scan a product first.');
    return;
  }

  if (!temperature || !humidity) {
    showModal('Error: Please enter both temperature and humidity.');
    return;
  }

  showLoader();

  analyzeSpoilage({ barcode, temperature, humidity })
    .then((result) => {
      hideLoader();

      if (result.error) {
        showModal(`Error: ${result.error}`);
      } else {
        const content = `
          <p><strong>Product Name:</strong> ${result?.productName}</p>
          <p><strong>Category:</strong> ${result?.category}</p>
          <p><strong>Recommended Temp:</strong> ${result?.recommendedTemp} °C</p>
          <p><strong>Recommended Humidity:</strong> ${result?.recommendedHumidity} %</p>
          <p><strong>Your Temp:</strong> ${result?.actualTemperature} °C</p>
          <p><strong>Your Humidity:</strong> ${result?.actualHumidity} %</p>
          <p><strong>Predicted Spoilage Duration:</strong> ${result?.predictedSpoilageDays} day(s)</p>
        `;
        showModal(content);
      }
    })
    .catch((error) => {
      hideLoader();
      showModal(`Error: ${error.message}`);
    });
}
