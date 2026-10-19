import { describe, expect, it } from 'vitest';

import { retryRead } from './useInvestigationViewModel';

describe('read retry policy', () => {
  it('does not retry permission/schema errors or retry forever', () => {
    expect(retryRead(0, { status: 403 })).toBe(false);
    expect(retryRead(0, { status: 400 })).toBe(false);
    expect(retryRead(0, { status: 429 })).toBe(true);
    expect(retryRead(0, { status: 503 })).toBe(true);
    expect(retryRead(1, new Error('network'))).toBe(false);
  });
});
