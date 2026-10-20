# Asset 360 Investigation Workspace — Flows code review

Date: 2026-10-20, round 5. This is a local technical review using the Cognite Flows certification criteria. It is not an engineering-lane approval or a certification submission.

## Path to approval

This review found **0 must-fix items** in the current source snapshot. Two Should Fix and four Nice Fix findings remain. Live acceptance remains incomplete. The design assessment is separate and does not meet its 3.8 average target.

### Reviewed commit

HEAD: `b46e8dfc37ea1793e1f6913b87e9abd532422aef`.

Reviewed production sources match that commit, including the production table-layout correction in src/views/InvestigationView.tsx, corresponding SPEC FR-015a and test-only chart/dialog-query corrections. Production TS/TSX SHA-256: 9b59bf7ac114c43bbfde50cfd1ee3cdd09be8aff09e7b2091748bd0624747e83, recorded in source-sha256.txt. It covers production src TS/TSX, including main.tsx, excluding tests and test-only fixtures. CSS is additionally reviewed: src/styles.css SHA-256 7e57d0554301c92d9b772ba0b5b96bcbb7ae2bd04c6face106ed5236c8752a99, recorded in styles-sha256.txt. The CSS change uses an existing Aura token for stronger light text contrast. The user committed the production changes during this review. The source and CSS hashes still match; the review artifacts contain additional uncommitted documentation updates.

## Checks performed

- Pre-checks: package.json and App-Brief.md present; git rev-parse confirms the app repository. Round 5 follows rounds 1–4 without overwriting their evidence.
- Pulled both flows-review-checks and code-quality successfully from cognitedata/builder-skills through the official CLI before scoring this run. Read both and ran all source hunts, including supplemental hook/naming/size checks. Fixer instructions were not applied during the review.
- Inventoried 24 TS/TSX/config files plus src/styles.css and read all non-trivial production modules. See review-files.md and hunt-evidence.md.
- The earlier browser geometry regression reproduced the notebook overlap before its fix and passed at three widths afterwards. The TS/TSX layout is unchanged in this round. The user confirmed readability in the live notebook. See [round 4 layout evidence](../feedback-round-4/layout-regression.json).
- Verification exposed a lazy-chart transform timeout and an ambiguous preview title query. Test-only corrections preload the real chart and scope title assertions to the actual document dialog. These test corrections from round 4 remain unchanged. The new complete suite after the CSS correction passes all 31 tests.
- `npm.cmd test -- --coverage --reporter=dot`: Vitest 4.1.12, **31 passed, 0 failed, 0 skipped**, nine files.
- Coverage scope: all production src TS/TSX except main.tsx bootstrap and declaration files. Tests and test-only fixtures are excluded. No domain feature, component, hook or service is excluded. V8: **82.81% statements, 71.31% branches, 82.87% functions, 85.71% lines (276/322)**.
- Current `npm.cmd run lint`: exit 0, no warnings/errors. `npm.cmd run build`: exit 0, including strict TypeScript. Initial JS 215.10 kB gzip; lazy chart 101.93 kB; CSS 23.78 kB. Non-blocking chunk-size and third-party Zod annotation notices remain.
- The generated scratch Vite cache was relocated during round 4. This round's normal full lint command passed without reducing its scope or rules. No production source changed after successful verification.
- Registry audit/outdated refreshed for this round; valid JSON results. **0 critical, 0 high, 0 moderate, 4 low** affected package entries, sharing an inherited KaTeX advisory. Aura deprecation spot-check returned no notice. See review-packages.md for versions and upgrade plan.
- User-reported real-data checks are recorded separately. The agent's Edge page tests isolated fixtures; no authenticated Fusion browser or successful real PDF opening is claimed.

## Contrast verification

A failing regression was recorded before the fix. All six resolved text/background token pairs now exceed 4.5:1. The light text on white changed from 3.71:1 to 9.58:1. Evidence and a repeatable script are in this round. This does not certify all rendered colors, focus states or assistive-technology behavior. The controlled semantic-token alias is a documented Aura exception, with no raw color values.

## Scores

| Area | Criterion | Score | Notes |
| --- | --- | ---: | --- |
| User & customer | 1.1 Known bugs | 4/5 | Root/panel boundaries and independent feedback in main.tsx and InvestigationView.tsx; parameterized PDF routing and the reported notebook table overlap are fixed and regression-tested. Live acceptance remains incomplete. |
| User & customer | 1.3 Packages | 3/5 | package.json/lockfile retain the documented scaffold API family. No high/critical/moderate advisories; outdated dependencies and inherited low entries need the compatibility upgrade plan in review-packages.md. |
| User & customer | 1.4 Tests & coverage | 4/5 | Full-scope lines 85.71%, nine files and 31 tests pass. App.tsx bootstrap and SeriesChart.tsx secondary interactions retain gaps. |
| User & customer | 1.5 Dead code | 4/5 | No unused source modules, unsafe production types, lint/type errors or unreachable routes found. InvestigationView.tsx would benefit from panel extraction. |
| User & customer | 1.6 Patterns & testability | 5/5 | WorkspaceContext.ts injects service/host/storage; AssetService.ts implements a narrow interface; the stateless ViewModel separates orchestration from the view. Tests inject external dependencies without vi.mock. |
| Cognite services | 2.1 DMS query patterns | 5/5 | AssetService.ts uses ranked search plus exact identity retrieval. Owning-view filtered lists are the documented suitable path for assets list relations, with no classic asset copy or Raw usage. |
| Cognite services | 2.2 Server-side filter | 4/5 | AssetService.ts applies relation/type/upload filters and limits at the API. View payloads still include some unneeded properties. |
| Cognite services | 2.3 Limits & pages | 4/5 | AssetService.ts paginates linked results with cursor protection, bounds discovery, and batches bounded historical reads. Full linked lists are intentional for this exercise; tuning remains possible for larger assets. |
| Cognite services | 2.4 Call rate | 4/5 | Query caching/deduplication in useInvestigationViewModel.ts and no polling/focus refetch. Rapid search could benefit from timed debounce. |
| Cognite services | 2.5 429 backoff | 3/5 | retryRead at useInvestigationViewModel.ts:8 enables a bounded TanStack backoff retry on 429. No shared concurrency cap, explicit jitter or Retry-After parsing. |
| Cognite services | 2.6 CDF Raw | N/A | No Raw calls found anywhere in src. |
| Brand | 3.1 Aura | 4/5 | InvestigationView.tsx and SeriesChart.tsx use Aura subpaths, controls, grids, feedback, dialogs and tokens. src/styles.css strengthens light secondary text using an existing Aura token. Keyboard works according to the user; full visual/focus acceptance remains pending. |

## Prioritized findings

**Must Fix:** none open in this local code review.

**Should Fix (2):** S1 shared throttling/retry policy; S2 compatible dependency migration. Paths and rationale are in review-findings.md.

**Nice Fix (4):** N1 presentational panel extraction; N2 timed search debounce; N3 secondary test depth; N4 live accessibility/layout verification. See review-findings.md.

## Shared and runner verification

- Every hunt records hits or none, including code-quality searches; all scores have supporting paths.
- Coverage excludes no production feature or application tests. Full-scope lines exceed 80%.
- All required report, inventory, findings and package files exist in this round. Counts below match the categorized findings; there are no Must Fix items requiring an Impact annotation.
- This report identifies the commit, production hash, committed layout/CSS corrections and additional review documentation. The actual document, activity-detail, shared-link and recent-history live checks remain pending in CERTIFICATION-CHECKLIST.md.
- This technical score is separate from the ten-question design assessment. No design score, deployment, demo or certification approval is claimed.

## Summary

- Must Fix open: 0
- Should Fix open: 2
- Nice Fix open: 4
