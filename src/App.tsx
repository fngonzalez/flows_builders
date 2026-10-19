import { connectToHostApp, reloadPreservingRoute } from '@cognite/app-sdk';
import type { ConnectToHostAppResult } from '@cognite/app-sdk';
import { CogniteSdkProvider, useCogniteSdk } from '@cognite/app-sdk/react';
import { Button } from '@cognite/aura/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@cognite/aura/components/card';
import { Loader } from '@cognite/aura/components/loader';
import type { ComponentProps } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { createAssetService } from './services/AssetService';
import { WorkspaceProvider } from './state/WorkspaceProvider';
import { InvestigationView } from './views/InvestigationView';

const browserStorage: Pick<Storage, 'getItem' | 'setItem'> = {
  getItem: (key: string) => window.localStorage.getItem(key),
  setItem: (key: string, value: string) =>
    window.localStorage.setItem(key, value),
};
function ConnectionState({ failed }: { failed?: boolean }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle as="h1">Asset 360</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!failed && <Loader aria-label="Connecting" />}
            <h2 className="text-lg font-medium">
              {failed
                ? 'Could not connect to Cognite Fusion'
                : 'Connecting to Cognite Fusion…'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Open Asset 360 inside your Cognite Fusion workspace to use your
              account and authorized data.
            </p>
            {failed && (
              <Button onClick={() => reloadPreservingRoute()}>Reconnect</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
function ConnectedWorkspace({
  connection,
}: {
  connection: ConnectToHostAppResult;
}) {
  const client = useCogniteSdk();
  const dependencies = useMemo(
    () => ({
      service: createAssetService(client),
      host: connection.api,
      storage: browserStorage,
      storageKey: `asset-360:recent:${client.project ?? 'project'}`,
    }),
    [client, connection.api],
  );
  return (
    <WorkspaceProvider
      dependencies={dependencies}
      initialState={connection.initialState}
    >
      <InvestigationView />
    </WorkspaceProvider>
  );
}
type AppProps = {
  connect?: typeof connectToHostApp;
  deps?: ComponentProps<typeof CogniteSdkProvider>['deps'];
};
export default function App({ connect = connectToHostApp, deps }: AppProps) {
  const [connection, setConnection] = useState<ConnectToHostAppResult | null>(
    null,
  );
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    // The SDK caches its host connection; the provider reuses the same handshake.
    void connect({ applicationName: 'asset-360' })
      .then((result: ConnectToHostAppResult) => {
        if (!cancelled) setConnection(result);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [connect]);
  if (failed) return <ConnectionState failed />;
  if (!connection) return <ConnectionState />;
  return (
    <CogniteSdkProvider
      deps={deps}
      loadingFallback={<ConnectionState />}
      errorFallback={<ConnectionState failed />}
    >
      <ConnectedWorkspace connection={connection} />
    </CogniteSdkProvider>
  );
}
