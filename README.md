# 🏋️ IRON PLATE — Upgraded

## What's New

### 1. 3D Interactive Muscle Model (`muscle.html`)
- Full Three.js r128 3D human body — no external model files needed
- Drag to rotate, scroll to zoom, two-finger pinch on mobile
- Click any muscle (chest, shoulders, biceps, triceps, forearms, lats, abs, quads, hamstrings, glutes, calves) to see exercises + diet tips
- Front / Back / Side preset views
- Wireframe toggle
- Quick-select buttons + colour-coded legend
- AI tips fetched from backend when available

### 2. Growth Tracker (`muscle.html` → "Growth Tracker" tab)
- Original 2D SVG skeleton growth simulator fully preserved
- Tab switcher between 3D Model and Growth Tracker

### 3. Upgraded Python Backend (`backend/app.py`)
- New `/api/muscle-tips` endpoint — AI-powered tips per muscle group
- Improved `/api/generate-diet` — enhanced muscle-growth prompting:
  - Protein target 2.0–2.4g/kg for muscle goals
  - Caloric surplus 200–400 kcal
  - Leucine-rich food prioritisation
  - Peri-workout nutrition guidance
- Better error handling throughout

### 4. Navbar & UI Polish
- All pages: consistent Navbar with Home / Diet Plan / Exercise / Muscle Guide / Profile
- Mobile hamburger menu on all pages
- Fully responsive 3D canvas (adapts from 520px desktop → 280px mobile)
- No layout overflow anywhere

## Running the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
# → http://localhost:5000
```

## Files Changed

| File | Change |
|------|--------|
| `backend/app.py` | New `/api/muscle-tips`, improved diet prompt |
| `muscle.html` | Tab system: 3D model + growth tracker |
| `js/muscle3d.js` | **NEW** — Three.js 3D body + interactions |
| `js/muscle.js` | Updated panel IDs for tab isolation |
| `css/style.css` | +200 lines: 3D canvas, legend, mode tabs, responsive |

## Files Unchanged
- `index.html`, `auth.html`, `dashboard.html`, `diet.html`, `exercise.html`, `profile.html`
- All `js/` files except `muscle.js` (minor ID patch)
- `backend/.env`, `backend/requirements.txt`
