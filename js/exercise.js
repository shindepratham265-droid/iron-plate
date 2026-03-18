// js/exercise.js — IronPlate Exercise Library

window.addEventListener('scroll',()=>document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>30));
function toggleMob(){document.getElementById('mob-menu').classList.toggle('open')}

requireAuth(user => {
  document.getElementById('nav-avatar').textContent = (user.displayName || user.email)[0].toUpperCase();
});

const EX = [
  {name:'Barbell Bench Press',    g:'chest',    icon:'🏋️',sets:'4',reps:'8–10',      rest:'90s', badge:'Compound', bc:'#16a34a',primary:['Pectorals (major)'],     secondary:['Front Deltoid','Triceps'],          tip:'Keep shoulder blades pinched. Lower bar to mid-chest, not neck. Drive through heels.'},
  {name:'Incline Dumbbell Press', g:'chest',    icon:'💪',sets:'3',reps:'10–12',     rest:'75s', badge:'Isolation', bc:'#2563eb',primary:['Upper Pectorals'],       secondary:['Front Deltoid','Triceps'],          tip:"Set bench to 30–45°. Full stretch at bottom. Don't flare elbows past 45°."},
  {name:'Cable Flyes',            g:'chest',    icon:'🎯',sets:'3',reps:'12–15',     rest:'60s', badge:'Isolation', bc:'#2563eb',primary:['Pectorals (stretch)'],   secondary:['Front Deltoid'],                   tip:'Slight bend in elbow. Squeeze pecs hard at top like hugging a barrel.'},
  {name:'Push-Ups',               g:'chest',    icon:'⬇️',sets:'3',reps:'15–20',     rest:'60s', badge:'Bodyweight',bc:'#d97706',primary:['Pectorals'],             secondary:['Triceps','Core','Shoulders'],       tip:'Full ROM. Touch chest to floor. Keep elbows at 45°, not fully flared.'},
  {name:'Deadlift',               g:'back',     icon:'⚡',sets:'4',reps:'5–6',       rest:'3min',badge:'Compound', bc:'#16a34a',primary:['Erector Spinae','Traps','Lats'],secondary:['Hamstrings','Glutes','Core'],  tip:'Bar over mid-foot. Neutral spine. Drive hips forward at top. Never round lower back.'},
  {name:'Pull-Ups / Lat Pulldown',g:'back',     icon:'🔝',sets:'4',reps:'8–12',      rest:'90s', badge:'Compound', bc:'#16a34a',primary:['Latissimus Dorsi'],       secondary:['Biceps','Rear Deltoid','Rhomboids'],tip:'Full extension at bottom. Lead with elbows, pull to upper chest. No kipping.'},
  {name:'Bent-Over Barbell Row',  g:'back',     icon:'🔙',sets:'4',reps:'8–10',      rest:'90s', badge:'Compound', bc:'#16a34a',primary:['Rhomboids','Lats','Traps'],secondary:['Biceps','Rear Delt','Core'],       tip:'Hinge at hips 45°. Pull bar to lower chest. Squeeze shoulder blades at top.'},
  {name:'Seated Cable Row',       g:'back',     icon:'🔁',sets:'3',reps:'10–12',     rest:'75s', badge:'Isolation', bc:'#2563eb',primary:['Mid Traps','Rhomboids'],  secondary:['Lats','Biceps'],                   tip:'Keep torso upright. Pull handle to belly button. Hold 1 second squeeze.'},
  {name:'Overhead Press (OHP)',   g:'shoulders',icon:'⬆️',sets:'4',reps:'8–10',      rest:'90s', badge:'Compound', bc:'#16a34a',primary:['Anterior Deltoid','Lateral Deltoid'],secondary:['Triceps','Upper Traps','Core'],tip:'Press bar in slight arc. Lock out overhead. Keep core tight throughout.'},
  {name:'Lateral Raises',         g:'shoulders',icon:'↔️',sets:'4',reps:'12–15',     rest:'60s', badge:'Isolation', bc:'#2563eb',primary:['Lateral Deltoid'],        secondary:[],                                  tip:'Lead with elbow not wrist. No swinging. Slight forward lean improves activation.'},
  {name:'Face Pulls',             g:'shoulders',icon:'🎯',sets:'3',reps:'15–20',     rest:'45s', badge:'Isolation', bc:'#2563eb',primary:['Rear Deltoid','Rotator Cuff'],secondary:['Traps','Rhomboids'],            tip:'Pull to face height. Externally rotate at end. Great for shoulder health.'},
  {name:'Barbell Curl',           g:'arms',     icon:'💪',sets:'4',reps:'10–12',     rest:'60s', badge:'Isolation', bc:'#2563eb',primary:['Biceps Brachii'],         secondary:['Brachialis','Forearms'],           tip:"Don't swing elbows forward. Supinate at top. Full stretch at bottom."},
  {name:'Hammer Curl',            g:'arms',     icon:'🔨',sets:'3',reps:'12–15',     rest:'60s', badge:'Isolation', bc:'#2563eb',primary:['Brachialis','Brachioradialis'],secondary:['Biceps'],                  tip:'Neutral grip (thumbs up). Key for arm thickness and forearm size.'},
  {name:'Tricep Dips',            g:'arms',     icon:'⬇️',sets:'3',reps:'10–15',     rest:'75s', badge:'Compound', bc:'#16a34a',primary:['Triceps (all 3 heads)'],   secondary:['Chest','Front Delt'],              tip:'Stay upright for more tricep activation. Lower until arms parallel to floor.'},
  {name:'Skull Crushers',         g:'arms',     icon:'💀',sets:'3',reps:'10–12',     rest:'60s', badge:'Isolation', bc:'#2563eb',primary:['Triceps Long Head'],       secondary:['Lateral Tricep Head'],             tip:'Lower bar BEHIND head not to forehead. Keep elbows fixed. Squeeze at top.'},
  {name:'Barbell Back Squat',     g:'legs',     icon:'🦵',sets:'4',reps:'8–10',      rest:'2min',badge:'Compound', bc:'#16a34a',primary:['Quadriceps','Glutes'],     secondary:['Hamstrings','Core','Calves'],       tip:'Feet shoulder-width, toes out 30°. Break parallel. Knees track toes.'},
  {name:'Romanian Deadlift',      g:'legs',     icon:'🏋️',sets:'3',reps:'10–12',     rest:'90s', badge:'Compound', bc:'#16a34a',primary:['Hamstrings','Glutes'],     secondary:['Erector Spinae','Adductors'],       tip:'Hinge at hips. Feel hamstring stretch. Bar stays close to legs throughout.'},
  {name:'Leg Press',              g:'legs',     icon:'🔄',sets:'3',reps:'12–15',     rest:'90s', badge:'Compound', bc:'#16a34a',primary:['Quadriceps'],             secondary:['Glutes','Hamstrings'],             tip:"Don't lock knees at top. Full range. Higher feet = more glutes."},
  {name:'Walking Lunges',         g:'legs',     icon:'🚶',sets:'3',reps:'12 each',   rest:'75s', badge:'Compound', bc:'#16a34a',primary:['Quads','Glutes'],         secondary:['Hamstrings','Calves','Core'],       tip:'Long stride. Front knee behind toes. Keep torso upright throughout.'},
  {name:'Calf Raises',            g:'legs',     icon:'🦶',sets:'4',reps:'15–20',     rest:'45s', badge:'Isolation', bc:'#2563eb',primary:['Gastrocnemius','Soleus'], secondary:[],                                  tip:'Full range: all the way down and up. Pause 1 second at top.'},
  {name:'Plank',                  g:'core',     icon:'🛡️',sets:'3',reps:'45–60 sec', rest:'60s', badge:'Bodyweight',bc:'#d97706',primary:['Transverse Abdominis','Rectus Abdominis'],secondary:['Obliques','Shoulders','Glutes'],tip:"Neutral spine. Squeeze glutes and abs hard. Don't let hips sag or rise."},
  {name:'Cable Crunch',           g:'core',     icon:'🔗',sets:'3',reps:'15–20',     rest:'60s', badge:'Isolation', bc:'#2563eb',primary:['Rectus Abdominis'],       secondary:['Obliques'],                        tip:'Crunch ribs to hips not head to knees. Constant tension throughout.'},
  {name:'Russian Twists',         g:'core',     icon:'🌀',sets:'3',reps:'20 total',  rest:'45s', badge:'Bodyweight',bc:'#d97706',primary:['Obliques'],               secondary:['Rectus Abdominis','Hip Flexors'],   tip:'Lean back 45°. Controlled rotation. Add weight plate to progress.'},
  {name:'Hanging Leg Raise',      g:'core',     icon:'🏃',sets:'3',reps:'10–15',     rest:'75s', badge:'Bodyweight',bc:'#d97706',primary:['Lower Abs','Hip Flexors'],secondary:['Obliques','Forearms'],              tip:'No swinging. Curl pelvis up at top. Lower slowly for maximum tension.'},
  {name:'HIIT Sprint Intervals',  g:'cardio',   icon:'🏃',sets:'8',reps:'30s on/90s off',rest:'Built-in',badge:'Cardio',bc:'#dc2626',primary:['Heart','Lungs'],     secondary:['Full Body','Legs'],                tip:'All-out effort in sprint phase. Walk (not stand) in rest phase.'},
  {name:'Jump Rope',              g:'cardio',   icon:'💫',sets:'5',reps:'2 min rounds',rest:'60s',badge:'Cardio',   bc:'#dc2626',primary:['Calves','Coordination'], secondary:['Shoulders','Core'],                 tip:'Land softly on balls of feet. Small jumps are more efficient than big hops.'},
  {name:'Cycling / Stationary',   g:'cardio',   icon:'🚴',sets:'1',reps:'20–30 min', rest:'—',   badge:'Cardio',   bc:'#dc2626',primary:['Cardiovascular System'], secondary:['Quads','Glutes'],                   tip:'Vary resistance every 5 minutes. Aim for 70–80% of max heart rate.'},
  {name:'Rowing Machine',         g:'cardio',   icon:'🚣',sets:'4',reps:'500m sprints',rest:'90s',badge:'Cardio',  bc:'#dc2626',primary:['Cardiovascular System','Back'],secondary:['Arms','Core','Legs'],           tip:'Legs → hips → arms on the drive. Power comes from legs, not arms.'},
];

const GC = {chest:'#2563eb',back:'#0891b2',shoulders:'#d97706',arms:'#dc2626',legs:'#7c3aed',core:'#16a34a',cardio:'#dc2626'};

function renderEx(filter) {
  const list = filter==='all' ? EX : EX.filter(e=>e.g===filter);
  document.getElementById('ex-count').textContent = filter==='all'
    ? `Showing all ${EX.length} exercises`
    : `Showing ${list.length} ${filter} exercises`;

  document.getElementById('ex-grid').innerHTML = list.map((e,i)=>{
    const gc = GC[e.g]||'#2563eb';
    const muscles = [...e.primary,...e.secondary].slice(0,4);
    return `
    <div class="ex-card" data-group="${e.g}" style="animation-delay:${i*0.04}s">
      <div class="ex-card-top">
        <div class="ex-card-icon">${e.icon}</div>
        <div class="ex-badges">
          <span class="ex-badge" style="background:${e.bc}15;color:${e.bc};border:1px solid ${e.bc}30">${e.badge}</span>
          <span class="ex-badge" style="background:${gc}12;color:${gc};border:1px solid ${gc}25">${cap(e.g)}</span>
        </div>
      </div>
      <div class="ex-card-body">
        <div class="ex-name">${e.name}</div>
        <div class="ex-target">Primary: <b>${e.primary[0]}</b></div>
        <div class="ex-stats">
          <div class="ex-stat"><div class="es-val" style="color:${gc}">${e.sets}</div><div class="es-lbl">Sets</div></div>
          <div class="ex-stat"><div class="es-val" style="color:${gc}">${e.reps}</div><div class="es-lbl">Reps</div></div>
          <div class="ex-stat"><div class="es-val" style="color:var(--amber)">${e.rest}</div><div class="es-lbl">Rest</div></div>
        </div>
        <div class="ex-muscles">${muscles.map(m=>`<span class="ex-tag">${m}</span>`).join('')}</div>
        <div class="ex-tip">${e.tip}</div>
      </div>
    </div>`;
  }).join('');
}

function filterEx(group, btn) {
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  renderEx(group);
}

function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}

// Muscle map click
document.querySelectorAll('.muscle-zone').forEach(z=>{
  z.addEventListener('click', function(){
    const g = this.dataset.group;
    const btn = [...document.querySelectorAll('.chip')].find(c=>c.textContent.toLowerCase().includes(g));
    if (btn) filterEx(g, btn);
  });
  // Hover pulse
  z.addEventListener('mouseenter', function(){ this.style.opacity='1'; });
  z.addEventListener('mouseleave', function(){ this.style.opacity='.85'; });
});

renderEx('all');