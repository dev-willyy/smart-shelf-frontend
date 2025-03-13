export function initScanner() {
  const startBtn = document.getElementById('startScannerBtn');
  const stopBtn = document.getElementById('stopScannerBtn');
  const barcodeEl = document.getElementById('detectedBarcode');
  const snapshotCanvas = document.getElementById('snapshotCanvas');
  const snapshotCtx = snapshotCanvas?.getContext('2d');
  const barcodeSound = document.getElementById('barcodeSound');

  let scannerActive = false;

  // Buffer to store consecutive detections for stability
  const detectionBuffer = [];
  const STABILITY_THRESHOLD = 3;

  // Camera constraints for back and front cameras
  const backCameraConstraints = {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: { ideal: 'environment' },
  };
  const frontCameraConstraints = {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: { ideal: 'user' },
  };

  // Start Quagga with the given constraints
  function startQuagga(constraints) {
    const quaggaConfig = {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.getElementById('interactive'),
        constraints,
      },
      decoder: {
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
        // Fallback to front camera if back camera fails
        if (constraints.facingMode.ideal === 'environment') {
          console.log('Falling back to front camera...');
          startQuagga(frontCameraConstraints);
        } else {
          alert('Error initializing barcode scanner. Please check permissions or try a different device.');
        }
        return;
      }
      window.Quagga.start();
      scannerActive = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      console.log('Scanner started with constraints:', constraints);
      window.Quagga.onDetected(onDetected);
    });
  }

  // Called when Quagga detects a barcode
  function onDetected(result) {
    const code = result.codeResult.code || '';

    detectionBuffer.push(code);
    if (detectionBuffer.length > STABILITY_THRESHOLD) {
      detectionBuffer.shift();
    }

    if (isStableCode()) {
      const stableCode = detectionBuffer[detectionBuffer.length - 1];
      barcodeEl.textContent = stableCode;
      captureCurrentFrame();
      // Play beep sound when a stable barcode is captured
      if (barcodeSound) {
        barcodeSound.play().catch((err) => {
          console.error('Error playing barcode sound:', err);
        });
      }
      // Clear the buffer to avoid repeated triggers
      detectionBuffer.length = 0;
    }
  }

  // Returns true if the last STABILITY_THRESHOLD detections match
  function isStableCode() {
    if (detectionBuffer.length < STABILITY_THRESHOLD) return false;
    const lastCode = detectionBuffer[detectionBuffer.length - 1];
    return detectionBuffer.every((c) => c === lastCode);
  }

  // Capture current frame from the video feed into snapshotCanvas
  function captureCurrentFrame() {
    const video = document.querySelector('#interactive video');
    if (video && snapshotCtx) {
      snapshotCtx.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
    }
  }

  // Event listeners for starting and stopping the scanner
  startBtn.addEventListener('click', () => {
    if (scannerActive) return;
    startQuagga(backCameraConstraints);
  });

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
