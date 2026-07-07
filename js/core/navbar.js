/**
 * Dynamically injects the global navigation bar into the #app-header container
 */

export function renderNavbar(currentPage) {
  const container = document.getElementById('app-header');
  if (!container) return; // In case some page doesn't have it

  // Determine active states
  const isDiscovery = currentPage === 'home' || currentPage === 'discovery' || currentPage === 'state' || currentPage === 'district' || currentPage === 'place';
  const isPlanner = currentPage === 'planner';
  const isBookings = currentPage === 'bookings';
  const isTravanaGram = currentPage === 'travvanagram';

  container.innerHTML = `
    <header class="top-bar" id="top-bar">
      <a class="top-bar__logo" href="index.html">
        <img class="top-bar__logo-img" src="assets/images/logo.png" alt="Travvana" width="36" height="36">
        <span class="top-bar__logo-text">TRAVVANA</span>
      </a>
      <div class="top-bar__right">
        <nav class="top-bar__nav" id="top-nav">
          <a class="top-bar__nav-link ${isDiscovery ? 'top-bar__nav-link--active' : ''}" href="index.html">Discovery</a>
          <a class="top-bar__nav-link ${isPlanner ? 'top-bar__nav-link--active' : ''}" href="planner.html">AI Planner</a>
          <a class="top-bar__nav-link ${isBookings ? 'top-bar__nav-link--active' : ''}" href="bookings.html">Bookings</a>
          <a class="top-bar__nav-link ${isTravanaGram ? 'top-bar__nav-link--active' : ''}" href="travvanagram.html">Travvanagram</a>
        </nav>
        
        <button class="theme-toggle-btn" id="theme-toggle-btn" aria-label="Toggle Theme">
          <span class="theme-icon-sun">☀️</span>
          <span class="theme-icon-moon">🌙</span>
        </button>
      </div>
    </header>

    <nav class="bottom-nav" id="bottom-nav">
      <a class="bottom-nav__item ${isDiscovery ? 'bottom-nav__item--active' : ''}" href="index.html">
        <span class="bottom-nav__icon">🏠</span>
        <span class="bottom-nav__label">Discovery</span>
      </a>
      <a class="bottom-nav__item ${isPlanner ? 'bottom-nav__item--active' : ''}" href="planner.html">
        <span class="bottom-nav__icon">✨</span>
        <span class="bottom-nav__label">AI Planner</span>
      </a>
      <a class="bottom-nav__item ${isBookings ? 'bottom-nav__item--active' : ''}" href="bookings.html">
        <span class="bottom-nav__icon">🎫</span>
        <span class="bottom-nav__label">Bookings</span>
      </a>
      <a class="bottom-nav__item ${isTravanaGram ? 'bottom-nav__item--active' : ''}" href="travvanagram.html">
        <span class="bottom-nav__icon">📸</span>
        <span class="bottom-nav__label">Travvanagram</span>
      </a>
    </nav>
  `;
}
