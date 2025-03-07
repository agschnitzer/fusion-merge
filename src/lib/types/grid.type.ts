/**
 * Represents the state of the grid.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface GridState
 * @property {Grid} grid The grid.
 * @property {Record<string, Omit<Tile, 'value'>>} emptyTiles The empty tiles.
 * @property {boolean} moved Whether any tiles have moves since the last update.
 * @property {(direction: 'up' | 'down' | 'left' | 'right') => void} update Updates the grid.
 * @property {() => void} addTile Adds a new tile to the grid.
 */
export interface GridState {
  grid: Grid
  emptyTiles: Record<string, Omit<Tile, 'value'>>
  moved: boolean
  update: (direction: 'up' | 'down' | 'left' | 'right') => void
  addTile: () => void
}

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
