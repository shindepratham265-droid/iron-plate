// js/muscle.js — IronPlate Muscle Growth Tracker

window.addEventListener('scroll',()=>document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>30));
function toggleMob(){document.getElementById('mob-menu').classList.toggle('open')}

requireAuth(user => {
  document.getElementById('nav-avatar').textContent = (user.displayName || user.email)[0].toUpperCase();
});

// ── Exercise definitions ──
// Each entry: muscles affected and how fast each grows (rx/ry per day at max scale)
const EXERCISES = [
  {
    id:'pushup', icon:'⬇️', name:'Push-Ups',
    muscles:{ 'chest': 1.0, 'triceps': 0.7, 'shoulders': 0.5, 'core': 0.3 },
    info:'Chest, Triceps, Front Deltoid, Core',
    rate:'Beginner-friendly. Chest grows fastest, visible gains by day 14.',
    zones: {
      'm-chest-l':{cx:84,cy:100,maxRx:16,maxRy:13,rate:1.0},
      'm-chest-r':{cx:116,cy:100,maxRx:16,maxRy:13,rate:1.0},
      'm-tri-l':  {cx:44,cy:130,maxRx:8, maxRy:14,rate:0.7},
      'm-tri-r':  {cx:156,cy:130,maxRx:8,maxRy:14,rate:0.7},
      'm-sho-l':  {cx:58,cy:80, maxRx:11,maxRy:10,rate:0.5},
      'm-sho-r':  {cx:142,cy:80,maxRx:11,maxRy:10,rate:0.5},
      'm-abs':    {isRect:true,x:86,y:118,maxW:28,maxH:26,rate:0.3},
    }
  },
  {
    id:'bench', icon:'🏋️', name:'Bench Press',
    muscles:{ 'chest': 1.0, 'triceps': 0.8, 'shoulders': 0.6 },
    info:'Pectorals (major/minor), Triceps, Front Deltoid',
    rate:'Compound movement. Rapid chest & tricep hypertrophy from week 2.',
    zones: {
      'm-chest-l':{cx:84,cy:100,maxRx:18,maxRy:15,rate:1.0},
      'm-chest-r':{cx:116,cy:100,maxRx:18,maxRy:15,rate:1.0},
      'm-tri-l':  {cx:44,cy:130,maxRx:9, maxRy:16,rate:0.8},
      'm-tri-r':  {cx:156,cy:130,maxRx:9,maxRy:16,rate:0.8},
      'm-sho-l':  {cx:58,cy:80, maxRx:12,maxRy:11,rate:0.6},
      'm-sho-r':  {cx:142,cy:80,maxRx:12,maxRy:11,rate:0.6},
    }
  },
  {
    id:'pullup', icon:'🔝', name:'Pull-Ups',
    muscles:{ 'lats': 1.0, 'biceps': 0.85, 'rear_delt': 0.6, 'forearms': 0.4 },
    info:'Latissimus Dorsi, Biceps Brachii, Rear Deltoid, Rhomboids',
    rate:'Back width explodes by day 21. Bicep peaks visible by day 30.',
    zones: {
      'm-lat-l':  {cx:76,cy:115,maxRx:14,maxRy:22,rate:1.0},
      'm-lat-r':  {cx:124,cy:115,maxRx:14,maxRy:22,rate:1.0},
      'm-bi-l':   {cx:44,cy:114,maxRx:9, maxRy:18,rate:0.85},
      'm-bi-r':   {cx:156,cy:114,maxRx:9,maxRy:18,rate:0.85},
      'm-sho-l':  {cx:58,cy:80, maxRx:10,maxRy:9, rate:0.6},
      'm-sho-r':  {cx:142,cy:80,maxRx:10,maxRy:9, rate:0.6},
      'm-fa-l':   {cx:34,cy:158,maxRx:7, maxRy:13,rate:0.4},
      'm-fa-r':   {cx:166,cy:158,maxRx:7,maxRy:13,rate:0.4},
    }
  },
  {
    id:'curl', icon:'💪', name:'Bicep Curl',
    muscles:{ 'biceps': 1.0, 'forearms': 0.7, 'brachialis': 0.6 },
    info:'Biceps Brachii, Brachialis, Forearms',
    rate:'Peak bicep shape forms around day 20. Forearm density by day 45.',
    zones: {
      'm-bi-l':   {cx:44,cy:114,maxRx:11,maxRy:20,rate:1.0},
      'm-bi-r':   {cx:156,cy:114,maxRx:11,maxRy:20,rate:1.0},
      'm-fa-l':   {cx:34,cy:158,maxRx:8, maxRy:15,rate:0.7},
      'm-fa-r':   {cx:166,cy:158,maxRx:8,maxRy:15,rate:0.7},
    }
  },
  {
    id:'squat', icon:'🦵', name:'Back Squat',
    muscles:{ 'quads': 1.0, 'glutes': 0.9, 'hamstrings': 0.7, 'core': 0.4 },
    info:'Quadriceps, Glutes, Hamstrings, Core',
    rate:'Quads and glutes grow rapidly. Full lower body transformation by day 45.',
    zones: {
      'm-quad-l': {cx:84,cy:238,maxRx:16,maxRy:32,rate:1.0},
      'm-quad-r': {cx:116,cy:238,maxRx:16,maxRy:32,rate:1.0},
      'm-glu-l':  {cx:87,cy:200,maxRx:14,maxRy:16,rate:0.9},
      'm-glu-r':  {cx:113,cy:200,maxRx:14,maxRy:16,rate:0.9},
      'm-ham-l':  {cx:84,cy:248,maxRx:14,maxRy:26,rate:0.7},
      'm-ham-r':  {cx:116,cy:248,maxRx:14,maxRy:26,rate:0.7},
      'm-abs':    {isRect:true,x:86,y:118,maxW:28,maxH:26,rate:0.4},
    }
  },
  {
    id:'rdl', icon:'🏋️', name:'Romanian Deadlift',
    muscles:{ 'hamstrings': 1.0, 'glutes': 0.85, 'back': 0.7 },
    info:'Hamstrings (all heads), Glutes, Erector Spinae',
    rate:'Hamstring hypertrophy is unmatched. Glute roundness visible by day 25.',
    zones: {
      'm-ham-l':  {cx:84,cy:248,maxRx:16,maxRy:30,rate:1.0},
      'm-ham-r':  {cx:116,cy:248,maxRx:16,maxRy:30,rate:1.0},
      'm-glu-l':  {cx:87,cy:200,maxRx:16,maxRy:18,rate:0.85},
      'm-glu-r':  {cx:113,cy:200,maxRx:16,maxRy:18,rate:0.85},
      'm-lat-l':  {cx:76,cy:115,maxRx:10,maxRy:18,rate:0.7},
      'm-lat-r':  {cx:124,cy:115,maxRx:10,maxRy:18,rate:0.7},
    }
  },
  {
    id:'ohp', icon:'⬆️', name:'Overhead Press',
    muscles:{ 'shoulders': 1.0, 'triceps': 0.7, 'core': 0.4 },
    info:'Anterior & Lateral Deltoid, Triceps, Upper Traps',
    rate:'Boulder shoulders develop by day 30. Tricep mass follows closely.',
    zones: {
      'm-sho-l':  {cx:58,cy:80, maxRx:15,maxRy:14,rate:1.0},
      'm-sho-r':  {cx:142,cy:80,maxRx:15,maxRy:14,rate:1.0},
      'm-tri-l':  {cx:44,cy:130,maxRx:9, maxRy:16,rate:0.7},
      'm-tri-r':  {cx:156,cy:130,maxRx:9,maxRy:16,rate:0.7},
      'm-abs':    {isRect:true,x:86,y:118,maxW:24,maxH:22,rate:0.4},
    }
  },
  {
    id:'plank', icon:'🛡️', name:'Plank',
    muscles:{ 'core': 1.0, 'shoulders': 0.4, 'glutes': 0.3 },
    info:'Transverse Abdominis, Rectus Abdominis, Obliques',
    rate:'Core density improves over 4–8 weeks. Subtle but powerful changes.',
    zones: {
      'm-abs':    {isRect:true,x:86,y:118,maxW:32,maxH:30,rate:1.0},
      'm-obl-l':  {cx:73,cy:138,maxRx:9, maxRy:16,rate:0.8},
      'm-obl-r':  {cx:127,cy:138,maxRx:9,maxRy:16,rate:0.8},
      'm-sho-l':  {cx:58,cy:80, maxRx:8, maxRy:7, rate:0.4},
      'm-sho-r':  {cx:142,cy:80,maxRx:8, maxRy:7, rate:0.4},
    }
  },
  {
    id:'legpress', icon:'🔄', name:'Leg Press',
    muscles:{ 'quads': 1.0, 'glutes': 0.7, 'hamstrings': 0.5 },
    info:'Quadriceps (vastus lateralis/medialis), Glutes',
    rate:'Quad size surges in first 3 weeks. Great for mass building.',
    zones: {
      'm-quad-l': {cx:84,cy:238,maxRx:18,maxRy:34,rate:1.0},
      'm-quad-r': {cx:116,cy:238,maxRx:18,maxRy:34,rate:1.0},
      'm-glu-l':  {cx:87,cy:200,maxRx:13,maxRy:15,rate:0.7},
      'm-glu-r':  {cx:113,cy:200,maxRx:13,maxRy:15,rate:0.7},
      'm-ham-l':  {cx:84,cy:248,maxRx:12,maxRy:22,rate:0.5},
      'm-ham-r':  {cx:116,cy:248,maxRx:12,maxRy:22,rate:0.5},
    }
  },
  {
    id:'calf', icon:'🦶', name:'Calf Raises',
    muscles:{ 'calves': 1.0 },
    info:'Gastrocnemius (upper calf), Soleus (lower calf)',
    rate:'Calf hypertrophy is slower but very visible by day 60.',
    zones: {
      'm-calf-l': {cx:82,cy:330,maxRx:14,maxRy:26,rate:1.0},
      'm-calf-r': {cx:118,cy:330,maxRx:14,maxRy:26,rate:1.0},
    }
  },
];

// Muscle display labels
const MUSCLE_LABELS = {
  'm-chest-l':'Chest (L)', 'm-chest-r':'Chest (R)',
  'm-sho-l':'Shoulder (L)', 'm-sho-r':'Shoulder (R)',
  'm-bi-l':'Bicep (L)', 'm-bi-r':'Bicep (R)',
  'm-tri-l':'Tricep (L)', 'm-tri-r':'Tricep (R)',
  'm-fa-l':'Forearm (L)', 'm-fa-r':'Forearm (R)',
  'm-lat-l':'Lat (L)', 'm-lat-r':'Lat (R)',
  'm-abs':'Abs', 'm-obl-l':'Oblique (L)', 'm-obl-r':'Oblique (R)',
  'm-quad-l':'Quad (L)', 'm-quad-r':'Quad (R)',
  'm-ham-l':'Hamstring (L)', 'm-ham-r':'Hamstring (R)',
  'm-glu-l':'Glute (L)', 'm-glu-r':'Glute (R)',
  'm-calf-l':'Calf (L)', 'm-calf-r':'Calf (R)',
};

let selectedEx = null;
let currentDay  = 0;

// ── Build exercise selector ──
document.getElementById('ex-sel-grid').innerHTML = EXERCISES.map(ex=>`
  <button class="ex-sel-btn" data-id="${ex.id}" onclick="selectExercise('${ex.id}')">
    <span class="ex-sel-icon">${ex.icon}</span>
    ${ex.name}
  </button>
`).join('');

function selectExercise(id) {
  selectedEx = EXERCISES.find(e=>e.id===id);
  if (!selectedEx) return;

  // UI
  document.querySelectorAll('.ex-sel-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-id="${id}"]`).classList.add('active');
  document.getElementById('sk-title').textContent = selectedEx.name + ' — Muscle Growth';
  document.getElementById('sk-sub').textContent   = `Drag the slider to see day-by-day muscle development`;
  document.getElementById('day-slider-wrap').style.display = 'block';
  document.getElementById('growth-strip').style.display    = 'block';
  document.getElementById('ex-info-card').style.display    = 'block';
  document.getElementById('ex-info-muscles').textContent   = selectedEx.info;
  document.getElementById('ex-info-rate').textContent      = selectedEx.rate;

  // Reset day
  document.getElementById('day-range').value = 0;
  currentDay = 0;
  updateSkeleton(0);
  buildProgressBars();
  buildGrowthStrip();
}

function onDayChange(val) {
  currentDay = parseInt(val);
  document.getElementById('day-num-display').textContent = currentDay;
  document.getElementById('day-streak').textContent =
    currentDay === 0 ? '🔥 Start' :
    currentDay < 7   ? `🔥 ${currentDay}d` :
    currentDay < 30  ? `⚡ ${currentDay}d` :
    currentDay < 60  ? `💪 ${currentDay}d` : `🏆 ${currentDay}d`;

  updateSkeleton(currentDay);
  updateProgressBars(currentDay);
  updateGrowthStrip(currentDay);
}

// ── Growth curve: logarithmic (fast early gains, plateau) ──
function growthFactor(day, rate) {
  // 0 at day 0, ~0.9 at day 90 with natural curve
  const raw = Math.log1p(day * rate * 0.6) / Math.log1p(90 * 0.6);
  return Math.min(raw, 1);
}

function updateSkeleton(day) {
  if (!selectedEx) return;

  // First zero all muscles
  Object.keys(MUSCLE_LABELS).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === 'm-abs') {
      el.setAttribute('x', '0'); el.setAttribute('y', '0');
      el.setAttribute('width','0'); el.setAttribute('height','0');
    } else {
      el.setAttribute('rx','0'); el.setAttribute('ry','0');
    }
  });

  // Apply growth for selected exercise
  Object.entries(selectedEx.zones).forEach(([id, z]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const f = growthFactor(day, z.rate);
    if (z.isRect) {
      const w = z.maxW * f, h = z.maxH * f;
      const cx = z.x + z.maxW/2 - w/2;
      const cy = z.y + z.maxH/2 - h/2;
      el.setAttribute('x', cx);
      el.setAttribute('y', cy);
      el.setAttribute('width', w);
      el.setAttribute('height', h);
    } else {
      el.setAttribute('cx', z.cx);
      el.setAttribute('cy', z.cy);
      el.setAttribute('rx', z.maxRx * f);
      el.setAttribute('ry', z.maxRy * f);
    }
  });

  // Day overlay text
  const overlay = document.getElementById('day-overlay');
  overlay.setAttribute('opacity', day > 0 ? '1' : '0');
  overlay.textContent = `Day ${day}`;
}

// ── Progress bars ──
function buildProgressBars() {
  const zones = selectedEx.zones;
  const uniqueLabels = {};
  Object.entries(zones).forEach(([id, z]) => {
    // Merge L/R by stripping suffix
    const base = id.replace(/-[lr]$/, '');
    if (!uniqueLabels[base]) {
      uniqueLabels[base] = { id, label: getBaseLabel(id), rate: z.rate };
    }
  });

  document.getElementById('muscle-progress-list').innerHTML =
    Object.entries(uniqueLabels).map(([base, {id, label, rate}])=>`
      <div class="mp-row" id="pr-${base}">
        <div class="mp-name">${label}</div>
        <div class="mp-track"><div class="mp-fill" id="mpf-${base}" style="width:0%"></div></div>
        <div class="mp-pct" id="mpp-${base}">0%</div>
      </div>
    `).join('');
}

function updateProgressBars(day) {
  if (!selectedEx) return;
  const zones = selectedEx.zones;
  const seen = {};
  Object.entries(zones).forEach(([id, z]) => {
    const base = id.replace(/-[lr]$/, '');
    if (seen[base]) return;
    seen[base] = true;
    const f  = growthFactor(day, z.rate);
    const pct = Math.round(f * 100);
    const fillEl = document.getElementById(`mpf-${base}`);
    const pctEl  = document.getElementById(`mpp-${base}`);
    if (fillEl) fillEl.style.width = pct + '%';
    if (pctEl)  pctEl.textContent  = pct + '%';
  });
}

function getBaseLabel(id) {
  const m = {
    'm-chest': 'Chest', 'm-sho': 'Shoulders', 'm-bi': 'Biceps',
    'm-tri': 'Triceps', 'm-fa': 'Forearms', 'm-lat': 'Lats / Back',
    'm-abs': 'Abs', 'm-obl': 'Obliques', 'm-quad': 'Quads',
    'm-ham': 'Hamstrings', 'm-glu': 'Glutes', 'm-calf': 'Calves',
  };
  const base = id.replace(/-[lr]$/, '');
  return m[base] || base;
}

// ── Growth strip (day timeline bars) ──
function buildGrowthStrip() {
  const bars = Array.from({length:90},(_,i)=>`
    <div class="gs-bar" id="gsb-${i}" title="Day ${i+1}"></div>
  `).join('');
  document.getElementById('growth-bars').innerHTML = bars;
}

function updateGrowthStrip(day) {
  for (let i=0; i<90; i++) {
    const el = document.getElementById(`gsb-${i}`);
    if (!el) continue;
    // Height based on overall growth at that day
    const avgF = calcAvgGrowth(i+1);
    el.style.height = Math.max(4, avgF * 36) + 'px';
    el.classList.toggle('grown', i < day);
  }
}

function calcAvgGrowth(day) {
  if (!selectedEx) return 0;
  const rates = Object.values(selectedEx.zones).map(z => growthFactor(day, z.rate));
  return rates.reduce((a,b)=>a+b,0) / rates.length;
}

function resetGrowth() {
  document.getElementById('day-range').value = 0;
  currentDay = 0;
  onDayChange(0);
}