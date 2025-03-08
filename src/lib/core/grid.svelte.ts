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
  const state: Grid = Array.from({ length: size }, () => Array.from({ length: size }, () => null))
  const emptyTiles: EmptyTiles = state
      .flatMap((row, y) => row.map((_, x) => ({ [`${ y }${ x }`]: { x, y } })))
      .reduce((object, tile) => ({ ...object, ...tile }), {})

  let score = $state(0)

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

    // Game over
    if (!key) return

    const { x, y } = emptyTiles[key]
    state[y][x] = { value: Math.random() < 0.9 ? 2 : 4, x, y }
    score += state[y][x].value

    delete emptyTiles[`${ y }${ x }`]
  }

  // Initialize the grid with two random tiles
  addRandomTile()
  addRandomTile()

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
     * Returns the current score.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {number} The current score.
     */
    get score(): number { return score },
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

      const positions = {
        startToEnd: {
          start: 0,
          end: state.length,
          step: 1,
        },
        endToStart: {
          start: state.length - 1,
          end: 0,
          step: -1,
        },
      }
      const { start, end, step } = direction === 'down' || direction === 'right' ? positions.endToStart : positions.startToEnd
      const horizontal = direction === 'left' || direction === 'right'

      for (let i = 0; i < state.length; i++) {
        let position = start
        let lastMerged: Tile | null = null

        for (let j = start; direction === 'down' || direction === 'right' ? j >= end : j < end; j += step) {
          const y = horizontal ? i : j
          const x = horizontal ? j : i

          const tile = state[y][x]
          if (!tile) {
            emptyTiles[`${ y }${ x }`] = { x, y }
            continue
          }

          tile.y = y
          tile.x = x

          const newY = horizontal ? i : position
          const newX = horizontal ? position : i

          // Move tile to new position
          if (position !== j) {
            state[y][x] = null
            state[newY][newX] = tile

            emptyTiles[`${ y }${ x }`] = { x, y }
            delete emptyTiles[`${ newY }${ newX }`]

            moved = true
          }

          const targetY = horizontal ? i : position + step * (-1)
          const targetX = horizontal ? position + step * (-1) : i

          if (targetY < 0 || targetX < 0 || targetY >= state.length || targetX >= state.length) {
            position += step
            continue
          }

          const targetTile = state[targetY][targetX]

          // Merge only if target tile has not been merged before
          if (targetTile && lastMerged !== targetTile && tile.value === targetTile.value) {
            state[newY][newX] = null
            state[targetY][targetX]!.value *= 2

            emptyTiles[`${ newY }${ newX }`] = { x: newX, y: newY }
            delete emptyTiles[`${ targetY }${ targetX }`]

            lastMerged = state[targetY][targetX]
            moved = true

            continue
          }

          position += step
        }
      }

      return moved
    },
    addRandomTile,
  }
}
