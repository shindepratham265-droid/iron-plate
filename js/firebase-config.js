const firebaseConfig = {
  apiKey:            "AIzaSyCPN_8hg5JmOUYnNO10g1bbGxIrco1IB-A",
  authDomain:        "ironplate-app.firebaseapp.com",
  projectId:         "ironplate-app",
  storageBucket:     "ironplate-app.firebasestorage.app",
  messagingSenderId: "101477362529",
  appId:             "1:101477362529:web:cb3aa18d5f680d80e4b320"
};

firebase.initializeApp(firebaseConfig);

// Global references used by all pages
const auth      = firebase.auth();
const db        = firebase.firestore();

// ── Helper: show toast notification ──
function showToast(msg, icon = '✅') {
  let t = document.getElementById('global-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'global-toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = `<span class="toast-icon">${icon}</span>${msg}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ── Helper: require auth (call at top of protected pages) ──
function requireAuth(cb) {
  auth.onAuthStateChanged(user => {
    if (!user) { window.location.href = 'auth.html'; return; }
    cb(user);
  });
}

// ── LocalStorage Fallback Helpers ──
// These allow the app to work even when Firestore rules block access.
function saveUserLocal(uid, data) {
  try {
    const existing = JSON.parse(localStorage.getItem('ip_user_' + uid) || '{}');
    const merged = { ...existing, ...data };
    localStorage.setItem('ip_user_' + uid, JSON.stringify(merged));
  } catch(e) { console.warn('localStorage save failed:', e); }
}

function getUserLocal(uid) {
  try {
    return JSON.parse(localStorage.getItem('ip_user_' + uid) || 'null');
  } catch(e) { return null; }
}

// Unified save: tries Firestore first, always saves to localStorage as backup
async function saveUserData(uid, data) {
  // Always save locally first so the app works immediately
  saveUserLocal(uid, data);
  try {
    await db.collection('users').doc(uid).set(data, { merge: true });
    console.log('✅ Saved to Firestore');
  } catch(e) {
    console.warn('⚠️ Firestore write blocked (check rules), using localStorage:', e.message);
  }
}

// Unified read: tries Firestore first, falls back to localStorage
async function getUserData(uid) {
  try {
    const doc = await db.collection('users').doc(uid).get();
    if (doc.exists) {
      const data = doc.data();
      saveUserLocal(uid, data); // sync to local
      return data;
    }
  } catch(e) {
    console.warn('⚠️ Firestore read blocked (check rules), using localStorage:', e.message);
  }
  // Fallback to localStorage
  return getUserLocal(uid);
}