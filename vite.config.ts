import { svelteTesting } from '@testing-library/svelte/vite'
import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

const config = defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  server: {
    host: '0.0.0.0',
  },
  test: {
    workspace: [{
      extends: './vite.config.ts',
      plugins: [svelteTesting()],
      test: {
        name: 'client',
        environment: 'jsdom',
        clearMocks: true,
        include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
        exclude: ['src/lib/server/**'],
        setupFiles: ['./vitest-setup-client.ts'],
      },
    }, {
      extends: './vite.config.ts',
      test: {
        name: 'server',
        environment: 'node',
        include: ['tests/**/*.{test,spec}.{js,ts}'],
        exclude: ['tests/**/*.svelte.{test,spec}.{js,ts}'],
      },
    }],
  },
})

export default config
