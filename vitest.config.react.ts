import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

const root = path.resolve(import.meta.dirname, 'src');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': root,
    },
  },
  test: {
    environment: 'jsdom',
    root,
  },
});
