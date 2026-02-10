import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { codecovVitePlugin } from '@codecov/vite-plugin';

export default defineConfig({
  plugins: [
    solidPlugin(),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: 'sigstore-playground',
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true, // split CSS per lazy-loaded chunk
    rollupOptions: {
      output: {
        manualChunks: {
          // separate animation libraries into their own chunk
          'solid-motion': ['solid-motionone', 'motion'],
        },
      },
    },
  },
});
