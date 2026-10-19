import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        settings: {
          handleDisabledFileLoadingAsSuccess: true,
          disableIframePageLoading: true,
          disableCSSFileLoading: true,
          disableJavaScriptFileLoading: true,
        },
      },
    },
    setupFiles: ['vitest.setup.ts'],
    exclude: [...configDefaults.exclude, '.claude/**', '.agents/**'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/*.test.{ts,tsx}',
        'src/main.tsx',
        'src/__mocks__/**',
        '**/*.d.ts',
      ],
    },
  },
});
