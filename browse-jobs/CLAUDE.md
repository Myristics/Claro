# CLAUDE.md — Claro Transparent Hiring Platform (Prototype)

> This file is the **single source of truth** for how you build this prototype.
> Read it fully before any task. Re-read the relevant section before each flow.
> Figma (via MCP) is the **visual source of truth**. This file governs architecture, routing, state, data, and component rules. When Figma and this file disagree on *visual* details, follow Figma. When they disagree on *behavior/routing/data*, follow this file.

---

## 0. What we are building

A **fully clickable React prototype** of **Claro**, a transparent hiring platform by Rakamin Academy. It has two sides (candidate + recruiter) that share one design language. The prototype must:

- Be navigable like a real app — every screen reachable, every primary button/link goes somewhere real.
- Use **persistent mock data** (a candidate's application state survives navigation and page refresh).
- Pass two reviews: **Aji** (can MCP/codegen consume the underlying Figma cleanly) and **Dityo** (design-system compliance + stakeholder readiness).
- Demonstrate **3 key flows** end-to-end (see §9), but ALL screens + ALL states must be reachable.

This is a **prototype**, not production. No real backend, no real auth, no real AI calls. Mock everything. But make it feel real: realistic data, real transitions, no lorem ipsum, no dead buttons.

---

## 1. Tech stack (do not deviate without asking)

- **React + Vite + TypeScript**
- **React Router** (`react-router-dom`) for routing
- **Zustand** for global state (application state machine, mock data) — chosen for simple persistence
- **localStorage persistence** via Zustand `persist` middleware — this is how "persistent mock data" works
- Plain CSS or CSS Modules using design tokens from §3. Do NOT pull in a UI kit (no MUI/Chakra/AntD) — we are reproducing the Rakamin Design System, not a generic one.
- Icons: **Tabler Icons** (`@tabler/icons-react`) — the handover references `ti-*` icon names which are Tabler.
- No SSR. SPA only. Deploy target is a static preview URL (Vercel/Netlify).

If a task seems to need a library not listed here, state the assumption and pick the lightest option, then continue.

---

## 2. How to use Figma MCP (critical — read carefully)

The user (Ahmad) will paste a **node-ID or frame link per screen**. Your job per screen:

1. Call the Figma MCP `get_image` (or equivalent) on the node FIRST to see the intended visual.
2. Call `get_variable_defs` (or equivalent) on the node to pull exact tokens (color/spacing/type) — reconcile against §3. If a token here is missing from Figma, §3 wins; if Figma has a more specific value, use Figma's and note it.
3. Call `get_code` (or equivalent) ONLY as a structural reference, not as final output. **Do not paste MCP-generated code verbatim.** MCP code from Figma tends to use absolute positioning and detached values. Re-author it as a clean React component using our tokens, our component library (§5), and auto-layout-equivalent fl/grid CSS.
4. Name the resulting component to match our component map (§5/§6), not Figma's layer names.

**Never invent a screen's layout from imagination if a Figma node was provided.** If no node was provided for something you need (e.g. a missing state), build it from the closest sibling screen + the rules in this file, and flag it in your summary so Ahmad can supply a node later.

**Workflow per screen is always:** `get_image` → `get_variable_defs` → `get_code` (reference) → re-author clean component → wire routing + data → build all 5 states.

---

## 3. Design tokens (authoritative)

> Light mode only. Frame design is 1440px desktop. Make it responsive-down but desktop is the target.

### Colors
```
--page-bg:          #F5F5F0
--surface:          #FFFFFF   /* card / sidebar / table bg */
--border:           #D3D1C7
--border-light:     #F1EFE8   /* row dividers */
--text-primary:     #2C2C2A
--text-secondary:   #5F5E5A
--text-tertiary:    #888780
--text-disabled:    #B4B2A9
--brand:            #0F6E56   /* primary action (teal) */
--brand-mid:        #0F8F8F
--brand-accent:     #2EBABA
--nav-active-bg:    #E1F5EE
```

### Status badges (recruiter vacancy)
```
Active:     bg #EAF3DE  text #3B6D11
Draft:      bg #F1EFE8  text #888780
Not Active: bg #F1EFE8  text #444441
```

### Semantic states
```
Urgent/amber:  bg #FAEEDA  text #854F0B
Resolved/green:bg #EAF3DE  text #3B6D11
Passive/gray:  bg #F1EFE8  text #444441
Error/red:     bg #FCEBEB  text #A32D2D
```

### Activity dots
```
Candidate action: #378ADD (blue)
Recruiter action: #0F6E56 (teal)
System action:    #888780 (gray)
Warning/overdue:  #BA7517 (amber)
```

### Assessment icon colors
```
Cognitive Reasoning: bg #EBF3FD  icon #185FA5
Personality Profile: bg #FAEEDA  icon #854F0B
Technical Aptitude:  bg #EEEDF9  icon #34299A
AI Interview:        bg #F0EFFE  icon #4B42B5
```

### Score colors
```
Good (>=75%):       text #3B6D11   bar #0F6E56
Below (<75%):       text #854F0B   bar #BA7517
```

### Typography
- Font: **Inter** (base). DM Sans / Memo only if a specific Figma frame calls for it.
- 8-step type scale, 12px–60px. Body 13–14px in dense recruiter tables; candidate-facing screens can breathe more (14–16px body).

### Spacing
- 9-step scale: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64.

### Pattern library (reuse exactly)
- **Card:** radius 10px, border 1px `--border`, header pad 12–13px/20px with bottom border, body pad 14–16px/20px, title 13px/600.
- **Table:** row pad 10–12px vertical; header 11px uppercase 500 `--text-tertiary` bg `--page-bg`; hover bg `--page-bg`; dividers 1px `--border-light`; dimmed/resolved rows opacity 0.55.
- **Filter pills:** default white/border/`--text-secondary`; active bg `--nav-active-bg` border+text `--brand` 500; urgent border `#BA7517`.
- **Buttons:** primary bg `--brand` text white; ghost transparent border `--border` text `--text-secondary`; danger-ghost transparent border `#F09595` text `#A32D2D`.
- **Topbar:** height 52px, bottom border 1px `--border`, bg white.

---

## 4. Two sides, one system

### Candidate sidebar
```
Claro°  / Transparent Hiring
[Rakamin Academy pill]
  Browse Jobs        (ti-briefcase)
  Applications       (ti-file-text)
  AI Conversations   (ti-sparkles)
  Profile            (ti-user)
[avatar: Ahmad Azza · Candidate]
```

### Recruiter sidebar
```
Claro°  / Transparent Hiring
[Rakamin Academy pill]
  Job Vacancies      (ti-briefcase)
  Candidate Pipeline (ti-users)
  AI Conversations   (ti-sparkles)
  My Profile         (ti-user)
[avatar: Ranti Ajah · HC Manager]
```

Rules:
- Single-tenant: never repeat company name in row meta.
- "AI Conversations" (not "My AI Chats") on both sides — professional tone.
- Avatars are **initials only**, never photos.
- Candidate screens may feel warmer/airier; recruiter screens denser. Same tokens, different density. They must read as one platform.

---

## 5. Component library (build these as reusable components)

### Design-system primitives (reuse everywhere — build once in `/src/components/ds/`)
`Text, Heading, Blockquote, Code, Link, AlertDialog, Avatar, Badge, Button, Callout, Card, Chip, Checkbox, ContextMenu, Dialog, DropdownMenu, Progress, RadioGroup, SelectTrigger, SegmentedControl, Skeleton, Spinner, Switch, Table (+TableRow, +TableCell), Tabs (+TabsTrigger), TabNav, TextArea, TextField, Toast`

These mirror Radix Themes primitives. Build them token-driven. Every screen composes from these — **no detached one-off styling** that bypasses them (Aji checks for this).

### Four custom platform components (documented in Handover File 1 — match its spec)
1. **ApplicationStatusCard** — variants: `active | pending | action-required | rejected | accepted`
2. **InsightReportBlock** — variants: `locked | unlocked | partial`
3. **AIChatBubble** — variants: `user | ai | loading | error | escalation`
4. **RejectionCard** — variants: `with-reason | without-reason | with-insight`

Before building these four, read `Handover_File1_New_Components.pdf` (in project) for exact variant props/usage. If a prop is ambiguous, mirror the matching Figma node and note the assumption.

---

## 6. Screen inventory + route map (authoritative)

> Route prefix: candidate screens under `/`, recruiter under `/r/`. A top-level role switch (dev-only toggle in the corner) flips between the two sidebars — this is a prototype affordance so reviewers can jump sides. Keep it subtle.

### CANDIDATE (route → screen → key states)

| Route | Screen | States to build |
|---|---|---|
| `/jobs` | Browse Jobs / discovery | default, loading(skeleton), empty-search, empty-filter, empty-search+filter, error(3-layer) |
| `/jobs/:id` | Job Detail (extended) | default, loading, closed (no longer accepting), error |
| `/jobs/:id/apply` | Application Form (multi-step) | step1 default, step1 auto-filled, step1 missing-field, step2 file-too-big, step3, exit-confirmation, complete, loading |
| `/applications` | Applications dashboard | default, loading, empty (no applications), active-empty, action-empty, error |
| `/applications/:id` | Application status / detail | default (per status, see §7), loading, error |
| `/applications/:id/assessment` | Assessment Landing | default, equipment-check (for AI parts), loading, error |
| `/applications/:id/assessment/run` | Assessment In-Progress | text-fill, numeric-fill, likert-scale, pause, exit-confirmation, edge: connection-lost |
| `/applications/:id/assessment/complete` | Assessment Complete | default, **loading uses Progress bar + ETA label (NOT skeleton)** |
| `/applications/:id/insight` | Insight Report (Layer 2) | locked, unlocked, partial, loading(progress bar), error |
| `/applications/:id/interview` | AI Interview Landing | default, equipment-check, loading, error |
| `/applications/:id/interview/run` | AI Interview In-Progress | in-progress, completed, edge: equipment fail |
| `/applications/:id/offer` | Offer / Acceptance page | default, loading, error |
| `/applications/:id/closed` | Rejection / "Application Closed" page | with-insight, with-reason, without-reason (uses RejectionCard) |
| `/conversations` | AI Conversations (archive page) | default, empty, loading, error |
| `/conversations/:id` | A conversation thread | default, empty, loading |
| `/profile` | My Profile (2 tabs: Profile / Privacy & Data) | profile default, profile CV-empty, privacy default, loading, error |

Plus a **global AI chat overlay bubble** (not a route) — see §8.

### RECRUITER (route → screen → key states)

| Route | Screen | States to build |
|---|---|---|
| `/r/vacancies` | Job Vacancies list | default, loading, empty, no-draft, error |
| `/r/vacancies/new` | Create Vacancy (4 steps) | step1 empty, step1 empty-field, step1 edge-case, step1 exit, step4 empty/review, loading |
| `/r/vacancies/:id` | Vacancy Detail (2 tabs: Overview / Pipeline) | overview default, pipeline default, pipeline no-candidates(vacancy active), pipeline no-candidates(no vacancy), pipeline no-result, error, closed, late(overdue decision) |
| `/r/vacancies/:id/edit` | Edit Vacancy (same flow as new, pre-filled) | reuse create flow |
| `/r/pipeline` | Candidate Pipeline (cross-vacancy) | default, edge: multiple-role(+1 role row), no-result, error |
| `/r/applications/:id` | Application Detail (2 tabs: Overview / Assessment) | overview default, assessment default, assessment empty, AI-interview completed, error |
| `/r/conversations` | AI Conversations (recruiter) | default, empty, loading |
| `/r/profile` | My Profile (recruiter, 2 tabs) | default, loading, error |

Recruiter modals (not routes — render over current screen):
- **Move applicant modal** (`Move_applicant_modal.png`)
- **Close/Bulk reject modal** (`Close_applicant_modal.png`)
- **Move Stage confirmation**, **Close Vacancy confirmation**
- **Deadline-passed confirmation**: "Set New Date" or "Move to Final Review" (see §7 timeline rule)

> Screenshots in the project (`/project/*.png`) map to these by filename and are your fallback visual reference when a Figma node is not yet provided. Filenames are descriptive (e.g. `Browse_Jobs__Empty_Filter.png`).

---

## 7. Status state machine (the spine of the prototype)

There are **two status vocabularies**. Do not mix them.

### A. Candidate-facing stage (7+1 stages) — drives candidate UI, badges, AIChat references
| Stage | Color | Icon | Candidate label |
|---|---|---|---|
| applied | Blue | inbox | "Application Received" |
| in-review | Indigo | eye | "Under Review" |
| assessment | Amber | clipboard | "Action Required — please complete your assessment" |
| assessment-complete | Teal | check-circle | "Assessment Submitted" |
| interview | Purple | calendar | "Interview Confirmed" |
| decision | Orange | clock | "Final Review in Progress" |
| accepted | Green | star | "Congratulations — your offer is extended" |
| rejected | Gray | x-circle | "Application Closed" |

### B. Recruiter-facing status (4 states) — drives recruiter pipeline urgency
| Label | Color | Meaning |
|---|---|---|
| Waiting on recruiter | Amber | assessment submitted, recruiter must act |
| Waiting on candidate | Gray | assessment assigned, awaiting candidate |
| In progress | Gray | under review / interview confirmed |
| Resolved | Green | offer extended / accepted |

Recruiter also shows a separate **Stage** column (Applied · Assessment · Interview · Final Review · Resolved) in **uniform dark text** — stage is not urgency, only Status gets color.

### Transitions (mock these; persisted in store)
```
applied → in-review → assessment → assessment-complete → interview → decision → (accepted | rejected)
```
- A candidate's application object holds: `{stage, expectedDecisionDate, assessmentProgress, insightUnlocked, deadline, extensionsUsed}`.
- **Insight report unlocks ONLY after application window closes** (anti-gaming). Until then InsightReportBlock = `locked`. If candidate finished but window not closed → `locked` with "available on [date]". If window closed + partial completion → `partial`. If complete + closed → `unlocked`.
- **Timeline extension rule:** recruiter may extend the decision deadline **once** with a new date. On the **second** miss → application auto-moves to `decision` (Final Review). When a deadline passes, recruiter sees the confirmation modal: **"Set New Date"** or **"Move to Final Review"**. Model `extensionsUsed` (0→1 allowed, then auto).
- Score = average of **numeric** assessments only (Cognitive + Technical if enabled). **Personality Profile is excluded** from score (informational only).

---

## 8. AI Chat (two surfaces — do not merge them)

1. **Overlay bubble (active chat):** a floating bubble bottom-right on EVERY candidate screen. Opens a chat panel. It is **context-aware** — it knows the route/screen the candidate is on and seeds suggested questions accordingly (e.g. on `/applications/:id/insight` → "What does my insight report mean?"). This is the product's helper, not the product itself.
2. **AI Conversations page (archive):** `/conversations` — a dedicated page listing past threads. This is storage/review, not the live helper. Different from the ChatGPT pattern on purpose: the chat is an *overlay assisting a workflow*, not a *destination*.

### AIChatBubble variants + behavior rules
- `user` / `ai` / `loading` / `error` / `escalation`.
- AI **answers:** application status, stage meaning, assessment logistics, timeline/dates, next steps, what the insight report means.
- AI **refuses / deflects:** raw scores, "why exactly was I rejected" beyond what recruiter chose to share, anything before the recruiter has decided ("A decision hasn't been made yet — here's what happens next…"), guarantees about outcomes.
- **Escalation to human is sentiment-triggered, not a button.** When mock sentiment detects distress, surface the `escalation` bubble offering a human recruiter handoff.
- **Banned word:** never use "unfortunately" in any candidate-facing copy. Rejection is always "Application Closed", never "Rejected".
- AI chat **usage limits** edge-case screen exists but copy is "to be confirmed with product team" — build the state, label it clearly as placeholder.

Mock the AI: canned responses keyed by route + intent. No real API. Keep responses on-brand (calm, plain, honest).

---

## 9. The 3 key flows (must work end-to-end with realistic data)

1. **Apply → assessment → result:** `/jobs` → `/jobs/:id` → `/jobs/:id/apply` (multi-step) → submit → `/applications/:id` (applied) → take assessment → `/applications/:id/assessment/complete` → after window closes → `/applications/:id/insight` (unlocked).
2. **Rejection → transparency → AI chat:** `/applications/:id` (decision) → `/applications/:id/closed` (RejectionCard with-insight) → open AI chat overlay → ask "what could I improve?" → AI answers within boundaries, then sentiment escalation path available.
3. **Recruiter review → transparency context → decision:** `/r/pipeline` or `/r/vacancies/:id` (Pipeline tab) → `/r/applications/:id` (Overview + Assessment tabs, AI interview results) → move stage / close → modal confirmation → state updates reflect on candidate side (shared store).

Flows 1–3 share the SAME store, so a recruiter decision in flow 3 changes what the candidate sees in flows 1–2. That shared state is the demo's "wow".

---

## 10. Mandatory rules (Aji + Dityo will check these)

- **Error states = 3-layer pattern, no exceptions:** (1) what happened, (2) why, (3) what to do next. Use Callout. Example: "I could not load the job listings." / "There may be a temporary issue with our service." / "Try refreshing the page."
- **Loading = Skeleton everywhere EXCEPT** assessment-result loading and insight-report loading, which use **Progress bar + estimated-time label**.
- **Empty states = always meaningful**, never blank. Each has an icon, one line of explanation, and one clear action. (Reference copy lives in the design doc — match its tone.)
- **Every interactive element goes somewhere.** No `href="#"`, no dead buttons. If a feature is out of scope, the button opens a small "Coming in V1" toast rather than doing nothing.
- **Components only.** No detached/arbitrary colors or spacing — pull from §3 tokens. This is the #1 thing Aji fails files on.
- **Descriptive naming.** Components, files, and props named by purpose (no `Frame427`, no `div2`).
- **Realistic data.** Use the names already in the screenshots (Aditya Kurniawan, Rina Permatasari, Budi Santoso, Maya Wijaya, etc.), real-sounding roles, IDR salaries, Indonesian cities. No lorem ipsum.

---

## 11. Project structure (suggested)

```
src/
  components/ds/        # design-system primitives (§5)
  components/platform/  # the 4 custom components (§5)
  components/chat/      # AIChatBubble overlay + panel
  layouts/             # CandidateLayout, RecruiterLayout (sidebars)
  routes/              # route definitions (§6)
  screens/candidate/
  screens/recruiter/
  store/               # zustand store + persist (§7 state machine)
  data/                # mock data (candidates, vacancies, conversations)
  tokens/              # tokens.css (§3)
  lib/aiChat.ts        # canned context-aware responses (§8)
```

---

## 12. How we work (do not re-ask settled questions)

- Everything in this file is **decided**. Don't re-litigate it. If something here is genuinely ambiguous, **state your assumption and proceed** — note it at the end of your turn so Ahmad can correct it.
- Work **one flow at a time** (see the execution prompts Ahmad will paste). After each flow: stop, summarize what you built, list assumptions + any missing Figma nodes, and wait.
- Figma is visual truth; this file is behavioral truth.
- Banned word "unfortunately"; rejection wording is "Application Closed".
- Indonesian for any notes back to Ahmad; English for all in-product copy.
