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