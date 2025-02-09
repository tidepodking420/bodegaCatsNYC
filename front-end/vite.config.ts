import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'cat-app-load-balancer-254988594.us-east-2.elb.amazonaws.com',
      'dualstack.cat-app-load-balancer-254988594.us-east-2.elb.amazonaws.com',
      'bodega-cats-nyc.com',
    ],
  },
})
