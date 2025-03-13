<script lang="ts">
  import type { Game } from '$lib/types/game.type'
  import { getContext } from 'svelte'

  const game: Game = getContext('game')
  $effect(() => {
    document.fonts.ready.then(game.initializeGame)
  })
</script>

<svelte:window onkeydown={game.handleGameMovement} onresize={game.canvas.adjustCanvasSize}/>

<div class="mb-2 flex flex-wrap justify-between gap-2 text-2xl uppercase">
  <p class="score-card border-text bg-highlight">
    Score<span class="sr-only">:</span>
    <span>{game?.state.score}</span>
  </p>
  <p class="score-card">
    Best<span class="sr-only">score:</span>
    <span>{game?.state.highScore}</span>
  </p>
</div>
<div class="relative isolate rounded-xl overflow-hidden">
  <canvas id={game.canvasId} width={game.initialWidth} height={game.initialWidth} onpointerdown={game.input.updatePointerStartPosition}
          onpointermove={(event) => game.input.throttlePointerEvent(event, game.handleGameMovement)}
          onpointerup={game.input.resetSwipeState} class="aspect-square bg-main touch-none"></canvas>
  {#if game?.state.isGameOver}
    <div role="alert" aria-atomic="true" aria-live="assertive" class="absolute inset-0 z-50 flex justify-center items-center bg-highlight">
      <div class="text-center">
        <h2 class="heading-1">Game Over</h2>
        <p class="mb-4 heading-2">You scored {game.state.score} points in {game.state.moveCount} moves.</p>
        <button onclick={game.resetGame} class="py-2 bg-main text-default">Play again</button>
      </div>
    </div>
  {/if}
</div>

