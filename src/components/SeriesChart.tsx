import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@cognite/aura/chart';
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
} from '@cognite/aura/components/empty-state';
import type { ReactNode } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { assetKey, formatDate } from '../domain/model';
import type { ChartData } from '../domain/model';

export function SeriesChart({ data }: { data: ChartData }) {
  return (
    <div className="space-y-6">
      {data.end !== null && (
        <p className="text-sm text-muted-foreground">
          {formatDate(data.start)} – {formatDate(data.end)} · Average /{' '}
          {data.granularity}. Window ends at the latest selected datapoint.
        </p>
      )}
      {data.series.map(({ series, points, latest }) => (
        <section
          key={assetKey(series)}
          aria-label={`${series.name} chart`}
          className="min-w-0 space-y-2"
        >
          <h3 className="text-sm font-medium">
            {series.name}{' '}
            <span className="text-muted-foreground">
              {series.unit || 'Unit not specified'}
            </span>
          </h3>
          {series.kind !== 'numeric' ? (
            <p className="text-sm text-muted-foreground">
              String and state series are listed for context; numeric charts are
              supported in this version.
            </p>
          ) : latest === null ? (
            <EmptyState>
              <EmptyStateTitle as="h4">No datapoints available</EmptyStateTitle>
              <EmptyStateDescription>
                This series has no accessible datapoints.
              </EmptyStateDescription>
            </EmptyState>
          ) : !points.length ? (
            <p className="text-sm text-muted-foreground">
              No samples in this time window. Last available datapoint:{' '}
              {formatDate(latest)}. Try a wider range.
            </p>
          ) : (
            <>
              <ChartContainer
                className="h-52 w-full"
                aria-label={`${series.name} over time in ${series.unit || 'unspecified units'}`}
                config={{
                  value: {
                    label: series.name,
                    color: 'var(--color-link-foreground)',
                  },
                }}
              >
                <LineChart
                  data={points}
                  accessibilityLayer
                  margin={{ top: 8, left: 8, right: 16, bottom: 8 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={[data.start ?? 'dataMin', data.end ?? 'dataMax']}
                    tickFormatter={(value: number) =>
                      new Date(value).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                      })
                    }
                    minTickGap={55}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    width={60}
                    tickFormatter={(value: number) =>
                      value.toLocaleString(undefined, {
                        maximumSignificantDigits: 4,
                      })
                    }
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value: ReactNode) =>
                          typeof value === 'number' ? formatDate(value) : value
                        }
                      />
                    }
                  />
                  <Line
                    dataKey="value"
                    type="linear"
                    stroke="var(--color-value)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ChartContainer>
              <p className="text-xs text-muted-foreground">
                {points.length} average samples · Latest datapoint{' '}
                {formatDate(latest)} · Each series uses its own vertical scale.
              </p>
            </>
          )}
        </section>
      ))}
    </div>
  );
}
