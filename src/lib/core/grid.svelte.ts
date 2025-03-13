import { encode, loadGameState, saveGameState } from '$lib/helpers/storage'
import type { Direction, EmptyTilePositions, Grid, GridState, Tile } from '$lib/types/grid.type'

/**
 * Creates a new grid with the specified size.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {number} size The size of the grid.
 * @returns {GridState} An object representing the grid of tiles, score, high score, game over status, and move count.
 */
export const createGrid = (size: number): GridState => {
  const saveKey = encode('fusion_merge_state')

  let score = $state(0)
  let highScore = $state(0)
  let isGameOver = $state(false)
  let isGameWon = $state(false)
  let moveCount = $state(0)

  let grid: Grid = Array.from({ length: size }, () => Array(size).fill(null))
  let emptyTilePositions: EmptyTilePositions = {}

  /**
   * Updates the positions of the tiles in the grid.
   * @since 1.0.0
   * @version 1.0.0
   * @private
   *
   * @param {number} fromRow The row of the tile being moved.
   * @param {number} fromCol The column of the tile being moved.
   * @param {number} toRow The row of the tile being moved to.
   * @param {number} toCol The column of the tile being moved to.
   * @returns {boolean} `true` indicating that the tile was moved.
   */
  const updateTilePositions = (fromRow: number, fromCol: number, toRow: number, toCol: number): true => {
    grid[fromRow][fromCol] = null

    emptyTilePositions[`${ fromRow }${ fromCol }`] = { row: fromRow, column: fromCol }
    delete emptyTilePositions[`${ toRow }${ toCol }`]

    return true
  }

  /**
   * Maps the position of a tile based on the direction of movement.
   * @since 1.0.0
   * @version 1.0.0
   * @private
   *
   * @param {boolean} isHorizontal `true` if the movement is horizontal, `false` if vertical.
   * @param {number} fixedAxis The fixed axis (row or column).
   * @param {number} variableAxis The variable axis (column or row).
   * @returns {[row: number, column: number]} A tuple representing the mapped coordinates.
   */
  const mapPositionByDirection = (isHorizontal: boolean, fixedAxis: number, variableAxis: number): [row: number, column: number] =>
      isHorizontal ? [fixedAxis, variableAxis] : [variableAxis, fixedAxis]

  /**
   * Adds a new tile to the grid.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @returns {Tile} The tile that was added.
   */
  const addTile = (): Tile => {
    const emptyPositions = Object.keys(emptyTilePositions)
    const key = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]

    const { column, row } = emptyTilePositions[key]
    delete emptyTilePositions[key]

    const tile: Tile = {
      value: Math.random() < 0.9 ? 1 : 2,
      row,
      column,
      mergedThisTurn: false,
    }

    grid[row][column] = tile
    return tile
  }

  /**
   * Moves the tiles in the specified direction.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {Direction} direction The direction to move the tiles, e.g. `up`, `down`, `left`, or `right`.
   * @returns {boolean} `true` if any tiles were moved, `false` otherwise.
   */
  const moveTiles = (direction: Direction): boolean => {
    let hasMoved = false
    const iterateReversed = direction === 'down' || direction === 'right'
    const iterateHorizontally = direction === 'left' || direction === 'right'
    const iterationStep = iterateReversed ? -1 : 1

    emptyTilePositions = {}
    for (let i = 0; i < size; i++) {
      let nextPosition = iterateReversed ? size - 1 : 0

      for (let j = nextPosition; iterateReversed ? j >= 0 : j < size; j += iterationStep) {
        const row = iterateHorizontally ? i : j
        const column = iterateHorizontally ? j : i
        const tile = grid[row][column]

        if (!tile) {
          emptyTilePositions[`${ row }${ column }`] = { row, column }
          continue
        }

        // Assign the original position to correctly animate the movement
        Object.assign(tile, { row, column, mergedThisTurn: false } as Tile)

        const [moveToRow, moveToCol] = mapPositionByDirection(iterateHorizontally, i, nextPosition)
        const [mergeCheckRow, mergeCheckCol] = mapPositionByDirection(iterateHorizontally, i, nextPosition - iterationStep)
        const adjacentTile = grid[mergeCheckRow]?.[mergeCheckCol] ?? null

        if (j !== nextPosition) {
          grid[moveToRow][moveToCol] = tile
          hasMoved = updateTilePositions(row, column, moveToRow, moveToCol)
        }

        // Skip incrementing the next position if the tile is merged
        if (adjacentTile?.value === tile.value && !adjacentTile.mergedThisTurn) {
          adjacentTile.value += 1

          score += Math.pow(2, adjacentTile.value)
          highScore = Math.max(score, highScore)

          isGameWon = adjacentTile.value === 10
          hasMoved = updateTilePositions(moveToRow, moveToCol, mergeCheckRow, mergeCheckCol)
          grid[mergeCheckRow][mergeCheckCol]!.mergedThisTurn = true

          continue
        }

        nextPosition += iterationStep
      }
    }

    if (!isGameWon) checkGameOver()

    moveCount += Number(hasMoved)
    return hasMoved
  }

  /**
   * Checks if the game is over by verifying if no moves are possible.
   * @since 1.0.0
   * @version 1.0.0
   */
  const checkGameOver = (): void => {
    // Check if the game is over when there are no empty tiles left
    if (!Object.keys(emptyTilePositions).length) {
      isGameOver = true

      for (let row = 0; row < size; row++) {
        for (let column = 0; column < size; column++) {
          const tile = grid[row][column]
          const boundary = size - 1

          // Check if the tile can be merged with its right or bottom neighbour
          if (tile && ((column < boundary && grid[row][column + 1]?.value === tile.value) ||
              (row < boundary && grid[row + 1][column]?.value === tile.value))) {
            isGameOver = false
            break
          }
        }

        if (!isGameOver) break
      }
    }
  }

  /**
   * Initializes the grid with a specified number of tiles.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {boolean} [reset = false] `true` to reset the grid, `false` to load the saved state.
   * @returns {Tile[]} An array of tiles added to the grid.
   */
  const initializeGrid = (reset: boolean = false): Tile[] => {
    // Load the saved game state
    if (!reset) {
      const gameState = loadGameState(saveKey)

      if (gameState) {
        ({ grid, score, highScore, isGameOver, isGameWon, moveCount } = gameState)
        return []
      }
    }

    emptyTilePositions = {}
    for (let row = 0; row < size; row++) {
      for (let column = 0; column < size; column++) {
        grid[row][column] = null
        emptyTilePositions[`${ row }${ column }`] = { row, column }
      }
    }

    return Array.from({ length: 2 }, addTile)
  }

  /**
   * Resets the grid to its initial state with two random tiles.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @returns {Tile[]} An array of tiles added to the grid.
   */
  const resetGrid = (): Tile[] => {
    score = 0
    moveCount = 0
    isGameOver = false
    isGameWon = false

    return initializeGrid(true)
  }

  /**
   * Saves the current state of the grid.
   * @since 1.0.0
   * @version 1.0.0
   */
  const saveGrid = (): void => saveGameState(saveKey, { grid, score, highScore, isGameOver, isGameWon, moveCount })

  return {
    /**
     * Returns the grid of tiles.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {Grid} A two-dimensional array of tiles.
     */
    get grid(): Grid { return grid },
    /**
     * Sets the grid of tiles.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @param {Grid} _grid The new grid of tiles.
     */
    set grid(_grid: Grid) {grid = _grid },
    /**
     * Returns the current score.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {number} A number representing the current score.
     */
    get score(): number { return score },
    /**
     * Returns the highest score achieved.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {number} A number representing the highest score.
     */
    get highScore(): number { return highScore },
    /**
     * Returns the game over status.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {boolean} `true` if the game is over, `false` otherwise.
     */
    get isGameOver(): boolean { return isGameOver },
    /**
     * Returns the game won status.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {boolean} `true` if the game is won, `false` otherwise.
     */
    get isGameWon(): boolean { return isGameWon },
    /**
     * Returns the number of moves made.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {number} A number representing the number of moves made.
     */
    get moveCount(): number { return moveCount },
    addTile,
    moveTiles,
    checkGameOver,
    initializeGrid,
    resetGrid,
    saveGrid,
  }
}
