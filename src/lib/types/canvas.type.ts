import type { Tile } from '$lib/types/grid.type'

/**
 * Represents the state of the canvas.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface CanvasState
 * @property {boolean} animating Indicates if the canvas is animating.
 * @property {() => Promise<void>} animateMove Animates the tiles on the canvas to their new positions.
 * @property {(tile: Tile) => Promise<void>} animateTile Animates a single tile on the canvas.
 * @property {(tiles: Tile[]) => void} reset Resets the canvas with the given tiles.
 */
export interface CanvasState {
  animating: boolean
  animateMove: () => Promise<void>
  animateTile: (tile: Tile) => Promise<void>
  reset: (tiles: Tile[]) => void
}

/**
 * Represents the options for the canvas.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface CanvasOptions
 * @property {number} gap The gap between tiles.
 * @property {number} borderRadius The border radius of the tiles.
 * @property {number} animationDuration The duration of the animation in milliseconds.
 * @property {string} backgroundColor The background colour of the canvas.
 * @property {string} emptyTileColor The background colour of empty tiles.
 * @property {string} textColor The text colour of the tiles.
 */
export interface CanvasOptions {
  gap: number
  borderRadius: number
  animationDuration: number
  backgroundColor: string
  emptyTileColor: string
  textColor: string
}
