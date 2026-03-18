// js/dashboard.js — IronPlate Dashboard

window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>30);
});
function toggleMob(){document.getElementById('mob-menu').classList.toggle('open')}

requireAuth(async user => {
  const av = (user.displayName || user.email)[0].toUpperCase();
  document.getElementById('nav-avatar').textContent = av;

  // Greeting
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name  = user.displayName ? user.displayName.split(' ')[0] : 'there';
  document.getElementById('greeting').textContent = `${greet}, ${name}! 👋`;

  // Load profile from Firestore
  const doc = await db.collection('users').doc(user.uid).get();
  if (!doc.exists || !doc.data().profileComplete) {
    window.location.href = 'profile.html';
    return;
  }
  const p = doc.data();
  document.getElementById('dash-sub').textContent = `${p.goal ? goalLabel(p.goal) : ''} · ${p.weight} kg · ${p.height} cm`;

  // Stats
  document.getElementById('s-cal').textContent    = p.targetCal ? `${p.targetCal} kcal` : '—';
  document.getElementById('s-cal-ch').textContent = p.tdee ? `TDEE: ${p.tdee} kcal` : '';
  document.getElementById('s-weight').textContent = p.weight ? `${p.weight} kg` : '—';
  document.getElementById('s-bmi').textContent    = p.bmi ? `BMI: ${p.bmi}` : '';
  document.getElementById('s-steps').textContent  = p.steps ? p.steps.toLocaleString() : '—';
  document.getElementById('s-goal').textContent   = p.goal ? goalLabel(p.goal) : '—';

  // Profile chips
  const chips = [
    ['Age', p.age + ' yrs'],
    ['Height', p.height + ' cm'],
    ['Activity', cap(p.activity || '')],
    ['Sport', cap(p.sport || '')],
  ];
  document.getElementById('profile-chips').innerHTML = chips.map(([l,v])=>`
    <div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px 18px;min-width:100px">
      <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.5px">${l}</div>
      <div style="font-family:var(--font-h);font-size:17px;font-weight:800;color:var(--text);margin-top:2px">${v}</div>
    </div>
  `).join('');

  // Activity chart (simulated for demo)
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const heights = [40,65,30,80,55,90,70];
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = today === 0 ? 6 : today-1;
  document.getElementById('act-chart').innerHTML = days.map((d,i)=>`
    <div class="act-bar-wrap">
      <div class="act-bar ${i<=todayIdx?'filled':''}" style="height:${heights[i]}%"></div>
      <div class="act-day">${d}</div>
    </div>
  `).join('');

  // Macro rings (based on targetCal)
  renderMacroRings(p.targetCal || 2000, p.goal || 'maintain');
});

function renderMacroRings(cal, goal) {
  // Macro ratios by goal
  const ratios = {
    lose:     { p:.35, c:.40, f:.25 },
    cut:      { p:.40, c:.35, f:.25 },
    maintain: { p:.30, c:.45, f:.25 },
    gain:     { p:.30, c:.50, f:.20 },
    bulk:     { p:.25, c:.55, f:.20 },
    athletic: { p:.30, c:.50, f:.20 },
  };
  const r = ratios[goal] || ratios.maintain;
  const protein = Math.round(cal * r.p / 4);
  const carbs   = Math.round(cal * r.c / 4);
  const fat     = Math.round(cal * r.f / 9);

  const macros = [
    { label:'Protein', val:protein, unit:'g', color:'#3b5bdb', pct:r.p*100 },
    { label:'Carbs',   val:carbs,   unit:'g', color:'#7048e8', pct:r.c*100 },
    { label:'Fat',     val:fat,     unit:'g', color:'#22d3ee', pct:r.f*100 },
  ];

  document.getElementById('macro-rings').innerHTML = macros.map(m=>`
    <div class="ring-wrap">
      <svg class="ring-svg" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r="28" fill="none" stroke="var(--border)" stroke-width="7"/>
        <circle cx="35" cy="35" r="28" fill="none" stroke="${m.color}" stroke-width="7"
          stroke-dasharray="${(m.pct/100)*175.9} 175.9"
          stroke-dashoffset="44"
          stroke-linecap="round"
          transform="rotate(-90 35 35)"
          style="transition:stroke-dasharray 1s ease"/>
        <text x="35" y="40" text-anchor="middle" font-size="13" font-weight="800" fill="${m.color}" font-family="Syne,sans-serif">${m.pct.toFixed(0)}%</text>
      </svg>
      <div class="ring-val">${m.val}${m.unit}</div>
      <div class="ring-label">${m.label}</div>
    </div>
  `).join('');
}

function goalLabel(g) {
  const m = {lose:'Lose Weight',cut:'Cut',maintain:'Maintain',gain:'Gain Muscle',bulk:'Bulk',athletic:'Athletic'};
  return m[g] || g;
}
function cap(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : ''; }

function doLogout() {
  auth.signOut().then(() => window.location.href = 'index.html');
}