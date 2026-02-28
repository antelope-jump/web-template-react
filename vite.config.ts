import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

import { createDevMockApiPlugin } from './mock/devMockApi';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://127.0.0.1:8080';
  const useMock = env.VITE_ENABLE_MOCK === 'true';

  return {
    plugins: [react(), ...(useMock ? [createDevMockApiPlugin()] : [])],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 5173,
      open: false,
      proxy: useMock
        ? undefined
        : {
            '/api': {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
            },
          },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      globals: true,
    },
  };
});
