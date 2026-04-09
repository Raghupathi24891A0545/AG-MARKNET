// ============================================================
// Agri-Connect v3.0 — Main Application Router
// ============================================================

import '../css/style.css';
import { renderNavbar } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { renderHome } from './pages/home.js';
import { renderWeather, initWeather } from './pages/weather.js';
import { renderMarket, initMarket } from './pages/market.js';
import { renderAnalysis, initAnalysis } from './pages/analysis.js';
import { renderCropDoctor, initCropDoctor } from './pages/cropDoctor.js';
import { renderChatbot, initChatbot } from './pages/chatbot.js';
import { renderAlerts, initAlerts } from './pages/alerts.js';
import { initVoice } from './voice.js';
import { onLangChange } from './i18n.js';

// ============================================================
// ROUTES
// ============================================================
const routes = {
  home:      { render: renderHome,      init: null,         label: 'Home',     icon: '🏠' },
  analysis:  { render: renderAnalysis,  init: initAnalysis, label: 'Analyzer', icon: '🌱' },
  weather:   { render: renderWeather,   init: initWeather,  label: 'Weather',  icon: '🌤️' },
  market:    { render: renderMarket,    init: initMarket,   label: 'Market',   icon: '📊' },
  cropDoctor:{ render: renderCropDoctor,init: initCropDoctor,label: 'Crop Doctor',icon: '🔬' },
  chatbot:   { render: renderChatbot,   init: initChatbot,  label: 'Chatbot',  icon: '💬' },
  alerts:    { render: renderAlerts,    init: initAlerts,   label: 'Alerts',   icon: '🚨' },
};

let currentPage = 'home';

// ============================================================
// NAVIGATE
// ============================================================
function navigateTo(page) {
  const route = routes[page];
  if (!route) return;

  currentPage = page;
  renderNavbar(page, routes);

  const app = document.getElementById('app');
  app.innerHTML = route.render();

  if (route.init) route.init();

  // Attach navigation listeners in page content
  app.querySelectorAll('[data-navigate]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(el.dataset.navigate);
    });
  });

  // Voice FAB only on analysis pages
  const fab = document.getElementById('voice-fab');
  if (fab) {
    fab.classList.toggle('hidden', page === 'home');
  }

  // Re-render footer to update language
  renderFooter();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// INIT
// ============================================================
function init() {
  renderFooter();
  initVoice();

  window.addEventListener('navigate', e => navigateTo(e.detail));

  onLangChange(() => navigateTo(currentPage));

  // Handle URL hash for deep-linking
  const hash = window.location.hash.replace('#', '');
  navigateTo(routes[hash] ? hash : 'home');

  window.addEventListener('hashchange', () => {
    const h = window.location.hash.replace('#', '');
    if (routes[h]) navigateTo(h);
  });
}

document.addEventListener('DOMContentLoaded', init);
