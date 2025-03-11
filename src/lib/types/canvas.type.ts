import type { Tile } from '$lib/types/grid.type'

/**
 * Represents a canvas state for a game.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface CanvasState
 */
export interface CanvasState {
  /**
   * Animates the entry of a tile or tiles into the canvas.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {Tile | Tile[]} tile The tile or tiles to animate.
   * @returns {Promise<void>} A promise that resolves when the animation is complete.
   */
  animateTileEntry: (tile: Tile | Tile[]) => Promise<void>
  /**
   * Animates the movement of the grid.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @returns {Promise<void>} A promise that resolves when the animation is complete.
   */
  animateGridMovement: () => Promise<void>
  /**
   * Initializes the canvas with the given tiles.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {Tile[]} tiles The tiles to draw on the canvas.
   */
  initializeWithTiles: (tiles: Tile[]) => Promise<void>
  /**
   * Adjusts the canvas size based on the current window size.
   * @since 1.0.0
   * @version 1.0.0
   */
  adjustCanvasSize: () => void
}

/**
 * Represents options for a canvas state.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface CanvasOptions
 */
export interface CanvasOptions {
  /** The width of the canvas in pixels. */
  canvasWidth: number
  /** The duration of the animation in milliseconds. */
  animationDuration: number
  /** The scale factor for the pulse animation. */
  pulseScaleFactor: number
  /** The number of tiles in the grid. */
  gridSize: number
  /** The size of each tile in pixels. */
  tileSize: number
  /** The gap between tiles in pixels. */
  tileGap: number
  /** The border radius of tiles in pixels. */
  tileBorderRadius: number
  /** The colour of the grid background. */
  backgroundColor: string
  /** The background colour of empty tiles. */
  emptyTileBackgroundColor: string
  /** The border colour of empty tiles. */
  emptyTileBorderColor: string
  /** The text colour of tiles. */
  defaultTextColor: string
  /** Array of atom symbols. */
  atomSymbols: string[]
  /** Array of atom background colours. */
  atomTileBackgroundColors: string[]
  /** Array of atom text colours. */
  atomTextColors: string[]
}
