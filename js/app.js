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

/**
 * Displays the loader overlay.
 */
export function showLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.remove('hidden');
  }
}

/**
 * Hides the loader overlay.
 */
export function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hidden');
  }
}
