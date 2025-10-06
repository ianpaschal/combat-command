import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'edge-runtime',
    root: path.resolve(__dirname, 'convex'),
    server: {
      deps: {
        inline: ['convex-test'],
      },
    },
  },
});
