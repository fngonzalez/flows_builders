# Review hunt evidence

Current flows-review-checks and code-quality were pulled from cognitedata/builder-skills before this review. Windows equivalents cover the full source tree; missing src/hooks and src/contexts are represented by src/viewmodels and src/state.

## Coverage / test scope

- src/domain/model.ts:160: ].includes(mimeType.toLowerCase().split(';')[0].trim());
- vitest.config.ts:20: exclude: [...configDefaults.exclude, '.claude/**', '.agents/**'],
- vitest.config.ts:21: coverage: {
- vitest.config.ts:22: include: ['src/**/*.{ts,tsx}'],
- vitest.config.ts:25: exclude: [
- tsconfig.json:30: "include": ["src"]

## Error boundaries

- src/components/ErrorBoundary.test.tsx:4: import { ErrorBoundary } from './ErrorBoundary';
- src/components/ErrorBoundary.test.tsx:16: <ErrorBoundary onRecover={recover}>
- src/components/ErrorBoundary.test.tsx:18: </ErrorBoundary>,
- src/components/ErrorBoundary.tsx:11: export class ErrorBoundary extends Component<
- src/components/ErrorBoundary.tsx:16: static getDerivedStateFromError(): { failed: boolean } {
- src/main.tsx:7: import { ErrorBoundary } from './components/ErrorBoundary';
- src/main.tsx:26: <ErrorBoundary onRecover={reloadPreservingRoute}>
- src/main.tsx:28: </ErrorBoundary>
- src/views/InvestigationView.tsx:53: import { ErrorBoundary } from '../components/ErrorBoundary';
- src/views/InvestigationView.tsx:581: <ErrorBoundary key={`series-${identity}`}>
- src/views/InvestigationView.tsx:698: </ErrorBoundary>
- src/views/InvestigationView.tsx:717: <ErrorBoundary key={`activity-${identity}`}>
- src/views/InvestigationView.tsx:739: </ErrorBoundary>
- src/views/InvestigationView.tsx:754: <ErrorBoundary key={`files-${identity}`}>
- src/views/InvestigationView.tsx:776: </ErrorBoundary>

## Critical TODOs

none

## Effects / cleanup

- src/App.tsx:13: import { useEffect, useMemo, useState } from 'react';
- src/App.tsx:85: useEffect(() => {
- src/App.tsx:86: let cancelled = false;
- src/App.tsx:90: if (!cancelled) setConnection(result);
- src/App.tsx:93: if (!cancelled) setFailed(true);
- src/App.tsx:95: return () => {
- src/App.tsx:96: cancelled = true;
- src/viewmodels/useInvestigationViewModel.ts:2: import { useDeferredValue, useEffect } from 'react';
- src/viewmodels/useInvestigationViewModel.ts:125: useEffect(() => {

## Loading / error feedback

- src/viewmodels/useInvestigationViewModel.ts:1: import { useQuery } from '@tanstack/react-query';
- src/viewmodels/useInvestigationViewModel.ts:33: const search = useQuery({
- src/viewmodels/useInvestigationViewModel.ts:39: const suggestions = useQuery({
- src/viewmodels/useInvestigationViewModel.ts:46: const documentSuggestions = useQuery({
- src/viewmodels/useInvestigationViewModel.ts:52: const documentCheck = useQuery({
- src/viewmodels/useInvestigationViewModel.ts:58: const asset = useQuery({
- src/viewmodels/useInvestigationViewModel.ts:68: const series = useQuery({
- src/viewmodels/useInvestigationViewModel.ts:77: const activities = useQuery({
- src/viewmodels/useInvestigationViewModel.ts:86: const files = useQuery({
- src/viewmodels/useInvestigationViewModel.ts:100: const chart = useQuery({
- src/viewmodels/useInvestigationViewModel.ts:110: const preview = useQuery({
- src/views/InvestigationView.tsx:85: function Feedback({
- src/views/InvestigationView.tsx:121: function PanelState({
- src/views/InvestigationView.tsx:128: query: { isPending: boolean; error: unknown };
- src/views/InvestigationView.tsx:132: return query.isPending ? (
- src/views/InvestigationView.tsx:135: <Feedback name={name} error={query.error} retry={retry} />
- src/views/InvestigationView.tsx:323: <Feedback
- src/views/InvestigationView.tsx:404: <Feedback
- src/views/InvestigationView.tsx:441: <Feedback
- src/views/InvestigationView.tsx:540: <PanelState name="asset" query={asset} retry={asset.refetch}>
- src/views/InvestigationView.tsx:582: <PanelState
- src/views/InvestigationView.tsx:678: <PanelState
- src/views/InvestigationView.tsx:692: </PanelState>
- src/views/InvestigationView.tsx:697: </PanelState>
- src/views/InvestigationView.tsx:718: <PanelState
- src/views/InvestigationView.tsx:738: </PanelState>
- src/views/InvestigationView.tsx:755: <PanelState
- src/views/InvestigationView.tsx:775: </PanelState>
- src/views/InvestigationView.tsx:782: </PanelState>
- src/views/InvestigationView.tsx:843: <PanelState
- src/views/InvestigationView.tsx:904: </PanelState>

## CDF Raw

none

## DMS calls

- src/services/AssetService.test.ts:43: instances.list.mockResolvedValue({
- src/services/AssetService.test.ts:49: expect(instances.list.mock.calls[0][0]).toEqual({
- src/services/AssetService.test.ts:66: instances.list
- src/services/AssetService.test.ts:77: instances.retrieve.mockResolvedValue({
- src/services/AssetService.test.ts:83: expect(instances.list.mock.calls[1][0].cursor).toBe('next');
- src/services/AssetService.test.ts:84: expect(instances.list.mock.calls[2][0].filter.and).toHaveLength(1);
- src/services/AssetService.test.ts:88: instances.list.mockResolvedValue({
- src/services/AssetService.test.ts:93: instances.retrieve.mockResolvedValue({
- src/services/AssetService.test.ts:99: expect(instances.list.mock.calls[0][0].filter.and[1].equals).toEqual({
- src/services/AssetService.test.ts:106: instances.list.mockResolvedValue({
- src/services/AssetService.test.ts:115: instances.retrieve.mockResolvedValue({
- src/services/AssetService.test.ts:120: expect(instances.list.mock.calls[0][0].limit).toBe(25);
- src/services/AssetService.test.ts:121: expect(instances.retrieve.mock.calls[0][0].items).toEqual([
- src/services/AssetService.test.ts:127: instances.search.mockResolvedValue({
- src/services/AssetService.test.ts:130: instances.list.mockResolvedValue({
- src/services/AssetService.test.ts:135: expect(instances.search).toHaveBeenCalledWith(
- src/services/AssetService.test.ts:145: expect(instances.list.mock.calls[0][0].filter).toEqual(
- src/services/AssetService.test.ts:153: instances.list
- src/services/AssetService.test.ts:166: expect(instances.list.mock.calls[0][0].filter).toEqual({
- src/services/AssetService.test.ts:172: expect(instances.list.mock.calls[1][0].cursor).toBe('next');
- src/services/AssetService.test.ts:221: instances.list.mockRejectedValue({ status: 403 });
- src/services/AssetService.test.ts:236: instances.list.mockResolvedValue({
- src/services/AssetService.ts:80: const result = await this.client.instances.list({
- src/services/AssetService.ts:105: const response = await this.client.instances.list({
- src/services/AssetService.ts:147: const assets = await this.client.instances.retrieve({
- src/services/AssetService.ts:165: this.client.instances.search({
- src/services/AssetService.ts:172: this.client.instances.list({
- src/services/AssetService.ts:192: const result = await this.client.instances.retrieve({
- src/services/AssetService.ts:222: const response = await this.client.instances.retrieve({
- src/services/AssetService.ts:253: const response = await this.client.instances.list({

## Concurrency / retry

- src/viewmodels/useInvestigationViewModel.test.tsx:3: import { retryRead } from './useInvestigationViewModel';
- src/viewmodels/useInvestigationViewModel.test.tsx:7: expect(retryRead(0, { status: 403 })).toBe(false);
- src/viewmodels/useInvestigationViewModel.test.tsx:8: expect(retryRead(0, { status: 400 })).toBe(false);
- src/viewmodels/useInvestigationViewModel.test.tsx:9: expect(retryRead(0, { status: 429 })).toBe(true);
- src/viewmodels/useInvestigationViewModel.test.tsx:10: expect(retryRead(0, { status: 503 })).toBe(true);
- src/viewmodels/useInvestigationViewModel.test.tsx:11: expect(retryRead(1, new Error('network'))).toBe(false);
- src/viewmodels/useInvestigationViewModel.ts:8: export function retryRead(failures: number, error: unknown): boolean {
- src/viewmodels/useInvestigationViewModel.ts:12: (status === null || status === 408 || status === 429 || status >= 500)
- src/viewmodels/useInvestigationViewModel.ts:21: retry: retryRead,
- src/viewmodels/useInvestigationViewModel.ts:27: retry: typeof retryRead;

## Unsafe types / casts

none

## Module mocks

none

## Context injection

- src/state/WorkspaceContext.test.tsx:4: import { useWorkspace } from './WorkspaceContext';
- src/state/WorkspaceContext.test.tsx:8: expect(() => renderHook(() => useWorkspace())).toThrow(
- src/state/WorkspaceContext.ts:2: import { createContext, useContext } from 'react';
- src/state/WorkspaceContext.ts:26: export const WorkspaceContext = createContext<WorkspaceState | null>(null);
- src/state/WorkspaceContext.ts:27: export function useWorkspace(): WorkspaceState {
- src/state/WorkspaceContext.ts:28: const context = useContext(WorkspaceContext);
- src/state/WorkspaceProvider.test.tsx:9: import { useWorkspace } from './WorkspaceContext';
- src/state/WorkspaceProvider.test.tsx:33: const { result } = renderHook(() => useWorkspace(), { wrapper });
- src/state/WorkspaceProvider.test.tsx:70: const { result } = renderHook(() => useWorkspace(), { wrapper });
- src/viewmodels/useInvestigationViewModel.ts:6: import { useWorkspace } from '../state/WorkspaceContext';
- src/viewmodels/useInvestigationViewModel.ts:17: const workspace = useWorkspace();

## Direct client construction

none

## Service interfaces

- src/services/AssetService.ts:70: class CdfAssetService implements AssetService {

## Fetch inside a view

none

## ViewModel

- src/viewmodels/useInvestigationViewModel.test.tsx:3: import { retryRead } from './useInvestigationViewModel';
- src/viewmodels/useInvestigationViewModel.ts:16: export function useInvestigationViewModel() {
- src/views/InvestigationView.tsx:63: import { useInvestigationViewModel } from '../viewmodels/useInvestigationViewModel';
- src/views/InvestigationView.tsx:150: const vm = useInvestigationViewModel();

## Console calls

none

## Routes

none

## Flag-bag types

none

## Duplicated SDK shapes

none

## Same-primitive positional parameters

none

## Classic repeated fetches

none

## Formatting helpers

- src/components/SeriesChart.tsx:78: new Date(value).toLocaleDateString(undefined, {
- src/components/SeriesChart.tsx:90: value.toLocaleString(undefined, {
- src/domain/model.test.ts:45: expect(timeValue(new Date(1000))).toBe(1000);
- src/domain/model.ts:163: return value === null ? 'Not available' : new Date(value).toLocaleString();
- src/services/AssetService.test.ts:180: datapoints: [{ timestamp: new Date(1577836800000), value: 2 }],
- src/services/AssetService.test.ts:186: datapoints: [{ timestamp: new Date(1577836800000), average: 2 }],

## Repeated long layout classes

- src/App.tsx:26: <main className="flex min-h-screen items-center justify-center bg-background p-6">
- src/views/InvestigationView.tsx:243: <div className="min-h-screen bg-background text-foreground">
- src/views/InvestigationView.tsx:245: <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
- src/views/InvestigationView.tsx:261: <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
- src/views/InvestigationView.tsx:287: <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
- src/views/InvestigationView.tsx:298: <div className="max-w-3xl rounded-xl border border-border">
- src/views/InvestigationView.tsx:453: className="flex items-center gap-2 text-lg font-medium"
- src/views/InvestigationView.tsx:465: <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
- src/views/InvestigationView.tsx:478: <p className="mt-2 break-all text-xs text-muted-foreground">
- src/views/InvestigationView.tsx:592: <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
- src/views/InvestigationView.tsx:620: <div className="flex flex-wrap items-center justify-between gap-2">
- src/views/InvestigationView.tsx:807: <dt className="text-xs font-medium text-muted-foreground">
- src/views/InvestigationView.tsx:856: className="h-[65vh] w-full rounded-lg border border-border"
- src/views/InvestigationView.tsx:911: <footer className="border-t border-border py-4 text-xs text-muted-foreground">

## Accessibility probes

- src/App.tsx:33: {!failed && <Loader aria-label="Connecting" />}
- src/App.tsx:44: <Button onClick={() => reloadPreservingRoute()}>Reconnect</Button>
- src/components/ErrorBoundary.tsx:29: onClick={() => {
- src/components/SeriesChart.tsx:29: aria-label={`${series.name} chart`}
- src/components/SeriesChart.tsx:59: aria-label={`${series.name} over time in ${series.unit || 'unspecified units'}`}
- src/views/InvestigationView.tsx:75: aria-label={`Loading ${name}`}
- src/views/InvestigationView.tsx:109: onClick={() => {
- src/views/InvestigationView.tsx:112: aria-label={`Retry ${name}`}
- src/views/InvestigationView.tsx:175: onClick={() => {
- src/views/InvestigationView.tsx:208: onClick={() => {
- src/views/InvestigationView.tsx:269: onClick={() => {
- src/views/InvestigationView.tsx:284: <section aria-label="Asset search" className="space-y-4">
- src/views/InvestigationView.tsx:303: aria-label="Search assets"
- src/views/InvestigationView.tsx:377: <section className="space-y-3" aria-label="Find connected assets">
- src/views/InvestigationView.tsx:396: onClick={() => {
- src/views/InvestigationView.tsx:417: onClick={() => {
- src/views/InvestigationView.tsx:449: <section aria-labelledby="recent-heading" className="space-y-4">
- src/views/InvestigationView.tsx:459: <Button size="sm" variant="ghost" onClick={vm.clearRecent}>
- src/views/InvestigationView.tsx:471: onClick={() => {
- src/views/InvestigationView.tsx:533: onClick={() => {
- src/views/InvestigationView.tsx:545: aria-label="Asset identity"
- src/views/InvestigationView.tsx:624: aria-label="Time range"
- src/views/InvestigationView.tsx:639: onClick={() => {
- src/views/InvestigationView.tsx:652: aria-label="Refresh chart"
- src/views/InvestigationView.tsx:656: onClick={() => {
- src/views/InvestigationView.tsx:725: aria-label="Related activities"
- src/views/InvestigationView.tsx:762: aria-label="Related documents"
- src/views/InvestigationView.tsx:859: <img
- src/views/InvestigationView.tsx:874: onClick={() => {
- src/views/InvestigationView.tsx:883: onClick={() => {

## Raw colors / fixed dimensions

none

## Possibly unused modules

none (main.tsx is the HTML entry point).

## Comment blocks and naming

- src/services/AssetService.ts: 1 multi-line comment block(s); inspected as explanations, not dead source.
- No routed pages are unreachable: the host state selects one investigation view.
- Hook name starts with use; component symbols use PascalCase. File naming follows the scaffold; the optional per-component barrel structure is not used.
## Supplemental code-quality probes

- Ran rg for relative imports, context access and ViewModel use across all src/viewmodels and src/state. The ViewModel obtains the injected service/host/storage through useWorkspace; remaining imports are pure helpers/types and React/query primitives.
- Ran rg -B 2 -A 15 for every useEffect in App and the ViewModel. App cancels post-unmount writes; the recent-history effect has no timer or listener requiring cleanup.
- TSX size inventory: InvestigationView 921; WorkspaceProvider 133; SeriesChart 125; App 111; ErrorBoundary 41; main 32. The only production file exceeding 150 TSX lines is a purely presentational view, retained as N1.
- Lowercase TSX: main.tsx (bootstrap), useInvestigationViewModel.test.tsx (hook test). Non-use-prefixed hook filenames: none. Scaffold conventions and AGENTS.md prevail where the generic naming/folder suggestions differ.
- Cross-extension test pairs verified: WorkspaceContext.ts/.test.tsx and useInvestigationViewModel.ts/.test.tsx; the inventory's same-extension heuristic was corrected. All nine application test files ran.
- Current lint, strict tsc and build pass; no unused production source modules or unreachable routes were identified by the full tree scan and import inspection.


## CSS and current verification

- Read src/styles.css and the installed Aura theme declarations. No raw app colors or fixed CSS dimensions were added.
- A static, resolved-token regression failed before the change (three light pairs below 4.5:1) and passed after it (all six light/dark pairs). check-text-contrast.mjs is retained in this round; run it from the app root.
- src/styles.css:14 aliases the light muted text to Aura secondary foreground; CSS SHA-256 is recorded separately because the existing TS/TSX digest does not cover CSS.
- Re-ran every full-tree source hunt. The TS/TSX source digest is unchanged from the earlier fully inspected round 4; manually reviewed the CSS/SPEC delta for this round.
- Full tests: 31/31 in nine files; lines 85.71% at full production scope. Lint and strict tsc/build pass. Test-environment iframe/layout notices do not establish live document rendering.
