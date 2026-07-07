/* ============================================
   TRAVVANA — Smart Image Lazy Loader
   Uses IntersectionObserver for performant lazy loading
   with blur-up placeholder effect.
   ============================================ */

/**
 * Initialize the smart lazy loader.
 * Call this once after DOM is ready or after dynamic content is inserted.
 * Images must use: data-src="..." instead of src="..." and have class "lazy-img"
 */
export function initLazyLoader() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    document.querySelectorAll('img.lazy-img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.remove('lazy-img');
    });
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      const src = img.dataset.src;
      if (!src) return;

      // Start loading
      img.src = src;
      img.removeAttribute('data-src');

      img.addEventListener('load', () => {
        img.classList.add('lazy-img--loaded');
        img.classList.remove('lazy-img');
      }, { once: true });

      img.addEventListener('error', () => {
        img.classList.add('lazy-img--error');
        img.classList.remove('lazy-img');
      }, { once: true });

      obs.unobserve(img);
    });
  }, {
    rootMargin: '200px 0px',   // Start loading 200px before entering viewport
    threshold: 0.01
  });

  document.querySelectorAll('img.lazy-img[data-src]').forEach(img => {
    observer.observe(img);
  });

  // Store observer for re-use
  window.__travvanaLazyObserver = observer;
}

/**
 * Observe newly added lazy images (for dynamically inserted content).
 */
export function observeNewImages(container) {
  if (!window.__travvanaLazyObserver) {
    initLazyLoader();
    return;
  }
  const imgs = (container || document).querySelectorAll('img.lazy-img[data-src]');
  imgs.forEach(img => window.__travvanaLazyObserver.observe(img));
}

/**
 * Generate an optimized <img> tag with lazy loading.
 * Uses data-src for deferred loading + blur placeholder.
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text
 * @param {string} [className] - CSS class for the img
 * @param {string} [onError] - onerror handler string
 * @returns {string} HTML string
 */
export function lazyImage(src, alt, className = 'card__image', onError = '') {
  if (!src) return '';
  
  const errorAttr = onError ? ` onerror="${onError}"` : '';
  
  return `<img class="${className} lazy-img" 
    data-src="${src}" 
    alt="${alt}" 
    loading="lazy"
    decoding="async"${errorAttr}>`;
}
