import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173,
    allowedHosts: [
      '65123e82b0e6.ngrok-free.app' 
    ]
   }
});
