export type InstanceId = { space: string; externalId: string };
export type Asset = InstanceId & {
  name: string;
  description: string;
  parent?: InstanceId;
  parentName?: string;
  assetType?: InstanceId;
  typeName?: string;
};
export type RecentAsset = InstanceId & { name: string };
export type Series = InstanceId & {
  name: string;
  description: string;
  kind: string;
  unit: string;
};
export type Activity = InstanceId & {
  name: string;
  description: string;
  status: string;
  date: number | null;
  details: Record<string, string>;
};
export type AssetFile = InstanceId & {
  name: string;
  description: string;
  mimeType: string;
  uploaded: boolean;
  modified: number | null;
  modifiedLabel: string;
};
export const RANGES = {
  '1h': { duration: 3600000, granularity: '10s' },
  '24h': { duration: 86400000, granularity: '4m' },
  '7d': { duration: 604800000, granularity: '30m' },
  '30d': { duration: 2592000000, granularity: '2h' },
};
export type TimeRange = keyof typeof RANGES;
export type Navigation = {
  asset: InstanceId | null;
  query: string;
  selected: InstanceId[];
  range: TimeRange;
  activity: InstanceId | null;
  file: InstanceId | null;
};
export type ChartSeries = {
  series: Series;
  latest: number | null;
  points: { timestamp: number; value: number }[];
};
export type ChartData = {
  start: number | null;
  end: number | null;
  granularity: string;
  series: ChartSeries[];
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function isId(value: unknown): value is InstanceId {
  return (
    isRecord(value) &&
    typeof value.space === 'string' &&
    value.space.length > 0 &&
    value.space.length <= 255 &&
    typeof value.externalId === 'string' &&
    value.externalId.length > 0 &&
    value.externalId.length <= 256
  );
}
export function assetKey(id: InstanceId): string {
  return JSON.stringify([id.space, id.externalId]);
}
export function timeValue(value: unknown): number | null {
  const timestamp =
    value instanceof Date
      ? value.getTime()
      : typeof value === 'number'
        ? value
        : typeof value === 'string' && value
          ? Date.parse(value)
          : NaN;
  return Number.isFinite(timestamp) ? timestamp : null;
}
export function isRange(value: unknown): value is TimeRange {
  return value === '1h' || value === '24h' || value === '7d' || value === '30d';
}
export function decodeNavigation(raw?: string): Navigation {
  const identity = (id: InstanceId): InstanceId => ({
    space: id.space,
    externalId: id.externalId,
  });
  const fallback: Navigation = {
    asset: null,
    query: '',
    selected: [],
    range: '24h',
    activity: null,
    file: null,
  };
  try {
    const value: unknown = JSON.parse(raw ?? '{}');
    if (!isRecord(value)) return fallback;
    return {
      asset: isId(value.asset) ? identity(value.asset) : null,
      query: typeof value.query === 'string' ? value.query.slice(0, 256) : '',
      selected: Array.isArray(value.selected)
        ? value.selected.filter(isId).slice(0, 100).map(identity)
        : [],
      range: isRange(value.range) ? value.range : '24h',
      activity: isId(value.activity) ? identity(value.activity) : null,
      file: isId(value.file) ? identity(value.file) : null,
    };
  } catch {
    return fallback;
  }
}
export function parseRecent(raw: string | null): RecentAsset[] {
  try {
    const value: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(value)) return [];
    return value
      .filter(
        (item: unknown): item is RecentAsset =>
          isRecord(item) && typeof item.name === 'string' && isId(item),
      )
      .slice(0, 10);
  } catch {
    return [];
  }
}
export function rememberAsset(
  recent: RecentAsset[],
  asset: RecentAsset,
): RecentAsset[] {
  return [
    asset,
    ...recent.filter((item: RecentAsset) => assetKey(item) !== assetKey(asset)),
  ].slice(0, 10);
}
export function errorStatus(error: unknown): number | null {
  if (!isRecord(error)) return null;
  for (const value of [
    error.status,
    error.code,
    isRecord(error.response) ? error.response.status : null,
  ])
    if (typeof value === 'number') return value;
  return null;
}
export function canPreview(mimeType: string): boolean {
  return [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
  ].includes(mimeType.toLowerCase().split(';')[0].trim());
}
export function formatDate(value: number | null): string {
  return value === null ? 'Not available' : new Date(value).toLocaleString();
}
