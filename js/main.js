import { cropData, lifecycleStages } from './data.js';
import { renderSpeciesCards, renderComparisonTable, renderModalContent, createDiseaseHeatmap, createLifecycleTimeline } from './charts.js';
import { initScrollAnimations, initGsapEffects, initLenisSmoothScroll, initRippleEffect } from './animations.js';

// จัดการธีม, ภาษา, เมนูมือถือ, และการแสดงข้อมูลหลักของเว็บไซต์
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const body = document.body;
const themeToggle = document.querySelector('#theme-toggle');
const langToggle = document.querySelector('#lang-toggle');
const menuToggle = document.querySelector('#menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const closeMenu = document.querySelector('#close-menu');
const speciesGrid = document.querySelector('#species-grid');
const speciesSearch = document.querySelector('#species-search');
const seasonFilter = document.querySelector('#season-filter');
const comparePills = document.querySelector('#compare-pills');
const compareTable = document.querySelector('#compare-table');
const modal = document.querySelector('#crop-modal');
const modalContent = document.querySelector('#modal-content');
const closeModal = document.querySelector('#close-modal');
const scrollTopBtn = document.querySelector('#scroll-top');
const progressBar = document.querySelector('#reading-progress');
const preloader = document.querySelector('#preloader');
const preloaderBar = document.querySelector('#preloader-bar');

let currentFilter = 'all';
let currentSeason = 'all';
let currentQuery = '';
const selectedCompare = new Set();
let currentLanguage = localStorage.getItem('khaow-lang') || 'th';

// สลับโหมดสว่าง/มืดและจำค่าไว้ใน localStorage
function applyTheme(theme) {
  const isDark = theme === 'dark';
  body.classList.toggle('dark', isDark);
  localStorage.setItem('khaow-theme', theme);
  const icon = themeToggle.querySelector('i');
  if (icon) {
    icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    icon.innerHTML = '';
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  if (window.Chart && window.Chart.instances) {
    // Charts are recreated on render; theme changes trigger updates in the render cycle.
  }
}

function updateHeaderState() {
  const header = document.querySelector('header');
  if (window.scrollY > 24) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

function setupTheme() {
  const saved = localStorage.getItem('khaow-theme');
  if (saved === 'dark') applyTheme('dark');
  else applyTheme('light');
  themeToggle?.addEventListener('click', () => {
    const isDark = body.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
    renderAllCharts();
  });
}

function toggleMenu(forceOpen) {
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden', !shouldOpen);
}

function bindMobileMenu() {
  menuToggle?.addEventListener('click', () => toggleMenu(true));
  closeMenu?.addEventListener('click', () => toggleMenu(false));
  mobileMenu?.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

function initScrollProgress() {
  const doc = document.documentElement;
  const scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  const maxScroll = doc.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  progressBar.style.width = `${percent}%`;
}

function initLanguageToggle() {
  const labels = { th: 'EN', en: 'TH' };
  langToggle.textContent = labels[currentLanguage] || 'EN';
  langToggle.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'th' ? 'en' : 'th';
    localStorage.setItem('khaow-lang', currentLanguage);
    langToggle.textContent = currentLanguage === 'th' ? 'EN' : 'TH';
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (key === 'navIntro') el.textContent = currentLanguage === 'th' ? 'บทนำ' : 'Intro';
    });
  });
}

// Render กลุ่มสายพันธุ์ตามตัวกรองและผลการค้นหาแบบ real-time
function hydrateSpeciesCards() {
  renderSpeciesCards(speciesGrid, currentFilter, currentQuery, currentSeason);
  speciesGrid.querySelectorAll('.detail-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const crop = cropData.find((entry) => entry.id === button.dataset.id);
      if (!crop) return;
      modalContent.innerHTML = '';
      modalContent.appendChild(renderModalContent(crop));
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  });
}

function bindSpeciesControls() {
  document.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach((button) => button.classList.toggle('active', button === chip));
      currentFilter = chip.dataset.filter;
      hydrateSpeciesCards();
    });
  });

  speciesSearch.addEventListener('input', (event) => {
    currentQuery = event.target.value.trim();
    hydrateSpeciesCards();
  });

  seasonFilter.addEventListener('change', (event) => {
    currentSeason = event.target.value;
    hydrateSpeciesCards();
  });
}

function renderComparePills() {
  const unique = cropData.slice(0, 6);
  const pills = unique.map((crop) => `
    <button class="compare-pill ${selectedCompare.has(crop.id) ? 'active' : ''}" data-id="${crop.id}">${crop.nameThai}</button>
  `).join('');
  comparePills.innerHTML = pills;
  comparePills.querySelectorAll('.compare-pill').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      if (selectedCompare.has(id)) {
        selectedCompare.delete(id);
      } else if (selectedCompare.size < 3) {
        selectedCompare.add(id);
      }
      renderComparePills();
      renderComparisonTable(compareTable, [...selectedCompare]);
    });
  });
}

// สร้างกราฟข้อมูลและปรับค่าสีให้เข้ากับธีมปัจจุบัน
function renderAllCharts() {
  const isDark = body.classList.contains('dark');
  const radarCanvas = document.querySelector('#radarChart');
  const proteinCanvas = document.querySelector('#proteinChart');
  if (radarCanvas) {
    if (Chart.getChart('radarChart')) Chart.getChart('radarChart').destroy();
    new Chart(radarCanvas, {
      type: 'radar',
      data: {
        labels: cropData.map((crop) => crop.nameThai.split(' ').slice(0, 2).join(' ')),
        datasets: [
          { label: 'โปรตีน', data: cropData.map((crop) => crop.nutrition.protein), backgroundColor: 'rgba(82,183,136,0.25)', borderColor: '#52B788' },
          { label: 'ใยอาหาร', data: cropData.map((crop) => crop.nutrition.fiber), backgroundColor: 'rgba(212,165,55,0.18)', borderColor: '#D4A537' },
          { label: 'เหล็ก', data: cropData.map((crop) => crop.nutrition.iron), backgroundColor: 'rgba(45,106,79,0.2)', borderColor: '#2D6A4F' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: { backgroundColor: 'rgba(17,24,39,0.9)', titleColor: '#fff', bodyColor: '#fff' } },
        scales: { r: { angleLines: { color: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }, grid: { color: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }, pointLabels: { color: isDark ? '#fff' : '#1b1b1b' } } }
      }
    });
    radarCanvas.id = 'radarChart';
  }
  if (proteinCanvas) {
    if (Chart.getChart('proteinChart')) Chart.getChart('proteinChart').destroy();
    new Chart(proteinCanvas, {
      type: 'bar',
      data: { labels: cropData.map((crop) => crop.nameThai.replace('ข้าว', '').trim().slice(0, 12)), datasets: [{ label: 'โปรตีน (g)', data: cropData.map((crop) => crop.nutrition.protein), backgroundColor: 'rgba(82,183,136,0.75)' }, { label: 'ใยอาหาร (g)', data: cropData.map((crop) => crop.nutrition.fiber), backgroundColor: 'rgba(212,165,55,0.82)' }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: { backgroundColor: 'rgba(17,24,39,0.9)', titleColor: '#fff', bodyColor: '#fff' } }, scales: { x: { ticks: { color: isDark ? '#fff' : '#1b1b1b' }, grid: { display: false } }, y: { grid: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }, ticks: { color: isDark ? '#fff' : '#1b1b1b' } } } }
    });
    proteinCanvas.id = 'proteinChart';
  }
}

function initModal() {
  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });
}

function initScrollTop() {
  const showButton = window.scrollY > window.innerHeight;
  scrollTopBtn.classList.toggle('visible', showButton);
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

function initPreloader() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    preloaderBar.style.width = `${progress}%`;
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 350);
    }
  }, 90);
}

function initA11y() {
  document.querySelectorAll('[data-lucide]').forEach((icon) => {
    if (icon.dataset.lucide && window.lucide) { window.lucide.createIcons(); }
  });
}

function setupEvents() {
  window.addEventListener('scroll', () => {
    initScrollProgress();
    updateHeaderState();
    initScrollTop();
  });
  window.addEventListener('resize', initScrollProgress);
  document.querySelector('body').addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      toggleMenu(false);
    }
  });
}

// เริ่มต้นการทำงานของหน้าเว็บเมื่อ DOM พร้อมใช้งาน
function initPage() {
  setupTheme();
  bindMobileMenu();
  initPreloader();
  hydrateSpeciesCards();
  bindSpeciesControls();
  renderComparePills();
  renderComparisonTable(compareTable, [...selectedCompare]);
  const diseaseHeatmapHost = document.querySelector('#disease-heatmap');
  if (diseaseHeatmapHost) createDiseaseHeatmap(diseaseHeatmapHost, body.classList.contains('dark'));
  const timelineRoot = document.querySelector('#lifecycle-timeline');
  if (timelineRoot) {
    timelineRoot.innerHTML = lifecycleStages.map((stage, index) => `
      <article class="timeline-item reveal">
        <div class="timeline-head"><span>${stage.days}</span><span>${index + 1}</span></div>
        <h4>${stage.title}</h4>
        <ul>${stage.details.map((item) => `<li>${item}</li>`).join('')}</ul>
      </article>
    `).join('');
  }
  initModal();
  updateHeaderState();
  initScrollProgress();
  initScrollTop();
  setupEvents();
  initLanguageToggle();
  renderAllCharts();
  initScrollAnimations();
  initGsapEffects();
  initLenisSmoothScroll();
  initRippleEffect();
  if (window.lucide) window.lucide.createIcons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
