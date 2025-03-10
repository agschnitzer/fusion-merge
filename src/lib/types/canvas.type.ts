import type { Tile } from '$lib/types/grid.type'

/**
 * Represents the state of the canvas.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface CanvasState
 * @property {() => Promise<void>} animateMove Animates the tiles on the canvas to their new positions.
 * @property {(tile: Tile | Tile[]) => Promise<void>} animateTile Animates the given tile(s) on the canvas.
 * @property {(tiles: Tile[]) => Promise<void>} reset Resets the canvas with the given tiles.
 */
export interface CanvasState {
  animateMove: () => Promise<void>
  animateTile: (tile: Tile | Tile[]) => Promise<void>
  reset: (tiles: Tile[]) => Promise<void>
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
 * @property {number} scaleFactor The scale factor for the tiles.
 * @property {string} backgroundColor The background colour of the canvas.
 * @property {string} emptyTileColor The background colour of empty tiles.
 * @property {string} emptyTileBorderColor The border colour of empty tiles.
 * @property {string} textColor The text colour of the tiles.
 * @property {string[]} atoms The list of atoms used in the game.
 * @property {string[]} atomColors The list of colours for the atoms.
 * @property {string[]} atomTextColors The list of text colours for the atoms.
 */
export interface CanvasOptions {
  gap: number
  borderRadius: number
  animationDuration: number
  scaleFactor: number
  backgroundColor: string
  emptyTileColor: string
  emptyTileBorderColor: string
  textColor: string
  atoms: string[]
  atomColors: string[]
  atomTextColors: string[]
}
