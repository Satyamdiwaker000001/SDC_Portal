# SDC Portal — Frontend Design Guidelines & Developer Handbook

> **Purpose**: This document captures every design decision, mindset rule, and implementation pattern used to build the SDC Portal frontend. Any team member picking up a remaining module must read this **before** writing a single line of code.

---

## 1. The Core Design Philosophy

### 1.1 The "Tech Ops Command Center" Mindset

The SDC Portal is not a plain admin dashboard — it is a **command-and-control interface** for an elite software development club. Every design decision flows from one mental model:

> *"This screen is inside a spaceship. The user is an operator. Make them feel powerful."*

Translate this into design:
- Everything is **dark, dense, and precise**
- Information is presented like **telemetry data** — monospaced labels, uppercase tracking, minimal decoration
- Actions feel **intentional and weighty**, not casual
- Empty states feel like "silent network" not "404 page"
- Language uses **operational vocabulary**: "Transmit", "Broadcast", "Disconnect Session", "Command Center", "Pipeline", "Personnel"

### 1.2 "Premium First, Content Second"

**Before coding any module**, ask:
> *"If a non-technical person looked at this screen for 3 seconds, would they say 'wow'?"*

If the answer is no, the module needs more visual attention. Premium means:
- No plain flat boxes — always glassmorphism or deep dark cards
- No default system fonts — always `Outfit`
- No plain borders — always `border-white/10` or glowing accent borders
- No plain buttons — always gradient, hover glow, or micro-motion

---

## 2. Tech Stack (Non-Negotiable)

| Layer | Tool | Notes |
|---|---|---|
| **Framework** | React 19 (Vite) | Function components only |
| **Styling** | TailwindCSS v4 | Utility-first via `@import "tailwindcss"` |
| **Animation** | Framer Motion v12 | `motion.div`, `AnimatePresence` — mandatory on every view |
| **Icons** | `lucide-react` | Never use emojis as icons |
| **Routing** | React Router v7 | Nested routes under `/dashboard` |
| **HTTP Client** | Axios via `src/api/services.js` | Never call `fetch()` directly |
| **Auth** | `useAuth()` from `AuthContext` | Always gate content behind role checks |

> ⚠️ Do NOT introduce new packages without team discussion. No `react-query`, no `zustand`, no `shadcn`. Keep dependencies minimal.

---

## 3. The Design System — Color Tokens

All colors come from `src/index.css` `@theme` block. **Never hardcode hex values that aren't in the system** (exception: `#020617` and `#1c222b` are the two card dark backgrounds used by convention).

### 3.1 Semantic Color Usage

| Token | Hex | Usage |
|---|---|---|
| `[#020617]` | True Black-Blue | Main page background, deep card backgrounds |
| `[#1c222b]` | Dark Slate | Secondary card surface (list rows, modals) |
| `[#00b4d8]` | Cyan Accent | **Primary brand color** — active states, glows, icons, links |
| `blue-500 / blue-600` | Electric Blue | Buttons, gradients, stats highlights |
| `sky-400 / cyan-400` | Light Cyan | Secondary accents, badges |
| `white/5` → `white/10` | Semi-transparent | Card borders, hover state fills |
| `white/40` → `white/60` | Muted White | Body text, secondary info |
| `white` | Pure White | Headings only |

### 3.2 Status Color Convention

All status badges across the entire app follow this exact pattern:

```jsx
// ALWAYS use this pattern for status badges
const STATUS_COLORS = {
  'PENDING':     'bg-indigo-500/10  text-indigo-500  border-indigo-500/20',
  'ACTIVE':      'bg-blue-500/10    text-blue-400    border-blue-500/20',
  'IN_PROGRESS': 'bg-blue-500/20    text-blue-400    border-blue-500/30',
  'COMPLETED':   'bg-sky-500/20     text-sky-400     border-sky-500/30',
  'APPROVED':    'bg-sky-500/10     text-sky-400     border-sky-500/20',
  'REJECTED':    'bg-blue-500/10    text-blue-400    border-blue-500/20',
  'REVIEW':      'bg-cyan-500/20    text-cyan-400    border-cyan-500/30',
  'DRAFT':       'bg-sky-500/10     text-sky-400     border-sky-500/20',
};
```

**Rule**: Status badges are always `rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest`.

---

## 4. Typography Rules

All text follows the `Outfit` font. These are the exact classes used consistently:

| Element | Classes |
|---|---|
| Page H1 | `text-3xl md:text-4xl font-black text-white tracking-tight uppercase drop-shadow-md` |
| Hero H1 (dashboard) | `text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 tracking-tight` |
| Card title / H3 | `text-lg font-black text-white tracking-tight uppercase` |
| Section sub-label | `text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]` (tiny, monospaced-feel) |
| Body text | `text-sm font-medium text-white/60 leading-relaxed` |
| Small metadata | `text-[10px] text-white/30 font-mono` |
| Page breadcrumb/label | `text-sm font-bold tracking-[0.2em] text-[#00b4d8] uppercase` |

> **Key Typography Rule**: We use VERY small font sizes for labels (`text-[10px]`) combined with aggressive `tracking-widest` or `tracking-[0.2em]`. This is intentional — it creates a "technical readout" feel. Never use `text-xs` for labels when `text-[10px]` with wide tracking reads better.

---

## 5. Layout Architecture

### 5.1 The Shell (Never Touch This)

`DashboardLayout.jsx` defines the shell. It is:
- Full-height with `flex h-screen w-full bg-[#020617]`
- Has a **floating sidebar** (280px wide, `rounded-[2rem]`, glassmorphic)
- Has a **floating topbar** (h-20, `rounded-[2rem]`)
- Has a **main content area** (`<Outlet />`) with padding `p-6 lg:p-8`

Every page you write renders inside `<Outlet />`. Your page:
- Gets `h-full` automatically
- Should use `flex flex-col` to use vertical space
- Should have `overflow-hidden` at the root and `overflow-y-auto custom-scrollbar` on the scrollable inner section only

### 5.2 Standard Page Root Structure

Every view file follows this exact structure:

```jsx
export default function MyView() {
  return (
    <div className="h-full flex flex-col font-sans text-white pb-6 relative z-10 overflow-hidden">
      
      {/* 1. Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 shrink-0">
        {/* page icon + label + H1 + description */}
        {/* optional action button (top-right) */}
      </div>

      {/* 2. Stats Row (optional, only if this page has stats) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
        {/* stat cards */}
      </div>

      {/* 3. Main Content Area (flex-1 to fill remaining height) */}
      <div className="flex-1 ... overflow-hidden flex flex-col">
        {/* table header (if list view) */}
        {/* scrollable list / grid */}
      </div>

    </div>
  );
}
```

> ⚠️ **Critical**: Always use `shrink-0` on the header and stats so they don't collapse when the list grows. The main area must be `flex-1` to absorb remaining space.

---

## 6. Component Patterns — The Building Blocks

### 6.1 Page Header Pattern

Used on: RecruitmentView, NoticesView, ProjectsView, TeamsView, TelemetryView

```jsx
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 shrink-0">
  <div>
    {/* Icon + Section Label */}
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
        <PageIcon className="w-4 h-4 text-blue-400" />
      </div>
      <span className="text-sm font-bold tracking-[0.2em] text-blue-400 uppercase">Section Name</span>
    </div>
    {/* Main Title */}
    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase drop-shadow-md">
      Page Title
    </h1>
    {/* Subtitle */}
    <p className="text-sm text-white/40 mt-1 font-medium">
      Brief description of this section.
    </p>
  </div>
  
  {/* CTA Button — only for admin */}
  {role === 'admin' && (
    <button className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-black hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 border border-white/10 uppercase tracking-widest shrink-0">
      <PlusIcon className="w-4 h-4" /> Action Label
    </button>
  )}
</div>
```

### 6.2 Stats Card Pattern

Used in: DashboardOverview (admin), RecruitmentView, TelemetryView

```jsx
<div className="bg-[#1c222b] border border-{color}-500/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba({rgb},0.05)]">
  <div>
    <p className="text-[10px] font-bold text-{color}-400/60 uppercase tracking-widest">Label</p>
    <p className="text-2xl font-black text-{color}-400 mt-1">{value}</p>
  </div>
</div>
```

For the **hero stats card** (dashboard overview only — with 3D hover):

```jsx
<div className="relative bg-[#020617]/80 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] overflow-hidden transition-all duration-700 transform-gpu group-hover:-translate-y-2 group-hover:shadow-[20px_20px_40px_rgba(0,0,0,0.5)]">
  {/* gradient shimmer on top */}
  <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r ${stat.color} opacity-50`} />
  {/* icon + value + trend */}
</div>
```

### 6.3 Dark Card / Panel Pattern

Used everywhere as a container:

```jsx
// Standard dark panel
<div className="bg-[#1c222b] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
  {/* Table Header Row */}
  <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest bg-black/20">
    <div className="col-span-3">Column A</div>
    <div className="col-span-3">Column B</div>
    ...
  </div>
  {/* Scrollable Content */}
  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
    {/* rows */}
  </div>
</div>

// Glassmorphic panel (admin dashboard cards)
<div className="bg-[#020617]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 relative overflow-hidden">
  {/* ambient glow blob */}
  <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00b4d8]/20 blur-[100px] rounded-full mix-blend-screen opacity-50" />
  {/* content */}
</div>
```

### 6.4 List Row Pattern (Table Rows)

Used in: RecruitmentView, TelemetryView, TeamsView

```jsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05, ease: "easeOut" }}
  key={item.id}
  className="grid grid-cols-12 gap-4 px-6 py-4 items-center bg-white/[0.02] hover:bg-white/[0.04] transition-all border border-white/5 hover:border-white/10 rounded-2xl group"
>
  {/* content columns */}
</motion.div>
```

**Rule**: List rows always stagger their animations with `delay: index * 0.05`. Never render all at once without animation.

### 6.5 Card Grid Pattern

Used in: TeamsView, ProjectsView

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map((item, i) => (
    <motion.div
      variants={itemVariants}
      key={item.id}
      className="group relative bg-[#1c222b] border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all duration-300 shadow-xl"
    >
      {/* card content */}
    </motion.div>
  ))}
</div>
```

### 6.6 Avatar / Initial Badge Pattern

Used everywhere a user is referenced:

```jsx
<div className="w-10 h-10 rounded-xl bg-[#00b4d8]/10 border border-[#00b4d8]/30 flex items-center justify-center flex-shrink-0 text-[#00b4d8] font-black uppercase text-lg">
  {user.name ? user.name.charAt(0) : '?'}
</div>
```

For profile cards (TeamView), use the flip card design with `backfaceVisibility: 'hidden'`.

### 6.7 Modal Pattern

Used in: NoticesView, ProjectsView, TeamsView

```jsx
<AnimatePresence>
  {isModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={() => setIsModalOpen(false)}
      />
      {/* Modal Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-transparent relative overflow-hidden shrink-0">
          {/* ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[50px] -mr-20 -mt-20" />
          {/* icon + title + close button */}
        </div>
        {/* Modal Body (scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* form */}
        </div>
        {/* Modal Footer */}
        <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3 shrink-0">
          {/* Cancel + Submit buttons */}
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
```

**Rule**: Modals ALWAYS have `max-h-[90vh]` with a scrollable body and sticky footer. The close button is always top-right in the header. The backdrop closes the modal on click.

### 6.8 Form Input Pattern

```jsx
{/* Text Input */}
<div className="space-y-1.5">
  <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest ml-1">Field Label</label>
  <input
    type="text"
    required
    placeholder="Placeholder text..."
    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all font-bold text-lg"
  />
</div>

{/* Select */}
<select className="w-full px-4 py-3.5 rounded-xl bg-[#1c222b] border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all font-black uppercase tracking-wider cursor-pointer">
  <option>Option</option>
</select>

{/* Search Input */}
<div className="relative w-full md:w-64">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
  <input
    type="text"
    placeholder="Search..."
    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-white/30 shadow-inner"
  />
</div>
```

### 6.9 Empty State Pattern

Every list/grid view must handle the empty state with visual personality:

```jsx
<div className="h-full min-h-[400px] border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-white/30 p-8">
  <RelevantIcon className="w-16 h-16 mb-4 opacity-40 text-[#00b4d8]" />
  <p className="text-xl font-bold text-white/50 tracking-widest uppercase mb-1">
    Operational Thematic Title
  </p>
  <p className="text-sm opacity-50">
    Contextual explanation of why there's no data.
  </p>
</div>
```

---

## 7. Animation Rules — Framer Motion

### 7.1 Standard Variants (Copy These Exactly)

```js
// Container — controls stagger of children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// Item — each child animated up
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

// Landing page / hero
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};
```

### 7.2 Animation Rules

| Rule | Detail |
|---|---|
| **Every page root** | Wrap in `<motion.div variants={containerVariants} initial="hidden" animate="visible">` |
| **Every major section** | Wrap in `<motion.div variants={itemVariants}>` |
| **List items** | Use `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}` |
| **Modals** | Use `scale: 0.95 → 1` + `y: 20 → 0` with `exit` always set |
| **Active nav indicator** | Use `motion.div` with `layoutId="sidebarActiveLine"` for the spring slide |
| **3D card hover** | Use `transform-gpu group-hover:-translate-y-2` on the card, `perspective` on the parent |

### 7.3 Spring vs Ease

- **Spring** (`type: "spring", stiffness: 300, damping: 30`): For UI elements that "snap" into place (nav indicator, modals, tooltips)
- **Ease Out** (`ease: "easeOut", duration: 0.8`): For page-level section reveals (smooth, content-first)
- **cubic-bezier(0.16, 1, 0.3, 1)**: For slide-in-right / slide-up utilities (fast-start, bouncy end)

---

## 8. The Background Engine

The dashboard shell (`DashboardLayout.jsx`) sets up the background. Inside each page's main panel or in the admin dashboard cards, we add **ambient glow blobs**:

```jsx
{/* Ambient Glow — Place inside overflow:hidden container */}
<div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00b4d8]/20 blur-[100px] rounded-full mix-blend-screen opacity-50 pointer-events-none" />
<div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
```

**Rule**: Globs always have `pointer-events-none`. Glow blobs are either `#00b4d8` (cyan) or `blue-600`. Never use red, green, or purple glows — we stay in the blue/cyan spectrum.

The tech grid from the dashboard layout is the global BG. Do not re-add it inside pages.

---

## 9. Role-Based UI Rules

The app has 3 roles: `admin`, `developer`, `mentor`. Always check:

```jsx
const { role, user } = useAuth();
```

| Pattern | Usage |
|---|---|
| `{role === 'admin' && <button>}` | Show admin-only actions (create, delete, transmit) |
| `{role !== 'admin' && <ReadOnlyView />}` | Show read-only version for developers/mentors |
| `navItems.filter(item => item.roles.includes(role))` | Sidebar already filters, pages must also guard |

**Rule**: Never show a destructive button (delete, reject, etc.) to a non-admin. The button simply doesn't render — no "you don't have permission" tooltip needed.

---

## 10. API Integration Pattern

All API calls are in `src/api/services.js`. Never call URLs directly.

```jsx
// Standard data fetching pattern — used in every view
useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    const [dataA, dataB] = await Promise.all([
      apiServiceA.getAll().catch(() => []),
      apiServiceB.getAll().catch(() => [])
    ]);
    setDataA(dataA?.length ? dataA : MOCK_DATA_A);
    setDataB(dataB?.length ? dataB : MOCK_DATA_B);
  } catch (e) {
    setDataA(MOCK_DATA_A);
    setDataB(MOCK_DATA_B);
  } finally {
    setIsLoading(false);
  }
};
```

**Rules**:
1. Every view has `MOCK_*` constants at the top — these are the fallback when the backend is unavailable
2. Always use `Promise.all` when fetching multiple endpoints
3. Always use `.catch(() => [])` on each individual call inside `Promise.all` so one failure doesn't kill the rest
4. The real data replaces mock only if `data?.length > 0` — never replace with an empty array from backend

---

## 11. Custom Scrollbar (Always Include)

Every view that has a scrollable area must include this style tag:

```jsx
<style dangerouslySetInnerHTML={{__html: `
  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 6px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,180,216,0.5); }
`}} />
```

Apply `custom-scrollbar` class to any `overflow-y-auto` element.

---

## 12. Spacing & Border Radius Conventions

| Use | Value |
|---|---|
| Between major sections | `space-y-10` or `gap-6` |
| Between cards in a grid | `gap-6` |
| Between list rows | `space-y-3` |
| Page horizontal padding | `px-6 lg:px-8` |
| Panel inner padding | `p-6` |
| Card border radius (panels) | `rounded-[2rem]` |
| Card border radius (cards) | `rounded-3xl` or `rounded-[2rem]` |
| Badge / tag radius | `rounded-lg` |
| Buttons | `rounded-xl` (standard) or `rounded-full` (pill) |
| Input fields | `rounded-xl` |
| Icon containers | `rounded-xl` (square icons) or `rounded-full` (avatar) |

---

## 13. Pre-Design Checklist (Do This BEFORE Writing Code)

Before starting a new module, answer these:

- [ ] **What role sees this?** Admin only, or all roles? Design role-based variations if needed.
- [ ] **What data does it show?** Write `MOCK_*` constants first, then wire the API.
- [ ] **What actions exist?** CRUD, filter, search, status update?
- [ ] **Does it need a modal?** (Create/Edit forms → always modal)
- [ ] **Is it a list or a grid?** List = table-style rows. Grid = card layout.
- [ ] **What's the empty state?** Write the empty state UI before the list.
- [ ] **What stats should be visible?** Add a stats row if data supports it.
- [ ] **What is the "operational" language?** Rename standard terms to match the command center theme.

---

## 14. During-Design Checklist (Reference While Coding)

- [ ] Page root uses `h-full flex flex-col overflow-hidden`
- [ ] Header section uses `shrink-0`
- [ ] Main content area uses `flex-1` and `overflow-y-auto custom-scrollbar`
- [ ] All sections wrapped in `motion.div variants={itemVariants}`
- [ ] List rows stagger with `delay: i * 0.05`
- [ ] No hardcoded hex colors outside the defined system
- [ ] Buttons for admin-only actions are guarded with `{role === 'admin' && ...}`
- [ ] Every icon comes from `lucide-react`
- [ ] Status badges use the standard `STATUS_COLORS` map
- [ ] Modal has backdrop close, sticky footer, scrollable body
- [ ] `<style>` tag with custom scrollbar is at the bottom of the JSX
- [ ] Mock data is defined at the top of the file, outside the component
- [ ] API calls use `Promise.all` with individual `.catch(() => [])` guards

---

## 15. Module-by-Module Reference

| Module | File | Status | Pattern Used |
|---|---|---|---|
| Landing Page | `LandingPage.jsx` | ✅ Done | Hero, sections, 3D flip cards, full-page scroll |
| Login | `LoginView.jsx` | ✅ Done | Split-panel, barcode, card flip on auth success |
| Dashboard | `DashboardOverview.jsx` | ✅ Done | Role-based view, 3D stat cards, telemetry bars |
| Projects | `ProjectsView.jsx` | ✅ Done | Grid cards, modal create form, status badges |
| Personnel | `TeamView.jsx` | ✅ Done | Profile flip cards, add member modal, role badges |
| Teams | `TeamsView.jsx` | ✅ Done | Team cards, member list, create team modal |
| Notices | `NoticesView.jsx` | ✅ Done | Feed list, priority badges, transmit modal |
| Operations (Recruitment) | `RecruitmentView.jsx` | ✅ Done | Table list, stats row, inline status update |
| Telemetry | `TelemetryView.jsx` | ✅ Done | Tab switching, task list, audit log feed |

---

## 16. Anti-Patterns — What NOT To Do

❌ **Never** use plain white background (`bg-white`, `bg-gray-100`)  
❌ **Never** use `font-sans` without `font-black` or `font-bold` on headings  
❌ **Never** use `text-gray-*` — use `text-white/{opacity}` instead  
❌ **Never** call the backend directly with `fetch()` — always use services  
❌ **Never** skip the mock data fallback — the app must render without backend  
❌ **Never** show raw error messages to the user — use a styled error banner  
❌ **Never** use inline `onClick` on sensitive actions without a role check  
❌ **Never** place the modal outside `<AnimatePresence>` — exit animations won't work  
❌ **Never** use `border-radius` < `rounded-xl` on interactive elements  
❌ **Never** add raw `<div>` without thinking "should this be a `motion.div`?"  
❌ **Never** use a generic icon name — choose the most contextually accurate lucide icon  
❌ **Never** mix purple/violet accents into new pages — those are reserved for TeamView card theming only

---

## 17. Quick Copy-Paste Snippets

### The "Live" indicator badge
```jsx
<div className="flex items-center gap-2">
  <span className="text-[8px] text-[#00b4d8] font-mono font-bold tracking-widest">LIVE</span>
  <div className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse shadow-[0_0_8px_#00b4d8]" />
</div>
```

### The "role pill" badge
```jsx
<div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
  <span className="text-blue-400 text-[9px] uppercase tracking-[0.2em] font-bold">Role Label Here</span>
</div>
```

### The gradient primary button
```jsx
<button className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-black hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-1 border border-white/10 uppercase tracking-widest">
  <Icon className="w-4 h-4" /> Action Label
</button>
```

### The ghost/outline button
```jsx
<button className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider">
  Cancel
</button>
```

### The icon action button (small)
```jsx
<button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-400 transition-all">
  <Icon className="w-4 h-4" />
</button>
```

### The tab switcher (for views like TelemetryView)
```jsx
<div className="flex bg-white/5 rounded-xl border border-white/10 overflow-hidden p-1">
  {['tab1', 'tab2'].map(tab => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#00b4d8] text-white shadow-md' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
    >
      {tab}
    </button>
  ))}
</div>
```

---

## 18. File Naming & Organization

```
src/
├── api/
│   ├── client.js         ← Axios instance (DO NOT TOUCH)
│   └── services.js       ← All API functions (add new ones here)
├── assets/               ← Images and static assets
├── contexts/
│   └── AuthContext.jsx   ← Auth state (DO NOT TOUCH)
├── layouts/
│   └── DashboardLayout.jsx  ← Shell (DO NOT TOUCH unless adding nav items)
└── pages/
    ├── LandingPage.jsx
    ├── LoginView.jsx
    ├── DashboardOverview.jsx
    ├── ProjectsView.jsx
    ├── TeamView.jsx
    ├── TeamsView.jsx
    ├── NoticesView.jsx
    ├── RecruitmentView.jsx
    ├── TelemetryView.jsx
    └── [YourNewModule]View.jsx  ← New modules go here
```

**New routes**: Add to `App.jsx` under the dashboard `<Route>` block. Add nav item to the `navItems` array in `DashboardLayout.jsx` with the correct `roles` array.

---

*Last updated: July 2026 | Built by the SDC Portal Core Team*
