# SDC Portal: The Glacial Forge V6 ❄️🎬🎮

Welcome to the **SDC Portal**, a high-end, cinematic frontend and tactical LMS built for the **Skill Development Cell (SDC)**. This portal transitions from a stunning visitor showcase (The Glacial Throne) into a powerful developer management system.

## 🌌 The Vision
Designed with a "Light-Gaming" aesthetic inspired by *Game of Thrones*, the portal features a crystal-white glassmorphism (Snow) palette with Pearl Aqua tactical accents. It balances the high-impact visual needs of a visitor showcase with the technical precision required for an LMS.

---

## 🛠️ Technology Stack

### Frontend (GlacialForge)
- **Framework**: React 18 + Vite
- **Styling**: Styled-Components (Vanilla CSS tokens)
- **Animations**: Framer Motion + GSAP
- **3D Core**: React Three Fiber + Three.js
- **Icons**: Lucide React + Snowflake Glyphs

### Backend (ForgeCore)
- **API**: FastAPI (Python 3.14 optimized)
- **Database**: MySQL (3NF Normalized)
- **ORM**: SQLAlchemy
- **Auth**: JWT-based secure uplink

---

## 🏗️ Modular Architecture (V5)
The project follows a modular Atomic Design strategy in `frontend/src`:
- `components/common`: Reusable tactical UI (FrostCards, GamingButtons, GlacialLoader).
- `components/layout`: Cinematic HUD elements (Navbar, Footers).
- `components/landing`: Full-screen cinematic modules (Hero, Showcase, Snowfall).
- `pages/landing`: The orchestrated "Outstanding" portal experience.

---

## 🚀 Quick Start

### 1. Initialize Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Initialize Frontend
```powershell
cd frontend
npm install
npm run dev
```

---

## 📡 Tactical Protocols
- **Theme**: Light-Gaming (Snow / Pearl Aqua / Onyx).
- **Environment**: 50-particle Cyber-Snow weather system.
- **Protocol V6**: Paper Plane folding transition & cinematic loops.

**© 2026 SDC PORTAL // ENGINEERED FOR THE FUTURE**
