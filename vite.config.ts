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
    globals: true,
    coverage: {
      include: ['src/**/*.{ts,svelte}'],
      exclude: ['src/lib/types/**/*.ts', 'src/routes/**/*.ts'],
      reportsDirectory: './tests/coverage',
    },
    workspace: [
      {
        extends: './vite.config.ts',
        plugins: [svelteTesting()],
        test: {
          name: 'client',
          environment: 'jsdom',
          clearMocks: true,
          include: ['tests/components/**/*.test.ts'],
          setupFiles: ['./vitest-setup-client.ts'],
        },
      },
      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'jsdom',
          include: ['tests/**/*.test.ts'],
          exclude: ['tests/components/**/*.test.ts'],
        },
      },
    ],
  },
})

export default config
