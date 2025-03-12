import type { CanvasState } from '$lib/types/canvas.type'
import type { GridState } from '$lib/types/grid.type'
import type { InputController } from '$lib/types/input.type'

/**
 * Represents the game state and its properties.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface Game
 */
export interface Game extends Pick<GameOptions, 'initialWidth' | 'canvasId'> {
  /** The grid state of the game. */
  state: GridState
  /** The canvas state of the game. */
  canvas: CanvasState
  /** The input controller for handling user input. */
  input: InputController
  /**
   * Initializes the game by creating a grid and setting up the canvas.
   * @since 1.0.0
   * @version 1.0.0
   */
  initializeGame: () => void
  /**
   * Resets the game by clearing the grid and reinitializing it with new tiles.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @returns {Promise<void>} A promise that resolves when the game is reset.
   */
  resetGame: () => Promise<void>
  /**
   * Handles the movement of tiles in the game based on keyboard input.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {KeyboardEvent | PointerEvent} event The event triggered by the user input.
   * @returns {Promise<void>} A promise that resolves when the tile movement is completed.
   */
  handleGameMovement: (event: KeyboardEvent | PointerEvent) => Promise<void>
}

/**
 * Represents the options for creating a game instance.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface GameOptions
 */
export interface GameOptions {
  /** The initial width of the canvas. */
  initialWidth: number
  /** The size of the grid. */
  size: number
  /** The ID of the canvas element. */
  canvasId: string
}
