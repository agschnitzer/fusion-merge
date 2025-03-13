import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
  // TODO: Update to the correct URL
  const url = 'http://localhost:5173/'
  const description = 'Fusion Merge is an open-source puzzle game inspired by the classic 2048. Instead of merging numbers, you combine atomic elements to create heavier ones.'
  const publishedOn = new Date().toISOString()
  const updatedAt = new Date().toISOString()

  return {
    meta: {
      title: 'Fusion Merge - Play the free online game',
      description,
      url,
      publishedOn,
      updatedAt,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'VideoGame',
        name: 'Fusion Merge',
        url,
        description,
        datePublished: publishedOn,
        dateModified: updatedAt,
        inLanguage: ['English'],
        author: {
          '@type': 'Person',
          name: 'Alex Gschnitzer',
          url: 'https://alexgschnitzer.com/#about',
        },
        playMode: 'SinglePlayer',
        genre: ['Puzzle', 'Strategy'],
        gamePlatform: ['Web'],
      },
    },
  }
}
