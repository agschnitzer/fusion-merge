import { encode, loadGameState, saveGameState } from '$lib/core/storage'
import type { Direction, EmptyTiles, Grid, GridState, Tile } from '$lib/types/grid.type'

/**
 * Creates a new grid with the specified size.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {number} size The size of the grid.
 * @returns {GridState} An object representing the grid state.
 */
export const createGrid = (size: number): GridState => {
  const SAVE_KEY = encode('fusion_merge_state')

  let score = $state(0)
  let bestScore = $state(0)
  let gameOver = $state(false)
  let moves = $state(0)

  let grid: Grid = Array.from({ length: size }, () => Array(size).fill(null))
  let emptyTiles: EmptyTiles = {}


  /**
   * Adds a tile on the grid at a random position.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @returns {Tile} The tile that was added.
   */
  const addRandomTile = (): Tile => {
    let key: string | null = null
    let count = 0

    for (const tile in emptyTiles) {
      if (Math.random() < 1 / ++count) key = tile
    }

    const { x, y } = emptyTiles[key!]
    grid[y][x] = { value: Math.random() < 0.9 ? 1 : 2, x, y, merged: false }

    delete emptyTiles[key!]

    return grid[y][x]
  }

  /**
   * Tracks the tile update by keeping the grid and empty tiles in sync.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {number} oldX The x coordinate of the empty tile.
   * @param {number} oldY The y coordinate of the empty tile.
   * @param {number} newX The x coordinate of the tile that was moved or merged.
   * @param {number} newY The y coordinate of the tile that was moved or merged.
   * @returns {Tile} The tile that was moved or merged.
   */
  const trackTileUpdate = (oldX: number, oldY: number, newX: number, newY: number): Tile => {
    grid[oldY][oldX] = null

    emptyTiles[`${ oldY }${ oldX }`] = { x: oldX, y: oldY }
    delete emptyTiles[`${ newY }${ newX }`]

    return grid[newY][newX]!
  }

  /**
   * Maps coordinates based on the movement direction.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {boolean} isHorizontal `true` if the movement is horizontal, `false` otherwise.
   * @param {number} fixedAxis The fixed coordinate (row for horizontal, column for vertical).
   * @param {number} variableAxis The changing coordinate (column for horizontal, row for vertical).
   * @returns {[number, number]} A tuple containing the new coordinates.
   */
  const mapPositionByDirection = (isHorizontal: boolean, fixedAxis: number, variableAxis: number): [number, number] =>
      isHorizontal ? [fixedAxis, variableAxis] : [variableAxis, fixedAxis]

  /**
   * Checks if any tiles can be merged.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @returns {boolean} `true` if any tiles can be merged, `false` otherwise.
   */
  const hasPossibleMerges = (): boolean => {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid.length; x++) {
        // Check if any neighbouring tiles can be merged
        if ((x < grid.length - 1 && grid[y][x] && grid[y][x + 1] && grid[y][x]?.value === grid[y][x + 1]?.value) ||
            (y < grid.length - 1 && grid[y][x] && grid[y + 1][x] && grid[y][x]?.value === grid[y + 1][x]?.value)) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Saves the game state to local storage.
   * @since 1.0.0
   * @version 1.0.0
   */
  const save = (): void => saveGameState(SAVE_KEY, { score, bestScore, gameOver, moves, grid })

  /**
   * Initializes a new game or loads the state from local storage.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {boolean} reset `true` to reset the game, `false` to load the saved state.
   * @returns {Tile[]} An array of tiles that were added to the grid. Empty if loading saved state.
   */
  const init = (reset: boolean = false): Tile[] => {
    if (!reset) {
      const savedState = loadGameState(SAVE_KEY)

      if (savedState) {
        score = savedState.score
        gameOver = savedState.gameOver
        moves = savedState.moves
        grid = savedState.grid
        bestScore = savedState.bestScore

        return []
      }
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        grid[y][x] = null
        emptyTiles[`${ y }${ x }`] = { x, y }
      }
    }

    // Add two random tiles to start the game
    const tile1 = addRandomTile()
    const tile2 = addRandomTile()

    save()

    return [tile1, tile2]
  }

  /**
   * Resets the grid to its initial state.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @returns {Tile[]} An array of two tiles that were added to the grid.
   */
  const reset = (): Tile[] => {
    score = 0
    moves = 0
    gameOver = false

    return init(true)
  }

  return {
    /**
     * Returns the grid.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {Grid} A two-dimensional array representing the grid.
     */
    get grid(): Grid { return grid },
    /**
     * Sets the grid to a new state.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @param {Grid} newGrid The new grid state.
     */
    set grid(newGrid: Grid) {grid = newGrid },
    /**
     * Returns the current score.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {number} The current score.
     */
    get score(): number { return score },
    /**
     * Returns the best score.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {number} The best score.
     */
    get bestScore(): number { return bestScore },
    /**
     * Returns the game over state.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {boolean} `true` if the game is over, `false` otherwise.
     */
    get gameOver(): boolean { return gameOver },
    /**
     * Returns the number of moves made.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {number} The number of moves made.
     */
    get moves(): number { return moves },
    /**
     * Moves the tiles in the specified direction.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @param {Direction} direction The direction to move the tiles.
     * @returns {boolean} `true` if any tiles were moved, `false` otherwise.
     */
    moveTiles: (direction: Direction): boolean => {
      let moved = false

      const isReverse = direction === 'down' || direction === 'right'
      const isHorizontal = direction === 'left' || direction === 'right'

      const start = isReverse ? size - 1 : 0
      const end = isReverse ? 0 : size
      const step = isReverse ? -1 : 1

      emptyTiles = {}
      for (let i = 0; i < size; i++) {
        let nextPosition = start

        // Iterate over the row or column based on the direction of the move
        for (let j = start; isReverse ? j >= end : j < end; j += step) {
          const row = isHorizontal ? i : j
          const col = isHorizontal ? j : i

          const tile = grid[row][col]

          // Skip empty tiles
          if (!tile) {
            emptyTiles[`${ row }${ col }`] = { x: col, y: row }
            continue
          }

          // Save the tile position for animation
          Object.assign(tile, { y: row, x: col, merged: false })

          const [newRow, newCol] = mapPositionByDirection(isHorizontal, i, nextPosition)
          const [targetRow, targetCol] = mapPositionByDirection(isHorizontal, i, nextPosition - step)

          const targetTile = targetRow >= 0 && targetCol >= 0 && targetRow < size && targetCol < size ?
              grid[targetRow][targetCol] : null

          // Move the tile to the new position
          if (nextPosition !== j) {
            grid[newRow][newCol] = tile
            trackTileUpdate(col, row, newCol, newRow)
            moved = true
          }

          if (!!targetTile && !targetTile.merged && tile.value === targetTile.value) {
            targetTile.value += 1

            score += targetTile.value * targetTile.value
            bestScore = Math.max(score, bestScore)

            trackTileUpdate(newCol, newRow, targetCol, targetRow)
            grid[targetRow][targetCol]!.merged = true

            moved = true
            continue
          }

          nextPosition += step
        }
      }

      if (!Object.keys(emptyTiles).length) gameOver = !hasPossibleMerges()

      if (moved) moves++

      return moved
    },
    addRandomTile,
    init,
    reset,
    save,
  }
}
