// js/diet.js — IronPlate Diet Plan Logic

window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>30);
});
function toggleMob(){document.getElementById('mob-menu').classList.toggle('open')}

let userProfile = {};
let selectedPrefs = [];
let currentPlan   = [];
let currentMacros = {};

requireAuth(async user => {
  document.getElementById('nav-avatar').textContent = (user.displayName || user.email)[0].toUpperCase();
  const doc = await db.collection('users').doc(user.uid).get();
  if (doc.exists) {
    userProfile = doc.data();
    // Auto-load saved plan if exists
    if (userProfile.savedPlan) {
      selectedPrefs = userProfile.savedPrefs || [];
      selectedPrefs.forEach(p => {
        const el = document.querySelector(`[data-val="${p}"]`);
        if (el) el.classList.add('active');
      });
    }
  }
});

// ── Food preference toggle (max 3) ──
function togglePref(el) {
  const val = el.dataset.val;
  if (el.classList.contains('active')) {
    el.classList.remove('active');
    selectedPrefs = selectedPrefs.filter(p => p !== val);
  } else {
    if (selectedPrefs.length >= 3) {
      document.getElementById('pref-warn').style.display = 'block';
      setTimeout(()=>document.getElementById('pref-warn').style.display='none', 2500);
      return;
    }
    el.classList.add('active');
    selectedPrefs.push(val);
  }
  // Disable unselected if 3 reached
  document.querySelectorAll('.pref-card').forEach(c => {
    c.classList.toggle('disabled', selectedPrefs.length >= 3 && !c.classList.contains('active'));
  });
}

// ── Food database keyed by preference ──
const FOOD_DB = {
  // each entry: { name, qty, cal, p, c, f }
  veg: {
    breakfast:[ {n:'Oats with milk & banana',    qty:'1 bowl',  cal:350,p:12,c:58,f:7 },
                {n:'Boiled eggs (2) + toast',     qty:'2 eggs',  cal:320,p:18,c:35,f:10},
                {n:'Greek yoghurt with berries',  qty:'150g',    cal:180,p:15,c:20,f:4 } ],
    lunch:     [ {n:'Dal + 2 chapatis + salad',   qty:'1 plate', cal:420,p:18,c:65,f:8 },
                {n:'Paneer bhurji + rice',         qty:'1 bowl',  cal:480,p:22,c:60,f:16},
                {n:'Rajma + brown rice',           qty:'1 plate', cal:450,p:20,c:70,f:7 } ],
    snack:     [ {n:'Mixed nuts & seeds',         qty:'30g',     cal:180,p:5, c:6, f:16},
                {n:'Fruit bowl',                  qty:'1 medium',cal:120,p:2, c:28,f:1 },
                {n:'Hummus + veggies',            qty:'100g',    cal:160,p:6, c:18,f:8 } ],
    dinner:    [ {n:'Tofu stir fry + quinoa',     qty:'1 bowl',  cal:400,p:25,c:40,f:14},
                {n:'Palak paneer + 1 roti',        qty:'1 plate', cal:380,p:20,c:35,f:16},
                {n:'Lentil soup + whole wheat',    qty:'1 bowl',  cal:350,p:18,c:48,f:7 } ],
  },
  nonveg: {
    breakfast:[ {n:'Omelette (3 eggs) + toast',   qty:'3 eggs',  cal:380,p:28,c:30,f:16},
                {n:'Chicken sausage + oats',       qty:'1 plate', cal:420,p:30,c:40,f:12},
                {n:'Scrambled eggs + avocado',     qty:'2 eggs',  cal:360,p:24,c:12,f:22} ],
    lunch:     [ {n:'Grilled chicken breast + rice',qty:'150g',   cal:480,p:45,c:50,f:8 },
                {n:'Tuna wrap + salad',            qty:'1 wrap',  cal:420,p:38,c:38,f:10},
                {n:'Chicken curry + chapati',      qty:'1 plate', cal:520,p:40,c:55,f:14} ],
    snack:     [ {n:'Boiled eggs (2)',             qty:'2 eggs',  cal:150,p:13,c:1, f:10},
                {n:'Greek yoghurt + protein bar',  qty:'150g',    cal:220,p:20,c:22,f:6 },
                {n:'Chicken strips grilled',       qty:'80g',     cal:170,p:30,c:0, f:5 } ],
    dinner:    [ {n:'Baked salmon + sweet potato', qty:'180g',    cal:520,p:42,c:35,f:20},
                {n:'Mutton stew + brown rice',     qty:'1 bowl',  cal:580,p:38,c:55,f:18},
                {n:'Egg fried rice + veg',         qty:'1 plate', cal:460,p:22,c:62,f:12} ],
  },
  vegan: {
    breakfast:[ {n:'Chia pudding with almond milk',qty:'1 bowl',  cal:280,p:8, c:38,f:12},
                {n:'Smoothie bowl + granola',      qty:'1 bowl',  cal:320,p:10,c:55,f:8 },
                {n:'Tofu scramble + whole toast',  qty:'1 plate', cal:340,p:22,c:30,f:12} ],
    lunch:     [ {n:'Chickpea salad bowl',         qty:'1 bowl',  cal:380,p:18,c:52,f:10},
                {n:'Lentil soup + whole bread',    qty:'1 bowl',  cal:350,p:16,c:56,f:6 },
                {n:'Quinoa buddha bowl',           qty:'1 bowl',  cal:420,p:20,c:55,f:14} ],
    snack:     [ {n:'Edamame',                     qty:'100g',    cal:120,p:11,c:9, f:5 },
                {n:'Almond butter + apple',        qty:'2 tbsp',  cal:200,p:5, c:22,f:12},
                {n:'Trail mix',                    qty:'30g',     cal:160,p:4, c:16,f:9 } ],
    dinner:    [ {n:'Black bean tacos',            qty:'2 tacos', cal:440,p:20,c:60,f:12},
                {n:'Tempeh stir fry + rice',       qty:'1 bowl',  cal:480,p:28,c:55,f:16},
                {n:'Veggie curry + naan',          qty:'1 plate', cal:420,p:16,c:62,f:12} ],
  },
  keto: {
    breakfast:[ {n:'Avocado eggs (2)',             qty:'1 avocado',cal:380,p:16,c:4, f:32},
                {n:'Bacon + eggs (3)',              qty:'3 slices', cal:420,p:26,c:2, f:34},
                {n:'Keto pancakes',                qty:'3 pcs',    cal:360,p:18,c:6, f:28} ],
    lunch:     [ {n:'Grilled chicken caesar',      qty:'1 bowl',   cal:460,p:42,c:8, f:28},
                {n:'Salmon + asparagus',            qty:'180g',     cal:480,p:40,c:6, f:32},
                {n:'Egg salad on lettuce',          qty:'1 bowl',   cal:380,p:24,c:4, f:28} ],
    snack:     [ {n:'Cheese & olives',             qty:'40g',      cal:200,p:8, c:2, f:18},
                {n:'Almonds',                       qty:'25g',      cal:150,p:5, c:3, f:13},
                {n:'Keto fat bombs',               qty:'2 pcs',    cal:180,p:4, c:2, f:16} ],
    dinner:    [ {n:'Ribeye steak + butter',       qty:'200g',     cal:600,p:50,c:0, f:44},
                {n:'Keto chicken bake',             qty:'1 plate',  cal:520,p:44,c:4, f:36},
                {n:'Zoodles + meat sauce',          qty:'1 bowl',   cal:420,p:36,c:8, f:26} ],
  },
  paleo: {
    breakfast:[ {n:'Eggs with sweet potato hash', qty:'1 plate',  cal:380,p:22,c:35,f:16},
                {n:'Coconut flour pancakes',       qty:'3 pcs',    cal:340,p:14,c:40,f:14},
                {n:'Fruit & nut bowl',             qty:'1 bowl',   cal:300,p:8, c:42,f:12} ],
    lunch:     [ {n:'Turkey lettuce wraps',        qty:'3 wraps',  cal:380,p:34,c:12,f:18},
                {n:'Grilled fish + veg',            qty:'180g',     cal:420,p:38,c:20,f:16},
                {n:'Bison burger (no bun)',         qty:'1 patty',  cal:440,p:42,c:8, f:26} ],
    snack:     [ {n:'Coconut & berries',           qty:'100g',     cal:180,p:2, c:22,f:10},
                {n:'Jerky beef',                    qty:'30g',      cal:120,p:18,c:4, f:3 },
                {n:'Apple & almond butter',        qty:'1 apple',  cal:200,p:4, c:26,f:10} ],
    dinner:    [ {n:'Roasted chicken + roots',     qty:'1 plate',  cal:500,p:40,c:38,f:18},
                {n:'Lamb chops + greens',           qty:'180g',     cal:520,p:44,c:12,f:32},
                {n:'Baked cod + cauliflower',       qty:'180g',     cal:420,p:38,c:18,f:18} ],
  },
  mediterranean: {
    breakfast:[ {n:'Greek yoghurt + honey + nuts', qty:'200g',     cal:280,p:16,c:28,f:10},
                {n:'Whole grain toast + hummus',   qty:'2 slices', cal:300,p:12,c:44,f:8 },
                {n:'Omelette with feta & olives',  qty:'2 eggs',   cal:340,p:20,c:10,f:22} ],
    lunch:     [ {n:'Falafel wrap + tahini',       qty:'1 wrap',   cal:440,p:16,c:56,f:16},
                {n:'Grilled sea bass + salad',      qty:'180g',     cal:420,p:38,c:14,f:20},
                {n:'Pasta with olive oil & veg',    qty:'1 bowl',   cal:460,p:16,c:66,f:14} ],
    snack:     [ {n:'Olives + cheese',             qty:'40g',      cal:180,p:6, c:4, f:16},
                {n:'Whole grain crackers + hummus', qty:'6 pcs',    cal:200,p:6, c:28,f:7 },
                {n:'Fresh figs',                    qty:'3 figs',   cal:140,p:2, c:36,f:0 } ],
    dinner:    [ {n:'Moussaka',                    qty:'1 portion',cal:480,p:24,c:38,f:26},
                {n:'Shrimp & couscous',             qty:'1 bowl',   cal:440,p:32,c:50,f:12},
                {n:'Baked lamb + rice pilaf',       qty:'1 plate',  cal:520,p:38,c:52,f:18} ],
  },
  glutenfree: {
    breakfast:[ {n:'Rice flour crepes',            qty:'3 pcs',    cal:300,p:10,c:50,f:8 },
                {n:'GF oats + banana',             qty:'1 bowl',   cal:320,p:10,c:58,f:6 },
                {n:'Eggs + hash browns',           qty:'1 plate',  cal:360,p:20,c:35,f:14} ],
    lunch:     [ {n:'Rice bowl + grilled tofu',    qty:'1 bowl',   cal:420,p:22,c:58,f:10},
                {n:'Quinoa salad + chickpeas',      qty:'1 bowl',   cal:380,p:18,c:52,f:10},
                {n:'Gluten-free pasta + sauce',     qty:'1 bowl',   cal:440,p:16,c:70,f:10} ],
    snack:     [ {n:'Rice cakes + nut butter',     qty:'2 cakes',  cal:190,p:5, c:24,f:9 },
                {n:'Mixed nuts',                    qty:'30g',      cal:180,p:5, c:6, f:16},
                {n:'GF protein bar',               qty:'1 bar',    cal:200,p:15,c:20,f:6 } ],
    dinner:    [ {n:'Grilled chicken + rice',      qty:'1 plate',  cal:480,p:44,c:50,f:10},
                {n:'Baked potato + broccoli',       qty:'1 plate',  cal:380,p:12,c:62,f:8 },
                {n:'Stir fry rice noodles',        qty:'1 bowl',   cal:420,p:18,c:68,f:8 } ],
  }
};

const MEAL_META = [
  { icon:'🌅', name:'Breakfast', time:'7:00 – 8:00 AM' },
  { icon:'☀️', name:'Lunch',     time:'12:30 – 1:30 PM' },
  { icon:'🌆', name:'Snack',     time:'4:00 – 5:00 PM' },
  { icon:'🌙', name:'Dinner',    time:'7:30 – 8:30 PM' },
];

function generatePlan() {
  if (selectedPrefs.length === 0) {
    showToast('Please select at least 1 food preference.', '⚠️');
    return;
  }

  // Pick primary preference for food lookup (first selected)
  const pref = selectedPrefs[0];
  const mealKeys = ['breakfast','lunch','snack','dinner'];
  const foods = FOOD_DB[pref] || FOOD_DB.veg;

  currentPlan = mealKeys.map(mk => {
    const options = foods[mk] || [];
    // Pick 2–3 items
    const items = shuffle(options).slice(0,2);
    return {
      key: mk,
      items
    };
  });

  // Calculate totals
  let totalCal=0, totalP=0, totalC=0, totalF=0;
  currentPlan.forEach(m => m.items.forEach(i => {
    totalCal += i.cal; totalP += i.p; totalC += i.c; totalF += i.f;
  }));

  // Apply target calorie scaling from user profile
  const target = userProfile.targetCal || 2000;
  const scale  = target / (totalCal || 2000);
  currentPlan.forEach(m => m.items.forEach(i => {
    i.cal = Math.round(i.cal * scale);
    i.p   = Math.round(i.p   * scale);
    i.c   = Math.round(i.c   * scale);
    i.f   = Math.round(i.f   * scale);
  }));

  currentMacros = {
    cal: userProfile.targetCal || 2000,
    p:   userProfile.targetCal ? Math.round(userProfile.targetCal * .30 / 4) : Math.round(totalP * scale),
    c:   userProfile.targetCal ? Math.round(userProfile.targetCal * .45 / 4) : Math.round(totalC * scale),
    f:   userProfile.targetCal ? Math.round(userProfile.targetCal * .25 / 9) : Math.round(totalF * scale),
  };

  // Render
  document.getElementById('d-cal').textContent  = currentMacros.cal;
  document.getElementById('d-prot').textContent = currentMacros.p + 'g';
  document.getElementById('d-carbs').textContent= currentMacros.c + 'g';
  document.getElementById('d-fat').textContent  = currentMacros.f + 'g';

  renderMacroProgress();
  showMeal(0, document.querySelector('.meal-tab'));
  document.getElementById('plan-section').classList.remove('hidden');
  showToast('Meal plan generated! 🍽️', '✅');
}

function renderMacroProgress() {
  const {p,c,f} = currentMacros;
  const total = p*4 + c*4 + f*9;
  const bars = [
    {name:'Protein', val:p, unit:'g', pct:Math.round(p*4/total*100), color:'#3b5bdb'},
    {name:'Carbs',   val:c, unit:'g', pct:Math.round(c*4/total*100), color:'#7048e8'},
    {name:'Fat',     val:f, unit:'g', pct:Math.round(f*9/total*100), color:'#22d3ee'},
  ];
  document.getElementById('macro-progress').innerHTML = bars.map(b=>`
    <div class="macro-bar-row">
      <div class="macro-bar-lbl">${b.name}</div>
      <div class="macro-bar-track">
        <div class="macro-bar-fill" style="width:${b.pct}%;background:${b.color}"></div>
      </div>
      <div class="macro-bar-num">${b.val}g · ${b.pct}%</div>
    </div>
  `).join('');
}

function showMeal(idx, btn) {
  document.querySelectorAll('.meal-tab').forEach(t=>t.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const meal = currentPlan[idx];
  const meta = MEAL_META[idx];
  if (!meal) return;
  const mealCal = meal.items.reduce((a,i)=>a+i.cal, 0);
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
        ${meal.items.map(item=>`
          <div class="food-row">
            <div>
              <div class="food-name">${item.n || item.name}</div>
              <div class="food-macros">
                <span>P: <span>${item.p}g</span></span>
                <span>C: <span>${item.c}g</span></span>
                <span>F: <span>${item.f}g</span></span>
              </div>
            </div>
            <div style="margin-left:auto">
              <div class="food-qty">${item.qty}</div>
              <div style="font-size:12px;color:var(--muted);text-align:right">${item.cal} kcal</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function savePlanToFirestore() {
  const user = auth.currentUser;
  if (!user) return;
  await db.collection('users').doc(user.uid).update({
    savedPlan:  currentPlan,
    savedPrefs: selectedPrefs,
    savedMacros: currentMacros,
  });
  showToast('Diet plan saved to your profile! 💾', '✅');
}

function downloadPlan() {
  // Build a simple printable representation
  const prefs = selectedPrefs.join(', ') || 'Mixed';
  let html = `<html><head><meta charset="UTF-8"><style>
    body{font-family:Arial,sans-serif;padding:32px;max-width:700px;margin:0 auto}
    h1{color:#3b5bdb;margin-bottom:4px}
    .sub{color:#6b7280;font-size:14px;margin-bottom:24px}
    .meal{border:1px solid #e4e7f5;border-radius:10px;padding:16px;margin-bottom:16px}
    .meal-title{font-weight:800;font-size:17px;margin-bottom:8px}
    .item{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f2ff;font-size:14px}
    .macros{color:#3b5bdb;font-size:12px;margin-top:12px}
    .footer{margin-top:32px;font-size:12px;color:#6b7280;text-align:center}
  </style></head><body>
    <h1>🥗 IronPlate — My Diet Plan</h1>
    <div class="sub">Preferences: ${prefs} · Target: ${currentMacros.cal} kcal/day</div>
    <div class="macros">Daily Macros — Protein: ${currentMacros.p}g | Carbs: ${currentMacros.c}g | Fat: ${currentMacros.f}g</div><br>
    ${currentPlan.map((meal,i)=>`
      <div class="meal">
        <div class="meal-title">${MEAL_META[i].icon} ${MEAL_META[i].name} — ${MEAL_META[i].time}</div>
        ${meal.items.map(item=>`
          <div class="item">
            <span>${item.n || item.name} (${item.qty})</span>
            <span>${item.cal} kcal | P:${item.p}g C:${item.c}g F:${item.f}g</span>
          </div>
        `).join('')}
      </div>
    `).join('')}
    <div class="footer">Generated by IronPlate • ironplate.app</div>
  </body></html>`;

  const blob = new Blob([html], {type:'text/html'});
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'IronPlate-DietPlan.html';
  a.click();
  showToast('Diet plan downloaded! Open the file in any browser to print.', '⬇️');
}

function shuffle(arr) { return [...arr].sort(()=>Math.random()-.5); }