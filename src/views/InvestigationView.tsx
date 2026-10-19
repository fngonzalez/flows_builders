import { Alert, AlertDescription } from '@cognite/aura/components/alert';
import { Badge } from '@cognite/aura/components/badge';
import { Button } from '@cognite/aura/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@cognite/aura/components/card';
import {
  CheckboxGroup,
  CheckboxItem,
  CheckboxItemControl,
  CheckboxItemDescription,
  CheckboxItemLabel,
} from '@cognite/aura/components/checkbox';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@cognite/aura/components/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@cognite/aura/components/dialog';
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from '@cognite/aura/components/empty-state';
import { Skeleton } from '@cognite/aura/components/skeleton';
import { DataGrid } from '@cognite/aura/data-grid';
import {
  IconActivity,
  IconArrowLeft,
  IconArrowUpRight,
  IconBuildingFactory2,
  IconClock,
  IconFiles,
  IconRefresh,
  IconSearch,
  IconTool,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { lazy, Suspense } from 'react';

import { ErrorBoundary } from '../components/ErrorBoundary';
import {
  assetKey,
  canPreview,
  errorStatus,
  formatDate,
  isRange,
  RANGES,
} from '../domain/model';
import type { Activity, AssetFile } from '../domain/model';
import { useInvestigationViewModel } from '../viewmodels/useInvestigationViewModel';

const SeriesChart = lazy(() =>
  import('../components/SeriesChart').then((module) => ({
    default: module.SeriesChart,
  })),
);

function Loading({ name }: { name: string }) {
  return (
    <div
      role="status"
      aria-label={`Loading ${name}`}
      className="space-y-3 py-4"
    >
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-1/2" />
      <span className="sr-only">Loading {name}</span>
    </div>
  );
}
function Feedback({
  error,
  name,
  retry,
}: {
  error: unknown;
  name: string;
  retry: () => unknown;
}) {
  const status = errorStatus(error);
  return (
    <Alert variant={status === 403 ? 'info' : 'error'}>
      <AlertDescription>
        <div className="space-y-3">
          <p>
            {status === 403
              ? `No access to ${name}`
              : status === 401
                ? 'Your session has expired. Reconnect to Cognite.'
                : `Could not load ${name}. Try again.`}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              void retry();
            }}
            aria-label={`Retry ${name}`}
          >
            Retry
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
function PanelState({
  name,
  query,
  children,
  retry,
}: {
  name: string;
  query: { isPending: boolean; error: unknown };
  children: ReactNode;
  retry: () => unknown;
}) {
  return query.isPending ? (
    <Loading name={name} />
  ) : query.error ? (
    <Feedback name={name} error={query.error} retry={retry} />
  ) : (
    children
  );
}
function Empty({ title, children }: { title: string; children: ReactNode }) {
  return (
    <EmptyState>
      <EmptyStateTitle as="h3">{title}</EmptyStateTitle>
      <EmptyStateDescription>{children}</EmptyStateDescription>
    </EmptyState>
  );
}

export function InvestigationView() {
  const vm = useInvestigationViewModel();
  const {
    navigation,
    asset,
    series,
    activities,
    files,
    chart,
    selected,
    search,
    file,
    preview,
    activity,
  } = vm;
  const identity = navigation.asset ? assetKey(navigation.asset) : 'home';
  const activityColumns = [
    {
      accessorKey: 'name',
      header: 'Activity',
      cell: ({ row }: { row: { original: Activity } }) => (
        <Button
          variant="ghost"
          onClick={() => {
            void vm.update({
              activity: {
                space: row.original.space,
                externalId: row.original.externalId,
              },
            });
          }}
        >
          {row.original.name}
        </Button>
      ),
    },
    { accessorKey: 'externalId', header: 'Identifier' },
    { accessorKey: 'status', header: 'Status' },
    {
      accessorKey: 'date',
      header: 'Recent date',
      cell: ({ row }: { row: { original: Activity } }) =>
        formatDate(row.original.date),
    },
  ];
  const fileColumns = [
    {
      accessorKey: 'name',
      header: 'Document',
      cell: ({ row }: { row: { original: AssetFile } }) => (
        <Button
          variant="ghost"
          onClick={() => {
            void vm.update({
              file: {
                space: row.original.space,
                externalId: row.original.externalId,
              },
            });
          }}
        >
          {row.original.name}
        </Button>
      ),
    },
    {
      accessorKey: 'mimeType',
      header: 'Type',
      cell: ({ row }: { row: { original: AssetFile } }) =>
        row.original.mimeType || 'Unknown type',
    },
    {
      accessorKey: 'modified',
      header: 'Updated',
      cell: ({ row }: { row: { original: AssetFile } }) => (
        <span title={row.original.modifiedLabel}>
          {formatDate(row.original.modified)}
        </span>
      ),
    },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <IconBuildingFactory2
              className="size-6 text-link-foreground"
              aria-hidden
            />
            <span className="text-lg font-semibold">Asset 360</span>
            <span className="text-sm text-muted-foreground">
              Investigation workspace
            </span>
          </div>
          <Badge variant="nordic" background>
            Read only
          </Badge>
        </div>
      </header>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {vm.syncError && (
          <Alert>
            <AlertDescription>
              Your view is open, but the shareable link could not be updated.{' '}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  void vm.retrySync();
                }}
              >
                Retry link sync
              </Button>
            </AlertDescription>
          </Alert>
        )}
        {vm.storageError && (
          <p role="status" className="text-sm text-muted-foreground">
            Recent assets are available for this visit; browser storage is
            unavailable.
          </p>
        )}
        <section aria-label="Asset search" className="space-y-4">
          {!navigation.asset && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Equipment investigation
              </p>
              <h1 id="search-heading" className="text-3xl font-semibold">
                Start with an asset.
              </h1>
              <p className="text-muted-foreground">
                Find the equipment. Connect the signals. See the whole picture.
              </p>
            </div>
          )}
          <div className="max-w-3xl rounded-xl border border-border">
            {/* Aura Combobox has a static options API. Command supplies an accessible
              async combobox without filtering away server-ranked matches. */}
            <Command shouldFilter={false} label="Search assets">
              <CommandInput
                aria-label="Search assets"
                placeholder="Search by equipment tag, name or description…"
                value={navigation.query}
                onValueChange={(query: string) => {
                  void vm.update({ query });
                }}
              />
              <CommandList>
                {navigation.query.trim().length >= 2 && (
                  <>
                    {search.isFetching && (
                      <div
                        role="status"
                        className="px-4 py-3 text-sm text-muted-foreground"
                      >
                        Searching assets…
                      </div>
                    )}
                    {search.error && (
                      <div className="p-4">
                        <Feedback
                          name="search results"
                          error={search.error}
                          retry={search.refetch}
                        />
                      </div>
                    )}
                    {!search.isFetching &&
                      !search.error &&
                      search.data?.length === 0 && (
                        <p
                          role="status"
                          className="px-4 py-3 text-sm text-muted-foreground"
                        >
                          No assets matched. Try part of a name or a different
                          equipment tag.
                        </p>
                      )}
                    {search.data?.map((item) => (
                      <CommandItem
                        key={assetKey(item)}
                        value={assetKey(item)}
                        onSelect={() => {
                          void vm.update({ query: '' });
                          void vm.openAsset(item);
                        }}
                      >
                        <IconBuildingFactory2 aria-hidden />
                        <div className="min-w-0 py-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {item.externalId} ·{' '}
                            {item.parentName ?? 'No parent specified'} ·{' '}
                            {item.space}
                          </p>
                          {item.description && (
                            <p className="truncate text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <IconArrowUpRight className="ml-auto" aria-hidden />
                      </CommandItem>
                    ))}
                  </>
                )}
              </CommandList>
            </Command>
          </div>
          <p className="text-xs text-muted-foreground">
            Type at least 2 characters. Use ↑ ↓ to browse and Enter to
            investigate.
          </p>
        </section>
        <section className="space-y-3" aria-label="Find connected assets">
          {[
            {
              label: 'Find an asset with signals',
              name: 'assets with signals',
              query: vm.suggestions,
              icon: <IconActivity aria-hidden />,
            },
            {
              label: 'Find an asset with documents',
              name: 'assets with documents',
              query: vm.documentSuggestions,
              icon: <IconFiles aria-hidden />,
            },
          ].map(({ label, name, query, icon }) => (
            <div key={name} className="space-y-2">
              <Button
                variant="outline"
                disabled={query.isFetching}
                onClick={() => {
                  void query.refetch();
                }}
              >
                {icon}
                {query.isFetching ? 'Finding connected assets…' : label}
              </Button>
              {!!query.error && (
                <Feedback
                  name={name}
                  error={query.error}
                  retry={query.refetch}
                />
              )}
              {query.data &&
                (query.data.length ? (
                  <div className="flex flex-wrap gap-2">
                    {query.data.map((item) => (
                      <Button
                        variant="secondary"
                        key={assetKey(item)}
                        onClick={() => {
                          void vm.openAsset(item);
                        }}
                      >
                        {item.name} · {item.space}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p role="status" className="text-sm text-muted-foreground">
                    No connected assets were found in this sample. Try another
                    equipment tag or ask the project owner to check the data
                    relationships.
                  </p>
                ))}
            </div>
          ))}
        </section>
        {vm.documentCheck.data && (
          <Alert variant="info">
            <AlertDescription>{vm.documentCheck.data}</AlertDescription>
          </Alert>
        )}
        {!!vm.documentCheck.error && (
          <Feedback
            name="document availability"
            error={vm.documentCheck.error}
            retry={vm.documentCheck.refetch}
          />
        )}
        {!navigation.asset ? (
          <>
            <section aria-labelledby="recent-heading" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2
                  id="recent-heading"
                  className="flex items-center gap-2 text-lg font-medium"
                >
                  <IconClock className="size-5" aria-hidden />
                  Recently investigated
                </h2>
                {vm.recent.length > 0 && (
                  <Button size="sm" variant="ghost" onClick={vm.clearRecent}>
                    Clear history
                  </Button>
                )}
              </div>
              {vm.recent.length ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {vm.recent.map((item) => (
                    <Card key={assetKey(item)}>
                      <CardContent>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            void vm.openAsset(item);
                          }}
                        >
                          <IconBuildingFactory2 aria-hidden />
                          {item.name}
                        </Button>
                        <p className="mt-2 break-all text-xs text-muted-foreground">
                          {item.externalId} · {item.space}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent>
                    <Empty title="Your investigations start here">
                      Assets you open will appear here, with the 10 most recent
                      saved on this device.
                    </Empty>
                  </CardContent>
                </Card>
              )}
            </section>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: <IconActivity aria-hidden />,
                  title: 'Understand the signals',
                  body: 'Choose linked time series and inspect the latest available history.',
                },
                {
                  icon: <IconTool aria-hidden />,
                  title: 'Review recent work',
                  body: 'Read related maintenance activities in context.',
                },
                {
                  icon: <IconFiles aria-hidden />,
                  title: 'Find the documentation',
                  body: 'Open connected manuals, diagrams and inspection reports.',
                },
              ].map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <CardTitle as="h2" className="flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                void vm.openAsset(null);
              }}
            >
              <IconArrowLeft aria-hidden />
              All investigations
            </Button>
            <PanelState name="asset" query={asset} retry={asset.refetch}>
              {asset.data && (
                <>
                  <section
                    className="space-y-3 border-b border-border pb-6"
                    aria-label="Asset identity"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="nordic" background>
                        {asset.data.typeName ?? 'Asset type not provided'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {asset.data.space}
                      </span>
                    </div>
                    <h1 className="break-words text-3xl font-semibold">
                      {asset.data.name}
                    </h1>
                    <p className="break-all font-mono text-sm">
                      {asset.data.externalId}
                    </p>
                    <p className="max-w-3xl text-muted-foreground">
                      {asset.data.description || 'No description provided.'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Parent: {asset.data.parentName ?? 'Not specified'}
                    </p>
                  </section>
                  <Card>
                    <CardHeader>
                      <CardTitle as="h2" className="flex items-center gap-2">
                        <IconActivity aria-hidden />
                        Time series{' '}
                        {series.data && <Badge>{series.data.length}</Badge>}
                      </CardTitle>
                      <CardDescription>
                        Choose the signals to investigate. History refreshes
                        when you request it.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ErrorBoundary key={`series-${identity}`}>
                        <PanelState
                          name="time series"
                          query={series}
                          retry={series.refetch}
                        >
                          {!series.data?.length ? (
                            <Empty title="No linked time series">
                              This asset has no accessible linked signals.
                            </Empty>
                          ) : (
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
                              <div className="max-h-96 overflow-y-auto">
                                <CheckboxGroup>
                                  {series.data.map((item) => (
                                    <CheckboxItem key={assetKey(item)}>
                                      <CheckboxItemControl
                                        checked={selected.some(
                                          (entry) =>
                                            assetKey(entry) === assetKey(item),
                                        )}
                                        onCheckedChange={(checked: boolean) =>
                                          vm.setSeries(item, checked)
                                        }
                                      />
                                      <div className="min-w-0">
                                        <CheckboxItemLabel>
                                          {item.name}
                                        </CheckboxItemLabel>
                                        <CheckboxItemDescription>
                                          {item.unit || 'No unit'} ·{' '}
                                          {item.kind || 'Unknown type'}
                                        </CheckboxItemDescription>
                                      </div>
                                    </CheckboxItem>
                                  ))}
                                </CheckboxGroup>
                              </div>
                              <div className="min-w-0 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div
                                    className="flex gap-1"
                                    role="group"
                                    aria-label="Time range"
                                  >
                                    {Object.keys(RANGES).map(
                                      (range: string) => (
                                        <Button
                                          size="sm"
                                          key={range}
                                          variant={
                                            navigation.range === range
                                              ? 'secondary'
                                              : 'ghost'
                                          }
                                          aria-pressed={
                                            navigation.range === range
                                          }
                                          onClick={() => {
                                            if (isRange(range))
                                              void vm.update({ range });
                                          }}
                                        >
                                          {range}
                                        </Button>
                                      ),
                                    )}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    aria-label="Refresh chart"
                                    disabled={
                                      !selected.length || chart.isFetching
                                    }
                                    onClick={() => {
                                      void chart.refetch();
                                    }}
                                  >
                                    <IconRefresh aria-hidden />
                                    Refresh
                                  </Button>
                                </div>
                                {!selected.length ? (
                                  <EmptyState>
                                    <EmptyStateIcon>
                                      <IconActivity aria-hidden />
                                    </EmptyStateIcon>
                                    <EmptyStateTitle as="h3">
                                      Choose a time series
                                    </EmptyStateTitle>
                                    <EmptyStateDescription>
                                      Select one or more signals from the list
                                      to compare their history.
                                    </EmptyStateDescription>
                                  </EmptyState>
                                ) : (
                                  <PanelState
                                    name="chart"
                                    query={chart}
                                    retry={chart.refetch}
                                  >
                                    {chart.data && (
                                      <Suspense
                                        fallback={
                                          <Loading name="chart display" />
                                        }
                                      >
                                        <SeriesChart data={chart.data} />
                                      </Suspense>
                                    )}
                                  </PanelState>
                                )}
                              </div>
                            </div>
                          )}
                        </PanelState>
                      </ErrorBoundary>
                    </CardContent>
                  </Card>
                  <div className="grid min-w-0 gap-6 xl:grid-cols-2">
                    <Card className="min-w-0">
                      <CardHeader>
                        <CardTitle as="h2" className="flex items-center gap-2">
                          <IconTool aria-hidden />
                          Work orders & activities{' '}
                          {activities.data && (
                            <Badge>{activities.data.length}</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Most recent first. Work-order status is not supplied
                          by the core activity model.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ErrorBoundary key={`activity-${identity}`}>
                          <PanelState
                            name="activities"
                            query={activities}
                            retry={activities.refetch}
                          >
                            {activities.data?.length ? (
                              <DataGrid
                                aria-label="Related activities"
                                data={activities.data}
                                columns={activityColumns}
                                getRowId={assetKey}
                                enableSorting={false}
                              />
                            ) : (
                              <Empty title="No linked activities">
                                No accessible work orders or activities are
                                linked to this asset.
                              </Empty>
                            )}
                          </PanelState>
                        </ErrorBoundary>
                      </CardContent>
                    </Card>
                    <Card className="min-w-0">
                      <CardHeader>
                        <CardTitle as="h2" className="flex items-center gap-2">
                          <IconFiles aria-hidden />
                          Documents{' '}
                          {files.data && <Badge>{files.data.length}</Badge>}
                        </CardTitle>
                        <CardDescription>
                          Manuals, diagrams and reports linked to this asset.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ErrorBoundary key={`files-${identity}`}>
                          <PanelState
                            name="documents"
                            query={files}
                            retry={files.refetch}
                          >
                            {files.data?.length ? (
                              <DataGrid
                                aria-label="Related documents"
                                data={files.data}
                                columns={fileColumns}
                                getRowId={assetKey}
                                enableSorting={false}
                              />
                            ) : (
                              <Empty title="No linked documents">
                                No accessible documents are linked to this
                                asset.
                              </Empty>
                            )}
                          </PanelState>
                        </ErrorBoundary>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </PanelState>
          </>
        )}
        <Dialog
          open={!!navigation.activity}
          onOpenChange={(open: boolean) => {
            if (!open) void vm.update({ activity: null });
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{activity?.name ?? 'Activity details'}</DialogTitle>
              <DialogDescription>
                {activity?.externalId ?? 'Related activity'}
              </DialogDescription>
            </DialogHeader>
            {activity ? (
              <div className="max-h-[65vh] space-y-4 overflow-auto">
                <p>{activity.description || 'No description provided.'}</p>
                <p className="text-sm text-muted-foreground">
                  Status: Not available in the core model.
                </p>
                <dl className="space-y-3">
                  {Object.entries(activity.details).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-xs font-medium text-muted-foreground">
                        {key}
                      </dt>
                      <dd className="break-words text-sm">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <p>Activity is unavailable or no longer linked to this asset.</p>
            )}
          </DialogContent>
        </Dialog>
        <Dialog
          open={!!navigation.file}
          onOpenChange={(open: boolean) => {
            if (!open) void vm.update({ file: null });
          }}
        >
          <DialogContent className="w-[90vw] max-w-5xl">
            <DialogHeader>
              <DialogTitle>{file?.name ?? 'Document'}</DialogTitle>
              <DialogDescription>
                {file?.mimeType || 'Related document'}
                {file
                  ? ` · ${file.modifiedLabel}: ${formatDate(file.modified)}`
                  : ''}
              </DialogDescription>
            </DialogHeader>
            {file ? (
              !file.uploaded ? (
                <Empty title="Content not uploaded">
                  The document record exists, but its content is not yet
                  available.
                </Empty>
              ) : (
                <PanelState
                  name="document preview"
                  query={preview}
                  retry={preview.refetch}
                >
                  {preview.data && (
                    <div className="space-y-4">
                      {canPreview(file.mimeType) ? (
                        file.mimeType.toLowerCase().split(';')[0].trim() ===
                        'application/pdf' ? (
                          <iframe
                            title={file.name}
                            src={preview.data}
                            className="h-[65vh] w-full rounded-lg border border-border"
                          />
                        ) : (
                          <img
                            alt={file.name}
                            src={preview.data}
                            className="max-h-[65vh] w-full object-contain"
                          />
                        )
                      ) : (
                        <Empty title="Open this document externally">
                          Inline preview supports PDFs and common images. Open
                          this file in its associated application.
                        </Empty>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            void vm.openExternal(preview.data ?? '');
                          }}
                        >
                          <IconArrowUpRight aria-hidden />
                          Open / download
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            void preview.refetch();
                          }}
                        >
                          Refresh file link
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        If preview is unavailable, use Open / download or
                        refresh the file link.
                      </p>
                      {vm.actionError && (
                        <Alert>
                          <AlertDescription>
                            Could not open the file. Refresh the link and try
                            again.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </PanelState>
              )
            ) : (
              <p>Document is unavailable or no longer linked to this asset.</p>
            )}
          </DialogContent>
        </Dialog>
        <footer className="border-t border-border py-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <IconSearch className="size-4" aria-hidden />
            Search · Investigate · Brief maintenance
          </span>
        </footer>
      </main>
    </div>
  );
}
