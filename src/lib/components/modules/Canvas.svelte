<script lang="ts">
  import GameOver from '$lib/components/elements/GameOver.svelte'
  import type { Game } from '$lib/types/game.type'
  import { getContext } from 'svelte'

  const game: Game = getContext('game')
</script>

<div class="relative isolate rounded-xl overflow-hidden">
  <canvas id={game.canvasId} width={game.initialWidth} height={game.initialWidth} onpointerdown={game.input.updatePointerStartPosition}
          onpointermove={(event) => game.input.throttlePointerEvent(event, game.handleGameMovement)}
          onpointerup={game.input.resetSwipeState} class="aspect-square bg-main touch-none"></canvas>
  {#if game?.state.isGameOver || game?.state.isGameWon}
    <GameOver/>
  {/if}
</div>
