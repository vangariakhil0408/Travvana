/* ============================================
   TRAVVANA — App Entry Point
   Detects page, initializes core modules, boots controller
   ============================================ */

import { theme } from './theme.js';
import { renderNavbar } from './navbar.js';
import { stateRestoration } from './stateRestoration.js';
import { initLazyLoader, observeNewImages } from '../utils/lazyLoader.js';

// ── Global Error Handling (H-03) ──
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[App] Uncaught error:', { message, source, lineno, colno, error });
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('[App] Unhandled promise rejection:', event.reason);
});

/**
 * Initialize the application
 */
async function initApp() {
  // 1. Initialize theme
  theme.init();

  // 2. Detect current page
  const page = detectPage();

  // 3. Inject standard components
  renderNavbar(page);

  // 4. Set up common UI (theme toggle, navbar scrolling)
  setupCommonUI();

  // 5. Set up scroll restoration
  setupScrollRestoration();

  // 6. Boot the appropriate controller
  switch (page) {
    case 'home': {
      const { initDiscoveryController } = await import(`../modules/discovery/controllers/discoveryController.js?v=14`);
      await initDiscoveryController();
      break;
    }

    case 'discovery': {
      const { initExploreController } = await import(`../modules/discovery/controllers/exploreController.js?v=14`);
      await initExploreController();
      break;
    }

    case 'state': {
      const { initStateController } = await import(`../modules/discovery/controllers/stateController.js?v=14`);
      const stateSlug = getHashParam('state');
      if (stateSlug) await initStateController(stateSlug);
      break;
    }

    case 'destinations': {
      const { initDestinationsController } = await import(`../modules/discovery/controllers/destinationsController.js?v=14`);
      await initDestinationsController();
      break;
    }

    case 'place': {
      const { initPlaceController } = await import(`../modules/discovery/controllers/placeController.js?v=14`);
      const placeSlug = getHashParam('place');
      const placeState = getHashParam('state');
      if (placeSlug) await initPlaceController(placeSlug, placeState);
      break;
    }

    default:
      console.warn('[App] Unknown page:', page);
  }

  // 7. Initialize lazy image loader after content renders
  initLazyLoader();

  // 8. Auto-observe dynamically added lazy images via MutationObserver
  const contentEl = document.getElementById('app-content') || document.body;
  const mutObs = new MutationObserver(() => {
    observeNewImages(contentEl);
  });
  mutObs.observe(contentEl, { childList: true, subtree: true });
}

/**
 * Detect which page we're on based on filename
 */
function detectPage() {
  const path = window.location.pathname.toLowerCase();
  
  if (path.includes('discovery'))       return 'discovery';
  if (path.includes('state-detail'))    return 'state';
  if (path.includes('place-detail'))    return 'place';
  if (path.includes('destinations'))    return 'destinations';
  if (path.includes('planner'))         return 'planner';
  if (path.includes('bookings'))        return 'bookings';
  if (path.includes('travvanagram'))    return 'travvanagram';
  
  return 'home';
}

/**
 * Extract a hash parameter
 */
function getHashParam(key) {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const params = {};
  hash.split('&').forEach(pair => {
    const [k, v] = pair.split('=').map(decodeURIComponent);
    if (k) params[k] = v;
  });
  return params[key] || null;
}

/**
 * Set up common UI elements (auto-hide top bar on scroll)
 */
function setupCommonUI() {
  // Auto-hide top bar on scroll (rAF-throttled)
  let lastScroll = 0;
  let scrollTicking = false;
  const topBar = document.querySelector('.top-bar');
  if (topBar) {
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          if (currentScroll > 100 && currentScroll > lastScroll) {
            topBar.classList.add('top-bar--hidden');
          } else {
            topBar.classList.remove('top-bar--hidden');
          }
          lastScroll = currentScroll;
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }
}

/**
 * Global Scroll Restoration
 * Saves the scroll position before navigating away from the page.
 */
function setupScrollRestoration() {
  // Save state before navigating via clicking links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href) {
      // If the link points to a different page or place, save state
      if (!link.href.startsWith('javascript:')) {
        stateRestoration.saveScrollPosition();
      }
    }
  });

  // Save state when user uses browser back/forward buttons
  window.addEventListener('beforeunload', () => {
    stateRestoration.saveScrollPosition();
  });
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
