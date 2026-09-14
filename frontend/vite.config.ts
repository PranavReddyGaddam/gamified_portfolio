import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // The /api routes are Vercel functions, which `vite dev` does not run.
      // Point them at the deployment so they work locally without needing
      // `vercel dev` and a GITHUB_TOKEN in the environment.
      '/api': {
        target: 'https://pranavreddygaddam.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});

