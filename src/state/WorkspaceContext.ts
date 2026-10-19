import type { HostAppAPI } from '@cognite/app-sdk';
import { createContext, useContext } from 'react';

import type { InstanceId, Navigation, RecentAsset } from '../domain/model';
import type { AssetService } from '../services/AssetService';

export type WorkspaceDependencies = {
  service: AssetService;
  host: Pick<HostAppAPI, 'syncInternalState' | 'navigateExternal'>;
  storage: Pick<Storage, 'getItem' | 'setItem'>;
  storageKey: string;
};
export type WorkspaceState = WorkspaceDependencies & {
  navigation: Navigation;
  recent: RecentAsset[];
  syncError: boolean;
  storageError: boolean;
  actionError: boolean;
  update: (patch: Partial<Navigation>) => Promise<void>;
  openAsset: (id: InstanceId | null) => Promise<void>;
  remember: (asset: RecentAsset) => void;
  clearRecent: () => void;
  retrySync: () => Promise<void>;
  openExternal: (url: string) => Promise<void>;
};
export const WorkspaceContext = createContext<WorkspaceState | null>(null);
export function useWorkspace(): WorkspaceState {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('Workspace provider is missing');
  return context;
}
