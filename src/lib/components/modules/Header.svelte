<script lang="ts">
  import { page } from '$app/state'
  import type { Game } from '$lib/types/game.type'
  import { getContext } from 'svelte'

  const game: Game = getContext('game')
</script>

<header class="min-h-12 2xs:mb-4 py-6 flex flex-wrap justify-between items-center 2xs:gap-x-4">
  <!-- Navigation for screen readers -->
  <nav class="sr-only" aria-label="Main Navigation">
    <ul>
      <li>
        <a href="/">Play Fusion Merge</a>
      </li>
      <li>
        <a href="/about/">About the game</a>
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
