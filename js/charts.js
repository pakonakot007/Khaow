import { cropData, nutrientLabels, diseaseDefinitions } from './data.js';

export function createNutritionTable(container, isDark) {
  const table = document.createElement('table');
  table.className = 'nutrient-table w-full min-w-[1100px] text-left text-sm';

  const cols = ['สายพันธุ์', 'พลังงาน', 'โปรตีน', 'ไขมัน', 'คาร์โบไฮเดรต', 'ใยอาหาร', 'วิตามินบี', 'วิตามินอี', 'เหล็ก', 'แมกนีเซียม', 'สังกะสี', 'ดัชนีน้ำตาล'];
  const sorted = [...cropData];
  const head = document.createElement('thead');
  head.innerHTML = `
    <tr>
      ${cols.map((col) => `<th class="px-3 py-3 font-semibold">${col}</th>`).join('')}
    </tr>
  `;

  const body = document.createElement('tbody');
  sorted.forEach((crop) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="whitespace-nowrap font-semibold text-primary dark:text-darkgold">${crop.nameThai}</td>
      <td>${crop.nutrition.energy}</td>
      <td>${crop.nutrition.protein}</td>
      <td>${crop.nutrition.fat}</td>
      <td>${crop.nutrition.carbs}</td>
      <td>${crop.nutrition.fiber}</td>
      <td>${crop.nutrition.vitaminB}</td>
      <td>${crop.nutrition.vitaminE}</td>
      <td>${crop.nutrition.iron}</td>
      <td>${crop.nutrition.magnesium}</td>
      <td>${crop.nutrition.zinc}</td>
      <td>${crop.nutrition.sugarIndex}</td>
    `;
    body.appendChild(row);
  });

  table.append(head, body);
  container.innerHTML = '';
  container.appendChild(table);
}

export function renderRadarChart(canvas, isDark) {
  const labels = cropData.map((crop) => crop.nameThai.split(' ').slice(0, 2).join(' '));
  const datasets = [
    {
      label: 'โปรตีน',
      data: cropData.map((crop) => crop.nutrition.protein),
      backgroundColor: 'rgba(82,183,136,0.25)',
      borderColor: '#52B788',
      pointBackgroundColor: '#52B788'
    },
    {
      label: 'ใยอาหาร',
      data: cropData.map((crop) => crop.nutrition.fiber),
      backgroundColor: 'rgba(212,165,55,0.18)',
      borderColor: '#D4A537',
      pointBackgroundColor: '#D4A537'
    },
    {
      label: 'เหล็ก',
      data: cropData.map((crop) => crop.nutrition.iron),
      backgroundColor: 'rgba(45,106,79,0.2)',
      borderColor: '#2D6A4F',
      pointBackgroundColor: '#2D6A4F'
    }
  ];

  const chart = new Chart(canvas, {
    type: 'radar',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: isDark ? '#f5f5f5' : '#1b1b1b',
            font: { family: 'IBM Plex Sans Thai' }
          }
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${context.formattedValue}`;
            }
          },
          titleColor: '#fff',
          bodyColor: '#fff',
          backgroundColor: 'rgba(17,24,39,0.9)'
        }
      },
      scales: {
        r: {
          angleLines: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' },
          grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' },
          pointLabels: {
            color: isDark ? '#f5f5f5' : '#1b1b1b',
            font: { family: 'IBM Plex Sans Thai', size: 11 }
          },
          suggestedMin: 0,
          suggestedMax: 16
        }
      }
    }
  });

  return chart;
}

export function renderProteinChart(canvas, isDark) {
  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: cropData.map((crop) => crop.nameThai.replace('ข้าว', '').trim().slice(0, 12)),
      datasets: [
        {
          label: 'โปรตีน (g)',
          data: cropData.map((crop) => crop.nutrition.protein),
          backgroundColor: 'rgba(82,183,136,0.75)',
          borderRadius: 10
        },
        {
          label: 'ใยอาหาร (g)',
          data: cropData.map((crop) => crop.nutrition.fiber),
          backgroundColor: 'rgba(212,165,55,0.82)',
          borderRadius: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: isDark ? '#f5f5f5' : '#1b1b1b',
            font: { family: 'IBM Plex Sans Thai' }
          }
        },
        tooltip: {
          titleColor: '#fff',
          bodyColor: '#fff',
          backgroundColor: 'rgba(17,24,39,0.9)'
        }
      },
      scales: {
        x: {
          ticks: { color: isDark ? '#f5f5f5' : '#1b1b1b', font: { family: 'IBM Plex Sans Thai', size: 11 } },
          grid: { display: false }
        },
        y: {
          ticks: { color: isDark ? '#f5f5f5' : '#1b1b1b' },
          grid: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }
        }
      }
    }
  });

  return chart;
}

export function createDiseaseHeatmap(container, isDark) {
  const diseases = ['blast', 'blight', 'brownSpot', 'rust', 'powdery', 'seedling'];
  const labels = [
    { key: 'blast', label: 'โรคไหม้' },
    { key: 'blight', label: 'โรคขอบใบแห้ง' },
    { key: 'brownSpot', label: 'โรคใบจุดสีน้ำตาล' },
    { key: 'rust', label: 'โรคราสนิม' },
    { key: 'powdery', label: 'โรคราแป้ง' },
    { key: 'seedling', label: 'โรคเมล็ดด่าง' }
  ];

  const table = document.createElement('table');
  table.className = 'w-full min-w-[760px] border-separate border-spacing-2 text-sm';

  const headerRow = document.createElement('tr');
  headerRow.innerHTML = '<th class="p-2 text-left">สายพันธุ์</th>' + labels.map((item) => `<th class="p-2 text-center">${item.label}</th>`).join('');
  table.appendChild(headerRow);

  cropData.forEach((crop) => {
    const row = document.createElement('tr');
    const cellData = diseases.map((disease) => {
      const score = crop.resistance[disease];
      const levels = [
        { value: 1, label: 'ต้านทานดีมาก', className: 'level-excellent' },
        { value: 2, label: 'ต้านทานดี', className: 'level-good' },
        { value: 3, label: 'ต้านทานปานกลาง', className: 'level-moderate' },
        { value: 4, label: 'อ่อนแอ', className: 'level-weak' },
        { value: 5, label: 'อ่อนแอมาก', className: 'level-vulnerable' }
      ];
      const level = levels[Math.max(0, Math.min(4, score - 1))];
      return `<td class="p-2 align-middle"><button class="resistance-cell ${level.className} w-full" data-disease="${disease}" data-crop="${crop.nameThai}" aria-label="${diseaseDefinitions[disease].label}">${level.label}</button></td>`;
    }).join('');
    row.innerHTML = `<td class="p-2 font-semibold text-primary dark:text-darkgold">${crop.nameThai}</td>${cellData}`;
    table.appendChild(row);
  });

  container.innerHTML = '';
  container.appendChild(table);
  const tooltip = document.createElement('div');
  tooltip.className = 'disease-tooltip';
  container.appendChild(tooltip);

  table.querySelectorAll('.resistance-cell').forEach((button) => {
    button.addEventListener('pointerenter', (event) => {
      const diseaseKey = event.target.dataset.disease;
      const cropName = event.target.dataset.crop;
      const info = diseaseDefinitions[diseaseKey];
      const rect = event.target.getBoundingClientRect();
      tooltip.innerHTML = `<strong>${cropName}</strong><br>${info.label}<br>${info.description}<br><em>วิธีป้องกัน:</em> ${info.prevention}`;
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.top - 10}px`;
      tooltip.classList.add('visible');
    });
    button.addEventListener('pointerleave', () => tooltip.classList.remove('visible'));
  });
}

export function createLifecycleTimeline(container) {
  const { lifecycleStages } = await import('./data.js');
  const grid = document.createElement('div');
  grid.className = 'timeline-grid';
  lifecycleStages.forEach((stage, index) => {
    const item = document.createElement('article');
    item.className = 'timeline-item';
    item.innerHTML = `
      <div class="timeline-head">
        <span>${stage.days}</span>
        <span>${index + 1}</span>
      </div>
      <h4>${stage.title}</h4>
      <ul>${stage.details.map((d) => `<li>${d}</li>`).join('')}</ul>
    `;
    grid.appendChild(item);
  });
  container.innerHTML = '';
  container.appendChild(grid);
}

export function renderSpeciesCards(container, category = 'all', query = '', season = 'all') {
  const filtered = cropData.filter((crop) => {
    const matchesCategory = category === 'all' || crop.category === category;
    const matchesQuery = crop.nameThai.toLowerCase().includes(query.toLowerCase()) || crop.nameLatin.toLowerCase().includes(query.toLowerCase());
    const matchesSeason = season === 'all' || crop.season === season;
    return matchesCategory && matchesQuery && matchesSeason;
  });

  container.innerHTML = filtered.map((crop) => `
    <article class="species-card reveal" data-id="${crop.id}" data-category="${crop.category}">
      <div class="species-thumb">
        <img src="${crop.image}" alt="${crop.nameThai}" loading="lazy" width="800" height="600" />
        <span class="species-badge" style="background:${crop.categoryColor};">${crop.category}</span>
      </div>
      <div class="species-body">
        <div class="species-name">
          <h3>${crop.nameThai}</h3>
          <span class="tag">${crop.growthDays} วัน</span>
        </div>
        <div class="species-scientific">${crop.nameLatin}</div>
        <p class="species-desc">${crop.description}</p>
        <div class="species-footer">
          <div class="tags">
            <span class="tag">${crop.season}</span>
            <span class="tag">${crop.yield} กก/ไร่</span>
          </div>
          <button class="detail-btn text-sm font-semibold text-primary dark:text-darkgold" data-id="${crop.id}">รายละเอียด</button>
        </div>
      </div>
    </article>
  `).join('');

  if (!filtered.length) {
    container.innerHTML = '<div class="col-span-full rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">ไม่พบสายพันธุ์ที่ตรงกับเงื่อนไข</div>';
  }
}

export function renderComparisonTable(container, selectedIds) {
  const selected = cropData.filter((crop) => selectedIds.includes(crop.id));
  if (!selected.length) {
    container.innerHTML = '<p class="text-sm text-slate-500">กรุณาเลือกสายพันธุ์ 2–3 ชนิดเพื่อเปรียบเทียบ</p>';
    return;
  }

  const metrics = [
    ['พลังงาน', (crop) => crop.nutrition.energy],
    ['โปรตีน', (crop) => crop.nutrition.protein],
    ['ไขมัน', (crop) => crop.nutrition.fat],
    ['คาร์โบไฮเดรต', (crop) => crop.nutrition.carbs],
    ['ใยอาหาร', (crop) => crop.nutrition.fiber],
    ['เหล็ก', (crop) => crop.nutrition.iron],
    ['แมกนีเซียม', (crop) => crop.nutrition.magnesium],
    ['สังกะสี', (crop) => crop.nutrition.zinc]
  ];

  const rows = metrics.map(([label, valueFn]) => {
    const cells = selected.map((crop) => `<td class="px-3 py-3 text-center">${valueFn(crop)}</td>`).join('');
    return `<tr><th class="px-3 py-3 text-left text-xs uppercase tracking-[0.2em] text-slate-500">${label}</th>${cells}</tr>`;
  }).join('');

  const headers = selected.map((crop) => `<th class="px-3 py-3 text-left text-primary dark:text-darkgold">${crop.nameThai}</th>`).join('');
  container.innerHTML = `
    <table class="w-full min-w-[640px] text-sm">
      <thead><tr><th></th>${headers}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

export function renderModalContent(crop) {
  const content = document.createElement('div');
  content.className = 'space-y-8';
  content.innerHTML = `
    <div class="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <div class="overflow-hidden rounded-[26px]">
        <img src="${crop.image}" alt="${crop.nameThai}" class="h-full w-full object-cover" width="1200" height="860" />
      </div>
      <div class="space-y-4">
        <div class="flex items-center gap-3"><span class="rounded-full px-3 py-1 text-xs font-semibold text-white" style="background:${crop.categoryColor};">${crop.category}</span><span class="text-xs uppercase tracking-[0.2em] text-slate-400">${crop.season}</span></div>
        <h2 class="font-display text-4xl text-primary dark:text-darkgold">${crop.nameThai}</h2>
        <p class="italic text-sm text-slate-500 dark:text-slate-300">${crop.nameLatin}</p>
        <p class="leading-8 text-slate-700 dark:text-slate-200">${crop.description}</p>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-2xl bg-white/70 p-3 dark:bg-slate-800/70"><div class="text-xs uppercase tracking-[0.15em] text-slate-500">ระยะเวลาเก็บเกี่ยว</div><div class="mt-2 font-display text-2xl text-primary dark:text-darkgold">${crop.growthDays} วัน</div></div>
          <div class="rounded-2xl bg-white/70 p-3 dark:bg-slate-800/70"><div class="text-xs uppercase tracking-[0.15em] text-slate-500">ผลผลิต</div><div class="mt-2 font-display text-2xl text-primary dark:text-darkgold">${crop.yield} กก/ไร่</div></div>
        </div>
      </div>
    </div>
    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-[22px] bg-white/70 p-5 dark:bg-slate-800/70"><h3 class="font-display text-2xl text-primary dark:text-darkgold">ลักษณะพิเศษ</h3><p class="mt-3 leading-8 text-slate-700 dark:text-slate-200">${crop.special}</p></div>
      <div class="rounded-[22px] bg-white/70 p-5 dark:bg-slate-800/70"><h3 class="font-display text-2xl text-primary dark:text-darkgold">สภาพดินและภูมิอากาศ</h3><p class="mt-3 leading-8 text-slate-700 dark:text-slate-200"><strong>ดิน:</strong> ${crop.suitableSoil}<br><strong>อากาศ:</strong> ${crop.climate}</p></div>
      <div class="rounded-[22px] bg-white/70 p-5 dark:bg-slate-800/70"><h3 class="font-display text-2xl text-primary dark:text-darkgold">วิธีการปลูกและการดูแล</h3><p class="mt-3 leading-8 text-slate-700 dark:text-slate-200"><strong>ปลูก:</strong> ${crop.planting}<br><strong>ดูแล:</strong> ${crop.care}</p></div>
      <div class="rounded-[22px] bg-white/70 p-5 dark:bg-slate-800/70"><h3 class="font-display text-2xl text-primary dark:text-darkgold">โรคและแมลงศัตรูพืช</h3><p class="mt-3 leading-8 text-slate-700 dark:text-slate-200">${crop.diseases.join(', ')}</p></div>
    </div>
    <div class="rounded-[22px] bg-white/70 p-5 dark:bg-slate-800/70">
      <h3 class="font-display text-2xl text-primary dark:text-darkgold">การนำไปใช้ประโยชน์</h3>
      <div class="mt-3 flex flex-wrap gap-2">${crop.uses.map((use) => `<span class="tag">${use}</span>`).join('')}</div>
    </div>
  `;
  return content;
}

export function updateThemeCharts(isDark) {
  const charts = Chart.getChart('radarChart');
  if (charts) charts.destroy();
  const proteinChart = Chart.getChart('proteinChart');
  if (proteinChart) proteinChart.destroy();
}

export function getMetricLabel(metric) {
  return nutrientLabels[metric] || metric;
}
