import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
  return {
    meta: {
      title: 'About Fusion Merge',
      description: 'I created this game as a fun side project to learn more about canvas rendering and game development. As a fan of 2048, I wanted to create something similar but with a new twist. The game is built using SvelteKit and TypeScript.',
      url: 'https://fusionmerge.smialworks.com/about/',
      publishedOn: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      image: {
        src: '/fusion-merge-open-graph.png',
        alt: 'Fusion Merge - Play the free online game',
        width: 1200,
        height: 630,
        format: 'image/png',
      },
    },
    heading: 'About Fusion Merge',
    text: [
      `<strong>Fusion Merge</strong> is an open-source puzzle game inspired by the classic <a href="https://play2048.co" target="_blank">2048</a>. Instead of merging numbers, you combine atomic elements to create heavier ones, adding a <strong>scientific twist</strong> to the familiar sliding-tile gameplay.`,
      `I created this game as a fun side project to learn more about canvas rendering and game development. As a fan of 2048, I wanted to create something similar but with a new twist. The game is built using SvelteKit and TypeScript.`,
    ],
    sections: [
      {
        id: 'gameplay',
        heading: 'From Hydrogen to Neon',
        text: [`In <strong>Fusion Merge</strong>, you’ll combine the <strong>first ten elements</strong> of the periodic table, each represented by a unique tile. Starting with <strong>Hydrogen</strong>, you’ll fuse elements together to create heavier ones, following a natural progression of atomic numbers:`],
        list: [
          'Hydrogen (1)',
          'Helium (2)',
          'Lithium (3)',
          'Beryllium (4)',
          'Boron (5)',
          'Carbon (6)',
          'Nitrogen (7)',
          'Oxygen (8)',
          'Fluorine (9)',
          'Neon (10)',
        ],
      },
      {
        id: 'how-to-play',
        heading: 'How to Play',
        list: [
          'Swipe <strong>up, down, left, or right</strong> to slide all tiles in that direction.',
          'When two tiles with the same element collide, they <strong>fuse into a heavier element</strong>.',
          'After each move, a <strong>new element (Hydrogen or Helium)</strong> appears on the board.',
          'Plan your moves carefully to keep merging elements and <strong>prevent the grid from filling up</strong>.',
          'The game ends when <strong>you reach Neon (10)</strong> or when the grid is full and no more moves are possible.',
        ],
      },
      {
        id: 'open-source',
        heading: 'Open Source',
        text: [`<strong>Fusion Merge is fully open source</strong>—anyone can view, modify, and improve the code. Contributions are always welcome! Check out the project on <a href="https://github.com/agschnitzer/fusion-merge" target="_blank">GitHub</a>.`],
      },
      {
        id: 'credits',
        heading: 'Credits',
        text: [`Inspired by <a href="https://play2048.co" target="_blank">2048</a> by Gabriele Cirulli, <strong>Fusion Merge</strong> builds upon the original concept with a new theme. Thanks to Gabriele for the inspiration and for making such a fun game!`],
      },
      {
        id: 'feedback',
        heading: 'Feedback',
        text: [`If you have any questions, feedback, or suggestions, feel free to reach out to me. You can contact me through my <a href="https://alexgschnitzer.com" target="_blank">website</a> or check out my <a href="https://github.com/agschnitzer" target="_blank">GitHub profile</a> for more details and contributions!`],
      },
    ],
  }
}
