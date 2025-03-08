<script lang="ts">
  import { createCanvas } from '$lib/core/canvas.svelte.js'
  import { createGrid } from '$lib/core/grid.svelte'
  import type { CanvasState } from '$lib/types/canvas.type'
  import type { Direction } from '$lib/types/grid.type'

  let { width = 400, size = 4 } = $props()

  const state = createGrid(size)
  let canvas: CanvasState, element: HTMLCanvasElement

  /**
   * It determines which direction to move the tiles based on the key that is pressed. It updates the state and animates the canvas
   * if any tiles are moved. It then adds a new tile to the grid and draws it on the canvas.
   *
   * @summary Handles the keydown event.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {KeyboardEvent} event The keydown event.
   */
  const onkeydown = (event: KeyboardEvent): void => {
    if (state.gameOver || canvas.animating) return

    const directions: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    }
    const direction = directions[event.key]

    // Return if the pressed key is not a valid direction or no tiles can be moved in that direction
    if (!direction || !state.moveTiles(direction)) return

    requestAnimationFrame((time: number): void => canvas.animate(time, performance.now()))

    setTimeout(() => {
      state.addRandomTile()
      canvas.draw()
    }, canvas.animationDuration)
  }

  /**
   * Resets the game state and redraws the canvas.
   * @since 1.0.0
   * @version 1.0.0
   */
  const reset = (): void => {
    state.reset()
    canvas.draw()
  }

  $effect(() => {
    canvas = createCanvas(size, element, state.grid)
    canvas.draw()
  })
</script>

<svelte:window {onkeydown}/>

<div class="w-fit mx-auto py-10">
  <canvas bind:this={element} {width} height={width} class="mb-4 bg-slate-100 shadow-sm border border-slate-700 rounded-md"></canvas>
  <div class="flex justify-between items-stretch gap-4">
    <p class="px-3 flex items-center font-semibold text-2xl text-center text-slate-700 bg-slate-100 rounded-md">Score: {state.score}</p>
    <button onclick={reset} class="px-3 py-2 font-medium bg-slate-800 text-slate-50 rounded-md">New Game</button>
  </div>
</div>
