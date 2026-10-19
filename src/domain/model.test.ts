import { describe, expect, it } from 'vitest';

import {
  assetKey,
  decodeNavigation,
  parseRecent,
  rememberAsset,
  timeValue,
} from './model';

describe('persistent identities and navigation', () => {
  it('keeps identical external IDs in different spaces distinct', () => {
    expect(assetKey({ space: 'a', externalId: 'pump' })).not.toBe(
      assetKey({ space: 'b', externalId: 'pump' }),
    );
  });
  it('recovers from malformed host state and validates every selected ID', () => {
    expect(decodeNavigation('{broken').asset).toBeNull();
    expect(
      decodeNavigation('{"asset":{"space":"a"},"range":"bad"}').range,
    ).toBe('24h');
    expect(decodeNavigation('{"selected":[{"space":"a"}]}').selected).toEqual(
      [],
    );
  });
  it('caps recent history, moves repeated entries to front and isolates spaces', () => {
    const recent = Array.from({ length: 12 }, (_: unknown, i: number) => ({
      space: 'a',
      externalId: String(i),
      name: String(i),
    }));
    const result = rememberAsset(recent, {
      space: 'b',
      externalId: '0',
      name: 'other',
    });
    expect(result).toHaveLength(10);
    expect(result[0].space).toBe('b');
    expect(rememberAsset(result, result[5])).toHaveLength(10);
    expect(rememberAsset(result, result[5])[0]).toEqual(result[5]);
  });
  it('rejects corrupt stored history and parses date values safely', () => {
    expect(parseRecent('{oops')).toEqual([]);
    expect(parseRecent('[{"space":"a"},null]')).toEqual([]);
    expect(timeValue(new Date(1000))).toBe(1000);
    expect(timeValue('2020-01-01T00:00:00Z')).toBe(1577836800000);
    expect(timeValue('invalid')).toBeNull();
  });
});
