import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ErrorBoundary } from './ErrorBoundary';

describe('render recovery', () => {
  it('replaces an uncaught render failure with a recovery action', () => {
    const errorLog = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const recover = vi.fn();
    function Broken(): never {
      throw new Error('broken render');
    }
    render(
      <ErrorBoundary onRecover={recover}>
        <Broken />
      </ErrorBoundary>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Reload workspace' }));
    expect(recover).toHaveBeenCalled();
    errorLog.mockRestore();
  });
});
