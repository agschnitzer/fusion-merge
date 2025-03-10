import { encode, loadGameState, loadScore, saveGameState, saveScore } from '$lib/core/storage'
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
  const SCORE_KEY = encode('fusion_merge_score')
  const BEST_SCORE_KEY = encode('fusion_merge_best_score')
  const STATE_KEY = encode('fusion_merge_state')

  let score = $state(0)
  let bestScore = $state(0)
  let state: Grid = Array.from({ length: size }, () => Array(size).fill(null))
  let emptyTiles: EmptyTiles = {}
  let gameOver = $state(false)

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
    state[y][x] = { value: Math.random() < 0.9 ? 1 : 2, x, y, merged: false }

    delete emptyTiles[key!]

    saveGameState(STATE_KEY, state)

    return state[y][x]
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
   * Updates the score and the best score.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {number} value The value to add to the score.
   */
  const updateScore = (value: number): void => {
    score += value
    bestScore = Math.max(score, bestScore)

    saveScore(SCORE_KEY, score)
    saveScore(BEST_SCORE_KEY, bestScore)
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
   * Initializes a new game or loads the state from local storage.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {boolean} loadState `true` to load the state from local storage, `false` to start a new game.
   * @returns {Tile[]} An array of tiles that were added to the grid. Empty if loading saved state.
   */
  const init = (loadState: boolean = true): Tile[] => {
    if (loadState) {
      const savedScore = loadScore(SCORE_KEY)
      const savedState = loadGameState(STATE_KEY)
      bestScore = loadScore(BEST_SCORE_KEY)

      if (savedScore && savedState) {
        score = savedScore
        state = savedState

        return savedState.flat().filter(Boolean) as Tile[]
      }
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        state[y][x] = null
        emptyTiles[`${ y }${ x }`] = { x, y }
      }
    }

    // Add two random tiles to start the game
    const tile1 = addRandomTile()
    const tile2 = addRandomTile()

    saveScore(SCORE_KEY, score)

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
    gameOver = false
    score = 0

    return init(false)
  }

  init(true)

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
          Object.assign(tile, { y: row, x: col, merged: false })

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

          if (!!targetTile && !targetTile.merged && tile.value === targetTile.value) {
            targetTile.value += 1
            updateScore(targetTile.value * targetTile.value)

            trackTileUpdate(newCol, newRow, targetCol, targetRow)
            state[targetRow][targetCol]!.merged = true

            moved = true
            continue
          }

          nextPosition += step
        }
      }

      if (!Object.keys(emptyTiles).length) gameOver = !hasPossibleMerges()

      if (!gameOver) saveGameState(STATE_KEY, state)

      return moved
    },
    addRandomTile,
    reset,
  }
}
