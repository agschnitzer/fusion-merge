<script lang="ts">
  import type { Game } from '$lib/types/game.type'
  import { getContext } from 'svelte'

  const game: Game = getContext('game')
</script>

<div role="alert" aria-atomic="true" aria-live="assertive" class="absolute inset-0 z-50 flex justify-center items-center bg-highlight">
  <div class="text-center">
    <h2 class="heading-1">{game.state.isGameOver ? 'Game Over' : 'Fusion Complete'}</h2>
    <p class="mb-4 heading-2">You scored {game.state.score ?? 0} points in {game.state.moveCount ?? 0} moves.</p>
    <button onclick={game.resetGame} class="py-2 bg-main text-default hover:bg-accent">Play again</button>
  </div>
</div>
