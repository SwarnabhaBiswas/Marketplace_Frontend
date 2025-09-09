import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173,
    allowedHosts: [
      'b4f50dd5fdcc.ngrok-free.app' 
    ]
   }
});
