<script lang="ts">
  const sections: Array<{ heading: string, content: string | string[] }> = [
    {
      heading: 'How to Play',
      content: [
        'Swipe <strong>up, down, left, or right</strong> to slide all tiles in that direction.',
        'When two tiles with the same element collide, they <strong>fuse into a heavier element</strong>.',
        'After each move, a <strong>new element (Hydrogen or Helium)</strong> appears on the board.',
        'Plan your moves carefully to keep merging elements and <strong>prevent the grid from filling up</strong>.',
        'The game ends when <strong>you reach Neon (atomic number 10)</strong> or when the grid is full and no more moves are possible.',
      ],
    },
    {
      heading: 'Open Source',
      content: `<strong>Fusion Merge is fully open source</strong>—anyone can view, modify, and improve the code. Contributions are always welcome! Check out the project on <a href="https://github.com/agschnitzer/fusion-merge" target="_blank">GitHub</a>.`,
    },
    {
      heading: 'Credits',
      content: `<p>Inspired by <a href="https://play2048.co" target="_blank">2048</a> by Gabriele Cirulli, <strong>Fusion Merge</strong> builds upon the original concept with a new theme. Thanks to Gabriele for the inspiration and for making such a fun game!</p>`,
    },
    {
      heading: 'Feedback',
      content: `If you have any questions, feedback, or suggestions, feel free to reach out to me. You can contact me through my <a href="https://alexgschnitzer.com" target="_blank">website</a> or check out my <a href="https://github.com/agschnitzer" target="_blank">GitHub profile</a> for more details and contributions!`,
    },
  ]
</script>

<article aria-labelledby="about-heading" class="space-y-6 font-sans">
  <header class="mb-4">
    <h2 id="about-heading" class="text-2xl font-display tracking-tight">About Fusion Merge</h2>
  </header>
  <div class="space-y-4">
    <p>
      <strong>Fusion Merge</strong> is an open-source puzzle game inspired by the classic
      <a href="https://play2048.co" target="_blank">2048</a>. Instead of merging numbers, you combine atomic
      elements to create heavier ones, adding a <strong>scientific twist</strong> to the familiar sliding-tile gameplay.
    </p>

    <p>
      I created this game as a fun side project to learn more about canvas rendering and game development. As a fan of 2048, I
      wanted to create something similar but with a new twist. The game is built using SvelteKit and TypeScript.
    </p>
  </div>

  {#each sections as { heading, content } (`section-${heading}`)}
    <section class="space-y-4">
      <header>
        <h3 class="text-xl font-display tracking-tight">{heading}</h3>
      </header>
      {#if typeof content === 'string'}
        <p>{@html content}</p>
      {:else}
        <ul class="list-disc pl-5 space-y-2">
          {#each content as item}
            <li>{@html item}</li>
          {/each}
        </ul>
      {/if}
    </section>
  {/each}
</article>
