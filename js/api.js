export function analyzeSpoilage(payload) {
  return fetch('http://localhost:5000/api/predict-expiry', {
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

export function setupApiHandlers() {
  // Bind the conditions form submission on scanning page
  const conditionsForm = document.getElementById('conditionsForm');
  if (conditionsForm) {
    conditionsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
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
      try {
        const result = await analyzeSpoilage({
          barcode,
          temperature,
          humidity,
        });
        // Check for non-food product error message
        if (result.error) {
          showModal(`Error: ${result.error}`);
        } else {
          // Build a detailed HTML output from result object
          const content = `
            <p><strong>Product Name:</strong> ${result.productName}</p>
            <p><strong>Category:</strong> ${result.category}</p>
            <p><strong>Recommended Temp:</strong> ${result.recommendedTemp} °C</p>
            <p><strong>Recommended Humidity:</strong> ${result.recommendedHumidity} %</p>
            <p><strong>Your Temp:</strong> ${result.actualTemperature} °C</p>
            <p><strong>Your Humidity:</strong> ${result.actualHumidity} %</p>
            <p><strong>Predicted Spoilage Duration:</strong> ${result.predictedSpoilageDays} day(s)</p>
          `;
          showModal(content);
        }
      } catch (error) {
        showModal(`Error: ${error.message}`);
      }
    });
  }
}

import { showModal } from './modal.js';
