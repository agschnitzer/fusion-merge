import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
  return {
    meta: {
      title: 'About Fusion Merge',
      description: 'I created this game as a fun side project to learn more about canvas rendering and game development. As a fan of 2048, I wanted to create something similar but with a new twist. The game is built using SvelteKit and TypeScript.',
      // TODO: Update to the correct URL
      url: 'http://localhost:5173/about/',
      publishedOn: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }
}
