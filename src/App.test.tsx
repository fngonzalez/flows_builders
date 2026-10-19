import type { ConnectToHostAppResult } from '@cognite/app-sdk';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import App from './App';

describe('Fusion bootstrap', () => {
  it('explains the host connection while waiting for authentication', () => {
    render(
      <App
        connect={vi.fn(
          () => new Promise<ConnectToHostAppResult>(() => undefined),
        )}
      />,
    );
    expect(screen.getByText(/Open Asset 360 inside/)).toBeInTheDocument();
  });
  it('handles a rejected handshake without an unhandled rejection', async () => {
    render(
      <App
        connect={vi.fn().mockRejectedValue(new Error('connection refused'))}
      />,
    );
    expect(
      await screen.findByText('Could not connect to Cognite Fusion'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reconnect' }),
    ).toBeInTheDocument();
  });
});
