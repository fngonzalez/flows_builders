# Findings — Asset 360, round 2

Date: 2026-10-19. Evidence: [full hunts](hunt-evidence.md), [inventory](review-files.md), [packages](review-packages.md).

## Config inspected

- Read vitest.config.ts, vitest.setup.ts, vite.config.ts, tsconfig.json, package.json and manifest.json.
- Coverage includes all `src/**/*.{ts,tsx}`. Excludes only test files, declaration files, main.tsx bootstrap and test-only `__mocks__` fixtures. No production feature is excluded.
- Test excludes: Vitest defaults and generated `.agents/**` / `.claude/**` skills. No application tests are hidden. Nine files ran.
- All non-trivial production files were read. Interface-based services, context storage and the stateless ViewModel match AGENTS.md.

## Searches

| Check | Result |
| --- | --- |
| Error boundaries | Root main.tsx:26; three independent panel boundaries at InvestigationView.tsx:569,705,741. |
| Critical TODO / async effects | No critical TODOs; App.tsx:90 cancels post-unmount updates; useInvestigationViewModel.ts:132 has no timer or listener to clean up. |
| Loading / error / empty | PanelState and Feedback in InvestigationView.tsx:91,130; search, discovery, chart and preview have separate feedback. |
| Coverage / test exclusions | Full production scope; 85.71% line coverage; all nine test files ran. |
| CDF Raw | None; criterion 2.6 N/A. |
| DMS list / query / search | AssetService.ts:81,104,158,174,181,198,227,251. Search uses ranked search; linked reads filter owning views because reverse-list traversal is unsupported. |
| Limits / filters / cursors | Relation containsAny at AssetService.ts:257, limit/cursor at 263–264; repeated cursor protection; bounded discovery and batched history. |
| QueuedTaskRunner / 429 | No shared runner; retryRead at useInvestigationViewModel.ts:8 handles 429 with one TanStack backoff retry. S1 remains. |
| any / unsafe casts / module mocks | None in production; no as unknown as or vi.mock in src. |
| Lint / tsc | Current lint and build both exit 0; build runs strict tsc. |
| CogniteClient / DI / ViewModel | Auth provider in App.tsx; injected AssetService in WorkspaceContext.ts:7; no direct client construction; no fetches in view. |
| Unused / console / unreachable routes | No unused production modules, console calls or unreachable routes identified. |
| Components over 150 lines | InvestigationView.tsx:151 is 907 lines, with presentation and callbacks; extraction would aid maintenance. |
| Flag bags / duplicated SDK shapes / positional primitive args | No flagged patterns; CDF client/node types derive from SDK; domain results are deliberate parsed models. |
| DRY / formatting | Shared formatDate; chart ticks intentionally use compact formatting. Repeated layout classes align panels. MIME classifiers now agree. |
| Naming / structure / comments | Scaffold conventions and AGENTS.md followed; hook filenames start with use; comments explain actual constraints. No dead code blocks found. |
| Aura / accessible names | Aura subpath imports and tokens; labeled search, checkboxes, ranges, tables, images and PDF iframe. Real keyboard/focus/contrast acceptance remains pending. |

## Correction verified before this round

Parameterized PDFs could be rendered as images. The regression test failed before the fix; MIME normalization at InvestigationView.tsx:837 now routes these files to the iframe. SPEC FR-010a records the behavior. This is resolved, not an open finding.

## Must Fix

None found in this local review. This does not establish successful live PDF rendering or certification approval.

## Should Fix

- S1 — `src/viewmodels/useInvestigationViewModel.ts:8`, criterion 2.5: add shared request concurrency control, Retry-After support and jitter for larger deployments. The existing bounded retry avoids infinite loops but is not the complete throttling policy.
- S2 — `package.json:26`, criterion 1.3: follow the documented compatible scaffold-family upgrade plan. React, Aura and table packages have newer major versions; app-sdk and chart/virtualization packages have newer minor versions. Four inherited low audit entries remain. Avoid an untested force downgrade or piecemeal major migration.

## Nice Fix

- N1 — `src/views/InvestigationView.tsx:151`, criterion 1.5: extract named presentational panels and dialogs to make the 907-line file easier to review.
- N2 — `src/viewmodels/useInvestigationViewModel.ts:19`, criterion 2.4: consider a timed search debounce. useDeferredValue does not rate-limit network calls.
- N3 — `src/App.tsx:83` and `src/components/SeriesChart.tsx:90`, criterion 1.4: deepen bootstrap, tooltip and independent chart-scale coverage; full-scope coverage currently passes.
- N4 — `src/views/InvestigationView.tsx:151`, criterion 3.1: finish manual keyboard, focus, responsive layout and contrast checks in Fusion. No concrete accessibility defect is asserted from an unavailable browser.

## Live acceptance limits

The user confirmed an asset, two sensors, sixteen activities and a populated chart. Actual document opening, activity detail, shared URL restoration and history after reload remain unconfirmed. Agent browser inventory is empty. Fixture iframe and happy-dom layout checks cannot replace those live observations.
