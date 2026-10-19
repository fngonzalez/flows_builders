import { describe, expect, it, vi } from 'vitest';

import { createAssetService } from './AssetService';
import type { CdfClient } from './AssetService';

const asset = { space: 'plant', externalId: 'PUMP-1' };
function node(
  view: string,
  properties: Record<string, string | boolean | number | object>,
  externalId: string = 'PUMP-1',
) {
  return {
    space: 'plant',
    externalId,
    instanceType: 'node',
    version: 1,
    createdTime: 1,
    lastUpdatedTime: 2,
    properties: { cdf_cdm: { [`${view}/v1`]: properties } },
  };
}
function clientMock() {
  const instances = {
    search: vi.fn().mockResolvedValue({ items: [] }),
    list: vi.fn().mockResolvedValue({ items: [] }),
    retrieve: vi.fn().mockResolvedValue({ items: [] }),
  };
  const datapoints = {
    retrieveLatest: vi.fn().mockResolvedValue([]),
    retrieve: vi.fn().mockResolvedValue([]),
  };
  const files = { getDownloadUrls: vi.fn().mockResolvedValue([]) };
  const client = { instances, datapoints, files } satisfies CdfClient;
  return { client, instances, datapoints, files };
}

describe('read-only CDF contract', () => {
  it('distinguishes missing document data from a sample with no related assets', async () => {
    const { client, instances } = clientMock();
    expect(await createAssetService(client).checkDocuments()).toContain(
      'no accessible document records',
    );
    instances.list.mockResolvedValue({
      items: [node('CogniteFile', { name: 'Diagram' })],
    });
    expect(await createAssetService(client).checkDocuments()).toContain(
      'Document records are accessible',
    );
    expect(instances.list.mock.calls[0][0]).toEqual({
      instanceType: 'node',
      sources: [
        {
          source: {
            type: 'view',
            space: 'cdf_cdm',
            externalId: 'CogniteFile',
            version: 'v1',
          },
        },
      ],
      limit: 1,
    });
  });
  it('continues past empty relation lists and falls back to linked file records', async () => {
    const { client, instances } = clientMock();
    instances.list
      .mockResolvedValueOnce({
        items: [node('CogniteFile', { assets: [] }, 'empty')],
        nextCursor: 'next',
      })
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce({
        items: [
          node('CogniteFile', { assets: [asset], isUploaded: false }, 'linked'),
        ],
      });
    instances.retrieve.mockResolvedValue({
      items: [node('CogniteAsset', { name: 'Documented pump' })],
    });
    expect(
      await createAssetService(client).findAssetsWithDocuments(),
    ).toHaveLength(1);
    expect(instances.list.mock.calls[1][0].cursor).toBe('next');
    expect(instances.list.mock.calls[2][0].filter.and).toHaveLength(1);
  });
  it('finds document examples only from uploaded files with real asset relations', async () => {
    const { client, instances } = clientMock();
    instances.list.mockResolvedValue({
      items: [
        node('CogniteFile', { isUploaded: true, assets: [asset] }, 'file'),
      ],
    });
    instances.retrieve.mockResolvedValue({
      items: [node('CogniteAsset', { name: 'Documented pump' })],
    });
    expect(
      (await createAssetService(client).findAssetsWithDocuments())[0].name,
    ).toBe('Documented pump');
    expect(instances.list.mock.calls[0][0].filter.and[1].equals).toEqual({
      property: ['cdf_cdm', 'CogniteFile/v1', 'isUploaded'],
      value: true,
    });
  });
  it('finds example assets from real numeric time-series relations', async () => {
    const { client, instances } = clientMock();
    instances.list.mockResolvedValue({
      items: [
        node(
          'CogniteTimeSeries',
          { type: 'numeric', assets: [asset] },
          'sensor',
        ),
      ],
    });
    instances.retrieve.mockResolvedValue({
      items: [node('CogniteAsset', { name: 'Connected pump' })],
    });
    const assets = await createAssetService(client).findAssetsWithSignals();
    expect(assets[0].name).toBe('Connected pump');
    expect(instances.list.mock.calls[0][0].limit).toBe(25);
    expect(instances.retrieve.mock.calls[0][0].items).toEqual([
      { ...asset, instanceType: 'node' },
    ]);
  });
  it('merges ranked search with externalId prefix results without duplicates', async () => {
    const { client, instances } = clientMock();
    instances.search.mockResolvedValue({
      items: [node('CogniteAsset', { name: 'Pump' })],
    });
    instances.list.mockResolvedValue({
      items: [node('CogniteAsset', { name: 'Pump' })],
    });
    const result = await createAssetService(client).searchAssets('PUMP');
    expect(result).toHaveLength(1);
    expect(instances.search).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'PUMP',
        view: expect.objectContaining({
          space: 'cdf_cdm',
          externalId: 'CogniteAsset',
          version: 'v1',
        }),
      }),
    );
    expect(instances.list.mock.calls[0][0].filter).toEqual(
      expect.objectContaining({
        prefix: { property: ['node', 'externalId'], value: 'PUMP' },
      }),
    );
  });
  it('filters list-valued assets on the owning view and follows cursors', async () => {
    const { client, instances } = clientMock();
    instances.list
      .mockResolvedValueOnce({
        items: [
          node('CogniteTimeSeries', { name: 'Flow', type: 'numeric' }, 'ts1'),
        ],
        nextCursor: 'next',
      })
      .mockResolvedValueOnce({
        items: [
          node('CogniteTimeSeries', { name: 'Flow', type: 'numeric' }, 'ts2'),
        ],
      });
    expect(await createAssetService(client).listSeries(asset)).toHaveLength(2);
    expect(instances.list.mock.calls[0][0].filter).toEqual({
      containsAny: {
        property: ['cdf_cdm', 'CogniteTimeSeries/v1', 'assets'],
        values: [asset],
      },
    });
    expect(instances.list.mock.calls[1][0].cursor).toBe('next');
  });
  it('anchors to the latest selected historical point and uses instanceId, not externalId', async () => {
    const { client, datapoints } = clientMock();
    const id = { space: 'plant', externalId: 'sensor' };
    datapoints.retrieveLatest.mockResolvedValue([
      {
        instanceId: id,
        datapoints: [{ timestamp: new Date(1577836800000), value: 2 }],
      },
    ]);
    datapoints.retrieve.mockResolvedValue([
      {
        instanceId: id,
        datapoints: [{ timestamp: new Date(1577836800000), average: 2 }],
      },
    ]);
    const result = await createAssetService(client).loadChart(
      [
        {
          ...id,
          name: 'Sensor',
          kind: 'numeric',
          unit: 'bar',
          description: '',
        },
      ],
      '24h',
    );
    expect(result.end).toBe(1577836800000);
    expect(datapoints.retrieveLatest.mock.calls[0][0][0]).toHaveProperty(
      'instanceId',
      id,
    );
    expect(datapoints.retrieve.mock.calls[0][0].end).toBe(1577836800001);
    expect(result.series[0].points[0].value).toBe(2);
  });
  it('does not fetch history for a series with no datapoints', async () => {
    const { client, datapoints } = clientMock();
    const result = await createAssetService(client).loadChart(
      [{ ...asset, name: 'Empty', description: '', kind: 'numeric', unit: '' }],
      '1h',
    );
    expect(result.end).toBeNull();
    expect(result.series[0].points).toEqual([]);
    expect(datapoints.retrieve).not.toHaveBeenCalled();
  });
  it('propagates permission failures instead of substituting data', async () => {
    const { client, instances } = clientMock();
    instances.list.mockRejectedValue({ status: 403 });
    await expect(createAssetService(client).listFiles(asset)).rejects.toEqual({
      status: 403,
    });
  });
  it('resolves a file by instance ID and rejects unsafe download URLs', async () => {
    const { client, files } = clientMock();
    files.getDownloadUrls.mockResolvedValue([
      { downloadUrl: 'javascript:bad' },
    ]);
    await expect(createAssetService(client).fileUrl(asset)).rejects.toThrow();
    expect(files.getDownloadUrls).toHaveBeenCalledWith([{ instanceId: asset }]);
  });
  it('does not invent a status and sorts activity dates newest first', async () => {
    const { client, instances } = clientMock();
    instances.list.mockResolvedValue({
      items: [
        node('CogniteActivity', { endTime: '2020-01-01' }, 'old'),
        node('CogniteActivity', { scheduledEndTime: '2021-01-01' }, 'new'),
      ],
    });
    const rows = await createAssetService(client).listActivities(asset);
    expect(rows.map((row) => row.externalId)).toEqual(['new', 'old']);
    expect(rows[0].status).toBe('Not available');
  });
});
