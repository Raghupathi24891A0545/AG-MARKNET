// ============================================================
// Chatbot Page — Gemini AI-Powered Farmer Assistant
// Works like ChatGPT: full conversation context, markdown,
// streaming-style typing, and comprehensive answers.
// ============================================================

import { sendChatMessage, translateDynamicText } from '../api.js';
import { showToast } from '../voice.js';

let chatHistory = [];
let currentLang = 'en';

const BOT_GREETINGS = {
  en: "🌾 **Namaste! I'm AgriConnect AI** — your intelligent farming companion.\n\nI can help you with:\n• 🌱 Crop recommendations & management\n• 💊 Disease diagnosis & treatment\n• 🧪 Fertilizer & soil advice\n• 💰 Market prices & government schemes\n• 🌤️ Weather-based farming tips\n• 📚 **Any question** — I work just like ChatGPT!\n\nAsk me anything in **English** or **Telugu**. I'm here to help! 🚀",
  te: "🌾 **నమస్కారం! నేను AgriConnect AI** — మీ తెలివైన వ్యవసాయ సహాయకుడిని.\n\nనేను మీకు సహాయం చేయగలను:\n• 🌱 పంట సిఫారసులు & నిర్వహణ\n• 💊 వ్యాధి నిర్ధారణ & చికిత్స\n• 🧪 ఎరువులు & నేల సలహా\n• 💰 మార్కెట్ ధరలు & ప్రభుత్వ పథకాలు\n• 🌤️ వాతావరణ ఆధారిత వ్యవసాయ చిట్కాలు\n• 📚 **ఏదైనా ప్రశ్న** — నేను ChatGPT లాగా పని చేస్తాను!\n\n**ఇంగ్లీష్** లేదా **తెలుగు**లో ఏదైనా అడగండి. నేను సహాయం చేయడానికి ఇక్కడ ఉన్నాను! 🚀"
};

const QUICK_QUESTIONS = {
  en: [
    "What crop should I grow this Kharif season?",
    "How to control fall armyworm in maize?",
    "PM Kisan Yojana eligibility & benefits",
    "Best fertilizer schedule for rice paddy",
    "How to increase milk production in dairy cows?",
    "What is the current MSP for wheat?",
    "Explain drip irrigation benefits and cost",
    "How to prepare soil for turmeric cultivation?",
  ],
  te: [
    "ఈ ఖరీఫ్ సీజన్‌లో ఏ పంట వేయాలి?",
    "మొక్కజొన్నలో సేనా పురుగు నియంత్రణ ఎలా?",
    "PM కిసాన్ యోజన అర్హత & ప్రయోజనాలు",
    "వరి పంటకు ఉత్తమ ఎరువు షెడ్యూల్",
    "పాడి ఆవులలో పాల ఉత్పత్తి ఎలా పెంచాలి?",
    "గోధుమ MSP ప్రస్తుతం ఎంత?",
    "డ్రిప్ ఇరిగేషన్ ప్రయోజనాలు & ఖర్చు",
    "పసుపు సాగుకు నేలను ఎలా సిద్ధం చేయాలి?",
  ]
};

/* ── Markdown → HTML (lightweight) ────────────────── */
function renderMarkdown(text) {
  if (!text) return '';
  let html = text
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="lang-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Headers
    .replace(/^### (.+)$/gm, '<h4 class="chat-h4">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="chat-h3">$1</h3>')
    .replace(/^# (.+)$/gm, '<h2 class="chat-h2">$1</h2>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="chat-hr">')
    // Numbered lists
    .replace(/^\d+\.\s(.+)$/gm, '<li class="chat-oli">$1</li>')
    // Bullet points (•, -, *)
    .replace(/^[•\-\*]\s(.+)$/gm, '<li class="chat-li">$1</li>')
    // Line breaks → paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/((?:<li class="chat-li">.*?<\/li>\s*(?:<br>)?)+)/g, '<ul class="chat-ul">$1</ul>');
  html = html.replace(/((?:<li class="chat-oli">.*?<\/li>\s*(?:<br>)?)+)/g, '<ol class="chat-ol">$1</ol>');
  // Clean up stray <br> inside lists
  html = html.replace(/<ul class="chat-ul">(\s*<br>)?/g, '<ul class="chat-ul">');
  html = html.replace(/<ol class="chat-ol">(\s*<br>)?/g, '<ol class="chat-ol">');
  html = html.replace(/<br>\s*<\/ul>/g, '</ul>');
  html = html.replace(/<br>\s*<\/ol>/g, '</ol>');

  return `<p>${html}</p>`.replace(/<p><\/p>/g, '');
}

/* ── Render ────────────────────────────────────────── */
export function renderChatbot() {
  const greet = BOT_GREETINGS[currentLang];
  chatHistory = [{ role: 'bot', text: greet }];

  return `
    <div class="page-section chatbot-page">
      <div class="chatbot-fullscreen">
        <!-- Header Bar -->
        <div class="chatbot-header">
          <div class="chatbot-header-left">
            <div class="chatbot-avatar">
              <div class="chatbot-avatar-inner">🌾</div>
              <span class="chatbot-status-dot"></span>
            </div>
            <div class="chatbot-header-info">
              <div class="chatbot-header-name">AgriConnect AI</div>
              <div class="chatbot-header-status">
                <span class="status-pulse"></span>
                Powered by Gemini · Always Online
              </div>
            </div>
          </div>
          <div class="chatbot-header-right">
            <button class="chatbot-lang-btn ${currentLang === 'en' ? 'active' : ''}" id="lang-en-btn">EN</button>
            <button class="chatbot-lang-btn ${currentLang === 'te' ? 'active' : ''}" id="lang-te-btn">తె</button>
            <button class="chatbot-action-btn" id="chat-clear-btn" title="Clear chat">🗑️</button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="chatbot-messages-area" id="chat-messages">
          <div class="chat-welcome-card">
            <div class="welcome-icon">🌾</div>
            <div class="welcome-title">AgriConnect AI</div>
            <div class="welcome-subtitle">Your intelligent farming companion — ask me anything!</div>
          </div>
          <div class="chat-bubble bot">
            <div class="chat-bubble-avatar">🌾</div>
            <div class="chat-bubble-content">
              <div class="chat-bubble-text">${renderMarkdown(greet)}</div>
              <div class="chat-bubble-time">${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
            </div>
          </div>
        </div>

        <!-- Quick Questions (floating) -->
        <div class="chatbot-quick-bar" id="quick-questions-bar">
          <div class="quick-scroll">
            ${(QUICK_QUESTIONS[currentLang] || QUICK_QUESTIONS.en).map(q => `
              <button class="quick-chip" data-question="${q}">${q}</button>
            `).join('')}
          </div>
        </div>

        <!-- Input Area -->
        <div class="chatbot-input-bar">
          <div class="chatbot-input-wrapper">
            <textarea
              id="chat-input"
              class="chatbot-textarea"
              placeholder="${currentLang === 'te' ? 'మీ ప్రశ్న అడగండి... (Shift+Enter కొత్త లైన్)' : 'Ask me anything... (Shift+Enter for new line)'}"
              rows="1"
            ></textarea>
            <button class="chatbot-send-btn" id="chat-send-btn" title="Send message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div class="chatbot-input-hint">
            AgriConnect AI can make mistakes. Verify important farming advice with local experts.
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ── Init ──────────────────────────────────────────── */
export function initChatbot() {
  const sendBtn = document.getElementById('chat-send-btn');
  const input = document.getElementById('chat-input');
  const clearBtn = document.getElementById('chat-clear-btn');

  sendBtn?.addEventListener('click', sendMessage);

  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  input?.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 150) + 'px';
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

  // Clear chat
  clearBtn?.addEventListener('click', () => {
    chatHistory = [];
    window.dispatchEvent(new CustomEvent('navigate', { detail: 'chatbot' }));
  });

  // Quick questions
  document.querySelectorAll('[data-question]').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.question;
      if (input) {
        input.value = q;
        sendMessage();
      }
    });
  });

  // Focus input
  setTimeout(() => input?.focus(), 300);
}

/* ── Send Message ─────────────────────────────────── */
async function sendMessage() {
  const input = document.getElementById('chat-input');
  const msg = input?.value?.trim();
  if (!msg) return;

  input.value = '';
  input.style.height = 'auto';

  // Hide quick questions after first message
  const quickBar = document.getElementById('quick-questions-bar');
  if (quickBar) quickBar.style.display = 'none';

  appendMessage('user', msg);

  // Show typing indicator
  const typingId = appendTyping();

  try {
    const result = await sendChatMessage(msg, currentLang);
    removeTyping(typingId);

    let responseText = result.reply || 'Sorry, I could not process that. Please try again.';

    // Translate if Telugu selected
    if (currentLang !== 'en') {
      try {
        responseText = await translateDynamicText(responseText, currentLang);
      } catch (e) {
        // If translation fails, show English
      }
    }

    appendMessage('bot', responseText);
  } catch (err) {
    removeTyping(typingId);
    console.error('API Error:', err);
    let errMsg = \`⚠️ **Connection Error**\n\n\${err.message}\n\nPlease check your internet connection and try again.\`;
    if (currentLang !== 'en') {
      try { errMsg = await translateDynamicText(errMsg, currentLang); } catch (e) {}
    }
    appendMessage('bot', errMsg);
}

/* ── Append Message to Chat ───────────────────────── */
function appendMessage(role, text) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (role === 'bot') {
    bubble.innerHTML = `
      <div class="chat-bubble-avatar">🌾</div>
      <div class="chat-bubble-content">
        <div class="chat-bubble-text">${renderMarkdown(text)}</div>
        <div class="chat-bubble-meta">
          <span class="chat-bubble-time">${time}</span>
          <button class="chat-copy-btn" title="Copy response">📋</button>
        </div>
      </div>
    `;
    // Copy button handler
    setTimeout(() => {
      const copyBtn = bubble.querySelector('.chat-copy-btn');
      copyBtn?.addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = '✅';
          setTimeout(() => { copyBtn.textContent = '📋'; }, 1500);
        });
      });
    }, 50);
  } else {
    bubble.innerHTML = `
      <div class="chat-bubble-content">
        <div class="chat-bubble-text">${escapeHtml(text)}</div>
        <div class="chat-bubble-time">${time}</div>
      </div>
      <div class="chat-bubble-avatar user-avatar">👤</div>
    `;
  }

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  chatHistory.push({ role, text });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ── Typing Indicator ─────────────────────────────── */
function appendTyping() {
  const id = 'typing-' + Date.now();
  const container = document.getElementById('chat-messages');
  if (!container) return id;

  const el = document.createElement('div');
  el.className = 'chat-bubble bot';
  el.id = id;
  el.innerHTML = `
    <div class="chat-bubble-avatar">🌾</div>
    <div class="chat-bubble-content">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;

  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeTyping(id) {
  document.getElementById(id)?.remove();
}
