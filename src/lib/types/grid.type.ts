/**
 * Represents a grid of tiles. Each tile is either a {@link Tile} or null when empty.
 * @since 1.0.0
 * @version 1.0.0
 */
export type Grid = (Tile | null)[][]

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
