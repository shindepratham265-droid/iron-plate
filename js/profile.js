// js/profile.js — IronPlate Profile Onboarding

let profileData = {};
let currentStep = 1;

// ── Fade in once Firebase settles — prevents flash/redirect before auth loads ──
document.body.style.opacity = '0';

auth.onAuthStateChanged(user => {
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity .25s';

  if (!user) {
    window.location.href = 'auth.html';
    return;
  }

  document.getElementById('nav-avatar').textContent =
    (user.displayName || user.email)[0].toUpperCase();

  // Only redirect to dashboard if profile is already complete
  db.collection('users').doc(user.uid).get()
    .then(doc => {
      if (doc.exists && doc.data().profileComplete) {
        window.location.href = 'dashboard.html';
      }
      // If doc doesn't exist yet or profileComplete=false — stay on page
    })
    .catch(err => {
      // Firestore read error (rules not set) — still allow form fill
      console.warn('Profile read error (check Firestore rules):', err.message);
    });
});

// ── Step navigation ──
function goStep(n) {
  if (n > currentStep && !validateStep(currentStep)) return;

  document.getElementById('step'+currentStep).classList.add('hidden');
  document.getElementById('step'+n).classList.remove('hidden');

  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById('ps'+i);
    el.classList.remove('active','done');
    if (i < n)        el.classList.add('done');
    else if (i === n) el.classList.add('active');
  }

  if (n === 3) calcPreview();

  currentStep = n;
  window.scrollTo({top:0,behavior:'smooth'});
}

// ── Validate each step ──
function validateStep(step) {
  if (step === 1) {
    const age    = +document.getElementById('p-age').value;
    const weight = +document.getElementById('p-weight').value;
    const height = +document.getElementById('p-height').value;
    const sex    = document.getElementById('p-sex').value;
    const steps  = +document.getElementById('p-steps').value;
    let ok = true;

    function chk(id, errId, cond) {
      document.getElementById(errId).classList.toggle('show', !cond);
      if (!cond) ok = false;
    }
    chk('p-age',    'e-age',    age>=10 && age<=100);
    chk('p-weight', 'e-weight', weight>=30 && weight<=300);
    chk('p-height', 'e-height', height>=100 && height<=250);
    chk('p-sex',    'e-sex',    !!sex);
    chk('p-steps',  'e-steps',  steps>=0 && steps<=50000);

    if (ok) {
      profileData.age    = age;
      profileData.weight = weight;
      profileData.height = height;
      profileData.sex    = sex;
      profileData.steps  = steps;
    }
    return ok;
  }

  if (step === 2) {
    const actPill = document.querySelector('#activity-pills .pill.active');
    if (!actPill) {
      document.getElementById('e-activity').classList.add('show');
      return false;
    }
    document.getElementById('e-activity').classList.remove('show');
    profileData.activity = actPill.dataset.val;
    const sportPill = document.querySelector('#sport-pills .pill.active');
    profileData.sport = sportPill ? sportPill.dataset.val : 'general';
    return true;
  }

  return true;
}

// ── Pill selector ──
function selectPill(el, groupId) {
  document.querySelectorAll('#' + groupId + ' .pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const errEl = document.getElementById('e-activity');
  if (errEl) errEl.classList.remove('show');
}

// ── Goal card selector ──
function selectGoal(el) {
  document.querySelectorAll('#goal-cards .goal-card').forEach(g => g.classList.remove('active'));
  el.classList.add('active');
  profileData.goal = el.dataset.val;
  document.getElementById('e-goal').classList.remove('show');
  calcPreview();
}

// ── BMI + TDEE calculation ──
function calcPreview() {
  const { age, weight, height, sex, activity, goal } = profileData;
  if (!age || !weight || !height) return;

  const h   = height / 100;
  const bmi = (weight / (h * h)).toFixed(1);

  let bmiCat = '', catColor = '';
  if      (bmi < 18.5) { bmiCat = 'Underweight'; catColor = '#3b5bdb'; }
  else if (bmi < 25)   { bmiCat = 'Normal ✅';   catColor = '#12b886'; }
  else if (bmi < 30)   { bmiCat = 'Overweight';  catColor = '#f59e0b'; }
  else                  { bmiCat = 'Obese';       catColor = '#ef4444'; }

  // BMR (Mifflin-St Jeor)
  const bmr = 10*weight + 6.25*height - 5*age + (sex === 'female' ? -161 : 5);

  const actMap = { sedentary:1.2, light:1.375, moderate:1.55, very:1.725, extra:1.9 };
  const tdee   = Math.round(bmr * (actMap[activity] || 1.55));

  const goalMap = { lose:-500, cut:-300, maintain:0, gain:300, bulk:500, athletic:200 };
  const targetCal = tdee + (goalMap[goal] || 0);

  document.getElementById('bmi-val').textContent  = bmi;
  document.getElementById('bmi-cat').textContent  = bmiCat;
  document.getElementById('bmi-cat').style.color  = catColor;
  document.getElementById('tdee-val').textContent = tdee + ' kcal';
  document.getElementById('goal-cal').textContent = targetCal + ' kcal';
  document.getElementById('bmi-card').style.display = 'block';

  profileData.bmi       = parseFloat(bmi);
  profileData.tdee      = tdee;
  profileData.targetCal = targetCal;
}

// ── Save to Firestore ──
// Uses set() with merge:true so it works whether the doc exists or not.
// The earlier Firestore write in auth.js may have failed if rules were
// restrictive — this call will create OR update the document safely.
async function saveProfile() {
  if (!validateStep(2)) { goStep(2); return; }
  if (!profileData.goal) {
    document.getElementById('e-goal').classList.add('show');
    return;
  }

  const btn = document.getElementById('btn-save');
  btn.textContent = 'Saving…'; btn.disabled = true;

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    await db.collection('users').doc(user.uid).set(
      {
        ...profileData,
        profileComplete: true,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }   // ← creates doc if missing, updates if exists
    );

    showToast('Profile saved! Welcome to IronPlate 🎉', '🚀');
    setTimeout(() => window.location.href = 'dashboard.html', 900);

  } catch(e) {
    console.error('Save error:', e);
    showToast('Error saving: ' + e.message, '❌');
    btn.textContent = 'Save & Continue 🚀'; btn.disabled = false;
  }
}