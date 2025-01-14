import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ds6306-unit-2/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.csv')) {
            return '[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  publicDir: 'public'
})
