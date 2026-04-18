import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: true,        // 🔥 permite acceso desde Windows (WSL fix)
    port: 5173,        // puedes cambiarlo si quieres
    strictPort: true,  // evita que cambie el puerto automáticamente
    open: false,       // evita abrir navegador en WSL
  }
})