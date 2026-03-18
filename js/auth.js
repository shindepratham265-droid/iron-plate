// js/auth.js — IronPlate Auth Logic

// ── Guard flag: set to true while a login/register request is in flight.
//    This stops onAuthStateChanged from redirecting BEFORE the user even
//    clicks submit (e.g. if Firebase briefly emits a cached user state).
let isSubmitting = false;

// ── If already logged in, skip the auth page entirely ──
// We use a short delay so Firebase has time to settle its auth state
// before we decide to redirect.
let authCheckDone = false;
auth.onAuthStateChanged(user => {
  if (isSubmitting) return;   // mid-request — ignore the event
  if (authCheckDone) return;  // already handled once
  authCheckDone = true;

  if (user) {
    // User is genuinely already signed in — send them home
    db.collection('users').doc(user.uid).get().then(doc => {
      if (doc.exists && doc.data().profileComplete) {
        window.location.href = 'dashboard.html';
      } else {
        window.location.href = 'profile.html';
      }
    }).catch(() => {
      window.location.href = 'profile.html';
    });
  }
  // If no user, do nothing — stay on auth.html so they can register/login
});

// ── Tab switching ──
function switchTab(tab) {
  const tabs = document.querySelectorAll('.tab');
  document.getElementById('form-login').classList.toggle('hidden', tab !== 'login');
  document.getElementById('form-register').classList.toggle('hidden', tab !== 'register');
  tabs[0].classList.toggle('active', tab === 'login');
  tabs[1].classList.toggle('active', tab === 'register');
}

// ── Password strength ──
function checkStrength(pw) {
  const segs = ['s1','s2','s3','s4'];
  const colors = ['#ef4444','#f59e0b','#3b5bdb','#12b886'];
  const labels = ['Too weak','Fair','Good','Strong 💪'];
  let score = 0;
  if (pw.length >= 8)              score++;
  if (/[A-Z]/.test(pw))            score++;
  if (/[0-9]/.test(pw))            score++;
  if (/[^A-Za-z0-9]/.test(pw))    score++;
  segs.forEach((id,i)=>{
    document.getElementById(id).style.background = i < score ? colors[score-1] : 'var(--border)';
  });
  document.getElementById('strength-label').textContent = score > 0 ? labels[score-1] : 'Use 8+ chars, numbers & symbols';
}

// ── Validation helpers ──
function showErr(id, show) {
  document.getElementById(id).classList.toggle('show', show);
}
function val(id) { return document.getElementById(id).value.trim(); }

// ── LOGIN ──
async function doLogin() {
  const email = val('li-email'), pass = val('li-pass');
  let ok = true;
  showErr('li-email-err', !email || !email.includes('@')); if (!email || !email.includes('@')) ok=false;
  showErr('li-pass-err',  !pass);                          if (!pass) ok=false;
  if (!ok) return;

  const btn = document.getElementById('btn-login');
  btn.textContent = 'Logging in…'; btn.disabled = true;
  isSubmitting = true;

  try {
    await auth.signInWithEmailAndPassword(email, pass);
    showToast('Welcome back! 👋', '✅');
    // Check if profile complete
    const user = auth.currentUser;
    const doc  = await db.collection('users').doc(user.uid).get();
    if (doc.exists && doc.data().profileComplete) {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = 'profile.html';
    }
  } catch(e) {
    isSubmitting = false;
    showToast(friendlyError(e.code), '❌');
    btn.textContent = 'Log In →'; btn.disabled = false;
  }
}

// ── REGISTER ──
async function doRegister() {
  const first = val('reg-first'), last = val('reg-last');
  const email = val('reg-email'), pass = val('reg-pass'), pass2 = val('reg-pass2');
  let ok = true;

  showErr('reg-first-err', !first);                         if(!first) ok=false;
  showErr('reg-last-err',  !last);                          if(!last) ok=false;
  showErr('reg-email-err', !email||!email.includes('@'));   if(!email||!email.includes('@')) ok=false;
  showErr('reg-pass-err',  pass.length < 8);                if(pass.length<8) ok=false;
  showErr('reg-pass2-err', pass !== pass2);                 if(pass!==pass2) ok=false;
  if (!ok) return;

  const btn = document.getElementById('btn-reg');
  btn.textContent = 'Creating account…'; btn.disabled = true;
  isSubmitting = true;

  try {
    // Step 1: Create the Firebase Auth user
    const cred = await auth.createUserWithEmailAndPassword(email, pass);

    // Step 2: Set display name
    await cred.user.updateProfile({ displayName: `${first} ${last}` });

    // Step 3: Save user doc to Firestore
    // If this fails we still proceed — profile.js will create it on save
    try {
      await db.collection('users').doc(cred.user.uid).set({
        firstName:       first,
        lastName:        last,
        email:           email,
        createdAt:       firebase.firestore.FieldValue.serverTimestamp(),
        profileComplete: false
      });
    } catch(dbErr) {
      console.warn('Firestore write failed (check rules), continuing anyway:', dbErr.message);
    }

    showToast("Account created! Let's set up your profile 🎉", '✅');
    window.location.href = 'profile.html';

  } catch(e) {
    isSubmitting = false;
    showToast(friendlyError(e.code), '❌');
    btn.textContent = 'Create Account →'; btn.disabled = false;
  }
}

// ── Friendly Firebase error messages ──
function friendlyError(code) {
  const map = {
    'auth/user-not-found':       'No account found with that email.',
    'auth/wrong-password':       'Incorrect password. Try again.',
    'auth/email-already-in-use': 'That email is already registered.',
    'auth/invalid-email':        'Please enter a valid email address.',
    'auth/weak-password':        'Password must be at least 6 characters.',
    'auth/too-many-requests':    'Too many attempts. Please wait a moment.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

// ── Allow Enter key to submit ──
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    if (!document.getElementById('form-login').classList.contains('hidden')) doLogin();
    else doRegister();
  }
});