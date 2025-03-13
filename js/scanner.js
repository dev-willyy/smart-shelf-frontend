export function initScanner() {
  const startBtn = document.getElementById('startScannerBtn');
  const stopBtn = document.getElementById('stopScannerBtn');
  const barcodeEl = document.getElementById('detectedBarcode');

  let scannerActive = false;

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

  // Start Quagga with given constraints
  function startQuagga(constraints) {
    const quaggaConfig = {
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.getElementById('interactive'),
        constraints,
      },
      decoder: {
        // Expand the readers to include UPC, EAN, and Code128
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

        if (constraints.facingMode.ideal === 'environment') {
          console.log('Falling back to front camera...');
          startQuagga(frontCameraConstraints);
        } else {
          alert('Error initializing barcode scanner. Check camera permissions or try a different device.');
        }
        return;
      }

      window.Quagga.start();
      scannerActive = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      console.log('Scanner started with constraints:', constraints);

      // Log detection attempts to help debug
      window.Quagga.onProcessed((result) => {
        if (result) {
          console.log('onProcessed result:', result);
        }
      });

      window.Quagga.onDetected(onDetected);
    });
  }

  function onDetected(result) {
    const code = result.codeResult.code;
    console.log('Detected code:', code);
    barcodeEl.textContent = code;
  }

  // Start scanning
  startBtn.addEventListener('click', () => {
    if (scannerActive) return;
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
