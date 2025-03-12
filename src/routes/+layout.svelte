<script lang="ts">
  import '../app.css'
  import { page } from '$app/state'
  import { createGame } from '$lib/core/game.svelte'
  import { setContext } from 'svelte'

  let { children } = $props()

  const game = createGame()

  // Create a new game instance to use the resetGame method here
  setContext('game', game)
</script>

<div class="w-fit mx-auto px-6">
  <header class="min-h-12 2xs:mb-4 py-6 flex flex-wrap justify-between items-center 2xs:gap-x-4">
    <!-- Navigation for screen readers -->
    <nav class="sr-only" aria-label="Main Navigation">
      <ul class="flex gap-4">
        <li>
          <a href="/">Play Fusion Merge</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
      </ul>
    </nav>
    <h1 class="text-5xl leading-none tracking-tight">Fusion Merge</h1>
    {#if page.url.pathname === '/'}
      <button onclick={game.resetGame} class="p-3 text-2xl rounded-lg cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round" role="img" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
        <span class="sr-only">New Game</span>
      </button>
    {:else}
      <a href="/" class="text-xl">Back to game</a>
    {/if}
  </header>
  <main class="max-w-2xl">{@render children()}</main>
  <footer class="py-6 flex flex-wrap justify-between items-center 2xs:gap-x-4">
    {#if page.url.pathname === '/'}
      <a href="/about" class="text-xl">About the game</a>
    {/if}
    <p class="text-xs text-text font-sans">&copy; {new Date().getFullYear()} Alex Gschnitzer</p>
  </footer>
</div>
