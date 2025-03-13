import { createCanvas } from '$lib/core/canvas.svelte'
import { createGrid } from '$lib/core/grid.svelte'
import { createInputController } from '$lib/helpers/input'
import type { CanvasState } from '$lib/types/canvas.type'
import type { Game, GameOptions } from '$lib/types/game.type'
import type { GridState } from '$lib/types/grid.type'
import type { InputController } from '$lib/types/input.type'

/**
 * Creates a new game instance with the specified grid size and canvas element.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @returns {Game} A game instance containing the grid state, canvas state, input controller, and game methods.
 */
export const createGame = (): Game => {
  const options: GameOptions = {
    initialWidth: 526,
    size: 4,
    canvasId: 'game-canvas',
  }

  const state = createGrid(options.size)
  const controller = createInputController()
  let canvas: CanvasState

  /**
   * Initializes the game by creating a grid and setting up the canvas.
   * @since 1.0.0
   * @version 1.0.0
   */
  const initializeGame = (): void => {
    state.initializeGrid()
    canvas = createCanvas(document.getElementById(options.canvasId) as HTMLCanvasElement, state.grid)
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
    if (state.isGameOver) return

    const direction = controller.getMoveDirection(event)

    // Return if the pressed key is not a valid direction or no tiles can be moved in that direction
    if (!direction || !state.moveTiles(direction)) return

    await canvas.animateGridMovement()

    const tile = state.addTile()
    await canvas.animateTileEntry(tile)

    state.saveGrid()
  }

  return {
    /**
     * Returns the initial width of the game.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {number} The initial width of the game.
     */
    get initialWidth(): number { return options.initialWidth },
    /**
     * Returns the ID of the canvas element.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {string} A string representing the ID of the canvas element.
     */
    get canvasId(): string { return options.canvasId },
    /**
     * Returns the grid state of the game.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {GridState} An object representing the current state of the grid.
     */
    get state(): GridState { return state },
    /**
     * Returns the canvas state of the game.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {CanvasState} An object representing the current state of the canvas.
     */
    get canvas(): CanvasState { return canvas },
    /**
     * Returns the input controller of the game.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {InputController} An object representing the input controller.
     */
    get input(): InputController { return controller },
    initializeGame,
    resetGame,
    handleGameMovement,
  }
}
