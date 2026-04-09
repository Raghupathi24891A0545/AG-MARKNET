// ============================================================
// Chatbot Page — AI farming assistant (English + Telugu)
// ============================================================

import { sendChatMessage, translateDynamicText } from '../api.js';
import { showToast } from '../voice.js';

let chatHistory = [];
let currentLang = 'en';

const BOT_GREETINGS = {
  en: "👋 Namaste! I'm your Agri-Connect AI assistant. Ask me anything about crops, fertilizers, irrigation, diseases, weather, or market prices. I can help in English and Telugu!",
  te: "👋 నమస్కారం! నేను మీ Agri-Connect AI సహాయకుడిని. పంటలు, ఎరువులు, నీటిపారుదల, వ్యాధులు, వాతావరణం, లేదా మార్కెట్ ధరల గురించి అడగండి!"
};

const QUICK_QUESTIONS = {
  en: [
    "What crop should I grow this Kharif?",
    "How much fertilizer for rice?",
    "When should I irrigate cotton?",
    "Signs of leaf blight?",
    "Best market for tomatoes?",
  ],
  te: [
    "ఈ ఖరీఫ్‌లో ఏ పంట వేయాలి?",
    "వరికి ఎంత ఎరువు వేయాలి?",
    "పత్తికి ఎప్పుడు నీళ్ళు పోయాలి?",
    "ఆకు తెగులు లక్షణాలు ఏమిటి?",
    "టమాటాలకు మంచి మార్కెట్?",
  ]
};

export function renderChatbot() {
  const greet = BOT_GREETINGS[currentLang];
  chatHistory = [{ role: 'bot', text: greet }];

  return `
    <div class="page-section">
      <div class="page-header">
        <h1>💬 Agri AI Assistant</h1>
        <p>Ask farming questions in English or Telugu. Get instant, accurate advice powered by agricultural knowledge.</p>
      </div>

      <div class="grid-2" style="align-items:start;gap:var(--sp-xl);">
        <!-- Chat Window -->
        <div class="card" style="padding:0;overflow:hidden;">
          <!-- Chat Header -->
          <div style="padding:var(--sp-lg);border-bottom:1px solid var(--c-border);display:flex;align-items:center;gap:var(--sp-md);">
            <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--c-primary),var(--c-primary-dark));display:flex;align-items:center;justify-content:center;font-size:1.3rem;box-shadow:0 0 20px var(--c-primary-glow);">🌱</div>
            <div>
              <div style="font-weight:700;font-family:var(--font-display);">Agri-Connect AI</div>
              <div style="font-size:0.75rem;color:var(--c-primary-light);">● Online · English & Telugu</div>
            </div>
            <div style="margin-left:auto;display:flex;gap:var(--sp-sm);">
              <button class="tab-btn ${currentLang === 'en' ? 'active' : ''}" id="lang-en-btn">EN</button>
              <button class="tab-btn ${currentLang === 'te' ? 'active' : ''}" id="lang-te-btn">తె</button>
            </div>
          </div>

          <!-- Messages -->
          <div class="chatbot-messages" id="chat-messages" style="height:380px;">
            <div class="chat-msg bot">${greet}</div>
          </div>

          <!-- Input Area -->
          <div class="chatbot-input-area">
            <input type="text" class="form-input" id="chat-input"
              placeholder="${currentLang === 'te' ? 'మీ ప్రశ్న అడగండి...' : 'Ask your farming question...'}"
              style="flex:1;" />
            <button class="btn btn-primary" id="chat-send-btn">➤</button>
          </div>
        </div>

        <!-- Quick Questions + Info -->
        <div>
          <div class="card" style="margin-bottom:var(--sp-lg);">
            <h3 class="section-title"><span class="icon">💡</span> Quick Questions</h3>
            <div style="display:flex;flex-direction:column;gap:var(--sp-sm);" id="quick-questions">
              ${(QUICK_QUESTIONS[currentLang] || QUICK_QUESTIONS.en).map(q => `
                <button class="btn btn-secondary" style="text-align:left;justify-content:flex-start;font-size:0.83rem;" data-question="${q}">
                  ${q}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="card">
            <h3 class="section-title"><span class="icon">🌐</span> I can help with</h3>
            <ul class="solution-list">
              <li>Crop recommendations for your season</li>
              <li>Fertilizer and nutrient advice</li>
              <li>Irrigation scheduling</li>
              <li>Disease symptoms and treatment</li>
              <li>Weather-based farming tips</li>
              <li>Market price guidance</li>
              <li>Soil health interpretation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initChatbot() {
  document.getElementById('chat-send-btn')?.addEventListener('click', sendMessage);
  document.getElementById('chat-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });

  // Language toggle
  document.getElementById('lang-en-btn')?.addEventListener('click', () => {
    currentLang = 'en';
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'chatbot' }));
  });

  document.getElementById('lang-te-btn')?.addEventListener('click', () => {
    currentLang = 'te';
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'chatbot' }));
  });

  // Quick questions
  document.querySelectorAll('[data-question]').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.question;
      const input = document.getElementById('chat-input');
      if (input) {
        input.value = q;
        sendMessage();
      }
    });
  });
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const msg = input?.value?.trim();
  if (!msg) return;

  input.value = '';
  appendMessage('user', msg);

  // Show typing indicator
  const typingId = appendTyping();

  try {
    const result = await sendChatMessage(msg, currentLang);
    removeTyping(typingId);
    
    // Dynamically translate the bot's raw English response to the selected language
    let responseText = result.reply || 'Sorry, I could not process that. Please try again.';
    if (currentLang !== 'en') {
      responseText = await translateDynamicText(responseText, currentLang);
    }
    
    appendMessage('bot', responseText);
  } catch (err) {
    removeTyping(typingId);
    let errMsg = `⚠️ Connection error: ${err.message}. Make sure the backend is running.`;
    if (currentLang !== 'en') {
      errMsg = await translateDynamicText(errMsg, currentLang);
    }
    appendMessage('bot', errMsg);
  }
}

function appendMessage(role, text) {
  const msgEl = document.createElement('div');
  msgEl.className = `chat-msg ${role}`;
  msgEl.textContent = text;

  const container = document.getElementById('chat-messages');
  if (container) {
    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;
  }

  chatHistory.push({ role, text });
}

function appendTyping() {
  const id = 'typing-' + Date.now();
  const el = document.createElement('div');
  el.className = 'chat-msg bot';
  el.id = id;
  el.innerHTML = '<span style="opacity:0.6;">⏳ Thinking...</span>';

  const container = document.getElementById('chat-messages');
  if (container) {
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }
  return id;
}

function removeTyping(id) {
  document.getElementById(id)?.remove();
}
