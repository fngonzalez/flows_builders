# Review hunt evidence

Round 2, 2026-10-19. Both required skills were pulled successfully again with the official CLI before scoring. All non-trivial production modules, including the full 907-line InvestigationView, were read. No app fix was made during this review round; the PDF correction and its failing-then-passing regression preceded it.

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
- src/views/InvestigationView.tsx:569: <ErrorBoundary key={`series-${identity}`}>
- src/views/InvestigationView.tsx:686: </ErrorBoundary>
- src/views/InvestigationView.tsx:705: <ErrorBoundary key={`activity-${identity}`}>
- src/views/InvestigationView.tsx:726: </ErrorBoundary>
- src/views/InvestigationView.tsx:741: <ErrorBoundary key={`files-${identity}`}>
- src/views/InvestigationView.tsx:762: </ErrorBoundary>

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
- src/views/InvestigationView.tsx:311: <Feedback
- src/views/InvestigationView.tsx:392: <Feedback
- src/views/InvestigationView.tsx:429: <Feedback
- src/views/InvestigationView.tsx:528: <PanelState name="asset" query={asset} retry={asset.refetch}>
- src/views/InvestigationView.tsx:570: <PanelState
- src/views/InvestigationView.tsx:666: <PanelState
- src/views/InvestigationView.tsx:680: </PanelState>
- src/views/InvestigationView.tsx:685: </PanelState>
- src/views/InvestigationView.tsx:706: <PanelState
- src/views/InvestigationView.tsx:725: </PanelState>
- src/views/InvestigationView.tsx:742: <PanelState
- src/views/InvestigationView.tsx:761: </PanelState>
- src/views/InvestigationView.tsx:768: </PanelState>
- src/views/InvestigationView.tsx:829: <PanelState
- src/views/InvestigationView.tsx:890: </PanelState>

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
- src/views/InvestigationView.tsx:231: <div className="min-h-screen bg-background text-foreground">
- src/views/InvestigationView.tsx:233: <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
- src/views/InvestigationView.tsx:249: <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
- src/views/InvestigationView.tsx:275: <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
- src/views/InvestigationView.tsx:286: <div className="max-w-3xl rounded-xl border border-border">
- src/views/InvestigationView.tsx:441: className="flex items-center gap-2 text-lg font-medium"
- src/views/InvestigationView.tsx:453: <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
- src/views/InvestigationView.tsx:466: <p className="mt-2 break-all text-xs text-muted-foreground">
- src/views/InvestigationView.tsx:580: <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
- src/views/InvestigationView.tsx:608: <div className="flex flex-wrap items-center justify-between gap-2">
- src/views/InvestigationView.tsx:793: <dt className="text-xs font-medium text-muted-foreground">
- src/views/InvestigationView.tsx:842: className="h-[65vh] w-full rounded-lg border border-border"
- src/views/InvestigationView.tsx:897: <footer className="border-t border-border py-4 text-xs text-muted-foreground">

## Accessibility probes

- src/App.tsx:33: {!failed && <Loader aria-label="Connecting" />}
- src/App.tsx:44: <Button onClick={() => reloadPreservingRoute()}>Reconnect</Button>
- src/components/ErrorBoundary.tsx:29: onClick={() => {
- src/components/SeriesChart.tsx:29: aria-label={`${series.name} chart`}
- src/components/SeriesChart.tsx:59: aria-label={`${series.name} over time in ${series.unit || 'unspecified units'}`}
- src/views/InvestigationView.tsx:75: aria-label={`Loading ${name}`}
- src/views/InvestigationView.tsx:109: onClick={() => {
- src/views/InvestigationView.tsx:112: aria-label={`Retry ${name}`}
- src/views/InvestigationView.tsx:172: onClick={() => {
- src/views/InvestigationView.tsx:201: onClick={() => {
- src/views/InvestigationView.tsx:257: onClick={() => {
- src/views/InvestigationView.tsx:272: <section aria-label="Asset search" className="space-y-4">
- src/views/InvestigationView.tsx:291: aria-label="Search assets"
- src/views/InvestigationView.tsx:365: <section className="space-y-3" aria-label="Find connected assets">
- src/views/InvestigationView.tsx:384: onClick={() => {
- src/views/InvestigationView.tsx:405: onClick={() => {
- src/views/InvestigationView.tsx:437: <section aria-labelledby="recent-heading" className="space-y-4">
- src/views/InvestigationView.tsx:447: <Button size="sm" variant="ghost" onClick={vm.clearRecent}>
- src/views/InvestigationView.tsx:459: onClick={() => {
- src/views/InvestigationView.tsx:521: onClick={() => {
- src/views/InvestigationView.tsx:533: aria-label="Asset identity"
- src/views/InvestigationView.tsx:612: aria-label="Time range"
- src/views/InvestigationView.tsx:627: onClick={() => {
- src/views/InvestigationView.tsx:640: aria-label="Refresh chart"
- src/views/InvestigationView.tsx:644: onClick={() => {
- src/views/InvestigationView.tsx:713: aria-label="Related activities"
- src/views/InvestigationView.tsx:749: aria-label="Related documents"
- src/views/InvestigationView.tsx:845: <img
- src/views/InvestigationView.tsx:860: onClick={() => {
- src/views/InvestigationView.tsx:869: onClick={() => {

## Raw colors / fixed dimensions

none

## Possibly unused modules

none (main.tsx is the HTML entry point).

## Comment blocks and naming

- src/services/AssetService.ts: 1 multi-line comment block(s); inspected as explanations, not dead source.
- No routed pages are unreachable: the host state selects one investigation view.
- Hook name starts with use; component symbols use PascalCase. File naming follows the scaffold; the optional per-component barrel structure is not used.

## Supplemental code-quality searches

- Relative imports/context: `rg -n '^import|useContext|ViewModel|new CogniteClient|createCogniteClient' src/viewmodels src/state`. The ViewModel imports pure model helpers and the context accessor; the service, host and storage are injected through that context. There is no imported SDK singleton.
- TSX size scan: InvestigationView.tsx 907 lines; WorkspaceProvider.tsx 133; SeriesChart.tsx 125; App.tsx 111; ErrorBoundary.tsx 41; main.tsx 32. The only production component over 150 lines is InvestigationView, which renders the ViewModel rather than fetching data. Named panel extraction remains a Nice Fix.
- Lowercase TSX scan: main.tsx (bootstrap) and useInvestigationViewModel.test.tsx (hook test), both expected. The ViewModel filename starts with use. No non-use ViewModel hook filenames were found.
- Naming/structure: PascalCase component files and camelCase hooks follow the official scaffold and AGENTS.md conventions. domain/services/state/viewmodels separate pure types, CDF reads, shared storage and orchestration. Missing per-component barrels do not introduce coupling or unreachable source; direct subpath imports are required for Aura by AGENTS.md.
- Repeated MIME normalization now agrees in model.ts:160 and InvestigationView.tsx:837; the parameterized PDF regression exercises the actual iframe branch. No conflicting classifier remains.
- All nine application test files ran. Cross-extension test pairs WorkspaceContext.ts/.test.tsx and useInvestigationViewModel.ts/.test.tsx were manually verified; the inventory generator's same-extension heuristic was corrected in review-files.md.
