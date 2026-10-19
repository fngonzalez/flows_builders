# Asset 360 Investigation Workspace - Flows code review

This document is the local platform code review for Asset 360, conducted using the current Cognite Flows review skills. It is not an engineering-lane approval or a certification submission.

**Historical snapshot (2026-10-19):** This round describes the source hash below. A later audit corrected parameterized PDF MIME handling and added a regression test. The current source and its 31 passing tests are reviewed in [round 2](../feedback-round-2/code-review-report.md); use that newer report for current technical findings.

## Path to approval

This local review found **0 must-fix items** in the implemented code. Two Should Fix and four Nice Fix items remain. Live document acceptance, manual design assessment, deployment and submission are still pending.

### Reviewed commit

Baseline HEAD: `1b917dd638db02b52fd585e2158e4e61288ffd75`.

The implementation is an **uncommitted working tree**, not that scaffold commit. Reviewed production-source snapshot SHA-256: `7ff0c2f041b4b3ea2308d541343ce72d5fba651f5fd45849a31052d5f0ad0330`. The source inventory and snapshot are reproducible with scripts/review-hunt.mjs. Commit and re-identify the exact submitted revision before formal submission.

## Checks performed

- Current flows-review-checks and code-quality were pulled from cognitedata/builder-skills. Every hunt is recorded in hunt-evidence.md. Review did not substitute fixer skills for the criteria.
- 24 source/config files inventoried; production modules inspected; no unused production module candidates.
- npm run lint:fix: passed with no remaining warnings/errors.
- npm run build: passed, including strict TypeScript. Initial JS is 215.03 kB gzip; the lazy chart chunk is 101.93 kB gzip. CSS is 23.76 kB gzip. Vite's uncompressed chunk-size advisory and third-party Zod annotation messages remain non-blocking.
- Vitest 4.1.12: **30 passed, 0 failed, 0 skipped**, across nine test files.
- V8 coverage: **82.81% statements, 71.31% branches, 82.87% functions, 85.71% lines** (276/322). Full src production scope includes App, components, domain, services, state, viewmodels and views; only tests/test fixtures, declarations and main.tsx bootstrap are excluded. No production feature was removed from coverage.
- npm audit after the corrective Vitest update: **0 critical, 0 high, 0 moderate, 4 low**. See review-packages.md for actual dependency versions, advisories and migration plan.
- User-reported live checks: authenticated asset search/open, 2 sensor records, 16 activities and a real chart in publicdatacdm. No agent browser was connected; no screenshots, automated live DOM inspection or successful real PDF opening is claimed.

## Scores

| Area | Criterion | Score | Notes |
| --- | --- | ---: | --- |
| User & customer | 1.1 Known bugs | 4/5 | Root/panel boundaries and loading/error/empty/no-access UI; automated core flows pass. Live file acceptance is a documented data-example gap, not a claimed success. |
| User & customer | 1.3 Packages | 3/5 | Locked official scaffold family, no high/critical/moderate audit findings; inherited low advisories and major-version migration plan remain. |
| User & customer | 1.4 Tests & coverage | 4/5 | Honest 85.71% full-scope lines; bootstrap and some secondary interactions need deeper tests. |
| User & customer | 1.5 Dead code | 4/5 | No unused modules, production any or lint/type errors; large presentational view can be split. |
| User & customer | 1.6 Patterns & testability | 5/5 | Auth SDK from context, narrow interface-based service, shared storage and stateless ViewModel; injected service tests without module mocks. |
| Cognite services | 2.1 DMS query patterns | 5/5 | Ranked search and documented owning-view list lookups for unsupported reverse-list traversal; no Raw/classic asset copies. |
| Cognite services | 2.2 Server-side filter | 4/5 | Relation/type/upload filters applied server-side. Some flat view payloads contain unneeded fields; no broad project download followed by client-side search. |
| Cognite services | 2.3 Limits & pages | 4/5 | Explicit limits/cursors, repeated-cursor protection, bounded discovery, batched datapoints and bounded aggregates. Full linked lists are intentional requirements. |
| Cognite services | 2.4 Call rate | 4/5 | Query caching/deduplication; no polling/focus refresh; search can add a timed debounce. |
| Cognite services | 2.5 429 backoff | 3/5 | One bounded TanStack retry covers 429; no shared semaphore, Retry-After or explicit jitter. |
| Cognite services | 2.6 CDF Raw | N/A | Raw is unused. |
| Brand | 3.1 Aura | 4/5 | Aura search composition, controls, grids, feedback, dialogs and charts. Visual and keyboard/contrast sign-off remains a manual design step. |

## Prioritized findings

**Must Fix:** none in this local code review.

**Should Fix (2):** shared throttling/retry policy; compatible scaffold/dependency migration. Paths and rationale are in review-findings.md.

**Nice Fix (4):** extract presentational panels; timed search debounce; deeper secondary tests; manual browser accessibility verification.

## Limits and next actions

The app is not yet ready to claim the full certification success flow: a real document must still open from a related asset, design scores must be confirmed by the user, and repository/deployment/demo/submission links do not exist. The local source snapshot is not a committed submission revision.

## Summary

- Must Fix open: 0
- Should Fix open: 2
- Nice Fix open: 4
