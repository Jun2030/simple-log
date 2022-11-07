import { resolve } from 'path';
import { defineConfig } from 'vite';
import Dts from 'vite-plugin-dts';

export const pathResolve = (pathStr: string): string => resolve(__dirname, '.', pathStr);

export default defineConfig({
  resolve: {
    alias: {
      '@': pathResolve('src'),
    },
  },
  plugins: [Dts({
    rollupTypes: true,
  })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SimpleLog',
      fileName: 'index',
    },
    minify: true,
  },
});
