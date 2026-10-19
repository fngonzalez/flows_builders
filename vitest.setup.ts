import '@testing-library/jest-dom/vitest';
import { configure } from '@testing-library/dom';
import { beforeEach, vi } from 'vitest';

// happy-dom has no layout engine. Supply a viewport for Aura's real virtualized grids.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1000);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 0, 1000, 600),
  );
});
configure({
  getElementError: (message: string | null, container: Element) =>
    new Error(`${message}\n${container.textContent}`),
});
