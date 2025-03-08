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
  let state: Grid = Array.from({ length: size }, () => Array(size).fill(null))
  let emptyTiles: EmptyTiles = {}
  let score = $state(0)
  let gameOver = $state(false)

  /**
   * Adds a tile on the grid at a random position.
   * @since 1.0.0
   * @version 1.0.0
   */
  const addRandomTile = (): void => {
    let key: string | null = null
    let count = 0

    for (const tile in emptyTiles) {
      if (Math.random() < 1 / ++count) key = tile
    }

    if (!key) return

    const { x, y } = emptyTiles[key]
    state[y][x] = { value: Math.random() < 0.9 ? 1 : 2, x, y }

    delete emptyTiles[key]
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
    state[oldY][oldX] = null

    emptyTiles[`${ oldY }${ oldX }`] = { x: oldX, y: oldY }
    delete emptyTiles[`${ newY }${ newX }`]

    return state[newY][newX]!
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
    for (let y = 0; y < state.length; y++) {
      for (let x = 0; x < state.length; x++) {
        // Check if any neighbouring tiles can be merged
        if ((x < state.length - 1 && state[y][x] && state[y][x + 1] && state[y][x]?.value === state[y][x + 1]?.value) ||
            (y < state.length - 1 && state[y][x] && state[y + 1][x] && state[y][x]?.value === state[y + 1][x]?.value)) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Resets the grid to its initial state.
   * @since 1.0.0
   * @version 1.0.0
   */
  const reset = (): void => {
    gameOver = false
    score = 0

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        state[y][x] = null
        emptyTiles[`${ y }${ x }`] = { x, y }
      }
    }

    // Add two random tiles to start the game
    addRandomTile()
    addRandomTile()
  }

  reset()

  return {
    /**
     * Returns the grid.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {Grid} A two-dimensional array representing the grid.
     */
    get grid(): Grid { return state },
    /**
     * Sets the grid to a new state.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @param {Grid} grid The new grid state.
     */
    set grid(grid: Grid) {state = grid },
    /**
     * Returns the current score.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {number} The current score.
     */
    get score(): number { return score },
    /**
     * Returns the game over state.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {boolean} `true` if the game is over, `false` otherwise.
     */
    get gameOver(): boolean { return gameOver },
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

      const start = isReverse ? state.length - 1 : 0
      const end = isReverse ? 0 : state.length
      const step = isReverse ? -1 : 1

      emptyTiles = {}
      for (let i = 0; i < state.length; i++) {
        let nextPosition = start
        let lastMergedTile: Tile | null = null

        // Iterate over the row or column based on the direction of the move
        for (let j = start; isReverse ? j >= end : j < end; j += step) {
          const row = isHorizontal ? i : j
          const col = isHorizontal ? j : i

          const tile = state[row][col]

          // Skip empty tiles
          if (!tile) {
            emptyTiles[`${ row }${ col }`] = { x: col, y: row }
            continue
          }

          // Save the tile position for animation
          Object.assign(tile, { y: row, x: col })

          const [newRow, newCol] = mapPositionByDirection(isHorizontal, i, nextPosition)
          const [targetRow, targetCol] = mapPositionByDirection(isHorizontal, i, nextPosition - step)

          const targetTile = targetRow >= 0 && targetCol >= 0 && targetRow < state.length && targetCol < state.length ?
              state[targetRow][targetCol] : null

          // Move the tile to the new position
          if (nextPosition !== j) {
            state[newRow][newCol] = tile
            trackTileUpdate(col, row, newCol, newRow)
            moved = true
          }

          if (!!targetTile && lastMergedTile !== targetTile && tile.value === targetTile.value) {
            targetTile.value += 1
            score += targetTile.value * targetTile.value

            lastMergedTile = trackTileUpdate(newCol, newRow, targetCol, targetRow)
            moved = true
            continue
          }

          nextPosition += step
        }
      }

      if (!Object.keys(emptyTiles).length) gameOver = !hasPossibleMerges()

      return moved
    },
    addRandomTile,
    reset,
  }
}
