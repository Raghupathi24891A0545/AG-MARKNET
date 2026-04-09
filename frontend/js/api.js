// ============================================================
// Agri-Connect — Production API Client
// GPS-first coordinate-based calls to production Flask backend
// ============================================================

const API_BASE = 'http://127.0.0.1:5000';
const DISEASE_API_BASE = 'http://127.0.0.1:5001';

// Retry-aware fetch with timeout
async function apiFetch(endpoint, options = {}, retries = 2) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        ...options,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (!res.ok && data.error) throw new Error(data.error);
      return data;
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Request timed out. Check your internet connection.');
      }
      if (attempt === retries) {
        if (err.message === 'Failed to fetch') {
          throw new Error('Cannot connect to Agri-Connect server. Make sure the Flask backend is running on port 5000.');
        }
        throw err;
      }
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
}

// ---- GPS & Geocoding ----
export async function reverseGeocode(lat, lon) {
  return apiFetch(`/api/geocode/reverse?lat=${lat}&lon=${lon}`);
}

// ---- Weather (coordinate-first) ----
export async function getWeatherByCoords(lat, lon) {
  return apiFetch(`/api/weather/coords?lat=${lat}&lon=${lon}`);
}

export async function getForecastByCoords(lat, lon) {
  return apiFetch(`/api/forecast/coords?lat=${lat}&lon=${lon}`);
}

export async function getWeather(city) {
  return apiFetch(`/api/weather?city=${encodeURIComponent(city)}`);
}

export async function getForecast(city) {
  return apiFetch(`/api/forecast?city=${encodeURIComponent(city)}`);
}

// ---- Soil (real SoilGrids data) ----
export async function getSoilByCoords(lat, lon) {
  return apiFetch(`/api/soil/coords?lat=${lat}&lon=${lon}`);
}

// ---- Full Farm Analysis (primary endpoint) ----
export async function analyzeFarm(payload) {
  return apiFetch('/api/farm/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ---- Legacy ML endpoints ----
export async function predictCrop(data) {
  return apiFetch('/api/predict/crop', { method: 'POST', body: JSON.stringify(data) });
}

export async function predictFertilizer(data) {
  return apiFetch('/api/predict/fertilizer', { method: 'POST', body: JSON.stringify(data) });
}

export async function getSoilAnalysis(data) {
  return apiFetch('/api/soil-analysis', { method: 'POST', body: JSON.stringify(data) });
}

// ---- Market Prices ----
export async function getMarketPrices(data) {
  return apiFetch('/api/market-prices', { method: 'POST', body: JSON.stringify(data) });
}

// ---- News ----
export async function getNews() {
  return apiFetch('/api/news');
}

// ---- Alerts ----
export async function getAlerts(lat, lon, crop = 'rice', season = 'Kharif') {
  return apiFetch(`/api/alerts?lat=${lat}&lon=${lon}&crop=${crop}&season=${season}`);
}

// ---- Chatbot ----
export async function sendChatMessage(message, language = 'en') {
  return apiFetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, language }),
  });
}

// ---- Disease Detection ----
export async function predictDisease(file, language = 'en') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);

  try {
    const res = await fetch(`${DISEASE_API_BASE}/api/predict`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok && data.error) throw new Error(data.error);
    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error('Disease detection server not running. Start the image_detection server on port 5001.');
    }
    throw err;
  }
}

// ---- GPS Helper ----
export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      err => {
        const msgs = {
          1: 'Location permission denied. Please allow location access.',
          2: 'Location unavailable. Check GPS signal.',
          3: 'Location request timed out.',
        };
        reject(new Error(msgs[err.code] || 'Unknown location error'));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  });
}

// ---- Google Translate Helper ----
export const GOOGLE_TRANSLATE_API_KEY = 'AIzaSyAd1ldhGQS426uaWMwJc4AKltg62oGqiyM';
const translationCache = new Map();

export async function translateDynamicText(text, targetLang) {
  if (!text) return text;
  if (targetLang === 'en' || !targetLang) return text;
  
  const cacheKey = `${text}_${targetLang}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, target: targetLang })
    });
    
    // Fallback if API fails
    if (!res.ok) return text;
    
    const data = await res.json();
    const translated = data.data.translations[0].translatedText;
    
    // Cache it to avoid repeated identical API calls
    translationCache.set(cacheKey, translated);
    return translated;
  } catch (err) {
    console.warn("Translation failed:", err);
    return text;
  }
}
