import type { Grid, GridState, Tile } from '$lib/types/grid.type'

export const createGrid = (size: number): GridState => {
  const state: Grid = Array.from({ length: size }, () => Array.from({ length: size }, () => null))
  const positions = {
    up: {
      start: 0,
      end: state.length,
      step: 1,
    },
    down: {
      start: state.length - 1,
      end: 0,
      step: -1,
    },
    left: {
      start: 0,
      end: state.length,
      step: 1,
    },
    right: {
      start: state.length - 1,
      end: 0,
      step: -1,
    },
  }

  let emptyTiles: Record<string, Omit<Tile, 'value'>> = {}
  let score = $state(0)
  let moved = false

  // Initialize grid with two random tiles
  for (let i = 0; i < 2; i++) {
    const x = Math.floor(Math.random() * size)
    const y = Math.floor(Math.random() * size)

    if (state[y][x]) {
      i--
      continue
    }

    state[y][x] = { value: Math.random() < 0.9 ? 2 : 4, x, y }
    score += state[y][x].value
  }

  return {
    /**
     * Returns the grid.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {Grid} The grid state.
     */
    get grid(): Grid { return state },
    /**
     * Returns the empty tiles.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {Record<string, Omit<Tile, 'value'>>} The empty tiles.
     */
    get emptyTiles(): Record<string, Omit<Tile, 'value'>> { return emptyTiles },
    /**
     * Returns whether a tile has moved since the last move.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {boolean} `true` if a tile has moved, `false` otherwise.
     */
    get moved(): boolean { return moved },
    /**
     * Returns the current score.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {number} The current score.
     */
    get score(): number { return score },
    /**
     * Updates the grid by moving tiles.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @param {'up' | 'down' | 'left' | 'right'} direction The direction to move the tiles.
     */
    update: (direction: 'up' | 'down' | 'left' | 'right'): void => {
      moved = false

      const { start, end, step } = positions[direction]
      const horizontal = direction === 'left' || direction === 'right'

      emptyTiles = {}
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
    },
    /**
     * Adds a new tile to the grid.
     * @since 1.0.0
     * @version 1.0.0
     */
    addTile: (): void => {
      const emptyTilesArray = Object.values(emptyTiles)
      const { y, x } = emptyTilesArray[Math.floor(Math.random() * emptyTilesArray.length)]!
      state[y][x] = { value: Math.random() < 0.9 ? 2 : 4, y, x }
      score += state[y][x].value
      delete emptyTiles[`${ y }${ x }`]
    },
  }
}
