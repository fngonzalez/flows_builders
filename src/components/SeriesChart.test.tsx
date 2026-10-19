import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { series } from '../__mocks__/fixtures';

import { SeriesChart } from './SeriesChart';

describe('chart honesty', () => {
  it('exposes a labeled numeric plot with its historical window and aggregation', () => {
    render(
      <SeriesChart
        data={{
          start: 1577750400000,
          end: 1577836800000,
          granularity: '4m',
          series: [
            {
              series,
              latest: 1577836800000,
              points: [
                { timestamp: 1577836700000, value: 2 },
                { timestamp: 1577836800000, value: 3 },
              ],
            },
          ],
        }}
      />,
    );
    expect(
      screen.getByRole('img', { name: 'Discharge pressure over time in bar' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Window ends at the latest selected datapoint/),
    ).toBeInTheDocument();
    expect(screen.getByText(/2 average samples/)).toBeInTheDocument();
  });
  it('distinguishes absent history from unsupported types', () => {
    render(
      <SeriesChart
        data={{
          start: null,
          end: null,
          granularity: '4m',
          series: [
            { series, latest: null, points: [] },
            {
              series: { ...series, externalId: 'text', kind: 'string' },
              latest: null,
              points: [],
            },
          ],
        }}
      />,
    );
    expect(screen.getByText(/No datapoints available/)).toBeInTheDocument();
    expect(screen.getByText(/String and state series/)).toBeInTheDocument();
  });
});
