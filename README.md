# Saan Tayo Kakain? (MVP)

A fast, local-first restaurant decision app for BGC.
The goal is to help users decide where to eat in under 30 seconds with minimal friction.

---

## Product Vision

Most food apps optimize for search.
This product optimizes for decision-making.

- Mood-first flow (instead of endless browsing)
- Curated local restaurant data
- Explainable recommendations
- Quick re-rolls without repeating the same picks

---

## MVP Goals

### Primary Goal
Help users get a confident restaurant recommendation quickly.

### Success Criteria (MVP)
- User gets first recommendation in less than 30s
- At least 1 strong top pick + 2 alternatives
- Re-roll avoids repeats in-session
- Basic recommendation reason shown for each result

### Out of Scope (MVP)
- Real-time reservations
- Payments or ordering
- Multi-city support
- Full social/group voting system

---

## Core User Stories

1. As a hungry user, I can pick my mood and quickly get restaurant suggestions.
2. As a user, I can refine by budget/cuisine/dining type.
3. As a user, I can re-roll to get new picks without seeing duplicates.
4. As a user, I can understand why a place is recommended.
5. As a user, I can recover when no exact match is found.

---

## MVP Feature Checklist

## 1) Discovery Flow (P0)
- [x] Mood is required primary input
- [x] Optional filters (budget, cuisine, dining type)
- [x] "Ikaw na bahala" random mode
- [x] Submit CTA with loading state
- [ ] Keyboard accessibility pass for all filter controls
- [ ] Empty/error microcopy polish for edge cases

Acceptance criteria:
- Cannot submit without mood
- Random mode can submit instantly
- User can reset filters and start over easily

## 2) Recommendation Engine (P0)
- [x] Candidate filtering by mood/budget/cuisine/dining type
- [x] Top pick + alternatives generation
- [x] Fallback logic when exact matches are empty
- [x] Basic weighted scoring
- [x] Session-aware non-repeating picks
- [ ] Deterministic test suite for score/ranking logic
- [ ] Config-driven weights (instead of hardcoded values)

Acceptance criteria:
- Top pick is always valid and open (if status available)
- Re-roll prioritizes unseen options
- Fallback always returns useful options when possible

## 3) Results UX (P0)
- [x] Dedicated top pick card
- [x] Alternatives section
- [x] "Pick again" action
- [x] Direction chips (Light, Comfort, Premium, etc.)
- [x] Recommendation reason text
- [ ] "Not for me" feedback action per card
- [ ] Save/bookmark pick locally

Acceptance criteria:
- User can re-roll in one tap
- Alternatives update with direction while keeping top pick stable
- Reason text is visible and understandable

## 4) Data Layer (P0)
- [x] Curated local dataset (`data/restaurants.ts`)
- [x] Shared helpers for effective tags/cuisine/dining mapping
- [ ] Data validation script (schema + required fields)
- [ ] Duplicate detection script (name/slug/area conflicts)
- [ ] Missing-tag audit script (mood/cuisine gaps)

Acceptance criteria:
- Every restaurant has required fields
- No duplicate IDs/slugs
- All records map to recommendation filters

## 5) Reliability & State (P1)
- [x] Basic loading transitions
- [x] Session state for seen recommendations
- [ ] Graceful handling for malformed data entries
- [ ] Client-side error boundary / fallback UI
- [ ] Lightweight analytics event guards

Acceptance criteria:
- No crashes from single bad data entry
- Recommendation flow remains usable after rerolls/resets

## 6) Quality & Testing (P1)
- [ ] Unit tests for recommendation scoring
- [ ] Unit tests for fallback behavior
- [ ] Unit tests for no-repeat session logic
- [ ] Component tests for filter and result flow
- [ ] Smoke E2E: mood -> submit -> results -> reroll

Acceptance criteria:
- Critical recommendation logic covered by automated tests
- Core user journey passes in CI

## 7) Analytics (P1)
- [x] Vercel analytics integration present
- [ ] Event tracking plan implemented:
  - [ ] `filter_selected`
  - [ ] `search_submitted`
  - [ ] `result_shown`
  - [ ] `pick_again_clicked`
  - [ ] `direction_selected`
  - [ ] `fallback_triggered`
  - [ ] `new_search_clicked`
- [ ] Basic dashboard for weekly review

Acceptance criteria:
- Can measure conversion from app open to result shown
- Can measure reroll frequency and fallback rate

## 8) MVP Launch Readiness (P1)
- [ ] Responsive QA (mobile-first and desktop sanity pass)
- [ ] Accessibility baseline (focus states, labels, contrast)
- [ ] Performance check (LCP/CLS on mobile)
- [ ] Error logging (Sentry or equivalent)
- [ ] Basic legal pages (privacy/terms if collecting analytics)

Acceptance criteria:
- App is stable on target devices
- No blocking accessibility issues for basic navigation
- Core web vitals acceptable for MVP

---

## Product KPIs (MVP)

- Activation: percent of users who reach first result card
- Decision speed: `time_to_first_recommendation` (target: < 30s)
- Decision confidence: percent users who do not reroll after first recommendation
- Relevance signals:
  - fallback trigger rate
  - direction chip interaction rate
- Retention: returning users (7-day)

---

## Current Risks & Mitigations

Risk: Feels like a generic restaurant finder.
- Mitigation: keep mood-first UX and explainable recommendations as core identity.

Risk: Data quality degrades over time.
- Mitigation: add data audit scripts + monthly curation pass.

Risk: Recommendation trust is weak.
- Mitigation: improve reason quality and add simple thumbs up/down feedback loop.

Risk: Hardcoded list does not scale.
- Mitigation: move to hybrid pipeline (curated source of truth + external API enrichment later).

---

## Suggested Roadmap

### Phase 1 - Solid MVP (Now)
- Stabilize recommendation quality
- Add tests and analytics events
- Improve data validation and audit tooling

### Phase 2 - Smart Curation
- Add feedback signals (like/dislike)
- Add user memory (recently shown/visited)
- Improve explanation quality

### Phase 3 - Hybrid Data
- Integrate external APIs (Google/Foursquare) for discovery
- Keep curated scoring tags internally
- Add moderation workflow before publishing new places

---

## Tech Notes

- Framework: Next.js + React
- Recommendation logic: `lib/recommend/*`
- Data source: `data/restaurants.ts` (currently curated static list)
- UI flow: mood-first filter -> results -> reroll/direction exploration

---

## Nice-to-Have Backlog (Post-MVP)

- Group decision mode (multi-user vote)
- "Lunch break under 45 mins" contextual presets
- "Open now" and "walking distance" filters
- Map preview card
- Personalized suggestions over time
- Admin curation panel

---

## Definition of Done (MVP)

MVP is done when:
1. Core flow is stable and tested.
2. Recommendations are explainable and non-repetitive in-session.
3. Analytics proves users can reach decisions quickly.
4. Data is maintainable with basic validation/audit tools.
