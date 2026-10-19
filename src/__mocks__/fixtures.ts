import type { Activity, Asset, AssetFile, Series } from '../domain/model';

export const asset: Asset = {
  space: 'plant',
  externalId: 'PUMP-101',
  name: 'Cooling water pump',
  description: 'North process area',
};
export const series: Series = {
  space: 'plant',
  externalId: 'pressure',
  name: 'Discharge pressure',
  description: '',
  kind: 'numeric',
  unit: 'bar',
};
export const activity: Activity = {
  space: 'plant',
  externalId: 'WO-101',
  name: 'Inspect seal',
  description: 'Inspect the mechanical seal',
  status: 'Not available',
  date: 1577836800000,
  details: { name: 'Inspect seal', sourceId: 'SAP-101' },
};
export const file: AssetFile = {
  space: 'plant',
  externalId: 'manual',
  name: 'Pump manual.pdf',
  description: '',
  mimeType: 'application/pdf',
  uploaded: true,
  modified: 1577836800000,
  modifiedLabel: 'Source modified',
};
