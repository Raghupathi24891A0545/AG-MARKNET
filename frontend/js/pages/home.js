// ============================================================
// Home Page — Clean landing, no technical info shown
// ============================================================

import { t } from '../i18n.js';

export function renderHome() {
  return `
    <div class="hero-section">
      <div class="hero-badge">${t('hero_badge')}</div>

      <h1 class="hero-title">
        ${t('hero_title_1')}<br>
        <span class="green">${t('hero_title_2')}</span><br>
        ${t('hero_title_3')}
      </h1>

      <p class="hero-subtitle">
        ${t('hero_subtitle')}
      </p>

      <div class="hero-ctas">
        <button class="btn btn-accent btn-lg" data-navigate="analysis" id="hero-start-btn">
          ${t('hero_cta_analyze')}
        </button>
        <button class="btn btn-secondary btn-lg" data-navigate="weather">
          ${t('hero_cta_weather')}
        </button>
        <button class="btn btn-secondary btn-lg" data-navigate="cropDoctor">
          ${t('hero_cta_doctor')}
        </button>
      </div>

      <div class="feature-grid" style="max-width:1100px;margin-top:var(--sp-3xl);">
        <div class="feature-card" data-navigate="analysis">
          <span class="feature-card-icon">🌱</span>
          <div class="feature-card-title">${t('feature_crop_rec')}</div>
          <div class="feature-card-desc">${t('feature_crop_rec_desc')}</div>
        </div>
        <div class="feature-card" data-navigate="analysis">
          <span class="feature-card-icon">🌐</span>
          <div class="feature-card-title">${t('feature_soil')}</div>
          <div class="feature-card-desc">${t('feature_soil_desc')}</div>
        </div>
        <div class="feature-card" data-navigate="weather">
          <span class="feature-card-icon">🌩️</span>
          <div class="feature-card-title">${t('feature_weather')}</div>
          <div class="feature-card-desc">${t('feature_weather_desc')}</div>
        </div>
        <div class="feature-card" data-navigate="analysis">
          <span class="feature-card-icon">🧬</span>
          <div class="feature-card-title">${t('feature_fert')}</div>
          <div class="feature-card-desc">${t('feature_fert_desc')}</div>
        </div>
        <div class="feature-card" data-navigate="cropDoctor">
          <span class="feature-card-icon">🔬</span>
          <div class="feature-card-title">${t('feature_doctor')}</div>
          <div class="feature-card-desc">${t('feature_doctor_desc')}</div>
        </div>
        <div class="feature-card" data-navigate="market">
          <span class="feature-card-icon">📊</span>
          <div class="feature-card-title">${t('feature_market')}</div>
          <div class="feature-card-desc">${t('feature_market_desc')}</div>
        </div>
        <div class="feature-card" data-navigate="chatbot">
          <span class="feature-card-icon">💬</span>
          <div class="feature-card-title">${t('feature_chatbot')}</div>
          <div class="feature-card-desc">${t('feature_chatbot_desc')}</div>
        </div>
        <div class="feature-card" data-navigate="alerts">
          <span class="feature-card-icon">🚨</span>
          <div class="feature-card-title">${t('feature_alerts')}</div>
          <div class="feature-card-desc">${t('feature_alerts_desc')}</div>
        </div>
      </div>
    </div>
  `;
}
