// js/diet.js — IronPlate AI Diet Plan (Groq-powered)

const BACKEND_URL = 'http://localhost:5000';

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
});
function toggleMob() { document.getElementById('mob-menu').classList.toggle('open'); }

let userProfile   = {};
let selectedPrefs = [];
let currentPlan   = [];
let currentMacros = {};

const MEAL_META = [
  { icon: '🌅', name: 'Breakfast', time: '7:00 – 8:00 AM'   },
  { icon: '☀️', name: 'Lunch',     time: '12:30 – 1:30 PM'  },
  { icon: '🌆', name: 'Snack',     time: '4:00 – 5:00 PM'   },
  { icon: '🌙', name: 'Dinner',    time: '7:30 – 8:30 PM'   },
];

/* ── Auth guard ── */
requireAuth(async user => {
  document.getElementById('nav-avatar').textContent =
    (user.displayName || user.email)[0].toUpperCase();
  const data = await getUserData(user.uid);
  if (data) {
    userProfile = data;
    if (userProfile.savedPrefs) {
      selectedPrefs = userProfile.savedPrefs;
      selectedPrefs.forEach(p => {
        const el = document.querySelector(`[data-val="${p}"]`);
        if (el) el.classList.add('active');
      });
      updatePrefState();
    }
  }
});

/* ── Preference toggle ── */
function togglePref(el) {
  const val = el.dataset.val;
  if (el.classList.contains('active')) {
    el.classList.remove('active');
    selectedPrefs = selectedPrefs.filter(p => p !== val);
  } else {
    if (selectedPrefs.length >= 3) {
      document.getElementById('pref-warn').style.display = 'block';
      setTimeout(() => document.getElementById('pref-warn').style.display = 'none', 2500);
      return;
    }
    el.classList.add('active');
    selectedPrefs.push(val);
  }
  updatePrefState();
}

function updatePrefState() {
  document.querySelectorAll('.pref-card').forEach(c => {
    c.classList.toggle('disabled', selectedPrefs.length >= 3 && !c.classList.contains('active'));
  });
}

/* ── AI Diet Plan Generation ── */
async function generatePlan() {
  if (selectedPrefs.length === 0) {
    showToast('Please select at least 1 food preference.', '⚠️');
    return;
  }

  // Show loading state
  showLoadingState();

  const payload = {
    age:           userProfile.age          || 25,
    weight:        userProfile.weight       || 70,
    height:        userProfile.height       || 175,
    sex:           userProfile.sex          || 'male',
    goal:          userProfile.goal         || 'gain',
    activityLevel: userProfile.activity     || 'moderate',
    preferences:   selectedPrefs,
    targetCal:     userProfile.targetCal   || 0,
  };

  try {
    const resp = await fetch(`${BACKEND_URL}/api/generate-diet`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error || `Server error ${resp.status}`);
    }

    const data = await resp.json();
    renderAIPlan(data);

  } catch (err) {
    hideLoadingState();
    if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
      showToast('Cannot reach backend. Make sure the Python server is running (start.bat).', '⚠️');
      showBackendError();
    } else {
      showToast(`Error: ${err.message}`, '❌');
    }
    console.error('Diet AI error:', err);
  }
}

function showLoadingState() {
  document.getElementById('plan-section').classList.add('hidden');
  const loading = document.getElementById('diet-loading');
  if (loading) loading.style.display = 'flex';

  const btn = document.querySelector('.btn[onclick="generatePlan()"]');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-spinner"></span> AI is generating your plan…';
  }
}

function hideLoadingState() {
  const loading = document.getElementById('diet-loading');
  if (loading) loading.style.display = 'none';

  const btn = document.querySelector('[onclick="generatePlan()"]');
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = 'Generate My Meal Plan ✨';
  }
}

function showBackendError() {
  const errEl = document.getElementById('backend-error');
  if (errEl) errEl.style.display = 'block';
}

/* ── Render AI response ── */
function renderAIPlan(data) {
  hideLoadingState();

  // Normalise meal items from AI response
  currentPlan = (data.meals || []).map((meal, i) => ({
    key:   meal.name.toLowerCase(),
    meta:  { icon: meal.icon || MEAL_META[i]?.icon, name: meal.name, time: meal.time || MEAL_META[i]?.time },
    items: (meal.items || []).map(it => ({
      n:   it.name,
      qty: it.qty,
      cal: it.calories || it.cal || 0,
      p:   it.protein  || it.p  || 0,
      c:   it.carbs    || it.c  || 0,
      f:   it.fat      || it.f  || 0,
    }))
  }));

  currentMacros = {
    cal: data.dailyCalories || data.calories || 2000,
    p:   data.protein || 150,
    c:   data.carbs   || 200,
    f:   data.fat     || 60,
  };

  // Update header numbers
  document.getElementById('d-cal').textContent   = currentMacros.cal;
  document.getElementById('d-prot').textContent  = currentMacros.p + 'g';
  document.getElementById('d-carbs').textContent = currentMacros.c + 'g';
  document.getElementById('d-fat').textContent   = currentMacros.f + 'g';

  // Add AI badge + prefs tag
  const aiTag = document.getElementById('plan-ai-tag');
  if (aiTag) {
    aiTag.innerHTML = `
      <span class="ai-badge">✨ AI Generated</span>
      <span class="pref-tag">${selectedPrefs.join(', ')}</span>
    `;
  }

  renderMacroProgress();
  showMeal(0, document.querySelector('.meal-tab'));
  document.getElementById('plan-section').classList.remove('hidden');
  showToast('Your AI-powered meal plan is ready! 🍽️', '✅');
}

/* ── Macro progress bars ── */
function renderMacroProgress() {
  const { p, c, f } = currentMacros;
  const total = (p * 4) + (c * 4) + (f * 9) || 1;
  const bars = [
    { name: 'Protein', val: p, unit: 'g', pct: Math.round(p * 4 / total * 100), color: '#3b5bdb' },
    { name: 'Carbs',   val: c, unit: 'g', pct: Math.round(c * 4 / total * 100), color: '#7048e8' },
    { name: 'Fat',     val: f, unit: 'g', pct: Math.round(f * 9 / total * 100), color: '#22d3ee' },
  ];
  document.getElementById('macro-progress').innerHTML = bars.map(b => `
    <div class="macro-bar-row">
      <div class="macro-bar-lbl">${b.name}</div>
      <div class="macro-bar-track">
        <div class="macro-bar-fill" style="width:${b.pct}%;background:${b.color}"></div>
      </div>
      <div class="macro-bar-num">${b.val}g · ${b.pct}%</div>
    </div>
  `).join('');
}

/* ── Show individual meal ── */
function showMeal(idx, btn) {
  document.querySelectorAll('.meal-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const meal = currentPlan[idx];
  if (!meal) return;

  const meta    = meal.meta || MEAL_META[idx];
  const mealCal = meal.items.reduce((a, i) => a + (i.cal || 0), 0);

  document.getElementById('meal-display').innerHTML = `
    <div class="meal-card">
      <div class="meal-header">
        <div class="meal-icon">${meta.icon}</div>
        <div>
          <div class="meal-time">${meta.name}</div>
          <div style="font-size:12px;color:var(--muted)">${meta.time}</div>
        </div>
        <div class="meal-cal">${mealCal} kcal</div>
      </div>
      <div class="food-items">
        ${meal.items.map(item => `
          <div class="food-row">
            <div style="flex:1">
              <div class="food-name">${item.n || item.name}</div>
              <div class="food-macros">
                <span>P: <span>${item.p}g</span></span>
                <span>C: <span>${item.c}g</span></span>
                <span>F: <span>${item.f}g</span></span>
              </div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div class="food-qty">${item.qty}</div>
              <div style="font-size:12px;color:var(--muted)">${item.cal} kcal</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ── Save & Download ── */
async function savePlanToFirestore() {
  const user = auth.currentUser;
  if (!user) return;
  await saveUserData(user.uid, {
    savedPlan:   currentPlan,
    savedPrefs:  selectedPrefs,
    savedMacros: currentMacros,
  });
  showToast('Diet plan saved to your profile! 💾', '✅');
}

function downloadPlan() {
  const prefs = selectedPrefs.join(', ') || 'Mixed';
  let html = `<html><head><meta charset="UTF-8"><style>
    body{font-family:Arial,sans-serif;padding:32px;max-width:700px;margin:0 auto}
    h1{color:#3b5bdb;margin-bottom:4px}
    .sub{color:#6b7280;font-size:14px;margin-bottom:24px}
    .ai-note{background:#dbe4ff;color:#3b5bdb;padding:8px 16px;border-radius:8px;font-size:13px;margin-bottom:24px;display:inline-block}
    .meal{border:1px solid #e4e7f5;border-radius:10px;padding:16px;margin-bottom:16px}
    .meal-title{font-weight:800;font-size:17px;margin-bottom:8px}
    .item{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f2ff;font-size:14px}
    .macros{color:#3b5bdb;font-size:12px;margin-top:12px}
    .footer{margin-top:32px;font-size:12px;color:#6b7280;text-align:center}
  </style></head><body>
    <h1>🥗 IronPlate — AI Diet Plan</h1>
    <div class="sub">Preferences: ${prefs} · Target: ${currentMacros.cal} kcal/day</div>
    <div class="ai-note">✨ AI Generated by Groq LLaMA 3</div>
    <div class="macros">Daily Macros — Protein: ${currentMacros.p}g | Carbs: ${currentMacros.c}g | Fat: ${currentMacros.f}g</div><br>
    ${currentPlan.map((meal, i) => {
      const meta = meal.meta || MEAL_META[i];
      return `
        <div class="meal">
          <div class="meal-title">${meta.icon} ${meta.name} — ${meta.time}</div>
          ${meal.items.map(item => `
            <div class="item">
              <span>${item.n || item.name} (${item.qty})</span>
              <span>${item.cal} kcal | P:${item.p}g C:${item.c}g F:${item.f}g</span>
            </div>
          `).join('')}
        </div>
      `;
    }).join('')}
    <div class="footer">Generated by IronPlate AI • Powered by Groq LLaMA 3</div>
  </body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'IronPlate-AI-DietPlan.html';
  a.click();
  showToast('Diet plan downloaded! Open the HTML file in any browser to print.', '⬇️');
}