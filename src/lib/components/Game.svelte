<!-- @component Component that renders all the game components -->
<script lang="ts">
  import Controls from '$lib/components/Controls.svelte'
  import Score from '$lib/components/Score.svelte'
  import { createCanvas } from '$lib/core/canvas.svelte.js'
  import { createGrid } from '$lib/core/grid.svelte'
  import { createInputController } from '$lib/helpers/input'
  import type { CanvasState } from '$lib/types/canvas.type'

  let { width = 450, size = 4 } = $props()

  const state = createGrid(size)
  const { updatePointerStartPosition, throttlePointerEvent, getMoveDirection } = createInputController()
  let canvas: CanvasState, element: HTMLCanvasElement

  /**
   * Initializes the game by creating a grid and setting up the canvas.
   * @since 1.0.0
   * @version 1.0.0
   */
  const initializeGame = (): void => {
    state.initializeGrid()
    canvas = createCanvas(element, state.grid)
    canvas.adjustCanvasSize()
  }

  /**
   * Resets the game by clearing the grid and reinitializing it with new tiles.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @returns {Promise<void>} A promise that resolves when the game is reset.
   */
  const resetGame = async (): Promise<void> => {
    const tiles = state.resetGrid()
    state.saveGrid()

    await canvas.initializeWithTiles(tiles)
  }

  /**
   * Handles the movement of tiles in the game based on keyboard input.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {KeyboardEvent | PointerEvent} event The event triggered by the user input.
   * @returns {Promise<void>} A promise that resolves when the tile movement is completed.
   */
  const handleGameMovement = async (event: KeyboardEvent | PointerEvent): Promise<void> => {
    if (state.isGameOver || canvas.isAnimating) return

    const direction = getMoveDirection(event)

    // Return if the pressed key is not a valid direction or no tiles can be moved in that direction
    if (!direction || !state.moveTiles(direction)) return

    await canvas.animateGridMovement()

    const tile = state.addTile()
    await canvas.animateTileEntry(tile)

    state.saveGrid()
  }

  $effect(initializeGame)
</script>

<svelte:window onkeydown={handleGameMovement} onresize={() => canvas.adjustCanvasSize()}/>

<div class="w-fit mx-auto">
  <canvas bind:this={element} {width} height={width} style="--initialWidth: {width}px" onpointerdown={updatePointerStartPosition}
          onpointermove={(event) => throttlePointerEvent(event, handleGameMovement)}
          class="w-[var(--initialWidth)] aspect-square mb-4 bg-main rounded-xl touch-none"></canvas>
  <div class="flex flex-col xs:flex-row justify-between gap-4">
    <Score {...state} />
    <Controls onclick={resetGame}/>
  </div>
  {#if state.isGameOver}
    <p class="py-2 font-medium text-lg text-center">Game Over</p>
  {/if}
</div>
