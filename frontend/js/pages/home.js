// ============================================================
// Home Page — Heroic Entry Animation + Clean Landing
// ============================================================

import { t } from '../i18n.js';

let hasPlayedIntro = false;

export function renderHome() {
  return `
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
      <div class="hero-badge hero-anim" style="--anim-order:0">${t('hero_badge')}</div>

      <h1 class="hero-title">
        <span class="hero-word-line">
          <span class="hero-word" style="--word-i:0">${t('hero_title_1').split(' ')[0] || 'Smart'}</span>
          <span class="hero-word" style="--word-i:1">${t('hero_title_1').split(' ')[1] || 'Farming'}</span>
        </span>
        <span class="hero-word-line">
          <span class="hero-word green" style="--word-i:2">${t('hero_title_2').split(' ')[0] || 'Made'}</span>
          <span class="hero-word green" style="--word-i:3">${t('hero_title_2').split(' ')[1] || 'Simple'}</span>
        </span>
        <span class="hero-word-line">
          <span class="hero-word" style="--word-i:4">${t('hero_title_3').split(' ')[0] || 'For'}</span>
          <span class="hero-word" style="--word-i:5">${t('hero_title_3').split(' ')[1] || 'Every'}</span>
          <span class="hero-word" style="--word-i:6">${t('hero_title_3').split(' ')[2] || 'Farmer'}</span>
        </span>
      </h1>

      <p class="hero-subtitle hero-anim" style="--anim-order:7">
        ${t('hero_subtitle')}
      </p>

      <div class="hero-ctas hero-anim" style="--anim-order:8">
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

      <div class="feature-grid hero-anim" style="max-width:1100px;margin-top:var(--sp-3xl);--anim-order:9">
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
  const isFirstVisit = !hasPlayedIntro;
  const introDelay = isFirstVisit ? 3400 : 0;

  // Grand intro animation (plays only once per session)
  if (!hasPlayedIntro) {
    hasPlayedIntro = true;
    const overlay = document.getElementById('grand-intro');
    if (overlay) {
      spawnIntroParticles();

      // Auto-dismiss intro after animation completes
      setTimeout(() => {
        overlay.classList.add('intro-exit');
        setTimeout(() => overlay.remove(), 800);
      }, 3200);

      // Allow click to skip
      overlay.addEventListener('click', () => {
        overlay.classList.add('intro-exit');
        setTimeout(() => overlay.remove(), 600);
        // Trigger hero words immediately on skip
        triggerHeroWords(200);
      });
    }
  }

  // Trigger the heroic word-by-word title animation after intro
  triggerHeroWords(introDelay);
}

function triggerHeroWords(baseDelay) {
  // Animate each hero word with staggered dramatic entry
  const words = document.querySelectorAll('.hero-word');
  words.forEach((word, i) => {
    word.style.animationDelay = `${baseDelay + i * 120}ms`;
    word.classList.add('hero-word-animate');
  });

  // Animate other hero elements
  const heroAnims = document.querySelectorAll('.hero-anim');
  heroAnims.forEach((el) => {
    const order = parseInt(el.style.getPropertyValue('--anim-order') || '0');
    el.style.animationDelay = `${baseDelay + 600 + order * 100}ms`;
    el.classList.add('hero-anim-active');
  });
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
