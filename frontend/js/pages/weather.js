// ============================================================
// Weather Page — GPS-first coordinate-based weather
// ============================================================

import { getWeatherByCoords, getForecastByCoords, getWeather, getForecast, getCurrentPosition, reverseGeocode } from '../api.js';
import { showToast } from '../voice.js';
import { t } from '../i18n.js';

const WX_ICONS = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '🌥️',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

export function renderWeather() {
  return `
    <div class="page-section">
      <div class="page-header">
        <h1>🌤️ Live Weather</h1>
        <p>GPS-based live weather with 5-day farming forecast and advisories.</p>
      </div>

      <!-- Input Area -->
      <div class="card" style="margin-bottom:var(--sp-xl);">
        <div style="display:flex;gap:var(--sp-md);flex-wrap:wrap;align-items:flex-end;">
          <div style="flex:1;min-width:200px;">
            <label style="display:block;font-size:0.83rem;font-weight:600;color:var(--c-text-secondary);margin-bottom:var(--sp-sm);">City Name</label>
            <input type="text" class="form-input" id="wx-city" placeholder="Hyderabad, Warangal, Vijayawada..." />
          </div>
          <button class="btn btn-secondary" id="wx-search-btn">🔍 Search</button>
          <button class="gps-btn" id="wx-gps-btn">📡 Use My GPS Location</button>
        </div>
      </div>

      <!-- Results -->
      <div id="weather-results">
        <div style="text-align:center;padding:var(--sp-3xl);color:var(--c-text-muted);">
          <div style="font-size:3rem;margin-bottom:var(--sp-md);">🌤️</div>
          <p>Use GPS or search a city to see live weather and 5-day farming forecast</p>
        </div>
      </div>
    </div>
  `;
}

export function initWeather() {
  document.getElementById('wx-gps-btn')?.addEventListener('click', fetchByGPS);
  document.getElementById('wx-search-btn')?.addEventListener('click', fetchByCity);
  document.getElementById('wx-city')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') fetchByCity();
  });
}

async function fetchByGPS() {
  const btn = document.getElementById('wx-gps-btn');
  btn.textContent = '📡 Locating...';
  btn.classList.add('loading');

  showLoading();
  try {
    const pos = await getCurrentPosition();
    const [weather, forecast, geo] = await Promise.all([
      getWeatherByCoords(pos.lat, pos.lon),
      getForecastByCoords(pos.lat, pos.lon),
      reverseGeocode(pos.lat, pos.lon),
    ]);

    if (weather.error) throw new Error(weather.error);
    if (forecast.error) throw new Error(forecast.error);

    const locationName = [geo.village, geo.district, geo.state].filter(Boolean).join(', ')
      || weather.city_name || `${pos.lat.toFixed(3)}, ${pos.lon.toFixed(3)}`;

    renderWeatherResults(weather, forecast, locationName, 'gps', pos);
    showToast(`✅ GPS weather loaded for ${locationName}`, 'success');
  } catch (err) {
    showError(err.message);
    showToast(err.message, 'error');
  } finally {
    btn.textContent = '📡 Use My GPS Location';
    btn.classList.remove('loading');
  }
}

async function fetchByCity() {
  const city = document.getElementById('wx-city')?.value.trim();
  if (!city) { showToast('Enter a city name', 'error'); return; }

  const btn = document.getElementById('wx-search-btn');
  btn.textContent = 'Loading...';
  btn.disabled = true;
  showLoading();

  try {
    const [weather, forecast] = await Promise.all([
      getWeather(city),
      getForecast(city),
    ]);

    if (weather.error) throw new Error(weather.error);
    if (forecast.error) throw new Error(forecast.error);

    renderWeatherResults(weather, forecast, weather.city_name || city, 'city');
  } catch (err) {
    showError(err.message);
    showToast(err.message, 'error');
  } finally {
    btn.textContent = '🔍 Search';
    btn.disabled = false;
  }
}

function showLoading() {
  document.getElementById('weather-results').innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <div class="loading-text">Fetching live weather data...</div>
    </div>
  `;
}

function showError(msg) {
  document.getElementById('weather-results').innerHTML = `
    <div class="card" style="text-align:center;border-color:rgba(239,68,68,0.3);">
      <p style="color:#f87171;">⚠️ ${msg}</p>
    </div>
  `;
}

function renderWeatherResults(weather, forecast, locationName, source, gpsPos = null) {
  const emojiIcon = WX_ICONS[weather.icon] || '🌡️';
  const forecastDays = forecast?.forecast || [];
  const advisory = forecast?.advisory || [];

  let html = '';

  // Hero card
  html += `
    <div class="weather-hero" style="margin-bottom:var(--sp-xl);position:relative;">
      ${source === 'gps' ? '<div class="dq-badge dq-live" style="margin-bottom:var(--sp-sm);">📡 GPS — Coordinates-based</div>' : '<div class="dq-badge dq-reference" style="margin-bottom:var(--sp-sm);">🏙️ City Search</div>'}
      <div class="weather-icon-big">${emojiIcon}</div>
      <div class="weather-temp-big">${weather.temperature}°C</div>
      <div style="font-family:var(--font-display);font-size:1.5rem;font-weight:700;color:var(--c-primary-light);margin-bottom:4px;">${locationName}</div>
      <div style="color:var(--c-text-secondary);font-size:1.05rem;">${weather.description}</div>
      ${source === 'gps' && gpsPos ? `<div style="font-size:0.75rem;color:var(--c-text-muted);margin-top:6px;">📍 ${gpsPos.lat.toFixed(5)}, ${gpsPos.lon.toFixed(5)} (±${Math.round(gpsPos.accuracy)}m)</div>` : ''}
    </div>
  `;

  // Stats grid
  html += `
    <div class="grid-4" style="margin-bottom:var(--sp-xl);">
      <div class="stat-card">
        <div class="stat-icon amber">💧</div>
        <div class="stat-label">Humidity</div>
        <div class="stat-value">${weather.humidity}%</div>
        <div class="stat-sub">${weather.humidity > 80 ? '⚠️ High disease risk' : weather.humidity < 30 ? '⚠️ Very dry' : '✅ Normal'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue">💨</div>
        <div class="stat-label">Wind Speed</div>
        <div class="stat-value">${weather.wind_speed}<span style="font-size:1rem;"> m/s</span></div>
        <div class="stat-sub">${weather.wind_speed > 10 ? '⚠️ Avoid spraying' : '✅ Good for spray'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">🌧️</div>
        <div class="stat-label">Rainfall</div>
        <div class="stat-value">${weather.rainfall}<span style="font-size:1rem;"> mm</span></div>
        <div class="stat-sub">Last hour</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">📊</div>
        <div class="stat-label">Pressure</div>
        <div class="stat-value">${weather.pressure}<span style="font-size:0.9rem;"> hPa</span></div>
        <div class="stat-sub">Temp: ${weather.temp_min}–${weather.temp_max}°C</div>
      </div>
    </div>
  `;

  // 5-day forecast
  if (forecastDays.length) {
    html += `
      <div class="card" style="margin-bottom:var(--sp-xl);">
        <h3 class="section-title"><span class="icon">📅</span> 5-Day Forecast</h3>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:var(--sp-sm);">
          ${forecastDays.map(day => `
            <div class="forecast-card">
              <div style="font-weight:700;font-size:0.85rem;color:var(--c-text);">${day.short_day}</div>
              <div style="font-size:0.72rem;color:var(--c-text-muted);margin-bottom:var(--sp-sm);">${day.date}</div>
              <div style="font-size:1.6rem;margin-bottom:4px;">${WX_ICONS[day.icon] || '🌤️'}</div>
              <div style="font-weight:700;">${day.temp_max}°</div>
              <div style="color:var(--c-text-muted);font-size:0.8rem;">${day.temp_min}°</div>
              ${day.rainfall_total > 0 ? `<div style="color:#60a5fa;font-size:0.75rem;margin-top:4px;">🌧️ ${day.rainfall_total}mm</div>` : ''}
              <div style="font-size:0.7rem;color:var(--c-text-muted);margin-top:4px;">${day.humidity_avg}%</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Farming advisory
  if (advisory.length) {
    const icons = { danger: '🔴', warning: '🟡', info: '🔵', tip: '✅' };
    html += `
      <div class="card">
        <h3 class="section-title"><span class="icon">🌾</span> Farming Advisory</h3>
        ${advisory.map(a => `
          <div class="alert-banner ${a.type}" style="margin-bottom:8px;">
            <span class="alert-icon">${icons[a.type] || '📢'}</span>
            <div class="alert-content">
              <div class="alert-title">${a.title}</div>
              <div class="alert-message">${a.message}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  document.getElementById('weather-results').innerHTML = html;
}
