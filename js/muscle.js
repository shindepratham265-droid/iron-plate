// js/muscle.js — IronPlate Enhanced Muscle Growth Tracker

window.addEventListener('scroll', () =>
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30));
function toggleMob() { document.getElementById('mob-menu').classList.toggle('open'); }

requireAuth(user => {
  document.getElementById('nav-avatar').textContent =
    (user.displayName || user.email)[0].toUpperCase();
});

/* ══════════════════════════════════════════════
   MUSCLE CLICK INFO DATA
   ══════════════════════════════════════════════ */
const MUSCLE_INFO = {
  chest: {
    name: 'Pectorals (Chest)',
    icon: '🫀',
    sub: 'Large fan-shaped pushing muscle',
    exercises: [
      { name: 'Bench Press', detail: '4×8–12 reps · 90s rest · Primary mass builder' },
      { name: 'Incline Dumbbell', detail: '3×10–14 reps · 75s rest · Upper chest focus' },
      { name: 'Cable Flyes', detail: '3×12–15 reps · 60s rest · Isolation & peak contraction' },
      { name: 'Push-Ups', detail: '3×15–20 reps · 45s rest · Volume & endurance' },
    ],
    diet: [
      '🥚 Eat 1.8–2.2g protein per kg bodyweight to fuel hypertrophy',
      '🍚 Add 50g fast carbs (rice, banana) post-workout to spike insulin',
      '🥑 Healthy fats from avocado & nuts support testosterone production',
    ],
    stats: { fiber: 'Type II (Fast-twitch) dominant', growth: 'Visible growth in 4–6 weeks', max: 'Full development: 12–16 weeks' },
  },
  shoulders: {
    name: 'Deltoids (Shoulders)',
    icon: '⬆️',
    sub: '3-headed muscle: anterior, lateral, posterior',
    exercises: [
      { name: 'Overhead Press', detail: '4×6–10 reps · 120s rest · King of shoulder mass' },
      { name: 'Lateral Raises', detail: '4×12–20 reps · 45s rest · Width builder' },
      { name: 'Arnold Press', detail: '3×10–12 reps · 90s rest · Full 3-head activation' },
      { name: 'Rear Delt Flyes', detail: '3×15 reps · 60s rest · Posture & balance' },
    ],
    diet: [
      '🐔 Chicken breast & turkey provide lean protein for shoulder repair',
      '🧃 Consume BCAAs during training to reduce muscle breakdown',
      '⚡ Creatine monohydrate (5g/day) significantly boosts shoulder strength',
    ],
    stats: { fiber: 'Mixed fiber types', growth: 'Shape visible in 6–8 weeks', max: 'Capped delts: 16–20 weeks' },
  },
  biceps: {
    name: 'Biceps Brachii',
    icon: '💪',
    sub: '2-headed muscle: long head & short head',
    exercises: [
      { name: 'Barbell Curl', detail: '4×8–12 reps · 75s rest · Maximum load & peak' },
      { name: 'Incline Dumbbell Curl', detail: '3×10–14 reps · 60s rest · Long head stretch' },
      { name: 'Hammer Curl', detail: '3×12 reps · 60s rest · Brachialis & forearm' },
      { name: 'Cable Curl', detail: '3×15 reps · 45s rest · Constant tension' },
    ],
    diet: [
      '🥩 Red meat & eggs provide heme iron needed for bicep endurance',
      '🍌 Banana pre-workout gives quick energy for high-rep sets',
      '🥛 Casein protein before bed supports overnight muscle synthesis',
    ],
    stats: { fiber: 'Type I & II mixed', growth: 'Peak forming in 8–10 weeks', max: 'Full peak: 16+ weeks' },
  },
  triceps: {
    name: 'Triceps Brachii',
    icon: '🔱',
    sub: '3-headed muscle: makes up 67% of arm size',
    exercises: [
      { name: 'Close-Grip Bench', detail: '4×6–10 reps · 90s rest · Heaviest tricep movement' },
      { name: 'Skull Crushers', detail: '3×10–12 reps · 75s rest · Long head mass' },
      { name: 'Tricep Pushdown', detail: '4×12–15 reps · 60s rest · Lateral head squeeze' },
      { name: 'Overhead Extension', detail: '3×12 reps · 60s rest · Long head full stretch' },
    ],
    diet: [
      '🧀 Cottage cheese (casein) before sleep maximises overnight tricep growth',
      '⚗️ Zinc & magnesium (ZMA) supplementation improves recovery speed',
      '🍳 Eggs at breakfast provide complete amino acids for muscle protein synthesis',
    ],
    stats: { fiber: 'Fast-twitch dominant', growth: 'Horseshoe visible: 10 weeks', max: 'Full development: 20 weeks' },
  },
  forearms: {
    name: 'Forearms',
    icon: '🦾',
    sub: 'Flexors, extensors & brachioradialis',
    exercises: [
      { name: 'Wrist Curls', detail: '3×15–20 reps · 45s rest · Flexor mass' },
      { name: 'Reverse Curls', detail: '3×12–15 reps · 60s rest · Extensor & brachioradialis' },
      { name: 'Farmer\'s Walk', detail: '3×30m · 90s rest · Grip strength & overall density' },
      { name: 'Dead Hang', detail: '3×30–60s · 90s rest · Global grip endurance' },
    ],
    diet: [
      '🐟 Salmon omega-3s reduce inflammation in forearm tendons',
      '🥜 Brazil nuts & seeds provide selenium for connective tissue health',
      '💧 Stay well hydrated — tendons hold water and dehydration = injury risk',
    ],
    stats: { fiber: 'Endurance (Type I) heavy', growth: 'Density visible: 8 weeks', max: 'Slow growers: 20–24 weeks' },
  },
  lats: {
    name: 'Latissimus Dorsi (Back)',
    icon: '🪃',
    sub: 'Largest back muscle — creates the V-taper',
    exercises: [
      { name: 'Pull-Ups', detail: '4×6–12 reps · 120s rest · #1 back width builder' },
      { name: 'Bent-Over Row', detail: '4×8–10 reps · 90s rest · Thickness & strength' },
      { name: 'Lat Pulldown', detail: '4×10–12 reps · 75s rest · Width focus' },
      { name: 'Single-Arm Row', detail: '3×12 reps · 60s rest · Mind-muscle connection' },
    ],
    diet: [
      '🎣 Tuna & salmon: high protein + omega-3 for back muscle recovery',
      '🌰 Quinoa is a complete protein — ideal post-back-day meal base',
      '🍠 Sweet potato carbs replenish glycogen for successive back workouts',
    ],
    stats: { fiber: 'Mixed — power & endurance', growth: 'Width visible: 6–8 weeks', max: 'V-taper: 16–24 weeks' },
  },
  abs: {
    name: 'Core (Abs & Obliques)',
    icon: '⬡',
    sub: 'Rectus abdominis, transverse & obliques',
    exercises: [
      { name: 'Cable Crunch', detail: '4×15–20 reps · 45s rest · Weighted ab mass' },
      { name: 'Hanging Leg Raise', detail: '3×12–15 reps · 60s rest · Lower abs' },
      { name: 'Plank', detail: '3×45–90s · 60s rest · Transverse core' },
      { name: 'Russian Twists', detail: '3×20 reps · 45s rest · Oblique definition' },
    ],
    diet: [
      '🧾 Abs are made in the kitchen — maintain a 200–400 kcal daily deficit for visible abs',
      '🥬 Leafy greens are low-calorie, high-fibre foods that reduce belly bloat',
      '🚱 Limit sodium intake to reduce water retention and reveal definition',
    ],
    stats: { fiber: 'Endurance-dominant', growth: 'Core strength: 4–6 weeks', max: 'Visible at ~12% body fat' },
  },
  quads: {
    name: 'Quadriceps',
    icon: '🦵',
    sub: '4-headed muscle: front of thigh',
    exercises: [
      { name: 'Back Squat', detail: '4×5–8 reps · 180s rest · King of leg mass' },
      { name: 'Leg Press', detail: '4×10–15 reps · 90s rest · Safe high-volume option' },
      { name: 'Bulgarian Split Squat', detail: '3×10 reps · 90s rest · Balance & unilateral strength' },
      { name: 'Leg Extension', detail: '3×12–15 reps · 60s rest · VMO isolation' },
    ],
    diet: [
      '🍚 Rice & pasta within 1 hour post-leg-day maximises glycogen resynthesis',
      '🥩 Aim for 40–50g protein per post-leg meal — quads are huge muscles',
      '🍒 Tart cherry juice reduces DOMS — great after heavy squat sessions',
    ],
    stats: { fiber: 'Fast-twitch dominant', growth: 'Shape visible: 6–8 weeks', max: 'Full development: 20+ weeks' },
  },
  hamstrings: {
    name: 'Hamstrings',
    icon: '🏃',
    sub: '3-headed muscle: back of thigh',
    exercises: [
      { name: 'Romanian Deadlift', detail: '4×8–10 reps · 120s rest · #1 hamstring hypertrophy' },
      { name: 'Lying Leg Curl', detail: '4×10–15 reps · 75s rest · Full contraction' },
      { name: 'Nordic Curl', detail: '3×5–8 reps · 120s rest · Eccentric strength' },
      { name: 'Good Mornings', detail: '3×10 reps · 90s rest · Posterior chain power' },
    ],
    diet: [
      '🫐 Blueberries are antioxidant-rich — great for hamstring tendon recovery',
      '🥛 Whey protein immediately post-workout starts hamstring repair fast',
      '💊 Magnesium supplementation reduces hamstring cramping during training',
    ],
    stats: { fiber: 'Mixed — speed & strength', growth: 'Visible fullness: 8 weeks', max: 'Complete development: 24 weeks' },
  },
  glutes: {
    name: 'Gluteus (Glutes)',
    icon: '🍑',
    sub: 'Maximus, medius & minimus',
    exercises: [
      { name: 'Hip Thrust', detail: '4×8–12 reps · 90s rest · #1 glute activator' },
      { name: 'Back Squat', detail: '4×6–10 reps · 120s rest · Deep squat = max glutes' },
      { name: 'Romanian Deadlift', detail: '3×10 reps · 90s rest · Glute stretch & strength' },
      { name: 'Glute Kickback', detail: '3×15 reps · 60s rest · Isolation & tone' },
    ],
    diet: [
      '🥚 Eggs provide leucine — the most important amino acid for glute growth',
      '🫚 Olive oil & nuts: dietary fat supports testosterone needed for glute mass',
      '🍗 Eat protein every 3–4 hours to maintain positive protein synthesis for glutes',
    ],
    stats: { fiber: 'Fast-twitch + endurance', growth: 'Round shape: 6–10 weeks', max: 'Full development: 20–26 weeks' },
  },
  calves: {
    name: 'Calves (Gastrocnemius)',
    icon: '🦿',
    sub: 'Gastrocnemius & soleus',
    exercises: [
      { name: 'Standing Calf Raise', detail: '5×15–20 reps · 60s rest · Mass & shape' },
      { name: 'Seated Calf Raise', detail: '4×15–25 reps · 45s rest · Soleus deep muscle' },
      { name: 'Donkey Calf Raise', detail: '3×15–20 reps · 60s rest · High stretch range' },
      { name: 'Jump Rope', detail: '3×2min · 60s rest · Endurance + athletic calves' },
    ],
    diet: [
      '🐟 Fish oil reduces calf DOMS after high-volume raises',
      '🍌 Potassium-rich foods prevent calf cramps during training',
      '🥛 Dairy (leucine-rich) is essential for the notoriously slow-growing calves',
    ],
    stats: { fiber: 'Endurance-dominant (Type I)', growth: 'Shape noticeable: 10–12 weeks', max: 'Slow responders — 24–32 weeks' },
  },
};

/* ══════════════════════════════════════════════
   EXERCISE DEFINITIONS
   ══════════════════════════════════════════════ */
const EXERCISES = [
  {
    id: 'pushup', icon: '⬇️', name: 'Push-Ups',
    info: 'Chest, Triceps, Front Deltoid, Core',
    rate: 'Beginner-friendly. Chest grows fastest, visible gains by day 14.',
    zones: {
      'm-chest-l': { cx: 92, cy: 104, maxRx: 18, maxRy: 15, rate: 1.0, fill: 'rgba(220,50,50,VAL)', stroke: 'rgba(180,30,30,SVAL)' },
      'm-chest-r': { cx: 128, cy: 104, maxRx: 18, maxRy: 15, rate: 1.0, fill: 'rgba(220,50,50,VAL)', stroke: 'rgba(180,30,30,SVAL)' },
      'm-tri-l': { cx: 50, cy: 138, maxRx: 9, maxRy: 15, rate: 0.7, fill: 'rgba(180,50,80,VAL)', stroke: 'rgba(140,30,60,SVAL)' },
      'm-tri-r': { cx: 170, cy: 138, maxRx: 9, maxRy: 15, rate: 0.7, fill: 'rgba(180,50,80,VAL)', stroke: 'rgba(140,30,60,SVAL)' },
      'm-sho-l': { cx: 64, cy: 84, maxRx: 12, maxRy: 11, rate: 0.5, fill: 'rgba(210,80,40,VAL)', stroke: 'rgba(170,50,20,SVAL)' },
      'm-sho-r': { cx: 156, cy: 84, maxRx: 12, maxRy: 11, rate: 0.5, fill: 'rgba(210,80,40,VAL)', stroke: 'rgba(170,50,20,SVAL)' },
      'm-abs': { isRect: true, x: 94, y: 124, maxW: 32, maxH: 30, rate: 0.3, fill: 'rgba(200,60,60,VAL)', stroke: 'rgba(160,40,40,SVAL)' },
    }
  },
  {
    id: 'bench', icon: '🏋️', name: 'Bench Press',
    info: 'Pectorals (major/minor), Triceps, Front Deltoid',
    rate: 'Compound movement. Rapid chest & tricep hypertrophy from week 2.',
    zones: {
      'm-chest-l': { cx: 92, cy: 104, maxRx: 20, maxRy: 17, rate: 1.0, fill: 'rgba(220,50,50,VAL)', stroke: 'rgba(180,30,30,SVAL)' },
      'm-chest-r': { cx: 128, cy: 104, maxRx: 20, maxRy: 17, rate: 1.0, fill: 'rgba(220,50,50,VAL)', stroke: 'rgba(180,30,30,SVAL)' },
      'm-tri-l': { cx: 50, cy: 138, maxRx: 10, maxRy: 17, rate: 0.8, fill: 'rgba(180,50,80,VAL)', stroke: 'rgba(140,30,60,SVAL)' },
      'm-tri-r': { cx: 170, cy: 138, maxRx: 10, maxRy: 17, rate: 0.8, fill: 'rgba(180,50,80,VAL)', stroke: 'rgba(140,30,60,SVAL)' },
      'm-sho-l': { cx: 64, cy: 84, maxRx: 13, maxRy: 12, rate: 0.6, fill: 'rgba(210,80,40,VAL)', stroke: 'rgba(170,50,20,SVAL)' },
      'm-sho-r': { cx: 156, cy: 84, maxRx: 13, maxRy: 12, rate: 0.6, fill: 'rgba(210,80,40,VAL)', stroke: 'rgba(170,50,20,SVAL)' },
    }
  },
  {
    id: 'pullup', icon: '🔝', name: 'Pull-Ups',
    info: 'Latissimus Dorsi, Biceps Brachii, Rear Deltoid, Rhomboids',
    rate: 'Back width explodes by day 21. Bicep peaks visible by day 30.',
    zones: {
      'm-lat-l': { cx: 82, cy: 122, maxRx: 16, maxRy: 24, rate: 1.0, fill: 'rgba(180,45,45,VAL)', stroke: 'rgba(140,25,25,SVAL)' },
      'm-lat-r': { cx: 138, cy: 122, maxRx: 16, maxRy: 24, rate: 1.0, fill: 'rgba(180,45,45,VAL)', stroke: 'rgba(140,25,25,SVAL)' },
      'm-bi-l': { cx: 48, cy: 118, maxRx: 10, maxRy: 20, rate: 0.85, fill: 'rgba(200,60,60,VAL)', stroke: 'rgba(160,40,40,SVAL)' },
      'm-bi-r': { cx: 172, cy: 118, maxRx: 10, maxRy: 20, rate: 0.85, fill: 'rgba(200,60,60,VAL)', stroke: 'rgba(160,40,40,SVAL)' },
      'm-sho-l': { cx: 64, cy: 84, maxRx: 11, maxRy: 10, rate: 0.6, fill: 'rgba(210,80,40,VAL)', stroke: 'rgba(170,50,20,SVAL)' },
      'm-sho-r': { cx: 156, cy: 84, maxRx: 11, maxRy: 10, rate: 0.6, fill: 'rgba(210,80,40,VAL)', stroke: 'rgba(170,50,20,SVAL)' },
      'm-fa-l': { cx: 40, cy: 165, maxRx: 8, maxRy: 14, rate: 0.4, fill: 'rgba(190,70,60,VAL)', stroke: 'rgba(150,50,40,SVAL)' },
      'm-fa-r': { cx: 180, cy: 165, maxRx: 8, maxRy: 14, rate: 0.4, fill: 'rgba(190,70,60,VAL)', stroke: 'rgba(150,50,40,SVAL)' },
    }
  },
  {
    id: 'curl', icon: '💪', name: 'Bicep Curl',
    info: 'Biceps Brachii, Brachialis, Forearms',
    rate: 'Peak bicep shape forms around day 20. Forearm density by day 45.',
    zones: {
      'm-bi-l': { cx: 48, cy: 118, maxRx: 12, maxRy: 22, rate: 1.0, fill: 'rgba(200,60,60,VAL)', stroke: 'rgba(160,40,40,SVAL)' },
      'm-bi-r': { cx: 172, cy: 118, maxRx: 12, maxRy: 22, rate: 1.0, fill: 'rgba(200,60,60,VAL)', stroke: 'rgba(160,40,40,SVAL)' },
      'm-fa-l': { cx: 40, cy: 165, maxRx: 9, maxRy: 16, rate: 0.7, fill: 'rgba(190,70,60,VAL)', stroke: 'rgba(150,50,40,SVAL)' },
      'm-fa-r': { cx: 180, cy: 165, maxRx: 9, maxRy: 16, rate: 0.7, fill: 'rgba(190,70,60,VAL)', stroke: 'rgba(150,50,40,SVAL)' },
    }
  },
  {
    id: 'squat', icon: '🦵', name: 'Back Squat',
    info: 'Quadriceps, Glutes, Hamstrings, Core',
    rate: 'Quads and glutes grow rapidly. Full lower body transformation by day 45.',
    zones: {
      'm-quad-l': { cx: 91, cy: 252, maxRx: 18, maxRy: 34, rate: 1.0, fill: 'rgba(210,55,55,VAL)', stroke: 'rgba(170,35,35,SVAL)' },
      'm-quad-r': { cx: 129, cy: 252, maxRx: 18, maxRy: 34, rate: 1.0, fill: 'rgba(210,55,55,VAL)', stroke: 'rgba(170,35,35,SVAL)' },
      'm-glu-l': { cx: 93, cy: 215, maxRx: 16, maxRy: 18, rate: 0.9, fill: 'rgba(195,55,55,VAL)', stroke: 'rgba(155,35,35,SVAL)' },
      'm-glu-r': { cx: 127, cy: 215, maxRx: 16, maxRy: 18, rate: 0.9, fill: 'rgba(195,55,55,VAL)', stroke: 'rgba(155,35,35,SVAL)' },
      'm-ham-l': { cx: 91, cy: 262, maxRx: 16, maxRy: 28, rate: 0.7, fill: 'rgba(185,48,48,VAL)', stroke: 'rgba(145,28,28,SVAL)' },
      'm-ham-r': { cx: 129, cy: 262, maxRx: 16, maxRy: 28, rate: 0.7, fill: 'rgba(185,48,48,VAL)', stroke: 'rgba(145,28,28,SVAL)' },
      'm-abs': { isRect: true, x: 94, y: 124, maxW: 32, maxH: 30, rate: 0.4, fill: 'rgba(200,60,60,VAL)', stroke: 'rgba(160,40,40,SVAL)' },
    }
  },
  {
    id: 'rdl', icon: '🏋️', name: 'Romanian Deadlift',
    info: 'Hamstrings (all heads), Glutes, Erector Spinae',
    rate: 'Hamstring hypertrophy is unmatched. Glute roundness visible by day 25.',
    zones: {
      'm-ham-l': { cx: 91, cy: 262, maxRx: 18, maxRy: 32, rate: 1.0, fill: 'rgba(185,48,48,VAL)', stroke: 'rgba(145,28,28,SVAL)' },
      'm-ham-r': { cx: 129, cy: 262, maxRx: 18, maxRy: 32, rate: 1.0, fill: 'rgba(185,48,48,VAL)', stroke: 'rgba(145,28,28,SVAL)' },
      'm-glu-l': { cx: 93, cy: 215, maxRx: 18, maxRy: 20, rate: 0.85, fill: 'rgba(195,55,55,VAL)', stroke: 'rgba(155,35,35,SVAL)' },
      'm-glu-r': { cx: 127, cy: 215, maxRx: 18, maxRy: 20, rate: 0.85, fill: 'rgba(195,55,55,VAL)', stroke: 'rgba(155,35,35,SVAL)' },
      'm-lat-l': { cx: 82, cy: 122, maxRx: 11, maxRy: 20, rate: 0.7, fill: 'rgba(180,45,45,VAL)', stroke: 'rgba(140,25,25,SVAL)' },
      'm-lat-r': { cx: 138, cy: 122, maxRx: 11, maxRy: 20, rate: 0.7, fill: 'rgba(180,45,45,VAL)', stroke: 'rgba(140,25,25,SVAL)' },
    }
  },
  {
    id: 'ohp', icon: '⬆️', name: 'Overhead Press',
    info: 'Anterior & Lateral Deltoid, Triceps, Upper Traps',
    rate: 'Boulder shoulders develop by day 30. Tricep mass follows closely.',
    zones: {
      'm-sho-l': { cx: 64, cy: 84, maxRx: 17, maxRy: 16, rate: 1.0, fill: 'rgba(210,80,40,VAL)', stroke: 'rgba(170,50,20,SVAL)' },
      'm-sho-r': { cx: 156, cy: 84, maxRx: 17, maxRy: 16, rate: 1.0, fill: 'rgba(210,80,40,VAL)', stroke: 'rgba(170,50,20,SVAL)' },
      'm-tri-l': { cx: 50, cy: 138, maxRx: 10, maxRy: 17, rate: 0.7, fill: 'rgba(180,50,80,VAL)', stroke: 'rgba(140,30,60,SVAL)' },
      'm-tri-r': { cx: 170, cy: 138, maxRx: 10, maxRy: 17, rate: 0.7, fill: 'rgba(180,50,80,VAL)', stroke: 'rgba(140,30,60,SVAL)' },
      'm-abs': { isRect: true, x: 94, y: 124, maxW: 28, maxH: 25, rate: 0.4, fill: 'rgba(200,60,60,VAL)', stroke: 'rgba(160,40,40,SVAL)' },
    }
  },
  {
    id: 'plank', icon: '🛡️', name: 'Plank',
    info: 'Transverse Abdominis, Rectus Abdominis, Obliques',
    rate: 'Core density improves over 4–8 weeks. Subtle but powerful changes.',
    zones: {
      'm-abs': { isRect: true, x: 94, y: 124, maxW: 36, maxH: 34, rate: 1.0, fill: 'rgba(200,60,60,VAL)', stroke: 'rgba(160,40,40,SVAL)' },
      'm-obl-l': { cx: 78, cy: 148, maxRx: 10, maxRy: 18, rate: 0.8, fill: 'rgba(190,55,55,VAL)', stroke: 'rgba(150,35,35,SVAL)' },
      'm-obl-r': { cx: 142, cy: 148, maxRx: 10, maxRy: 18, rate: 0.8, fill: 'rgba(190,55,55,VAL)', stroke: 'rgba(150,35,35,SVAL)' },
      'm-sho-l': { cx: 64, cy: 84, maxRx: 9, maxRy: 8, rate: 0.4, fill: 'rgba(210,80,40,VAL)', stroke: 'rgba(170,50,20,SVAL)' },
      'm-sho-r': { cx: 156, cy: 84, maxRx: 9, maxRy: 8, rate: 0.4, fill: 'rgba(210,80,40,VAL)', stroke: 'rgba(170,50,20,SVAL)' },
    }
  },
  {
    id: 'legpress', icon: '🔄', name: 'Leg Press',
    info: 'Quadriceps (vastus lateralis/medialis), Glutes',
    rate: 'Quad size surges in first 3 weeks. Great for mass building.',
    zones: {
      'm-quad-l': { cx: 91, cy: 252, maxRx: 20, maxRy: 36, rate: 1.0, fill: 'rgba(210,55,55,VAL)', stroke: 'rgba(170,35,35,SVAL)' },
      'm-quad-r': { cx: 129, cy: 252, maxRx: 20, maxRy: 36, rate: 1.0, fill: 'rgba(210,55,55,VAL)', stroke: 'rgba(170,35,35,SVAL)' },
      'm-glu-l': { cx: 93, cy: 215, maxRx: 14, maxRy: 16, rate: 0.7, fill: 'rgba(195,55,55,VAL)', stroke: 'rgba(155,35,35,SVAL)' },
      'm-glu-r': { cx: 127, cy: 215, maxRx: 14, maxRy: 16, rate: 0.7, fill: 'rgba(195,55,55,VAL)', stroke: 'rgba(155,35,35,SVAL)' },
      'm-ham-l': { cx: 91, cy: 262, maxRx: 13, maxRy: 24, rate: 0.5, fill: 'rgba(185,48,48,VAL)', stroke: 'rgba(145,28,28,SVAL)' },
      'm-ham-r': { cx: 129, cy: 262, maxRx: 13, maxRy: 24, rate: 0.5, fill: 'rgba(185,48,48,VAL)', stroke: 'rgba(145,28,28,SVAL)' },
    }
  },
  {
    id: 'calf', icon: '🦶', name: 'Calf Raises',
    info: 'Gastrocnemius (upper calf), Soleus (lower calf)',
    rate: 'Calf hypertrophy is slower but very visible by day 60.',
    zones: {
      'm-calf-l': { cx: 88, cy: 352, maxRx: 15, maxRy: 28, rate: 1.0, fill: 'rgba(200,58,58,VAL)', stroke: 'rgba(160,38,38,SVAL)' },
      'm-calf-r': { cx: 132, cy: 352, maxRx: 15, maxRy: 28, rate: 1.0, fill: 'rgba(200,58,58,VAL)', stroke: 'rgba(160,38,38,SVAL)' },
    }
  },
];

const MUSCLE_LABELS = {
  'm-chest-l': 'Chest (L)', 'm-chest-r': 'Chest (R)',
  'm-sho-l': 'Shoulder (L)', 'm-sho-r': 'Shoulder (R)',
  'm-bi-l': 'Bicep (L)', 'm-bi-r': 'Bicep (R)',
  'm-tri-l': 'Tricep (L)', 'm-tri-r': 'Tricep (R)',
  'm-fa-l': 'Forearm (L)', 'm-fa-r': 'Forearm (R)',
  'm-lat-l': 'Lat (L)', 'm-lat-r': 'Lat (R)',
  'm-abs': 'Abs', 'm-obl-l': 'Oblique (L)', 'm-obl-r': 'Oblique (R)',
  'm-quad-l': 'Quad (L)', 'm-quad-r': 'Quad (R)',
  'm-ham-l': 'Hamstring (L)', 'm-ham-r': 'Hamstring (R)',
  'm-glu-l': 'Glute (L)', 'm-glu-r': 'Glute (R)',
  'm-calf-l': 'Calf (L)', 'm-calf-r': 'Calf (R)',
};

let selectedEx = null;
let currentDay = 0;

/* ── Build exercise selector ── */
document.getElementById('ex-sel-grid').innerHTML = EXERCISES.map(ex => `
  <button class="ex-sel-btn" data-id="${ex.id}" onclick="selectExercise('${ex.id}')">
    <span class="ex-sel-icon">${ex.icon}</span>
    ${ex.name}
  </button>
`).join('');

/* ── Select Exercise ── */
function selectExercise(id) {
  selectedEx = EXERCISES.find(e => e.id === id);
  if (!selectedEx) return;

  document.querySelectorAll('.ex-sel-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-id="${id}"]`).classList.add('active');
  document.getElementById('sk-title').textContent = selectedEx.name + ' — Muscle Growth';
  document.getElementById('sk-sub').textContent = 'Click any glowing muscle for exercises & diet tips';
  document.getElementById('day-slider-wrap').style.display = 'block';
  document.getElementById('growth-strip').style.display = 'block';
  document.getElementById('ex-info-card').style.display = 'block';
  document.getElementById('ex-info-muscles').textContent = selectedEx.info;
  document.getElementById('ex-info-rate').textContent = selectedEx.rate;
  document.getElementById('muscle-click-tip').style.display = 'flex';

  document.getElementById('day-range').value = 0;
  currentDay = 0;
  updateSkeleton(0);
  buildProgressBars();
  buildGrowthStrip();
}

/* ── Day slider change ── */
function onDayChange(val) {
  currentDay = parseInt(val);
  document.getElementById('day-num-display').textContent = currentDay;
  document.getElementById('day-streak').textContent =
    currentDay === 0 ? '🔥 Start' :
      currentDay < 7 ? `🔥 ${currentDay}d` :
        currentDay < 30 ? `⚡ ${currentDay}d` :
          currentDay < 60 ? `💪 ${currentDay}d` : `🏆 ${currentDay}d`;

  updateSkeleton(currentDay);
  updateProgressBars(currentDay);
  updateGrowthStrip(currentDay);
}

/* ── Growth math ── */
function growthFactor(day, rate) {
  const raw = Math.log1p(day * rate * 0.6) / Math.log1p(90 * 0.6);
  return Math.min(raw, 1);
}

/* ── Update SVG skeleton ── */
function updateSkeleton(day) {
  if (!selectedEx) return;

  // Zero all muscle zones
  Object.keys(MUSCLE_LABELS).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === 'm-abs') {
      el.setAttribute('x', '0'); el.setAttribute('y', '0');
      el.setAttribute('width', '0'); el.setAttribute('height', '0');
    } else {
      el.setAttribute('rx', '0'); el.setAttribute('ry', '0');
    }
    el.setAttribute('fill', 'rgba(200,60,60,0)');
    el.setAttribute('stroke', 'rgba(180,30,30,0)');
    el.style.filter = '';
    el.style.cursor = 'default';
  });

  // Render zones for selected exercise
  Object.entries(selectedEx.zones).forEach(([id, z]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const f = growthFactor(day, z.rate);
    const opacity = f * 0.85 + (f > 0 ? 0.1 : 0); // min visible at start
    const sOpacity = f * 0.9 + (f > 0 ? 0.15 : 0);

    const fillColor = (z.fill || 'rgba(220,50,50,VAL)').replace('VAL', opacity.toFixed(2));
    const strokeColor = (z.stroke || 'rgba(180,30,30,SVAL)').replace('SVAL', sOpacity.toFixed(2));

    el.setAttribute('fill', fillColor);
    el.setAttribute('stroke', strokeColor);
    el.setAttribute('stroke-width', f > 0.1 ? '1.5' : '0');
    el.style.cursor = f > 0.05 ? 'pointer' : 'default';
    if (f > 0.3) el.style.filter = 'url(#muscle-glow)';
    else el.style.filter = '';

    if (z.isRect) {
      const w = z.maxW * f, h = z.maxH * f;
      el.setAttribute('x', z.x + z.maxW / 2 - w / 2);
      el.setAttribute('y', z.y + z.maxH / 2 - h / 2);
      el.setAttribute('width', w);
      el.setAttribute('height', h);
    } else {
      el.setAttribute('cx', z.cx);
      el.setAttribute('cy', z.cy);
      el.setAttribute('rx', z.maxRx * f);
      el.setAttribute('ry', z.maxRy * f);
    }
  });

  // Day label
  const overlay = document.getElementById('day-overlay');
  overlay.setAttribute('opacity', day > 0 ? '1' : '0');
  overlay.textContent = `Day ${day}`;
}

/* ── Progress bars ── */
function buildProgressBars() {
  const zones = selectedEx.zones;
  const unique = {};
  Object.entries(zones).forEach(([id, z]) => {
    const base = id.replace(/-[lr]$/, '');
    if (!unique[base]) unique[base] = { id, label: getBaseLabel(id), rate: z.rate };
  });
  document.getElementById('muscle-progress-list').innerHTML =
    Object.entries(unique).map(([base, { label, rate }]) => `
      <div class="mp-row" id="pr-${base}">
        <div class="mp-name">${label}</div>
        <div class="mp-track"><div class="mp-fill" id="mpf-${base}" style="width:0%"></div></div>
        <div class="mp-pct" id="mpp-${base}">0%</div>
      </div>
    `).join('');
}

function updateProgressBars(day) {
  if (!selectedEx) return;
  const seen = {};
  Object.entries(selectedEx.zones).forEach(([id, z]) => {
    const base = id.replace(/-[lr]$/, '');
    if (seen[base]) return;
    seen[base] = true;
    const pct = Math.round(growthFactor(day, z.rate) * 100);
    const fillEl = document.getElementById(`mpf-${base}`);
    const pctEl = document.getElementById(`mpp-${base}`);
    if (fillEl) fillEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';
  });
}

function getBaseLabel(id) {
  const m = {
    'm-chest': 'Chest', 'm-sho': 'Shoulders', 'm-bi': 'Biceps',
    'm-tri': 'Triceps', 'm-fa': 'Forearms', 'm-lat': 'Lats / Back',
    'm-abs': 'Abs', 'm-obl': 'Obliques', 'm-quad': 'Quads',
    'm-ham': 'Hamstrings', 'm-glu': 'Glutes', 'm-calf': 'Calves',
  };
  return m[id.replace(/-[lr]$/, '')] || id;
}

/* ── Growth timeline strip ── */
function buildGrowthStrip() {
  document.getElementById('growth-bars').innerHTML =
    Array.from({ length: 90 }, (_, i) =>
      `<div class="gs-bar" id="gsb-${i}" title="Day ${i + 1}"></div>`
    ).join('');
}

function updateGrowthStrip(day) {
  for (let i = 0; i < 90; i++) {
    const el = document.getElementById(`gsb-${i}`);
    if (!el) continue;
    const avgF = calcAvgGrowth(i + 1);
    el.style.height = Math.max(4, avgF * 36) + 'px';
    el.classList.toggle('grown', i < day);
  }
}

function calcAvgGrowth(day) {
  if (!selectedEx) return 0;
  const rates = Object.values(selectedEx.zones).map(z => growthFactor(day, z.rate));
  return rates.reduce((a, b) => a + b, 0) / rates.length;
}

/* ── Muscle Click Info Panel ── */
function onMuscleClick(muscleKey) {
  const info = MUSCLE_INFO[muscleKey];
  if (!info) return;

  document.getElementById('mip-icon-2d').textContent = info.icon;
  document.getElementById('mip-name-2d').textContent = info.name;
  document.getElementById('mip-sub-2d').textContent = info.sub;

  document.getElementById('mip-exercises-2d').innerHTML = info.exercises.map(ex => `
    <div class="mip-ex-item">
      <div class="mip-ex-name">${ex.name}</div>
      <div class="mip-ex-detail">${ex.detail}</div>
    </div>
  `).join('');

  document.getElementById('mip-diet-2d').innerHTML = info.diet.map(tip => `
    <div class="mip-diet-tip">${tip}</div>
  `).join('');

  document.getElementById('mip-stats-2d').innerHTML = `
    <div class="mip-stat-row"><span class="mip-stat-lbl">Fiber Type</span><span class="mip-stat-val">${info.stats.fiber}</span></div>
    <div class="mip-stat-row"><span class="mip-stat-lbl">Early Growth</span><span class="mip-stat-val">${info.stats.growth}</span></div>
    <div class="mip-stat-row"><span class="mip-stat-lbl">Full Development</span><span class="mip-stat-val">${info.stats.max}</span></div>
  `;

  const panel = document.getElementById('muscle-info-panel-2d');
  panel.style.display = 'block';
  panel.classList.add('mip-animate');
  setTimeout(() => panel.classList.remove('mip-animate'), 400);

  // Pulse the clicked zones
  if (selectedEx) {
    pulseMuscleGroup(muscleKey);
  }
}

function closeMusclePanel() {
  document.getElementById('muscle-info-panel-2d').style.display = 'none';
}

function pulseMuscleGroup(key) {
  const keyMap = {
    chest: ['m-chest-l', 'm-chest-r'], shoulders: ['m-sho-l', 'm-sho-r'],
    biceps: ['m-bi-l', 'm-bi-r'], triceps: ['m-tri-l', 'm-tri-r'],
    forearms: ['m-fa-l', 'm-fa-r'], lats: ['m-lat-l', 'm-lat-r'],
    abs: ['m-abs', 'm-obl-l', 'm-obl-r'], quads: ['m-quad-l', 'm-quad-r'],
    hamstrings: ['m-ham-l', 'm-ham-r'], glutes: ['m-glu-l', 'm-glu-r'],
    calves: ['m-calf-l', 'm-calf-r'],
  };
  const ids = keyMap[key] || [];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transition = 'all 0.15s ease';
    const origRx = el.getAttribute('rx');
    const origRy = el.getAttribute('ry');
    if (origRx) {
      el.setAttribute('rx', parseFloat(origRx) * 1.2);
      el.setAttribute('ry', parseFloat(origRy) * 1.2);
      setTimeout(() => {
        el.style.transition = 'all 0.9s ease';
        el.setAttribute('rx', origRx);
        el.setAttribute('ry', origRy);
      }, 200);
    }
  });
}

/* ── Reset ── */
function resetGrowth() {
  document.getElementById('day-range').value = 0;
  currentDay = 0;
  onDayChange(0);
  closeMusclePanel();
}
function closeMusclePanel2d() {
  document.getElementById('muscle-info-panel-2d').style.display = 'none';
}
