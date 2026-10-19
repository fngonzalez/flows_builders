import type { CogniteClient } from '@cognite/sdk';

import { assetKey, isId, RANGES, timeValue } from '../domain/model';
import type {
  Activity,
  Asset,
  AssetFile,
  ChartData,
  ChartSeries,
  InstanceId,
  Series,
  TimeRange,
} from '../domain/model';

export type CdfClient = {
  instances: Pick<CogniteClient['instances'], 'search' | 'list' | 'retrieve'>;
  datapoints: Pick<CogniteClient['datapoints'], 'retrieve' | 'retrieveLatest'>;
  files: Pick<CogniteClient['files'], 'getDownloadUrls'>;
};
type Node = Awaited<
  ReturnType<CdfClient['instances']['list']>
>['items'][number];
type View =
  | 'CogniteAsset'
  | 'CogniteAssetType'
  | 'CogniteTimeSeries'
  | 'CogniteActivity'
  | 'CogniteFile';
export interface AssetService {
  findAssetsWithSignals(): Promise<Asset[]>;
  findAssetsWithDocuments(): Promise<Asset[]>;
  checkDocuments(): Promise<string>;
  searchAssets(query: string): Promise<Asset[]>;
  getAsset(id: InstanceId): Promise<Asset>;
  listSeries(id: InstanceId): Promise<Series[]>;
  listActivities(id: InstanceId): Promise<Activity[]>;
  listFiles(id: InstanceId): Promise<AssetFile[]>;
  loadChart(selected: Series[], range: TimeRange): Promise<ChartData>;
  fileUrl(id: InstanceId): Promise<string>;
}
const source = (
  externalId: View,
): { space: string; externalId: View; version: string; type: 'view' } => ({
  space: 'cdf_cdm',
  externalId,
  version: 'v1',
  type: 'view',
});
function properties(node: Node, view: View): Record<string, unknown> {
  return node.properties?.cdf_cdm?.[`${view}/v1`] ?? {};
}
function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}
function assetFrom(node: Node): Asset {
  const p = properties(node, 'CogniteAsset');
  return {
    space: node.space,
    externalId: node.externalId,
    name: text(p.name) || node.externalId,
    description: text(p.description),
    parent: isId(p.parent) ? p.parent : undefined,
    assetType: isId(p.type) ? p.type : undefined,
  };
}
function distinct<T extends InstanceId>(items: T[]): T[] {
  return [...new Map(items.map((item: T) => [assetKey(item), item])).values()];
}

class CdfAssetService implements AssetService {
  constructor(private readonly client: CdfClient) {}

  async findAssetsWithSignals(): Promise<Asset[]> {
    return this.findLinkedAssets('signals');
  }
  async findAssetsWithDocuments(): Promise<Asset[]> {
    return this.findLinkedAssets('documents');
  }
  async checkDocuments(): Promise<string> {
    const result = await this.client.instances.list({
      instanceType: 'node',
      sources: [{ source: source('CogniteFile') }],
      limit: 1,
    });
    return result.items.length
      ? 'Document records are accessible, but no connected equipment was found in the checked files. Ask the project owner for an asset with a linked, uploaded document.'
      : 'Cognite returned no accessible document records for this project. Ask the project owner to check CogniteFile data and your read access.';
  }
  private async findLinkedAssets(
    kind: 'signals' | 'documents',
  ): Promise<Asset[]> {
    const view = kind === 'signals' ? 'CogniteTimeSeries' : 'CogniteFile';
    let ids: InstanceId[] = [];
    // Empty relation arrays can satisfy exists. Prefer uploaded documents, but
    // also expose linked metadata when content is not yet uploaded. Both passes
    // have a hard page budget and stop as soon as actual asset IDs are found.
    for (
      let pass = 0;
      pass < (kind === 'documents' ? 2 : 1) && !ids.length;
      pass++
    ) {
      let cursor: string | undefined;
      const cursors = new Set<string>();
      for (let page = 0; page < (kind === 'documents' ? 5 : 1); page++) {
        const response = await this.client.instances.list({
          instanceType: 'node',
          sources: [{ source: source(view) }],
          cursor,
          filter: {
            and: [
              { exists: { property: ['cdf_cdm', `${view}/v1`, 'assets'] } },
              ...(pass === 0
                ? [
                    {
                      equals: {
                        property: [
                          'cdf_cdm',
                          `${view}/v1`,
                          kind === 'signals' ? 'type' : 'isUploaded',
                        ],
                        value: kind === 'signals' ? 'numeric' : true,
                      },
                    },
                  ]
                : []),
            ],
          },
          limit: kind === 'signals' ? 25 : 100,
        });
        ids = distinct(
          response.items.flatMap((node: Node) => {
            const relations = properties(node, view).assets;
            return Array.isArray(relations) ? relations.filter(isId) : [];
          }),
        ).slice(0, 30);
        if (
          ids.length ||
          !response.nextCursor ||
          cursors.has(response.nextCursor)
        )
          break;
        cursor = response.nextCursor;
        cursors.add(cursor);
      }
    }
    if (!ids.length) return [];
    const assets = await this.client.instances.retrieve({
      items: ids.map((id: InstanceId) => ({ ...id, instanceType: 'node' })),
      sources: [{ source: source('CogniteAsset') }],
    });
    return this.hydrate(
      assets.items
        .filter(
          (node: Node) =>
            node.instanceType === 'node' &&
            node.properties?.cdf_cdm?.['CogniteAsset/v1'],
        )
        .map(assetFrom),
    );
  }

  async searchAssets(query: string): Promise<Asset[]> {
    if (!query.trim()) return [];
    const [ranked, ids] = await Promise.all([
      this.client.instances.search({
        instanceType: 'node',
        view: source('CogniteAsset'),
        query,
        properties: ['name', 'description', 'aliases', 'tags', 'sourceId'],
        limit: 30,
      }),
      this.client.instances.list({
        instanceType: 'node',
        sources: [{ source: source('CogniteAsset') }],
        filter: { prefix: { property: ['node', 'externalId'], value: query } },
        limit: 30,
      }),
    ]);
    const exact = ids.items.filter(
      (item: Node) => item.externalId.toLowerCase() === query.toLowerCase(),
    );
    return this.hydrate(
      distinct(
        [...exact, ...ranked.items, ...ids.items]
          .filter((item: Node) => item.instanceType === 'node')
          .map(assetFrom),
      ).slice(0, 30),
    );
  }

  async getAsset(id: InstanceId): Promise<Asset> {
    const result = await this.client.instances.retrieve({
      sources: [{ source: source('CogniteAsset') }],
      items: [{ ...id, instanceType: 'node' }],
    });
    const node = result.items.find(
      (item: Node) =>
        item.instanceType === 'node' && assetKey(item) === assetKey(id),
    );
    if (!node || !node.properties?.cdf_cdm?.['CogniteAsset/v1'])
      throw new Error(
        'Asset is unavailable or access has changed. Try another search.',
      );
    return (await this.hydrate([assetFrom(node)]))[0];
  }

  private async hydrate(assets: Asset[]): Promise<Asset[]> {
    const parents = distinct(
      assets.flatMap((item: Asset) => (item.parent ? [item.parent] : [])),
    );
    const types = distinct(
      assets.flatMap((item: Asset) => (item.assetType ? [item.assetType] : [])),
    );
    const labels = new Map<string, string>();
    for (const [ids, view] of [
      [parents, 'CogniteAsset'],
      [types, 'CogniteAssetType'],
    ] satisfies [InstanceId[], View][]) {
      if (!ids.length) continue;
      // Missing context must not hide the main asset (access may differ on the parent/type).
      try {
        const response = await this.client.instances.retrieve({
          sources: [{ source: source(view) }],
          items: ids.map((id: InstanceId) => ({ ...id, instanceType: 'node' })),
        });
        for (const node of response.items)
          labels.set(
            assetKey(node),
            text(properties(node, view).name) || node.externalId,
          );
      } catch {
        /* Identity still provides a truthful context fallback. */
      }
    }
    return assets.map((item: Asset) => ({
      ...item,
      parentName: item.parent
        ? (labels.get(assetKey(item.parent)) ?? item.parent.externalId)
        : undefined,
      typeName: item.assetType
        ? (labels.get(assetKey(item.assetType)) ?? item.assetType.externalId)
        : undefined,
    }));
  }

  private async related(id: InstanceId, view: View): Promise<Node[]> {
    // Reverse traversal through assets (a list of direct relations) is unsupported.
    // A single owning-view lookup with a server-side relation filter is the documented path.
    let cursor: string | undefined;
    const nodes: Node[] = [];
    const seen = new Set<string>();
    do {
      const response = await this.client.instances.list({
        instanceType: 'node',
        sources: [{ source: source(view) }],
        filter: {
          containsAny: {
            property: ['cdf_cdm', `${view}/v1`, 'assets'],
            values: [{ space: id.space, externalId: id.externalId }],
          },
        },
        limit: 1000,
        cursor,
      });
      nodes.push(
        ...response.items.filter((node: Node) => node.instanceType === 'node'),
      );
      cursor = response.nextCursor;
      if (cursor && seen.has(cursor))
        throw new Error(
          'CDF returned a repeated page cursor. Retry this panel.',
        );
      if (cursor) seen.add(cursor);
    } while (cursor);
    return distinct(nodes);
  }
  async listSeries(id: InstanceId): Promise<Series[]> {
    return (await this.related(id, 'CogniteTimeSeries')).map((node: Node) => {
      const p = properties(node, 'CogniteTimeSeries');
      return {
        space: node.space,
        externalId: node.externalId,
        name: text(p.name) || node.externalId,
        description: text(p.description),
        kind: text(p.type),
        unit: text(p.sourceUnit),
      };
    });
  }
  async listActivities(id: InstanceId): Promise<Activity[]> {
    return (await this.related(id, 'CogniteActivity'))
      .map((node: Node) => {
        const p = properties(node, 'CogniteActivity');
        const date =
          timeValue(p.endTime) ??
          timeValue(p.scheduledEndTime) ??
          timeValue(p.startTime) ??
          timeValue(p.scheduledStartTime);
        const details: Record<string, string> = {};
        for (const [key, value] of Object.entries(p))
          details[key] =
            typeof value === 'string' ? value : JSON.stringify(value);
        return {
          space: node.space,
          externalId: node.externalId,
          name: text(p.name) || node.externalId,
          description: text(p.description),
          status: 'Not available',
          date,
          details,
        };
      })
      .sort(
        (a: Activity, b: Activity) =>
          (b.date ?? -Infinity) - (a.date ?? -Infinity) ||
          a.externalId.localeCompare(b.externalId),
      );
  }
  async listFiles(id: InstanceId): Promise<AssetFile[]> {
    return (await this.related(id, 'CogniteFile')).map((node: Node) => {
      const p = properties(node, 'CogniteFile');
      const sourceTime = timeValue(p.sourceUpdatedTime);
      return {
        space: node.space,
        externalId: node.externalId,
        name: text(p.name) || node.externalId,
        description: text(p.description),
        mimeType: text(p.mimeType),
        uploaded: p.isUploaded === true,
        modified: sourceTime ?? timeValue(node.lastUpdatedTime),
        modifiedLabel:
          sourceTime === null ? 'CDF record updated' : 'Source modified',
      };
    });
  }
  async loadChart(selected: Series[], range: TimeRange): Promise<ChartData> {
    const numeric = selected.filter(
      (series: Series) => series.kind === 'numeric',
    );
    const latestById = new Map<string, number>();
    // Batched reads prevent fan-out; no automatic polling is used.
    for (let i = 0; i < numeric.length; i += 100) {
      const response = await this.client.datapoints.retrieveLatest(
        numeric.slice(i, i + 100).map((item: Series) => ({
          instanceId: { space: item.space, externalId: item.externalId },
        })),
        { ignoreUnknownIds: true },
      );
      for (const item of response) {
        if (!item.instanceId) continue;
        const timestamp = timeValue(item.datapoints[0]?.timestamp);
        if (timestamp !== null)
          latestById.set(assetKey(item.instanceId), timestamp);
      }
    }
    const end = latestById.size ? Math.max(...latestById.values()) : null;
    const start = end === null ? null : end - RANGES[range].duration;
    const pointsById = new Map<string, ChartSeries['points']>();
    if (end !== null && start !== null) {
      const available = numeric.filter((item: Series) =>
        latestById.has(assetKey(item)),
      );
      for (let i = 0; i < available.length; i += 100) {
        const response = await this.client.datapoints.retrieve({
          items: available.slice(i, i + 100).map((item: Series) => ({
            instanceId: { space: item.space, externalId: item.externalId },
          })),
          start,
          end: end + 1,
          aggregates: ['average'],
          granularity: RANGES[range].granularity,
          limit: 1000,
          ignoreUnknownIds: true,
        });
        for (const item of response) {
          if (!item.instanceId) continue;
          if (item.nextCursor)
            throw new Error(
              'History exceeded the chart resolution. Select a shorter range.',
            );
          const points: ChartSeries['points'] = [];
          for (const point of item.datapoints) {
            const timestamp = timeValue(point.timestamp);
            const value =
              'average' in point
                ? point.average
                : 'value' in point
                  ? point.value
                  : undefined;
            if (
              timestamp !== null &&
              typeof value === 'number' &&
              Number.isFinite(value)
            )
              points.push({ timestamp, value });
          }
          pointsById.set(assetKey(item.instanceId), points);
        }
      }
    }
    return {
      start,
      end,
      granularity: RANGES[range].granularity,
      series: selected.map((series: Series) => ({
        series,
        latest: latestById.get(assetKey(series)) ?? null,
        points: pointsById.get(assetKey(series)) ?? [],
      })),
    };
  }
  async fileUrl(id: InstanceId): Promise<string> {
    const response = await this.client.files.getDownloadUrls([
      { instanceId: { space: id.space, externalId: id.externalId } },
    ]);
    const url = response[0]?.downloadUrl;
    if (!url || new URL(url).protocol !== 'https:')
      throw new Error('A secure file link is not available.');
    return url;
  }
}
export function createAssetService(client: CdfClient): AssetService {
  return new CdfAssetService(client);
}
