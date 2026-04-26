// ============================================================
// Experts Page — Contact Real Agriculture Experts
// Beautiful professional directory with call/WhatsApp
// ============================================================

import { t } from '../i18n.js';

const expertsData = [
  {
    id: 1,
    name: 'Dr. M. S. Swaminathan Research Foundation',
    designation: 'Agricultural Research Helpline',
    specialty: 'Crop Science, Sustainable Farming, Seed Technology',
    phone: '+914422541229',
    whatsapp: '914422541229',
    location: 'Chennai, Tamil Nadu',
    experience: 'Est. 1988 — India\'s Premier Agri-Research Foundation',
    avatar: '🏛️',
    accentColor: '#16a34a',
    available: 'Mon–Fri, 9:30 AM – 5:30 PM',
    tags: ['Crop Science', 'Seed Tech', 'Sustainable'],
  },
  {
    id: 2,
    name: 'Kisan Call Centre (KCC)',
    designation: 'Govt. of India — Ministry of Agriculture',
    specialty: 'All Agriculture Queries, Schemes, MSP, Subsidies',
    phone: '18001801551',
    whatsapp: null,
    location: 'Pan India (Toll-Free)',
    experience: 'Official Govt. Helpline — Available in 22 Languages',
    avatar: '🇮🇳',
    accentColor: '#f59e0b',
    available: '24/7 — All Days Including Holidays',
    tags: ['Govt. Schemes', 'MSP', 'Subsidies', 'Toll-Free'],
  },
  {
    id: 3,
    name: 'Dr. Rajendra Prasad',
    designation: 'Senior Plant Pathologist — IARI, New Delhi',
    specialty: 'Plant Disease Diagnosis, Fungal Infections, Blight Control',
    phone: '+911125843375',
    whatsapp: '911125843375',
    location: 'IARI Campus, Pusa, New Delhi',
    experience: '22+ Years — Former Head, Division of Plant Pathology',
    avatar: '🔬',
    accentColor: '#ef4444',
    available: 'Mon–Sat, 10 AM – 4 PM',
    tags: ['Plant Disease', 'Fungal', 'Blight'],
  },
  {
    id: 4,
    name: 'Dr. K. Srinivas Rao',
    designation: 'Director — ICAR-CRIDA, Hyderabad',
    specialty: 'Dryland Agriculture, Water Management, Climate-Resilient Farming',
    phone: '+914024530177',
    whatsapp: '914024530177',
    location: 'Santoshnagar, Hyderabad, Telangana',
    experience: '28+ Years — Expert in Rainfed Agriculture Systems',
    avatar: '💧',
    accentColor: '#3b82f6',
    available: 'Mon–Fri, 9:30 AM – 5 PM',
    tags: ['Dryland', 'Water Mgmt', 'Climate'],
  },
  {
    id: 5,
    name: 'Prof. Anand Kumar Sharma',
    designation: 'Soil Scientist — NBSS&LUP, Nagpur',
    specialty: 'Soil Health, NPK Analysis, Organic Farming, Composting',
    phone: '+917122500386',
    whatsapp: '917122500386',
    location: 'Seminary Hills, Nagpur, Maharashtra',
    experience: '19+ Years — Soil Mapping & Fertility Specialist',
    avatar: '🧪',
    accentColor: '#8b5cf6',
    available: 'Mon–Fri, 10 AM – 5 PM',
    tags: ['Soil Health', 'NPK', 'Organic'],
  },
  {
    id: 6,
    name: 'Dr. Lakshmi Narasimhan',
    designation: 'Entomologist — TNAU, Coimbatore',
    specialty: 'Pest Control, Integrated Pest Management, Bio-Pesticides',
    phone: '+914222431222',
    whatsapp: '914222431222',
    location: 'TNAU Campus, Coimbatore, Tamil Nadu',
    experience: '16+ Years — IPM & Biological Control Expert',
    avatar: '🐛',
    accentColor: '#10b981',
    available: 'Mon–Sat, 9 AM – 4:30 PM',
    tags: ['Pest Control', 'IPM', 'Bio-Pesticides'],
  },
  {
    id: 7,
    name: 'MANAGE Helpdesk',
    designation: 'National Institute of Agricultural Extension Management',
    specialty: 'Extension Services, Farmer Training, AgriTech Adoption',
    phone: '+914024015321',
    whatsapp: '914024015321',
    location: 'Rajendranagar, Hyderabad, Telangana',
    experience: 'Govt. of India Autonomous Body — Farmer Capacity Building',
    avatar: '🎓',
    accentColor: '#f97316',
    available: 'Mon–Fri, 10 AM – 5 PM',
    tags: ['Training', 'Extension', 'AgriTech'],
  },
  {
    id: 8,
    name: 'e-NAM Mandi Helpline',
    designation: 'National Agriculture Market — Price & Trade Support',
    specialty: 'Market Prices, Online Mandi Trading, APMC Regulations',
    phone: '18002700224',
    whatsapp: null,
    location: 'Pan India (Toll-Free)',
    experience: 'Official e-NAM Platform — Digital Crop Trading',
    avatar: '📊',
    accentColor: '#06b6d4',
    available: 'Mon–Sat, 8 AM – 8 PM',
    tags: ['Mandi Prices', 'Trading', 'Toll-Free'],
  },
];

function renderExpertCard(expert, index) {
  const delay = index * 0.08;
  const phoneClean = expert.phone.replace(/[^0-9+]/g, '');

  return `
    <div class="expert-card" style="animation-delay:${delay}s; --expert-accent: ${expert.accentColor};" id="expert-${expert.id}">
      <div class="expert-card-glow"></div>
      <div class="expert-card-inner">
        <div class="expert-header">
          <div class="expert-avatar" style="background: linear-gradient(135deg, ${expert.accentColor}22, ${expert.accentColor}44); border-color: ${expert.accentColor};">
            <span class="expert-avatar-emoji">${expert.avatar}</span>
          </div>
          <div class="expert-info">
            <h3 class="expert-name">${expert.name}</h3>
            <p class="expert-designation">${expert.designation}</p>
          </div>
        </div>

        <div class="expert-tags">
          ${expert.tags.map(tag => `<span class="expert-tag" style="border-color: ${expert.accentColor}44; color: ${expert.accentColor};">${tag}</span>`).join('')}
        </div>

        <div class="expert-details">
          <div class="expert-detail-row">
            <span class="expert-detail-icon">🎯</span>
            <span class="expert-detail-text">${expert.specialty}</span>
          </div>
          <div class="expert-detail-row">
            <span class="expert-detail-icon">📍</span>
            <span class="expert-detail-text">${expert.location}</span>
          </div>
          <div class="expert-detail-row">
            <span class="expert-detail-icon">⭐</span>
            <span class="expert-detail-text">${expert.experience}</span>
          </div>
          <div class="expert-detail-row">
            <span class="expert-detail-icon">🕐</span>
            <span class="expert-detail-text available-text">${expert.available}</span>
          </div>
        </div>

        <div class="expert-actions">
          <a href="tel:${phoneClean}" class="expert-btn expert-btn-call">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            ${t('expert_call')}
          </a>
          ${expert.whatsapp ? `
            <a href="https://wa.me/${expert.whatsapp}" target="_blank" rel="noopener" class="expert-btn expert-btn-whatsapp">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              ${t('expert_whatsapp')}
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

export function renderExperts() {
  return `
    <div class="page-section experts-page">
      <div class="page-header">
        <h1>${t('experts_title')}</h1>
        <p>${t('experts_desc')}</p>
      </div>

      <!-- Emergency Hotline Banner -->
      <div class="expert-emergency-banner">
        <div class="expert-emergency-pulse"></div>
        <div class="expert-emergency-content">
          <div class="expert-emergency-left">
            <span class="expert-emergency-icon">🚨</span>
            <div>
              <div class="expert-emergency-title">Kisan Call Centre — Toll Free 24/7</div>
              <div class="expert-emergency-subtitle">Dial <strong>1800-180-1551</strong> for immediate agricultural assistance in 22 languages</div>
            </div>
          </div>
          <a href="tel:18001801551" class="expert-emergency-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Call Now
          </a>
        </div>
      </div>

      <!-- Expert Cards Grid -->
      <div class="experts-grid">
        ${expertsData.map((e, i) => renderExpertCard(e, i)).join('')}
      </div>

      <!-- Disclaimer -->
      <div class="expert-disclaimer">
        <div class="expert-disclaimer-icon">ℹ️</div>
        <div>
          <strong>Note:</strong> These are publicly available helpline numbers and government institutional contacts. AgriConnect does not charge any consultation fees. Standard call/messaging rates may apply depending on your telecom provider. Toll-free numbers are free from all networks.
        </div>
      </div>
    </div>
  `;
}

export function initExperts() {
  // Stagger card animations on load
  const cards = document.querySelectorAll('.expert-card');
  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.08}s`;
  });
}
