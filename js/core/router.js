/* ============================================
   TRAVVANA — Hash Router
   Simple hash-based routing with param extraction
   ============================================ */

import { eventBus, EVENTS } from './eventBus.js';

class Router {
  constructor() {
    this._routes = new Map();
    this._currentRoute = null;
    this._onHashChange = this._onHashChange.bind(this);
  }

  /**
   * Initialize the router — start listening to hash changes
   */
  init() {
    window.addEventListener('hashchange', this._onHashChange);
    // Fire initial route
    this._onHashChange();
  }

  /**
   * Register a route handler
   * @param {string} name - Route name (e.g. 'state', 'district', 'place')
   * @param {Function} handler - Callback receiving params object
   */
  register(name, handler) {
    this._routes.set(name, handler);
  }

  /**
   * Navigate to a hash
   * @param {Object} params - Key-value pairs for hash params
   */
  navigate(params) {
    const hash = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    window.location.hash = hash;
  }

  /**
   * Get current hash params
   * @returns {Object}
   */
  getParams() {
    return this._parseHash(window.location.hash);
  }

  /**
   * Get a specific param value
   * @param {string} key
   * @returns {string|null}
   */
  getParam(key) {
    const params = this.getParams();
    return params[key] || null;
  }

  /**
   * Parse hash string into params object
   * @private
   */
  _parseHash(hash) {
    const cleanHash = hash.replace(/^#\/?/, '');
    if (!cleanHash) return {};

    const params = {};
    cleanHash.split('&').forEach(pair => {
      const [key, value] = pair.split('=').map(decodeURIComponent);
      if (key) params[key] = value || '';
    });
    return params;
  }

  /**
   * Handle hash change
   * @private
   */
  _onHashChange() {
    const params = this.getParams();
    const prevRoute = this._currentRoute;

    // Determine which route handler to call based on params
    let routeName = 'default';
    if (params.place) routeName = 'place';
    else if (params.district) routeName = 'district';
    else if (params.state) routeName = 'state';
    else if (params.view) routeName = params.view;

    this._currentRoute = { name: routeName, params };

    // Call registered handler
    const handler = this._routes.get(routeName);
    if (handler) {
      handler(params);
    }

    // Emit route change event
    eventBus.emit(EVENTS.ROUTE_CHANGE, {
      route: routeName,
      params,
      previousRoute: prevRoute,
    });
  }

  /**
   * Destroy the router
   */
  destroy() {
    window.removeEventListener('hashchange', this._onHashChange);
    this._routes.clear();
  }
}

export const router = new Router();
