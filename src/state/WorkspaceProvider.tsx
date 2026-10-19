import type { ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';

import { decodeNavigation, parseRecent, rememberAsset } from '../domain/model';
import type { InstanceId, Navigation, RecentAsset } from '../domain/model';

import { WorkspaceContext } from './WorkspaceContext';
import type { WorkspaceDependencies } from './WorkspaceContext';

export function WorkspaceProvider({
  dependencies,
  initialState,
  children,
}: {
  dependencies: WorkspaceDependencies;
  initialState?: string;
  children: ReactNode;
}) {
  const [navigation, setNavigation] = useState<Navigation>(() =>
    decodeNavigation(initialState),
  );
  const [syncError, setSyncError] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [actionError, setActionError] = useState(false);
  const [recent, setRecent] = useState<RecentAsset[]>(() => {
    try {
      return parseRecent(dependencies.storage.getItem(dependencies.storageKey));
    } catch {
      return [];
    }
  });
  const queue = useRef(Promise.resolve());
  const sync = useCallback(
    (value: Navigation): Promise<void> => {
      // Serialize host updates so rapid search/selection cannot restore an older URL state.
      queue.current = queue.current
        .then(() => dependencies.host.syncInternalState(JSON.stringify(value)))
        .then(() => setSyncError(false))
        .catch(() => setSyncError(true));
      return queue.current;
    },
    [dependencies.host],
  );
  const navigationRef = useRef(navigation);
  const update = useCallback(
    (patch: Partial<Navigation>): Promise<void> => {
      setActionError(false);
      const next = { ...navigationRef.current, ...patch };
      navigationRef.current = next;
      setNavigation(next);
      return sync(next);
    },
    [sync],
  );
  const openAsset = useCallback(
    (id: InstanceId | null): Promise<void> =>
      update({
        asset: id ? { space: id.space, externalId: id.externalId } : null,
        selected: [],
        activity: null,
        file: null,
      }),
    [update],
  );
  const recentRef = useRef(recent);
  const persistRecent = useCallback(
    (next: RecentAsset[]): void => {
      recentRef.current = next;
      setRecent(next);
      try {
        dependencies.storage.setItem(
          dependencies.storageKey,
          JSON.stringify(next),
        );
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
    },
    [dependencies.storage, dependencies.storageKey],
  );
  const remember = useCallback(
    (asset: RecentAsset): void =>
      persistRecent(
        rememberAsset(recentRef.current, {
          space: asset.space,
          externalId: asset.externalId,
          name: asset.name,
        }),
      ),
    [persistRecent],
  );
  const clearRecent = useCallback(
    (): void => persistRecent([]),
    [persistRecent],
  );
  const retrySync = useCallback(
    (): Promise<void> => sync(navigationRef.current),
    [sync],
  );
  const openExternal = useCallback(
    async (url: string): Promise<void> => {
      try {
        await dependencies.host.navigateExternal({ url, openInNewTab: true });
        setActionError(false);
      } catch {
        setActionError(true);
      }
    },
    [dependencies.host],
  );
  return (
    <WorkspaceContext.Provider
      value={{
        ...dependencies,
        navigation,
        recent,
        update,
        openAsset,
        remember,
        clearRecent,
        syncError,
        storageError,
        retrySync,
        actionError,
        openExternal,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
