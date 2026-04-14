// js/muscle3d.js — IronPlate 3D Muscle Model (Three.js r128)
// Interactive 3D human body — rotatable, zoomable, clickable muscle groups

'use strict';

/* ══════════════════════════════════════════════
   MUSCLE DATA
   ══════════════════════════════════════════════ */
const MUSCLE_INFO_3D = {
    chest: {
        name: 'Pectorals (Chest)', icon: '🫀', sub: 'Large fan-shaped pushing muscle',
        color: 0xe63946,
        exercises: [
            { name: 'Bench Press', detail: '4×8–12 reps · 90s rest · Primary mass builder' },
            { name: 'Incline Dumbbell', detail: '3×10–14 reps · Upper chest focus' },
            { name: 'Cable Flyes', detail: '3×12–15 reps · Isolation & peak contraction' },
            { name: 'Push-Ups', detail: '3×15–20 reps · Volume & endurance' },
        ],
        diet: ['🥚 1.8–2.2g protein/kg for hypertrophy', '🍚 50g fast carbs post-workout', '🥑 Healthy fats support testosterone'],
        stats: { fiber: 'Type II (Fast-twitch)', growth: 'Visible in 4–6 weeks', max: 'Full: 12–16 weeks' },
    },
    shoulders: {
        name: 'Deltoids (Shoulders)', icon: '⬆️', sub: '3-headed: anterior, lateral, posterior',
        color: 0xf4a261,
        exercises: [
            { name: 'Overhead Press', detail: '4×6–10 reps · King of shoulder mass' },
            { name: 'Lateral Raises', detail: '4×12–20 reps · Width builder' },
            { name: 'Arnold Press', detail: '3×10–12 reps · Full 3-head activation' },
            { name: 'Rear Delt Flyes', detail: '3×15 reps · Posture & balance' },
        ],
        diet: ['🐔 Lean protein for shoulder repair', '🧃 BCAAs during training', '⚡ Creatine 5g/day boosts strength'],
        stats: { fiber: 'Mixed fiber types', growth: 'Shape in 6–8 weeks', max: 'Capped delts: 16–20 weeks' },
    },
    biceps: {
        name: 'Biceps Brachii', icon: '💪', sub: '2-headed: long head & short head',
        color: 0xe76f51,
        exercises: [
            { name: 'Barbell Curl', detail: '4×8–12 reps · Maximum load & peak' },
            { name: 'Incline Dumbbell Curl', detail: '3×10–14 reps · Long head stretch' },
            { name: 'Hammer Curl', detail: '3×12 reps · Brachialis & forearm' },
            { name: 'Cable Curl', detail: '3×15 reps · Constant tension' },
        ],
        diet: ['🥩 Red meat & eggs for endurance', '🍌 Banana pre-workout', '🥛 Casein before bed'],
        stats: { fiber: 'Type I & II mixed', growth: 'Peak forming 8–10 weeks', max: 'Full peak: 16+ weeks' },
    },
    triceps: {
        name: 'Triceps Brachii', icon: '🔱', sub: '3-headed — 67% of arm size',
        color: 0xd62828,
        exercises: [
            { name: 'Close-Grip Bench', detail: '4×6–10 reps · Heaviest movement' },
            { name: 'Skull Crushers', detail: '3×10–12 reps · Long head mass' },
            { name: 'Tricep Pushdown', detail: '4×12–15 reps · Lateral head squeeze' },
            { name: 'Overhead Extension', detail: '3×12 reps · Full stretch' },
        ],
        diet: ['🧀 Cottage cheese before sleep', '⚗️ ZMA for recovery', '🍳 Eggs for complete amino acids'],
        stats: { fiber: 'Fast-twitch dominant', growth: 'Horseshoe: 10 weeks', max: 'Full: 20 weeks' },
    },
    forearms: {
        name: 'Forearms', icon: '🦾', sub: 'Flexors, extensors & brachioradialis',
        color: 0xc77dff,
        exercises: [
            { name: 'Wrist Curls', detail: "3×15–20 reps · Flexor mass" },
            { name: 'Reverse Curls', detail: "3×12–15 reps · Extensor & brachioradialis" },
            { name: "Farmer's Walk", detail: "3×30m · Grip & overall density" },
            { name: 'Dead Hang', detail: "3×30–60s · Global grip endurance" },
        ],
        diet: ['🐟 Salmon omega-3s for tendons', '🥜 Brazil nuts for connective tissue', '💧 Hydration prevents injury'],
        stats: { fiber: 'Endurance (Type I)', growth: 'Density: 8 weeks', max: 'Slow: 20–24 weeks' },
    },
    lats: {
        name: 'Latissimus Dorsi (Back)', icon: '🪃', sub: 'Largest back muscle — V-taper',
        color: 0x2a9d8f,
        exercises: [
            { name: 'Pull-Ups', detail: '4×6–12 reps · #1 width builder' },
            { name: 'Bent-Over Row', detail: '4×8–10 reps · Thickness & strength' },
            { name: 'Lat Pulldown', detail: '4×10–12 reps · Width focus' },
            { name: 'Single-Arm Row', detail: '3×12 reps · Mind-muscle connection' },
        ],
        diet: ['🎣 Tuna & salmon for recovery', '🌰 Quinoa — complete protein', '🍠 Sweet potato for glycogen'],
        stats: { fiber: 'Mixed — power & endurance', growth: 'Width: 6–8 weeks', max: 'V-taper: 16–24 weeks' },
    },
    abs: {
        name: 'Core (Abs & Obliques)', icon: '⬡', sub: 'Rectus abdominis, transverse & obliques',
        color: 0xffd60a,
        exercises: [
            { name: 'Cable Crunch', detail: '4×15–20 reps · Weighted ab mass' },
            { name: 'Hanging Leg Raise', detail: '3×12–15 reps · Lower abs' },
            { name: 'Plank', detail: '3×45–90s · Transverse core' },
            { name: 'Russian Twists', detail: '3×20 reps · Oblique definition' },
        ],
        diet: ['🧾 200–400 kcal deficit for visible abs', '🥬 Leafy greens reduce bloat', '🚱 Limit sodium for definition'],
        stats: { fiber: 'Endurance-dominant', growth: 'Core strength: 4–6 weeks', max: 'Visible at ~12% body fat' },
    },
    quads: {
        name: 'Quadriceps', icon: '🦵', sub: '4-headed muscle: front of thigh',
        color: 0x4361ee,
        exercises: [
            { name: 'Back Squat', detail: '4×5–8 reps · King of leg mass' },
            { name: 'Leg Press', detail: '4×10–15 reps · High-volume' },
            { name: 'Bulgarian Split Squat', detail: '3×10 reps · Balance & unilateral' },
            { name: 'Leg Extension', detail: '3×12–15 reps · VMO isolation' },
        ],
        diet: ['🍚 Rice & pasta post-workout', '🥩 40–50g protein per meal', '🍒 Tart cherry for DOMS'],
        stats: { fiber: 'Fast-twitch dominant', growth: 'Shape: 6–8 weeks', max: 'Full: 20+ weeks' },
    },
    hamstrings: {
        name: 'Hamstrings', icon: '🏃', sub: '3-headed muscle: back of thigh',
        color: 0x7209b7,
        exercises: [
            { name: 'Romanian Deadlift', detail: '4×8–10 reps · #1 hypertrophy' },
            { name: 'Lying Leg Curl', detail: '4×10–15 reps · Full contraction' },
            { name: 'Nordic Curl', detail: '3×5–8 reps · Eccentric strength' },
            { name: 'Good Mornings', detail: '3×10 reps · Posterior chain' },
        ],
        diet: ['🫐 Blueberries for tendon recovery', '🥛 Whey post-workout', '💊 Magnesium prevents cramps'],
        stats: { fiber: 'Mixed — speed & strength', growth: 'Fullness: 8 weeks', max: 'Complete: 24 weeks' },
    },
    glutes: {
        name: 'Gluteus (Glutes)', icon: '🍑', sub: 'Maximus, medius & minimus',
        color: 0xf77f00,
        exercises: [
            { name: 'Hip Thrust', detail: '4×8–12 reps · #1 glute activator' },
            { name: 'Back Squat', detail: '4×6–10 reps · Deep squat = max glutes' },
            { name: 'Romanian Deadlift', detail: '3×10 reps · Stretch & strength' },
            { name: 'Glute Kickback', detail: '3×15 reps · Isolation & tone' },
        ],
        diet: ['🥚 Eggs provide leucine', '🫚 Olive oil for testosterone', '🍗 Protein every 3–4 hours'],
        stats: { fiber: 'Fast-twitch + endurance', growth: 'Round shape: 6–10 weeks', max: 'Full: 20–26 weeks' },
    },
    calves: {
        name: 'Calves (Gastrocnemius)', icon: '🦿', sub: 'Gastrocnemius & soleus',
        color: 0x06d6a0,
        exercises: [
            { name: 'Standing Calf Raise', detail: '5×15–20 reps · Mass & shape' },
            { name: 'Seated Calf Raise', detail: '4×15–25 reps · Soleus deep muscle' },
            { name: 'Donkey Calf Raise', detail: '3×15–20 reps · High stretch range' },
            { name: 'Jump Rope', detail: '3×2min · Endurance & athletic calves' },
        ],
        diet: ['🐟 Fish oil reduces DOMS', '🍌 Potassium prevents cramps', '🥛 Dairy (leucine) for slow-growing calves'],
        stats: { fiber: 'Endurance (Type I)', growth: 'Shape: 10–12 weeks', max: 'Slow: 24–32 weeks' },
    },
};

/* ══════════════════════════════════════════════
   3D MODEL BUILDER
   ══════════════════════════════════════════════ */
let scene, camera, renderer, raycaster, mouse;
let selectedMeshKey = null;
let wireframeMode = false;
let isAnimating = true;
let autoRotate = true;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

const bodyGroup = new THREE.Group();
const muscleMeshes = {}; // key -> mesh

const SKIN_COLOR = 0xf5cba7;
const BONE_COLOR = 0xdde1f0;
const HIGHLIGHT_COL = 0xff2244;
const HOVER_COL = 0xff6680;

function init3D() {
    const container = document.getElementById('threejs-container');
    if (!container) return;

    const W = container.clientWidth || 500;
    const H = container.clientHeight || 600;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9ff);
    scene.fog = new THREE.FogExp2(0xf8f9ff, 0.02);

    // Camera
    camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x8baeff, 0.3);
    backLight.position.set(-3, -2, -5);
    scene.add(backLight);

    const fillLight = new THREE.PointLight(0xffd6d6, 0.4, 10);
    fillLight.position.set(-2, 2, 3);
    scene.add(fillLight);

    // Build body
    buildBody();
    scene.add(bodyGroup);

    // Raycaster
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Events
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('click', onCanvasClick);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });

    window.addEventListener('resize', onWindowResize);

    // Legend
    buildLegend();

    // Start
    animate();
}

/* ─────────────── Body geometry ─────────────── */
function makeMaterial(color, opacity = 0.88) {
    return new THREE.MeshPhongMaterial({
        color, shininess: 60, transparent: true, opacity,
        side: THREE.FrontSide
    });
}
function addMesh(geometry, material, x, y, z, name = null) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    if (name) {
        mesh.userData.muscleName = name;
        muscleMeshes[name] = muscleMeshes[name] || [];
        muscleMeshes[name].push(mesh);
    }
    bodyGroup.add(mesh);
    return mesh;
}

function buildBody() {
    const skin = makeMaterial(SKIN_COLOR);
    const bone = makeMaterial(BONE_COLOR, 0.5);

    // ── HEAD
    const headGeo = new THREE.SphereGeometry(0.32, 16, 16);
    addMesh(headGeo, makeMaterial(SKIN_COLOR), 0, 2.55, 0);

    // ── NECK
    const neckGeo = new THREE.CylinderGeometry(0.1, 0.13, 0.22, 12);
    addMesh(neckGeo, makeMaterial(SKIN_COLOR), 0, 2.18, 0);

    // ── TORSO (chest + abs)
    const torsoGeo = new THREE.BoxGeometry(0.95, 1.1, 0.42);
    torsoGeo.translate(0, 0, 0);
    const torsoMesh = new THREE.Mesh(torsoGeo, makeMaterial(SKIN_COLOR));
    torsoMesh.position.set(0, 1.38, 0);
    bodyGroup.add(torsoMesh);

    // ── CHEST muscles (left & right)
    const chestGeo = new THREE.SphereGeometry(0.24, 12, 10);
    chestGeo.scale(1, 0.65, 0.55);
    addMesh(chestGeo, makeMaterial(MUSCLE_INFO_3D.chest.color, 0.82), 0.21, 1.7, 0.22, 'chest');
    addMesh(chestGeo.clone(), makeMaterial(MUSCLE_INFO_3D.chest.color, 0.82), -0.21, 1.7, 0.22, 'chest');

    // ── SHOULDER muscles
    const shoulderGeo = new THREE.SphereGeometry(0.2, 10, 10);
    shoulderGeo.scale(1, 0.85, 0.9);
    addMesh(shoulderGeo, makeMaterial(MUSCLE_INFO_3D.shoulders.color, 0.82), 0.56, 1.9, 0.0, 'shoulders');
    addMesh(shoulderGeo.clone(), makeMaterial(MUSCLE_INFO_3D.shoulders.color, 0.82), -0.56, 1.9, 0.0, 'shoulders');

    // ── UPPER ARMS (bicep + tricep merged into two segments)
    const upperArmGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.55, 10);
    // Right arm
    const rArm = new THREE.Mesh(upperArmGeo, makeMaterial(SKIN_COLOR));
    rArm.position.set(0.76, 1.55, 0);
    rArm.rotation.z = -0.28;
    bodyGroup.add(rArm);
    // Left arm
    const lArm = rArm.clone();
    lArm.position.set(-0.76, 1.55, 0);
    lArm.rotation.z = 0.28;
    bodyGroup.add(lArm);

    // Bicep highlight
    const bicepGeo = new THREE.SphereGeometry(0.12, 10, 10);
    bicepGeo.scale(0.85, 1.2, 0.75);
    addMesh(bicepGeo, makeMaterial(MUSCLE_INFO_3D.biceps.color, 0.80), 0.76, 1.62, 0.06, 'biceps');
    addMesh(bicepGeo.clone(), makeMaterial(MUSCLE_INFO_3D.biceps.color, 0.80), -0.76, 1.62, 0.06, 'biceps');

    // Tricep highlight
    const tricepGeo = new THREE.SphereGeometry(0.11, 10, 10);
    tricepGeo.scale(0.8, 1.1, 0.7);
    addMesh(tricepGeo, makeMaterial(MUSCLE_INFO_3D.triceps.color, 0.80), 0.76, 1.58, -0.08, 'triceps');
    addMesh(tricepGeo.clone(), makeMaterial(MUSCLE_INFO_3D.triceps.color, 0.80), -0.76, 1.58, -0.08, 'triceps');

    // ── FOREARMS
    const forearmGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.48, 10);
    const rForearm = new THREE.Mesh(forearmGeo, makeMaterial(MUSCLE_INFO_3D.forearms.color, 0.78));
    rForearm.position.set(0.84, 1.16, 0.04);
    rForearm.rotation.z = -0.22;
    rForearm.userData.muscleName = 'forearms';
    bodyGroup.add(rForearm);
    muscleMeshes['forearms'] = muscleMeshes['forearms'] || [];
    muscleMeshes['forearms'].push(rForearm);
    const lForearm = rForearm.clone();
    lForearm.position.set(-0.84, 1.16, 0.04);
    lForearm.rotation.z = 0.22;
    lForearm.userData.muscleName = 'forearms';
    bodyGroup.add(lForearm);
    muscleMeshes['forearms'].push(lForearm);

    // ── LATS (back wings)
    const latShape = new THREE.SphereGeometry(0.22, 10, 10);
    latShape.scale(0.65, 1.4, 0.5);
    addMesh(latShape, makeMaterial(MUSCLE_INFO_3D.lats.color, 0.75), 0.42, 1.42, -0.12, 'lats');
    addMesh(latShape.clone(), makeMaterial(MUSCLE_INFO_3D.lats.color, 0.75), -0.42, 1.42, -0.12, 'lats');

    // ── ABS (6-pack blocks)
    const absGeo = new THREE.BoxGeometry(0.16, 0.12, 0.12);
    for (let row = 0; row < 3; row++) {
        for (let col = -1; col <= 0; col++) {
            const absMesh = addMesh(
                absGeo.clone(),
                makeMaterial(MUSCLE_INFO_3D.abs.color, 0.78),
                (col + 0.5) * 0.2, 1.3 - row * 0.17, 0.21,
                'abs'
            );
        }
    }

    // ── PELVIS / HIPS base
    const hipGeo = new THREE.BoxGeometry(0.75, 0.28, 0.38);
    addMesh(hipGeo, makeMaterial(SKIN_COLOR), 0, 0.82, 0);

    // ── GLUTES
    const gluteGeo = new THREE.SphereGeometry(0.24, 10, 10);
    gluteGeo.scale(1, 0.85, 0.7);
    addMesh(gluteGeo, makeMaterial(MUSCLE_INFO_3D.glutes.color, 0.80), 0.22, 0.84, -0.16, 'glutes');
    addMesh(gluteGeo.clone(), makeMaterial(MUSCLE_INFO_3D.glutes.color, 0.80), -0.22, 0.84, -0.16, 'glutes');

    // ── UPPER LEGS (thighs)
    const thighGeo = new THREE.CylinderGeometry(0.15, 0.13, 0.72, 10);
    // Right
    const rThigh = new THREE.Mesh(thighGeo, makeMaterial(SKIN_COLOR));
    rThigh.position.set(0.21, 0.3, 0);
    bodyGroup.add(rThigh);
    const lThigh = rThigh.clone();
    lThigh.position.set(-0.21, 0.3, 0);
    bodyGroup.add(lThigh);

    // QUADS
    const quadGeo = new THREE.SphereGeometry(0.15, 10, 10);
    quadGeo.scale(0.9, 1.4, 0.75);
    addMesh(quadGeo, makeMaterial(MUSCLE_INFO_3D.quads.color, 0.82), 0.21, 0.34, 0.1, 'quads');
    addMesh(quadGeo.clone(), makeMaterial(MUSCLE_INFO_3D.quads.color, 0.82), -0.21, 0.34, 0.1, 'quads');

    // HAMSTRINGS
    const hamGeo = new THREE.SphereGeometry(0.13, 10, 10);
    hamGeo.scale(0.85, 1.3, 0.65);
    addMesh(hamGeo, makeMaterial(MUSCLE_INFO_3D.hamstrings.color, 0.78), 0.21, 0.3, -0.1, 'hamstrings');
    addMesh(hamGeo.clone(), makeMaterial(MUSCLE_INFO_3D.hamstrings.color, 0.78), -0.21, 0.3, -0.1, 'hamstrings');

    // ── LOWER LEGS (shins)
    const shinGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.66, 10);
    const rShin = new THREE.Mesh(shinGeo, makeMaterial(SKIN_COLOR));
    rShin.position.set(0.21, -0.36, 0);
    bodyGroup.add(rShin);
    const lShin = rShin.clone();
    lShin.position.set(-0.21, -0.36, 0);
    bodyGroup.add(lShin);

    // CALVES
    const calfGeo = new THREE.SphereGeometry(0.1, 10, 10);
    calfGeo.scale(0.8, 1.2, 0.7);
    addMesh(calfGeo, makeMaterial(MUSCLE_INFO_3D.calves.color, 0.82), 0.21, -0.26, -0.04, 'calves');
    addMesh(calfGeo.clone(), makeMaterial(MUSCLE_INFO_3D.calves.color, 0.82), -0.21, -0.26, -0.04, 'calves');

    // ── FEET
    const footGeo = new THREE.BoxGeometry(0.15, 0.07, 0.28);
    addMesh(footGeo, makeMaterial(SKIN_COLOR), 0.21, -0.73, 0.07);
    addMesh(footGeo.clone(), makeMaterial(SKIN_COLOR), -0.21, -0.73, 0.07);

    // Center the whole body
    bodyGroup.position.y = -0.9;
}

/* ─────────────── Interaction ─────────────── */
function onMouseDown(e) {
    isDragging = false;
    previousMousePosition = { x: e.clientX, y: e.clientY };
}

function onMouseMove(e) {
    const dx = e.clientX - previousMousePosition.x;
    const dy = e.clientY - previousMousePosition.y;
    if (e.buttons === 1 && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
        isDragging = true;
        autoRotate = false;
        bodyGroup.rotation.y += dx * 0.01;
        bodyGroup.rotation.x += dy * 0.005;
        bodyGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, bodyGroup.rotation.x));
        previousMousePosition = { x: e.clientX, y: e.clientY };
    }

    // Hover highlight
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    checkHover();
}

function onMouseUp() {
    if (!isDragging) autoRotate = false; // stopped dragging
    // re-enable after 3s
    setTimeout(() => { autoRotate = true; }, 3000);
}

function onWheel(e) {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.005;
    camera.position.z = Math.max(2, Math.min(10, camera.position.z));
}

let lastTouchX = 0, lastTouchY = 0, lastTouchDist = 0;
function onTouchStart(e) {
    if (e.touches.length === 1) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        lastTouchDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
    }
    e.preventDefault();
}
function onTouchMove(e) {
    if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - lastTouchX;
        const dy = e.touches[0].clientY - lastTouchY;
        bodyGroup.rotation.y += dx * 0.012;
        bodyGroup.rotation.x += dy * 0.006;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        autoRotate = false;
    } else if (e.touches.length === 2) {
        const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        camera.position.z -= (dist - lastTouchDist) * 0.01;
        camera.position.z = Math.max(2, Math.min(10, camera.position.z));
        lastTouchDist = dist;
    }
    e.preventDefault();
}

let hoveredKey = null;
function checkHover() {
    raycaster.setFromCamera(mouse, camera);
    const allMeshes = Object.values(muscleMeshes).flat();
    const intersects = raycaster.intersectObjects(allMeshes);

    // Reset hover
    if (hoveredKey) {
        const hInfo = MUSCLE_INFO_3D[hoveredKey];
        if (hInfo) {
            (muscleMeshes[hoveredKey] || []).forEach(m => {
                if (hoveredKey !== selectedMeshKey) {
                    m.material.color.setHex(hInfo.color);
                    m.material.emissive.setHex(0x000000);
                }
            });
        }
        hoveredKey = null;
        renderer.domElement.style.cursor = 'grab';
    }

    if (intersects.length > 0) {
        const key = intersects[0].object.userData.muscleName;
        if (key && key !== selectedMeshKey) {
            hoveredKey = key;
            (muscleMeshes[key] || []).forEach(m => {
                m.material.color.setHex(HOVER_COL);
                m.material.emissive.setHex(0x331100);
            });
            renderer.domElement.style.cursor = 'pointer';
        }
    }
}

function onCanvasClick(e) {
    if (isDragging) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const allMeshes = Object.values(muscleMeshes).flat();
    const intersects = raycaster.intersectObjects(allMeshes);

    if (intersects.length > 0) {
        const key = intersects[0].object.userData.muscleName;
        if (key) selectMuscle3d(key);
    }
}

/* ─────────────── Selection ─────────────── */
function selectMuscle3d(key) {
    const info = MUSCLE_INFO_3D[key];
    if (!info) return;

    // Reset previous selection
    if (selectedMeshKey && selectedMeshKey !== key) {
        const prev = MUSCLE_INFO_3D[selectedMeshKey];
        if (prev) {
            (muscleMeshes[selectedMeshKey] || []).forEach(m => {
                m.material.color.setHex(prev.color);
                m.material.emissive.setHex(0x000000);
                m.scale.set(1, 1, 1);
            });
        }
    }

    selectedMeshKey = key;

    // Highlight selected
    (muscleMeshes[key] || []).forEach(m => {
        m.material.color.setHex(HIGHLIGHT_COL);
        m.material.emissive.setHex(0x550011);
        m.scale.set(1.12, 1.12, 1.12);
    });

    // Show info panel
    document.getElementById('mip-default').style.display = 'none';
    const panel = document.getElementById('muscle-info-panel');
    panel.style.display = 'block';
    panel.classList.add('mip-animate');
    setTimeout(() => panel.classList.remove('mip-animate'), 400);

    document.getElementById('mip-icon').textContent = info.icon;
    document.getElementById('mip-name').textContent = info.name;
    document.getElementById('mip-sub').textContent = info.sub;

    document.getElementById('mip-exercises').innerHTML = info.exercises.map(ex => `
    <div class="mip-ex-item">
      <div class="mip-ex-name">${ex.name}</div>
      <div class="mip-ex-detail">${ex.detail}</div>
    </div>
  `).join('');

    document.getElementById('mip-diet').innerHTML = info.diet.map(tip => `
    <div class="mip-diet-tip">${tip}</div>
  `).join('');

    document.getElementById('mip-stats').innerHTML = `
    <div class="mip-stat-row"><span class="mip-stat-lbl">Fiber Type</span><span class="mip-stat-val">${info.stats.fiber}</span></div>
    <div class="mip-stat-row"><span class="mip-stat-lbl">Early Growth</span><span class="mip-stat-val">${info.stats.growth}</span></div>
    <div class="mip-stat-row"><span class="mip-stat-lbl">Full Development</span><span class="mip-stat-val">${info.stats.max}</span></div>
  `;

    // Hide AI tip initially; try to fetch
    document.getElementById('mip-ai-tip').style.display = 'none';
    fetchAITip(key);

    // Update legend
    document.querySelectorAll('.mlc-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.muscle === key);
    });

    // Pan camera slightly toward selected muscle
    autoRotate = false;
}

/* ─────────────── AI Tips ─────────────── */
async function fetchAITip(muscleKey) {
    try {
        const res = await fetch('http://localhost:5000/api/muscle-tips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ muscle: muscleKey, age: 25, weight: 75, goal: 'gain' }),
            signal: AbortSignal.timeout(8000)
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.quickTip && document.getElementById('mip-ai-tip')) {
            document.getElementById('mip-ai-text').textContent = data.quickTip;
            document.getElementById('mip-ai-tip').style.display = 'flex';
        }
    } catch { /* backend offline — silently skip */ }
}

function closeMusclePanel() {
    if (selectedMeshKey) {
        const prev = MUSCLE_INFO_3D[selectedMeshKey];
        if (prev) {
            (muscleMeshes[selectedMeshKey] || []).forEach(m => {
                m.material.color.setHex(prev.color);
                m.material.emissive.setHex(0x000000);
                m.scale.set(1, 1, 1);
            });
        }
        selectedMeshKey = null;
    }
    document.getElementById('muscle-info-panel').style.display = 'none';
    document.getElementById('mip-default').style.display = 'block';
    document.querySelectorAll('.mlc-btn').forEach(b => b.classList.remove('active'));
}

/* ─────────────── Controls ─────────────── */
function resetCamera() {
    camera.position.set(0, 0, 5.5);
    bodyGroup.rotation.set(0, 0, 0);
    autoRotate = true;
}

function toggleWireframe() {
    wireframeMode = !wireframeMode;
    bodyGroup.traverse(obj => {
        if (obj.isMesh) obj.material.wireframe = wireframeMode;
    });
}

function setView(view) {
    autoRotate = false;
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('vbtn-' + view).classList.add('active');
    if (view === 'front') { bodyGroup.rotation.y = 0; }
    else if (view === 'back') { bodyGroup.rotation.y = Math.PI; }
    else if (view === 'side') { bodyGroup.rotation.y = Math.PI / 2; }
    setTimeout(() => { autoRotate = true; }, 3000);
}

/* ─────────────── Legend ─────────────── */
function buildLegend() {
    const grid = document.getElementById('mlc-grid');
    if (!grid) return;
    const muscles = Object.entries(MUSCLE_INFO_3D);
    grid.innerHTML = muscles.map(([key, info]) => `
    <button class="mlc-btn" data-muscle="${key}" onclick="selectMuscle3d('${key}')" style="--mc:${hexToCSS(info.color)}">
      <span>${info.icon}</span> ${info.name.split('(')[0].trim().split(' ').slice(0, 2).join(' ')}
    </button>
  `).join('');
}

function hexToCSS(hex) {
    return '#' + hex.toString(16).padStart(6, '0');
}

/* ─────────────── Render loop ─────────────── */
let rotDir = 1;
function animate() {
    requestAnimationFrame(animate);
    if (autoRotate) {
        bodyGroup.rotation.y += 0.004 * rotDir;
        if (bodyGroup.rotation.y > Math.PI * 0.4 || bodyGroup.rotation.y < -Math.PI * 0.4) {
            rotDir *= -1;
        }
    }
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('threejs-container');
    if (!container) return;
    const W = container.clientWidth;
    const H = container.clientHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
}

/* ─────────────── Mode switcher ─────────────── */
function switchMode(mode) {
    document.getElementById('mode-3d').style.display = mode === '3d' ? 'block' : 'none';
    document.getElementById('mode-2d').style.display = mode === '2d' ? 'grid' : 'none';
    document.getElementById('tab-3d').classList.toggle('active', mode === '3d');
    document.getElementById('tab-2d').classList.toggle('active', mode === '2d');

    if (mode === '3d' && !renderer) {
        setTimeout(init3D, 50);
    }
    if (mode === '2d') {
        isAnimating = false;
    } else {
        isAnimating = true;
    }
}

// Init on load
window.addEventListener('load', () => {
    setTimeout(init3D, 100);
});
