import { initScanner } from './scanner.js';
import { bindModalEvents } from './modal.js';
import { setupApiHandlers } from './api.js';

// Run on both pages
document.addEventListener('DOMContentLoaded', () => {
  bindModalEvents();
  setupApiHandlers();

  // If the page contains the scanner viewport, initialize it
  if (document.getElementById('interactive')) {
    initScanner();
  }
});
