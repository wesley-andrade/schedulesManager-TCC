import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separa o React e suas dependências
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Separa o React Query
          'vendor-query': ['@tanstack/react-query'],
          // Separa o React Big Calendar
          'vendor-calendar': ['react-big-calendar'],
          // Separa o date-fns
          'vendor-dates': ['date-fns'],
          // Separa os componentes UI
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-toast',
            '@radix-ui/react-select',
            '@radix-ui/react-tooltip'
          ]
        }
      }
    },
    // Aumenta o limite de aviso de tamanho do chunk
    chunkSizeWarningLimit: 1000
  },
});
