export function initScanner() {
  const startBtn = document.getElementById('startScannerBtn');
  const stopBtn = document.getElementById('stopScannerBtn');
  const barcodeEl = document.getElementById('detectedBarcode');
  const snapshotCanvas = document.getElementById('snapshotCanvas');
  const snapshotCtx = snapshotCanvas?.getContext('2d');

  let scannerActive = false;

  // This is to store the last recognized codes in an array to confirm accuracy.
  // e.g., if we detect the same code 3 times in a row, we treat it as stable.
  const detectionBuffer = [];
  const STABILITY_THRESHOLD = 3;

  // "environment" (back camera) - primary
  const backCameraConstraints = {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: { ideal: 'environment' },
  };
  // "user" (front camera) - fallback
  const frontCameraConstraints = {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: { ideal: 'user' },
  };

  // Start Quagga with the specified constraints
  function startQuagga(constraints) {
    const quaggaConfig = {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.getElementById('interactive'),
        constraints,
      },
      decoder: {
        // Include multiple readers to handle different barcode formats
        readers: ['upc_reader', 'upc_e_reader', 'ean_reader', 'ean_8_reader', 'code_128_reader'],
      },
      locate: true,
      locator: {
        patchSize: 'medium',
        halfSample: true,
      },
      numOfWorkers: navigator.hardwareConcurrency ? Math.max(1, navigator.hardwareConcurrency - 1) : 1,
    };

    window.Quagga.init(quaggaConfig, (err) => {
      if (err) {
        console.error('Quagga init error:', err);
        // If back camera & it fails, fallback to front camera
        if (constraints.facingMode.ideal === 'environment') {
          console.log('Falling back to front camera...');
          startQuagga(frontCameraConstraints);
        } else {
          alert('Error initializing barcode scanner. Please check permissions or try a different device.');
        }
        return;
      }

      // Successfully initialized
      window.Quagga.start();
      scannerActive = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      console.log('Scanner started with constraints:', constraints);

      // Listen for detection events
      window.Quagga.onDetected(onDetected);
    });
  }

  // Called each time Quagga thinks it sees a barcode
  function onDetected(result) {
    const code = result.codeResult.code || '';

    // Push it onto our buffer
    detectionBuffer.push(code);

    if (detectionBuffer.length > STABILITY_THRESHOLD) {
      detectionBuffer.shift();
    }

    if (isStableCode()) {
      const stableCode = detectionBuffer[detectionBuffer.length - 1];
      barcodeEl.textContent = stableCode;
      captureCurrentFrame();
      detectionBuffer.length = 0;
    }
  }

  // Checks if we have the same code repeated STABILITY_THRESHOLD times in a row
  function isStableCode() {
    if (detectionBuffer.length < STABILITY_THRESHOLD) return false;
    const lastCode = detectionBuffer[detectionBuffer.length - 1];
    // Check if all entries match the last code
    return detectionBuffer.every((c) => c === lastCode);
  }

  // Capture the current camera frame and draw it into snapshotCanvas
  function captureCurrentFrame() {
    // Quagga uses <video> or <canvas> in #interactive
    const video = document.querySelector('#interactive video');
    if (video && snapshotCtx) {
      snapshotCtx.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
    }
  }

  // Start scanning when user clicks "Start Scanner"
  startBtn.addEventListener('click', () => {
    if (scannerActive) return;
    // Attempt back camera first
    startQuagga(backCameraConstraints);
  });

  // Stop scanning
  stopBtn.addEventListener('click', () => {
    if (!scannerActive) return;
    window.Quagga.stop();
    window.Quagga.offDetected(onDetected);
    scannerActive = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    console.log('Scanner stopped');
  });
}
