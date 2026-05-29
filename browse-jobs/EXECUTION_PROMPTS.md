# Claro — Execution Prompts (paste into Claude Code one phase at a time)

> Prerequisite: `CLAUDE.md` is in the project root, and the Figma MCP server is connected.
> For each phase, paste the prompt, then **paste the Figma node-IDs/links** where the prompt says `[PASTE NODES]`.
> Wait for Claude Code to finish + summarize each phase before starting the next. Do not run them all at once.

---

## PHASE 0 — Scaffold + design system + shared spine

```
Read CLAUDE.md fully first. Then scaffold the project per §11:

1. Set up React + Vite + TypeScript + react-router-dom + zustand (with persist) + @tabler/icons-react.
2. Create src/tokens/tokens.css with EVERY token from §3 as CSS variables. All later styling references these — no hardcoded hex anywhere else.
3. Build the design-system primitives in src/components/ds/ (§5 list). Token-driven, minimal, reusable. Build them as the real Radix-style API (variants/sizes as props). Don't style screens yet — just the primitives + a quick visual gallery route at /_ds to eyeball them.
4. Build CandidateLayout and RecruiterLayout (§4 sidebars) with the dev-only role switch (§6).
5. Set up the Zustand store skeleton implementing the §7 state machine (types + initial mock data shape, transitions stubbed). Wire persist to localStorage.
6. Define ALL routes from §6 as empty placeholder screens that render their name + intended states list, so the whole route map is navigable immediately.

Do NOT touch Figma yet. This phase is pure scaffolding from CLAUDE.md.
Stop when done. Summarize the file tree, confirm all routes render, and list anything ambiguous.
```

---

## PHASE 1 — The 4 custom components (from Handover File 1 + Figma)

```
Read CLAUDE.md §5 and §8. Read Handover_File1_New_Components.pdf in the project for exact variant specs.

Figma nodes for the 4 custom components:
- ApplicationStatusCard: [PASTE NODES — one per variant if available: active, pending, action-required, rejected, accepted]
- InsightReportBlock:     [PASTE NODES — locked, unlocked, partial]
- AIChatBubble:           [PASTE NODES — user, ai, loading, error, escalation]
- RejectionCard:          [PASTE NODES — with-reason, without-reason, with-insight]

For EACH component, follow the §2 MCP workflow (get_image → get_variable_defs → get_code as reference → re-author clean). Build each as ONE component with a `variant` prop, composed from ds/ primitives and §3 tokens. Add them to the /_ds gallery showing every variant.

Stop when done. Show each variant rendered. Flag any variant where no Figma node was provided (build from the PDF + closest sibling and tell me).
```

---

## PHASE 2 — FLOW 1: Apply → Assessment → Result (candidate)

```
Read CLAUDE.md §6 (candidate routes), §7 (state machine), §9 (flow 1), §10 (rules).

Build these candidate screens for real, in order, each with ALL its states from the §6 table:
1. /jobs (Browse Jobs) — incl. empty-search, empty-filter, empty-search+filter, error(3-layer), loading(skeleton)
2. /jobs/:id (Job Detail) — incl. closed, error
3. /jobs/:id/apply (multi-step Application Form) — all steps + auto-filled, missing-field, file-too-big, exit-confirmation, complete
4. /applications + /applications/:id (dashboard + status detail per stage)
5. /applications/:id/assessment + .../run + .../complete — remember: complete-loading uses PROGRESS BAR + ETA, not skeleton (§10)
6. /applications/:id/insight — locked / unlocked / partial per §7 unlock rules; loading uses progress bar

Figma nodes:
[PASTE NODES — group them by screen; for each screen list its frame links/node-ids, including state variants you have]

MCP workflow per screen (§2). Wire the full clickable path of flow 1 so I can apply to a job and watch the application advance through the store. Use realistic data (§10). Add the context-aware AI chat overlay bubble (§8) on these screens with canned responses seeded by route.

Stop after this flow. Summarize, list assumptions + missing nodes.
```

---

## PHASE 3 — FLOW 2: Rejection → Transparency → AI Chat (candidate)

```
Read CLAUDE.md §7, §8, §9 (flow 2), §10.

Build:
1. /applications/:id/closed — RejectionCard with-insight / with-reason / without-reason. Copy rule: "Application Closed", never "Rejected"; banned word "unfortunately" (§8/§10).
2. The full AI chat overlay behavior (§8): context-aware suggestions, the answer/refuse boundaries, the "no decision yet" response, and the SENTIMENT-TRIGGERED escalation bubble (not a button).
3. /conversations + /conversations/:id (archive page + thread) with empty/loading states.
4. The AI chat usage-limit edge-case state — label copy as "to be confirmed with product team" placeholder.

Figma nodes:
[PASTE NODES — closed page variants, AI chat states, conversations page]

Wire flow 2 end-to-end: from a rejected application, open closed page → open chat → ask about improvement → AI answers within boundaries → trigger escalation path. MCP workflow per §2.

Stop, summarize, flag gaps.
```

---

## PHASE 4 — Remaining candidate screens (interview, offer, profile)

```
Read CLAUDE.md §6.

Build the candidate screens not yet covered, with all states:
1. /applications/:id/interview + .../run (AI Interview landing, equipment-check, in-progress, completed, edge: equipment fail)
2. /applications/:id/offer (Acceptance/Offer page)
3. /profile (2 tabs: Profile / Privacy & Data; incl. CV-empty state)

Figma nodes:
[PASTE NODES — interview screens, offer page, profile tabs]

MCP workflow per §2. Make sure these are reachable from the application detail and sidebar. Candidate side should now be fully navigable across every route in §6.

Stop, summarize, flag gaps.
```

---

## PHASE 5 — FLOW 3 + recruiter side (vacancies, pipeline, application detail)

```
Read CLAUDE.md §4 (recruiter sidebar), §6 (recruiter routes), §7 (status A vs B — don't mix), §9 (flow 3), §10.

Build recruiter screens with all states:
1. /r/vacancies (list) + /r/vacancies/new (4-step create) + /r/vacancies/:id/edit (pre-filled reuse)
2. /r/vacancies/:id (Vacancy Detail — Overview tab + Pipeline tab). Pipeline: Candidate · Status · Stage · Score · Last Activity · ···. Status uses 4-state color; Stage uniform dark text. Score adaptive per §7. Bulk actions in topbar on selection (Vacancy Detail pipeline only). Incl. late/overdue + closed states.
3. /r/pipeline (cross-vacancy) — NO checkbox/bulk; per-row ··· only; edge: multiple-role (+1 role row).
4. /r/applications/:id (Application Detail — Overview + Assessment tabs; AI interview results with "AI-generated summary" label; Personality excluded from score).
5. Modals: Move applicant, Close/Bulk reject, Move Stage confirmation, Close Vacancy confirmation, and the deadline-passed confirmation ("Set New Date" / "Move to Final Review") wired to the §7 extension rule (one extension, then auto-move to Final Review).
6. /r/conversations + /r/profile (recruiter, 2 tabs).

Figma nodes:
[PASTE NODES — recruiter screens + modals, grouped by screen]

Critical: this side shares the SAME store as candidate side. A recruiter moving a stage / closing an application must change what the candidate sees (§9). Wire flow 3 end-to-end and verify the cross-side reactivity. MCP workflow per §2.

Stop, summarize, flag gaps.
```

---

## PHASE 6 — Polish, cross-side demo wiring, deploy

```
Read CLAUDE.md §9, §10.

1. Verify all 3 key flows run start-to-finish with persistent state across refresh.
2. Verify cross-side reactivity (recruiter decision → candidate view updates).
3. Sweep every route in §6: confirm default + loading + empty + error + at least one edge case exists and is reachable. List any missing.
4. Audit against §10 rules: 3-layer errors, skeleton-vs-progress-bar, meaningful empties, no dead buttons (out-of-scope buttons show a "Coming in V1" toast), tokens only (no stray hex), descriptive naming. Produce a short compliance checklist of pass/fail.
5. Add a tiny "Demo reset" control (dev-only) that re-seeds the store to the starting state, so I can re-run flows during the defense.
6. Prep for static deploy (Vercel/Netlify): build passes, base path correct, no console errors.

Output the compliance checklist and the deploy command. Tell me exactly what to click for each of the 3 defense flows.
```

---

## Tips while running

- If Claude Code starts inventing layouts, reply: *"Stop — pull the Figma node first per CLAUDE.md §2, then re-author."*
- If a state has no Figma node, let it build from the sibling + rules and note it; you can supply the node later and ask it to reconcile.
- After each phase, skim the summary's "assumptions/gaps" list — that's where drift hides.
- Keep `CLAUDE.md` updated if you make a new decision mid-build, so later phases stay consistent.
