import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    root: import.meta.dirname,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: path.resolve(import.meta.dirname, 'coverage'),
      include: [
        'src/**/*.{js,ts,tsx}',
        'convex/**/*.{js,ts}',
      ],
      exclude: [
        'src/**/*.{test,spec}.{js,ts,tsx}',
        'convex/**/*.{test,spec}.{js,ts}',
        'convex/_generated/**',
        'convex/_fixtures/**',
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
          name: 'react',
          environment: 'jsdom',
        },
      },
      {
        extends: true,
        test: {
          include: ['convex/**/*.{test,spec}.{js,ts}'],
          name: 'convex',
          environment: 'edge-runtime',
          server: {
            deps: {
              inline: ['convex-test'],
              external: ['**/node_modules/**'],
            },
          },
          deps: {
            optimizer: {
              ssr: {
                exclude: ['**/node_modules/**'],
              },
            },
          },
        },
      },
    ],
  },
});
