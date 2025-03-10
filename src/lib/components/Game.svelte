<!-- @component Component that renders all the game components -->
<script lang="ts">
  import Controls from '$lib/components/Controls.svelte'
  import Score from '$lib/components/Score.svelte'
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
  const handleKeyPress = async (event: KeyboardEvent): Promise<void> => {
    if (state.gameOver) return

    const directions: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    }
    const direction = directions[event.key]

    // Return if the pressed key is not a valid direction or no tiles can be moved in that direction
    if (!direction || !state.moveTiles(direction)) return

    await canvas.animateMove()

    const tile = state.addRandomTile()
    await canvas.animateTile(tile)
  }

  /**
   * Resets the game state and redraws the canvas.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @returns {Promise<void>} A promise that resolves when the reset is complete.
   */
  const reset = async (): Promise<void> => {
    const tiles = state.reset()
    await canvas.reset(tiles)
  }

  $effect(() => {
    canvas = createCanvas(element, state.grid)
  })
</script>

<svelte:window onkeydown={handleKeyPress}/>

<div class="w-fit mx-auto py-10">
  <canvas bind:this={element} {width} height={width} style="--width: {width}px" class="w-[var(--width)] aspect-square mb-4 shadow rounded-xl"></canvas>
  <div class="flex justify-between items-stretch gap-4">
    <Score score={state.score}/>
    <Controls {reset}/>
  </div>
  {#if state.gameOver}
    <p class="py-2 font-medium text-lg text-center">Game Over</p>
  {/if}
</div>
