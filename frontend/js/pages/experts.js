import { t } from '../i18n.js';

const expertsData = [
  {
    id: 1,
    name: 'Dr. Ramesh Kumar',
    specialty: 'Plant Pathology & Disease Control',
    phone: '+919876543210',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&h=300&q=80',
    available: 'Mon-Sat, 9 AM - 6 PM'
  },
  {
    id: 2,
    name: 'Dr. Sunita Reddy',
    specialty: 'Soil Health & Fertilizers',
    phone: '+919876543211',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80',
    available: 'Mon-Fri, 10 AM - 5 PM'
  },
  {
    id: 3,
    name: 'Dr. Vikram Singh',
    specialty: 'Agronomy & Crop Planning',
    phone: '+919876543212',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&h=300&q=80',
    available: 'Tue-Sun, 8 AM - 4 PM'
  },
  {
    id: 4,
    name: 'Kisan Helpline (Toll Free)',
    specialty: 'General Agriculture Queries',
    phone: '18001801551',
    image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=300&h=300&q=80',
    available: '24/7'
  }
];

export function renderExperts() {
  const expertCards = expertsData.map(expert => `
    <div class="card p-6 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left transition-transform hover:-translate-y-1">
      <img src="${expert.image}" alt="${expert.name}" class="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-800">${expert.name}</h3>
        <p class="text-emerald-600 font-medium mt-1">${t('expert_specialty')}${expert.specialty}</p>
        <p class="text-gray-500 text-sm mt-2 flex items-center justify-center md:justify-start gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          ${expert.available}
        </p>
        <div class="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
          <a href="tel:${expert.phone}" class="btn btn-primary flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            ${t('expert_call')}
          </a>
          <a href="https://wa.me/${expert.phone.replace('+', '')}" target="_blank" class="btn btn-secondary flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm transition-colors border-0">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            ${t('expert_whatsapp')}
          </a>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="page-container page-enter">
      <div class="page-header text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">${t('experts_title')}</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">${t('experts_desc')}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        ${expertCards}
      </div>
      
      <div class="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-200 max-w-5xl mx-auto flex flex-col md:flex-row gap-4 items-center">
        <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <h4 class="font-bold text-amber-800 mb-1">Disclaimer</h4>
          <p class="text-amber-700 text-sm">The experts listed above are available for consultation. Standard call and messaging rates may apply depending on your network provider. AgriConnect does not charge any consultation fees.</p>
        </div>
      </div>
    </div>
  `;
}

export function initExperts() {
  // Any specific initializations for experts page can go here
}
