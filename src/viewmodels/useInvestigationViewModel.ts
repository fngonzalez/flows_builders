import { useQuery } from '@tanstack/react-query';
import { useDeferredValue, useEffect } from 'react';

import { assetKey, errorStatus } from '../domain/model';
import type { InstanceId, Series } from '../domain/model';
import { useWorkspace } from '../state/WorkspaceContext';

export function retryRead(failures: number, error: unknown): boolean {
  const status = errorStatus(error);
  return (
    failures < 1 &&
    (status === null || status === 408 || status === 429 || status >= 500)
  );
}

export function useInvestigationViewModel() {
  const workspace = useWorkspace();
  const { navigation, service, remember, update } = workspace;
  const searchTerm = useDeferredValue(navigation.query.trim());
  const queryOptions = {
    retry: retryRead,
    staleTime: 300000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  } satisfies {
    retry: typeof retryRead;
    staleTime: number;
    refetchOnWindowFocus: boolean;
    refetchOnReconnect: boolean;
    refetchInterval: false;
  };
  const search = useQuery({
    ...queryOptions,
    queryKey: ['assets', searchTerm],
    queryFn: () => service.searchAssets(searchTerm),
    enabled: searchTerm.length >= 2,
  });
  const suggestions = useQuery({
    ...queryOptions,
    queryKey: ['assets-with-signals'],
    queryFn: () => service.findAssetsWithSignals(),
    enabled: false,
  });
  const id = navigation.asset;
  const documentSuggestions = useQuery({
    ...queryOptions,
    queryKey: ['assets-with-documents'],
    queryFn: () => service.findAssetsWithDocuments(),
    enabled: false,
  });
  const documentCheck = useQuery({
    ...queryOptions,
    queryKey: ['document-availability'],
    queryFn: () => service.checkDocuments(),
    enabled: documentSuggestions.data?.length === 0,
  });
  const asset = useQuery({
    ...queryOptions,
    queryKey: ['asset', id],
    queryFn: () => {
      if (!id) throw new Error('Select an asset');
      return service.getAsset(id);
    },
    enabled: id !== null,
  });
  const enabled = !!asset.data && id !== null;
  const series = useQuery({
    ...queryOptions,
    queryKey: ['series', id],
    queryFn: () => {
      if (!id) throw new Error('Select an asset');
      return service.listSeries(id);
    },
    enabled,
  });
  const activities = useQuery({
    ...queryOptions,
    queryKey: ['activities', id],
    queryFn: () => {
      if (!id) throw new Error('Select an asset');
      return service.listActivities(id);
    },
    enabled,
  });
  const files = useQuery({
    ...queryOptions,
    queryKey: ['files', id],
    queryFn: () => {
      if (!id) throw new Error('Select an asset');
      return service.listFiles(id);
    },
    enabled,
  });
  const selected = (series.data ?? []).filter((item: Series) =>
    navigation.selected.some(
      (value: InstanceId) => assetKey(value) === assetKey(item),
    ),
  );
  const chart = useQuery({
    ...queryOptions,
    queryKey: ['chart', id, selected.map(assetKey), navigation.range],
    queryFn: () => service.loadChart(selected, navigation.range),
    enabled: enabled && selected.length > 0,
    staleTime: Infinity,
  });
  const file = files.data?.find(
    (item) => navigation.file && assetKey(item) === assetKey(navigation.file),
  );
  const preview = useQuery({
    ...queryOptions,
    queryKey: ['file-url', id, file ? assetKey(file) : null],
    queryFn: () => {
      if (!file) throw new Error('Select a document');
      return service.fileUrl(file);
    },
    enabled: !!file?.uploaded,
    staleTime: 0,
    gcTime: 0,
  });
  const activity = activities.data?.find(
    (item) =>
      navigation.activity && assetKey(item) === assetKey(navigation.activity),
  );
  useEffect(() => {
    if (asset.data) remember(asset.data);
  }, [asset.data, remember]);
  const setSeries = (item: Series, checked: boolean): void => {
    const key = assetKey(item);
    void update({
      selected: [
        ...navigation.selected.filter(
          (entry: InstanceId) => assetKey(entry) !== key,
        ),
        ...(checked
          ? [{ space: item.space, externalId: item.externalId }]
          : []),
      ],
    });
  };
  return {
    ...workspace,
    search,
    suggestions,
    documentSuggestions,
    documentCheck,
    asset,
    series,
    activities,
    files,
    selected,
    chart,
    file,
    preview,
    activity,
    setSeries,
  };
}
