<script lang="ts">
  import '../app.css'
  import { page } from '$app/state'
  import { createGame } from '$lib/core/game.svelte'
  import { setContext } from 'svelte'

  let { children } = $props()

  const game = createGame()

  // Create a new game instance to use the resetGame method here
  setContext('game', game)

  /**
   * Convert a date string to a human-readable format.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {string} date The date string to convert.
   * @returns {string} A human-readable date string.
   */
  const dateToString = (date: string): string => new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
</script>

<svelte:head>
  <link rel="canonical" href={page.data.meta.url}>

  <title>{page.data.meta.title}</title>
  <meta property="og:title" content={page.data.meta.title}>
  <meta name="og:site_name" content={page.data.meta.title}>
  <meta property="twitter:title" content={page.data.meta.title}>

  <meta name="description" content={page.data.meta.description}>
  <meta property="og:description" content={page.data.meta.description}>
  <meta property="twitter:description" content={page.data.meta.description}>

  <meta property="og:locale" content="en_GB">
  <meta property="og:type" content="website">
  <meta property="og:url" content={page.data.meta.url}>
  <meta name="twitter:card" content="summary_large_image">

  <!-- TODO: Add image -->
</svelte:head>

<p class="sr-only">
  Published
  <time datetime={page.data.meta.publishedOn}>{dateToString(page.data.meta.publishedOn)}</time>
</p>
<p class="sr-only">
  Last updated:
  <time datetime={page.data.meta.updatedAt}>{dateToString(page.data.meta.updatedAt)}</time>
</p>

<div class="w-fit mx-auto px-6">
  <header class="min-h-12 2xs:mb-4 py-6 flex flex-wrap justify-between items-center 2xs:gap-x-4">
    <!-- Navigation for screen readers -->
    <nav class="sr-only" aria-label="Main Navigation">
      <ul>
        <li>
          <a href="/">Play Fusion Merge</a>
        </li>
        <li>
          <a href="/about/">About</a>
        </li>
      </ul>
    </nav>
    <h1 class="heading-1">Fusion Merge</h1>
    {#if page.url.pathname === '/'}
      <button onclick={game.resetGame}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" role="img" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
        <span class="sr-only">New Game</span>
      </button>
    {:else}
      <a href="/" class="heading-3">Back to game</a>
    {/if}
  </header>
  <main class="max-w-2xl">{@render children()}</main>
  <footer class="py-4 flex flex-wrap justify-between items-center 2xs:gap-x-4">
    {#if page.url.pathname === '/'}
      <a href="/about/" class="heading-3">About the game</a>
    {/if}
    <p class="text-xs text-text font-sans">&copy; {new Date().getFullYear()} Alex Gschnitzer</p>
  </footer>
</div>
