// ============================================
// Crop Doctor Page — AI Disease Detection
// ============================================

import { predictDisease } from '../api.js';
import { getLang } from '../i18n.js';
import { showToast } from '../voice.js';

export function renderCropDoctor() {
    return `
    <div class="page-section">
      <div class="page-header">
        <h1>🔬 Crop Doctor</h1>
        <p>Upload a leaf photo for AI disease detection. Works for potato and other crops. (Telugu + English)</p>
      </div>

      <div class="card crop-doctor-card">
        <div class="upload-zone" id="upload-zone">
          <div class="upload-icon">📸</div>
          <div class="upload-text">📸 Click or drag a leaf photo here</div>
          <div class="upload-hint">JPG, PNG — max 10MB · Camera supported on mobile</div>
          <input type="file" id="leaf-input" accept="image/*" capture="environment" />
        </div>

        <img id="leaf-preview" class="leaf-preview" style="display:none;" />

        <div class="crop-doctor-actions" id="cd-actions" style="display:none;">
          <button class="btn btn-accent btn-lg" id="cd-analyze-btn">🔬 Analyze Disease</button>
        </div>

        <div class="loader-section" id="cd-loader" style="display:none;">
          <div class="loading-spinner">
            <div class="spinner"></div>
            <div class="loading-text">🔬 Analyzing leaf for disease...</div>
          </div>
        </div>

        <div id="cd-result" style="display:none;">
          <div class="cd-result-card" id="cd-result-card"></div>
        </div>
      </div>
    </div>
  `;
}

export function initCropDoctor() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('leaf-input');
    const preview = document.getElementById('leaf-preview');
    const actions = document.getElementById('cd-actions');
    const analyzeBtn = document.getElementById('cd-analyze-btn');
    const loader = document.getElementById('cd-loader');
    const resultDiv = document.getElementById('cd-result');

    // Click to upload
    uploadZone?.addEventListener('click', () => fileInput?.click());

    // Drag & drop
    uploadZone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });
    uploadZone?.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });
    uploadZone?.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        const files = e.dataTransfer?.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    });

    // File input change
    fileInput?.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (file) handleFileSelect(file);
    });

    function handleFileSelect(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
            uploadZone.style.display = 'none';
            actions.style.display = 'flex';
            resultDiv.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }

    // Analyze button
    analyzeBtn?.addEventListener('click', async () => {
        const file = fileInput?.files?.[0];
        if (!file) {
            showToast('No image selected', 'error');
            return;
        }

        actions.style.display = 'none';
        loader.style.display = 'block';
        resultDiv.style.display = 'none';

        try {
            const data = await predictDisease(file, getLang());
            loader.style.display = 'none';
            resultDiv.style.display = 'block';
            renderResult(data);
        } catch (err) {
            loader.style.display = 'none';
            actions.style.display = 'flex';
            showToast(`Error: ${err.message}`, 'error');
        }
    });

    function renderResult(data) {
        const card = document.getElementById('cd-result-card');
        if (!card || !data) return;

        const isHealthy = data.is_healthy;
        const diag = data.diagnosis;
        const scores = data.all_scores || [];

        let html = `
      <div class="cd-diagnosis ${isHealthy ? 'healthy' : 'diseased'}">
        <div class="cd-diagnosis-icon">${isHealthy ? '✅' : '⚠️'}</div>
        <div class="cd-diagnosis-name">${diag.name}</div>
      </div>

      <div class="cd-details">
        <div class="cd-detail-row">
          <span class="cd-detail-label">💊 Medicine / Treatment</span>
          <span class="cd-detail-value">${diag.med || 'See a local agronomist'}</span>
        </div>
        <div class="cd-detail-row">
          <span class="cd-detail-label">📋 Action Plan</span>
          <span class="cd-detail-value">${diag.plan || '—'}</span>
        </div>
      </div>

      <div class="cd-scores">
        <div class="cd-scores-title" style="font-weight:700;margin-bottom:8px;">Confidence Scores</div>
        ${scores.map(s => `
          <div class="cd-score-item">
            <div class="cd-score-header">
              <span>${s.name}</span>
              <span class="cd-score-pct">${s.conf}%</span>
            </div>
            <div class="confidence-bar">
              <div class="confidence-fill" style="width:${s.conf}%;"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="text-align:center;margin-top:24px;">
        <button class="btn btn-secondary btn-lg" id="cd-scan-again">🔄 Scan Another Leaf</button>
      </div>
    `;

        card.innerHTML = html;

        document.getElementById('cd-scan-again')?.addEventListener('click', () => {
            preview.style.display = 'none';
            preview.src = '';
            uploadZone.style.display = 'flex';
            actions.style.display = 'none';
            resultDiv.style.display = 'none';
            fileInput.value = '';
        });
    }
}
