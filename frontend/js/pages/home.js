// ============================================================
// Home Page — Heroic Entry Animation + Clean Landing
// ============================================================

import { t } from '../i18n.js';

let hasPlayedIntro = false;

export function renderHome() {
  return `
    <!-- Floating Flower Petals Background -->
    <div class="flower-petals-container" id="flower-petals"></div>

    <!-- Grand Intro Overlay (plays once) -->
    ${!hasPlayedIntro ? `
    <div class="grand-intro-overlay" id="grand-intro">
      <div class="intro-particles" id="intro-particles"></div>
      <div class="intro-content">
        <div class="intro-icon-burst" id="intro-icon">🌾</div>
        <div class="intro-title-container">
          <span class="intro-letter" style="--i:0">A</span>
          <span class="intro-letter" style="--i:1">g</span>
          <span class="intro-letter" style="--i:2">r</span>
          <span class="intro-letter" style="--i:3">i</span>
          <span class="intro-letter intro-green" style="--i:4">C</span>
          <span class="intro-letter intro-green" style="--i:5">o</span>
          <span class="intro-letter intro-green" style="--i:6">n</span>
          <span class="intro-letter intro-green" style="--i:7">n</span>
          <span class="intro-letter intro-green" style="--i:8">e</span>
          <span class="intro-letter intro-green" style="--i:9">c</span>
          <span class="intro-letter intro-green" style="--i:10">t</span>
        </div>
        <div class="intro-tagline" id="intro-tagline">Smart Farming for Every Farmer 🌱</div>
      </div>
    </div>
    ` : ''}

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
        <div class="feature-card" data-navigate="experts">
          <span class="feature-card-icon">👨‍🌾</span>
          <div class="feature-card-title">Expert Connect</div>
          <div class="feature-card-desc">Talk to certified agronomists and plant pathologists directly via call or WhatsApp.</div>
        </div>
      </div>
    </div>
  `;
}

export function initHome() {
  // Spawn floating flower petals
  spawnFlowerPetals();

  // Grand intro animation (plays only once per session)
  if (!hasPlayedIntro) {
    hasPlayedIntro = true;
    const overlay = document.getElementById('grand-intro');
    if (overlay) {
      // Spawn intro sparkles
      spawnIntroParticles();

      // Auto-dismiss intro after animation completes
      setTimeout(() => {
        overlay.classList.add('intro-exit');
        setTimeout(() => {
          overlay.remove();
        }, 800);
      }, 3200);

      // Allow click to skip
      overlay.addEventListener('click', () => {
        overlay.classList.add('intro-exit');
        setTimeout(() => overlay.remove(), 600);
      });
    }
  }
}

function spawnFlowerPetals() {
  const container = document.getElementById('flower-petals');
  if (!container) return;

  const petals = ['🌸', '🌺', '🌻', '🌼', '🌷', '🍃', '🌿', '☘️', '🍂', '🌾'];
  const count = 25;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'floating-petal';
    petal.textContent = petals[Math.floor(Math.random() * petals.length)];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${12 + Math.random() * 18}s`;
    petal.style.animationDelay = `${Math.random() * 15}s`;
    petal.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
    petal.style.opacity = `${0.15 + Math.random() * 0.25}`;
    container.appendChild(petal);
  }
}

function spawnIntroParticles() {
  const container = document.getElementById('intro-particles');
  if (!container) return;

  const sparkles = ['✨', '⭐', '🌟', '💫', '🌾', '🌿'];
  for (let i = 0; i < 30; i++) {
    const spark = document.createElement('div');
    spark.className = 'intro-spark';
    spark.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    spark.style.left = `${Math.random() * 100}%`;
    spark.style.top = `${Math.random() * 100}%`;
    spark.style.animationDuration = `${1 + Math.random() * 2}s`;
    spark.style.animationDelay = `${Math.random() * 2}s`;
    spark.style.fontSize = `${0.6 + Math.random() * 1.4}rem`;
    container.appendChild(spark);
  }
}
