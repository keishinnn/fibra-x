<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

Guidance for AI coding agents working in `fibra-x`.

## 1) Project Identity

- Product name: `FibraX`
- Product subtitle: `Bitcoin Cycle Ratio Visualizer`
- Product type: Bitcoin market-cycle research dashboard
- Positioning: research and visualization tool, not a guaranteed prediction engine
- Required disclaimer baseline:
  - Educational and research use only
  - Not financial advice
  - Market behavior is uncertain and models can fail

## 2) Current Stack and Commands

Current stack in repository:

- Next.js App Router (`src/app`)
- React 19
- TypeScript (`strict: true`)
- Tailwind CSS 4
- ESLint 9

Planned stack additions (when installed):

- `shadcn/ui`
- `lightweight-charts` (primary charting)
- `recharts` (secondary dashboard charts)

Local commands:

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Lint: `npm run lint`
- Production build check: `npm run build`

Before finalizing significant changes, run:

1. `npm run lint`
2. `npm run build`

## 3) Architecture Contract (Feature-Based)

Use feature-based architecture as the default for all new work.

High-level layout:

- `src/app`: routes, layouts, metadata, loading/error boundaries (keep thin)
- `src/features`: feature modules with co-located UI, logic, types, and data transforms
- `src/components`: shared reusable UI primitives and layout components
- `src/lib`: shared cross-feature utilities, constants, helpers
- `src/styles` (optional): shared style tokens/utilities if introduced

Route composition rule:

- Route files in `src/app/**/page.tsx` should compose feature entry components rather than contain heavy business logic.

## 4) Feature Module Structure

For each feature in `src/features/<feature-name>/`, prefer:

- `components/`: presentational and composed feature UI
- `hooks/`: feature-specific React hooks
- `lib/`: pure calculations and helpers (no React dependency)
- `types/`: domain types and interfaces
- `data/`: static seed/sample datasets and mapping data
- `server/` (only when needed): server-only access logic

Example target features for this project:

- `market-chart`
- `cycle-model`
- `dashboard`

## 5) Engineering Principles

Apply these principles on every change:

- KISS: choose the simplest solution that satisfies requirements
- DRY: avoid duplicated logic and duplicated constants
- YAGNI: do not implement speculative features
- Separation of Concerns: keep UI, domain logic, and data access separate
- SOLID (practical): especially single responsibility and dependency inversion for reusable logic
- Explicitness over magic: prefer readable, typed transformations

Implementation expectations:

- Prefer pure functions in `lib/` for model calculations.
- Keep components focused and small.
- Co-locate related logic within the owning feature.
- Avoid adding dependencies unless clearly justified.

## 6) TypeScript and Imports

- Preserve strict typing standards; avoid `any` unless temporary and documented.
- Model domain entities explicitly (candles, cycle phases, fib zones, projections).
- Use path alias imports via `@/*` from `tsconfig.json`.
- Prefer immutable patterns for shared model data.

## 7) Next.js and Rendering Rules

- Respect server/client boundaries in App Router.
- Add `"use client"` only where interactivity is required.
- Keep heavy calculations outside render paths where possible.
- Prefer server-rendered shells with client islands for chart-heavy areas.
- Read relevant docs in `node_modules/next/dist/docs/` before introducing or changing Next.js APIs.

## 8) UI and Product Rules for FibraX

UI direction:

- Dark-first trading dashboard aesthetic
- Chart-first layout with supporting metrics panels
- Professional, technical, concise labeling

Product framing rules:

- Never present outputs as guaranteed future price predictions.
- Use wording such as projection zones, scenarios, invalidation, and historical comparison.
- Preserve disclaimer visibility on landing and dashboard contexts.

## 9) Data and Modeling Rules

- Treat model logic as research heuristics, not deterministic truth.
- Keep calculation logic deterministic and testable.
- Keep raw historical inputs separate from derived metrics.
- Document assumptions near model functions.
- Prefer static typed datasets first; add external APIs only behind clear boundaries.

## 10) Charting Rules

Primary charting:

- Use `lightweight-charts` for main market chart experiences.
- Main chart responsibilities: candles, optional volume, halving markers, fib levels, phase overlays, projection zones.

Secondary charts:

- Use `recharts` for compact comparative panels and summaries.

Design constraints:

- Do not clone TradingView UI one-to-one.
- Build a TradingView-inspired interface with clear FibraX branding.

## 11) Quality and Testing Expectations

- Add tests for non-trivial pure logic in `features/**/lib` when test setup exists.
- Prefer deterministic fixtures for cycle and ratio calculations.
- For UI changes, verify desktop and mobile layout behavior.
- If tests are not yet configured, validate via lint + build and document the limitation.

## 12) Agent Workflow

1. Read nearby files and mirror existing conventions.
2. Confirm architecture placement before creating new files.
3. Make the smallest safe change set that solves the request.
4. Run relevant checks (`lint`, then `build`) for significant changes.
5. Summarize what changed, why, and known risks or follow-ups.

## 13) Security and Integrity

- Never commit secrets, private keys, or production credentials.
- Validate and sanitize external data before model use.
- Avoid silent fallbacks that hide data quality issues.
- Surface confidence limits and invalidation conditions clearly when applicable.
