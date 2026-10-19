import { renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import { useWorkspace } from './WorkspaceContext';

it('fails clearly when a view is outside the shared workspace provider', () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  expect(() => renderHook(() => useWorkspace())).toThrow(
    'Workspace provider is missing',
  );
  log.mockRestore();
});
