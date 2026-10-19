import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { asset } from '../__mocks__/fixtures';
import type { AssetService } from '../services/AssetService';

import { useWorkspace } from './WorkspaceContext';
import { WorkspaceProvider } from './WorkspaceProvider';

describe('shared workspace storage', () => {
  it('restores host navigation, syncs selection and resets series when changing asset', async () => {
    const host = {
      syncInternalState: vi.fn().mockResolvedValue(undefined),
      navigateExternal: vi.fn().mockResolvedValue(undefined),
    };
    const storage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
    };
    const service = {} as Partial<AssetService> as AssetService;
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={new QueryClient()}>
        <WorkspaceProvider
          dependencies={{ service, host, storage, storageKey: 'test' }}
          initialState={JSON.stringify({ asset, selected: [asset] })}
        >
          {children}
        </WorkspaceProvider>
      </QueryClientProvider>
    );
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    expect(result.current.navigation.asset).toEqual({
      space: asset.space,
      externalId: asset.externalId,
    });
    await act(async () =>
      result.current.openAsset({ ...asset, externalId: 'OTHER' }),
    );
    expect(result.current.navigation.selected).toEqual([]);
    expect(host.syncInternalState).toHaveBeenCalledWith(
      expect.stringContaining('OTHER'),
    );
  });
  it('survives unavailable localStorage and recovers a sync error', async () => {
    const host = {
      syncInternalState: vi
        .fn()
        .mockRejectedValueOnce(new Error('offline'))
        .mockResolvedValue(undefined),
      navigateExternal: vi.fn().mockResolvedValue(undefined),
    };
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('blocked');
      }),
      setItem: vi.fn(() => {
        throw new Error('blocked');
      }),
    };
    const service = {} as Partial<AssetService> as AssetService;
    const wrapper = ({ children }: { children: ReactNode }) => (
      <WorkspaceProvider
        dependencies={{ service, host, storage, storageKey: 'test' }}
      >
        {children}
      </WorkspaceProvider>
    );
    const { result } = renderHook(() => useWorkspace(), { wrapper });
    await act(async () => result.current.openAsset(asset));
    expect(result.current.syncError).toBe(true);
    await act(async () => result.current.retrySync());
    expect(result.current.syncError).toBe(false);
    act(() => result.current.remember(asset));
    expect(result.current.recent).toHaveLength(1);
    expect(result.current.storageError).toBe(true);
  });
});
