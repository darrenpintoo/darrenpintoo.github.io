import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    // Honor the PORT env when provided (e.g. by the preview harness); Vite
    // otherwise ignores it and picks its own port, which the harness can't reach.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: !!process.env.PORT,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'markdown-vendor': ['react-markdown', 'remark-gfm'],
        },
      },
    },
  },
})
