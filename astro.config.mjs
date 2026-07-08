// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react()],
  env: {
    schema: {
      SITE_URL: envField.string({
        context: 'server',
        access: 'public',
        default: 'http://localhost:4321',
      }),
      GOOGLE_CLIENT_ID: envField.string({
        context: 'server',
        access: 'public',
      }),
      GOOGLE_CLIENT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),
      SESSION_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),
      DATABASE_URL: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
  },
  vite: {
    plugins: [tailwind()],
  },
});
