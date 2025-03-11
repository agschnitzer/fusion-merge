/**
 * Represents the state of a grid in a game, including methods to manipulate tiles.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface GridState
 */
export interface GridState extends GameState {
  /**
   * Adds a new tile to the grid.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @returns {Tile} The tile that was added.
   */
  addTile: () => Tile
  /**
   * Moves the tiles in the specified direction.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {Direction} direction The direction to move the tiles, e.g. `up`, `down`, `left`, or `right`.
   * @returns {boolean} `true` if any tiles were moved, `false` otherwise.
   */
  moveTiles: (direction: Direction) => boolean
  /**
   * Depending on the `reset` parameter, either resets the grid to its initial state or loads the saved state.
   *
   * @summary Initializes the grid with a specified number of tiles.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {boolean} [reset = false] `true` to reset the grid, `false` to load the saved state.
   * @returns {Tile[]} An array of tiles added to the grid.
   */
  initializeGrid: (reset?: boolean) => Tile[]
  /**
   * Resets the grid to its initial state with two random tiles.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @returns {Tile[]} An array of tiles added to the grid.
   */
  resetGrid: () => Tile[]
  /**
   * Saves the current state of the grid.
   * @since 1.0.0
   * @version 1.0.0
   */
  saveGrid: () => void
}

/**
 * Represents the state of the game, including the grid, score, and game over status.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface GameState
 */
export interface GameState {
  /** The grid of tiles. */
  grid: Grid
  /** The current score. */
  score: number
  /** The highest score achieved. */
  highScore: number
  /** `true` if the game is over, `false` otherwise. */
  isGameOver: boolean
  /** The number of moves made. */
  moveCount: number
}

/**
 * Represents the direction in which tiles can be moved.
 * @since 1.0.0
 * @version 1.0.0
 */
export type Direction = 'up' | 'down' | 'left' | 'right'

/**
 * Represents the grid as a two-dimensional array of tiles. Each tile can be either a `Tile` object or `null` if the tile is empty.
 * @since 1.0.0
 * @version 1.0.0
 */
export type Grid = (Tile | null)[][]

/**
 * Represents the empty tiles on the grid as a list of coordinates.
 * @since 1.0.0
 * @version 1.0.0
 */
export type EmptyTilePositions = Record<string, Pick<Tile, 'column' | 'row'>>

/**
 * Represents a tile on the grid.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface Tile
 */
export interface Tile {
  /** The value of the tile. */
  value: number
  /** The row index of the tile in the grid. */
  row: number
  /** The column index of the tile in the grid. */
  column: number
  /** `true` if the tile has been merged this turn, `false` otherwise. */
  mergedThisTurn: boolean
}
