import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { activity, asset, file, series } from '../__mocks__/fixtures';
import type { AssetService } from '../services/AssetService';
import { WorkspaceProvider } from '../state/WorkspaceProvider';

// Preload the real lazy chart so module transforms do not consume interaction timeouts.
import '../components/SeriesChart';

import { InvestigationView } from './InvestigationView';

function setup(initialState?: string, overrides?: Partial<AssetService>) {
  const service: AssetService = {
    findAssetsWithSignals: vi.fn().mockResolvedValue([asset]),
    findAssetsWithDocuments: vi.fn().mockResolvedValue([asset]),
    checkDocuments: vi
      .fn()
      .mockResolvedValue(
        'Cognite returned no accessible document records for this project.',
      ),
    searchAssets: vi.fn().mockResolvedValue([asset]),
    getAsset: vi.fn().mockResolvedValue(asset),
    listSeries: vi.fn().mockResolvedValue([series]),
    listActivities: vi.fn().mockResolvedValue([activity]),
    listFiles: vi.fn().mockResolvedValue([file]),
    loadChart: vi.fn().mockResolvedValue({
      start: 1577750400000,
      end: 1577836800000,
      granularity: '4m',
      series: [{ series, latest: 1577836800000, points: [] }],
    }),
    fileUrl: vi.fn().mockResolvedValue('https://files.test/manual.pdf'),
    ...overrides,
  };
  const host = {
    syncInternalState: vi.fn().mockResolvedValue(undefined),
    navigateExternal: vi.fn().mockResolvedValue(undefined),
  };
  const storage = { getItem: vi.fn().mockReturnValue(null), setItem: vi.fn() };
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <WorkspaceProvider
        dependencies={{ service, host, storage, storageKey: 'test' }}
        initialState={initialState}
      >
        <InvestigationView />
      </WorkspaceProvider>
    </QueryClientProvider>,
  );
  return { service, host, storage };
}
describe('asset investigation', () => {
  it('finds real-service candidates with signals when a searched asset has no relations', async () => {
    const { service } = setup();
    fireEvent.click(
      screen.getByRole('button', { name: 'Find an asset with signals' }),
    );
    fireEvent.click(
      await screen.findByRole('button', { name: /Cooling water pump · plant/ }),
    );
    expect(
      await screen.findByRole('heading', { name: 'Cooling water pump' }),
    ).toBeInTheDocument();
    expect(service.findAssetsWithSignals).toHaveBeenCalledTimes(1);
  });
  it('searches and opens a live-service asset, with no chart selected initially', async () => {
    const { service, host } = setup();
    fireEvent.change(screen.getByRole('combobox', { name: 'Search assets' }), {
      target: { value: 'PUMP' },
    });
    fireEvent.click(
      await screen.findByRole('option', { name: /Cooling water pump/ }),
    );
    expect(
      await screen.findByRole('heading', { name: 'Cooling water pump' }),
    ).toBeInTheDocument();
    expect(await screen.findByText('Choose a time series')).toBeInTheDocument();
    expect(service.loadChart).not.toHaveBeenCalled();
    expect(host.syncInternalState).toHaveBeenCalled();
  });
  it('keeps activities usable when the document panel has no access', async () => {
    setup(JSON.stringify({ asset }), {
      listFiles: vi.fn().mockRejectedValue({ status: 403 }),
    });
    expect(
      await screen.findByText('No access to documents'),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'Inspect seal' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Inspect seal' }));
    expect(await screen.findByText('SAP-101')).toBeInTheDocument();
  });
  it('plots only after selection and refreshes manually without polling', async () => {
    const { service } = setup(JSON.stringify({ asset }));
    await userEvent.click(
      await screen.findByRole('checkbox', { name: /Discharge pressure/ }),
    );
    await waitFor(() => expect(service.loadChart).toHaveBeenCalledTimes(1));
    expect(
      // The real chart loads lazily; its first transform can exceed 1s on a busy runner.
      await screen.findByText(
        /No samples in this time window/,
        {},
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Refresh chart' }));
    await waitFor(() => expect(service.loadChart).toHaveBeenCalledTimes(2));
  }, 10000);
  it('offers a retry for a failed panel and resolves file preview on demand', async () => {
    const listFiles = vi
      .fn()
      .mockRejectedValueOnce({ status: 400 })
      .mockResolvedValue([file]);
    const { service } = setup(JSON.stringify({ asset }), { listFiles });
    fireEvent.click(
      await screen.findByRole('button', { name: 'Retry documents' }),
    );
    fireEvent.click(
      await screen.findByRole('button', { name: 'Pump manual.pdf' }),
    );
    expect(
      await within(await screen.findByRole('dialog')).findByTitle('Pump manual.pdf'),
    ).toBeInTheDocument();
    expect(service.fileUrl).toHaveBeenCalledWith(
      expect.objectContaining({ externalId: 'manual' }),
    );
  });
  it('opens a PDF with MIME parameters in the document viewer', async () => {
    setup(JSON.stringify({ asset }), {
      listFiles: vi.fn().mockResolvedValue([
        { ...file, mimeType: ' Application/PDF; charset=binary ' },
      ]),
    });
    await userEvent.click(
      await screen.findByRole('button', { name: file.name }),
    );
    expect(await within(await screen.findByRole('dialog')).findByTitle(file.name)).toHaveAttribute(
      'src',
      'https://files.test/manual.pdf',
    );
    expect(screen.queryByRole('img', { name: file.name })).not.toBeInTheDocument();
  });
  it('handles no search matches and an asset that is no longer accessible', async () => {
    setup(JSON.stringify({ asset }), {
      getAsset: vi.fn().mockRejectedValue({ status: 403 }),
      searchAssets: vi.fn().mockResolvedValue([]),
    });
    expect(await screen.findByText('No access to asset')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox', { name: 'Search assets' }), {
      target: { value: 'missing' },
    });
    expect(await screen.findByText(/No assets matched/)).toBeInTheDocument();
  });
});
