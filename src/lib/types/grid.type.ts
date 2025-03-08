/**
 * Represents the state of the grid.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface GridState
 * @property {Grid} grid A grid of tiles.
 * @property {number} score The current score.
 * @property {boolean} gameOver Indicates if the game is over.
 * @property {(direction: Direction) => boolean} moveTiles Moves the tiles in the specified direction.
 * @property {() => void} addRandomTile Adds a tile on the grid at a random position.
 * @property {() => void} reset Resets the grid to its initial state.
 */
export interface GridState {
  grid: Grid
  score: number
  gameOver: boolean
  moveTiles: (direction: Direction) => boolean
  addRandomTile: () => void
  reset: () => void
}

/**
 * Represents the direction to move the tiles.
 * @since 1.0.0
 * @version 1.0.0
 */
export type Direction = 'up' | 'down' | 'left' | 'right'

/**
 * Represents a grid of tiles. Each tile is either a {@link Tile} or null when empty.
 * @since 1.0.0
 * @version 1.0.0
 */
export type Grid = (Tile | null)[][]

/**
 * Represents the empty tiles on the grid.
 * @since 1.0.0
 * @version 1.0.0
 */
export type EmptyTiles = Record<string, Omit<Tile, 'value'>>

/**
 * Represents a tile on the grid.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface Tile
 * @property {number} value The value of the tile.
 * @property {number} x The x coordinate of the tile.
 * @property {number} y The y coordinate of the tile.
 */
export interface Tile {
  value: number
  x: number
  y: number
}
