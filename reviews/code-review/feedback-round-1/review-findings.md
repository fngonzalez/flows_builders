# Findings - Asset 360

## Config inspected

- vitest.config.ts, vite.config.ts, vitest.setup.ts and tsconfig.json inspected.
- Coverage includes all src/**/*.ts(x). Exclusions: tests, main.tsx bootstrap, declaration files and test-only __mocks__/fixtures.ts. No production page, service, hook or component is hidden.
- Test exclusions are Vitest defaults plus generated .agents/.claude skill directories. All nine application test files ran.
- [Full hunt output](hunt-evidence.md) records every source probe, including code-quality searches, full inventory and unused-module check. src/state and src/viewmodels are the context/hook locations in this app.

## Search results

| Check | Result |
| --- | --- |
| Error boundaries | Root in src/main.tsx:26; three panel boundaries in src/views/InvestigationView.tsx:569,705,741 |
| Coverage/test exclusion | Honest full production scope, 85.71% line coverage |
| CDF Raw | none |
| instances.list/query/search | src/services/AssetService.ts; ranked search plus externalId prefix lookup; owning-view relation-filter lists are documented exceptions because reverse traversal of a list relation is unsupported |
| QueuedTaskRunner / 429 | retryRead handles 429 with one retry through TanStack Query; no app-wide task runner, Retry-After parsing or injected jitter |
| any / unsafe casts | none in production; test-only Partial interface casts use the AGENTS exception; no as unknown as |
| vi.mock | none; external services are injected |
| lint / TypeScript | lint:fix exit 0, build includes tsc and exited 0 |
| CogniteClient / DI / ViewModel | No manual client construction; authenticated provider supplies SDK; interface-based service injected into shared context; stateless ViewModel composes query hooks |
| Unused files / console.log | none after removing the scaffold utility; no production diagnostic logging |
| Components over 150 lines | InvestigationView is large but purely presentational; App is bootstrap; tests are not production screens |
| Duplicated shapes / flag bags / positional primitive arguments | No unsafe duplicated SDK DTOs or core flag-bag state found; SDK-derived client/node types and validated domain types are used |
| Repeated formatting/layout | One date formatter; chart ticks have intentionally compact formatting; layout classes repeat to align panels |
| Naming / structure | Scaffold-style PascalCase component files, camelCase hooks, dedicated domain/services/state/viewmodels/views; optional per-component barrels omitted |
| Dead commented blocks / unreachable routes | none; explanatory comments describe relation limits and host sync; one host-state-driven investigation view |

## Must Fix

None found in the local code review. This does not establish live document acceptance or certification approval.

## Should Fix

- S1 - src/viewmodels/useInvestigationViewModel.ts:8: add shared request concurrency control, Retry-After support and jitter before larger multi-user deployments. Current bounded retry avoids loops, but is not the full 429 policy. Criterion 2.5.
- S2 - package.json: migrate the scaffold package family together when a newer compatible template is adopted; four inherited low advisories remain in optional Mermaid/KaTeX dependencies and several packages have newer majors. Do not use npm audit fix --force to downgrade Aura. Criterion 1.3.

## Nice to Fix

- N1 - src/views/InvestigationView.tsx: extract named presentational panels/dialogs to reduce the size of the view. No fetch logic is embedded in the view. Criterion 1.5.
- N2 - src/viewmodels/useInvestigationViewModel.ts:19: add an actual timed search debounce for rapid typing. useDeferredValue is a rendering tool, not a network rate limiter. Criterion 2.4.
- N3 - src/App.tsx and src/components/SeriesChart.tsx: broaden bootstrap/tooltip and independent scale tests; existing full-scope coverage passes but is uneven by module. Criterion 1.4.
- N4 - src/views/InvestigationView.tsx: complete browser-level keyboard/focus/contrast checks with the user. Aura supplies most interactions; no direct visual/a11y browser inspection was possible in this agent session. Criterion 3.1.

## Live acceptance observations (separate from code findings)

- User confirmed WMT:23-PC-9109-M01 in valhall-assets with 2 numeric series, 16 activities and a rendered historical chart.
- File records are accessible. The bounded discovery search did not find related asset candidates. This is not proof that the entire project lacks relationships; an instructor/admin example is required to finish the live file acceptance case.
- File preview tests use a reserved .test URL and disabled iframe network loading; they validate UI/contract, not real PDF rendering. Recharts also reports missing layout in happy-dom. Both are test-environment limitations, and all tests pass.
