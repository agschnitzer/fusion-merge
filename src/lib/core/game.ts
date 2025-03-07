import type { Grid, Tile } from '$lib/types/grid.type'

export const moveTiles = (grid: Grid, right: boolean = true, horizontal: boolean = true): {
  moved: boolean,
  emptyTiles: Partial<Record<string, { x: number, y: number }>>
} => {
  let moved = false

  const emptyTiles: Partial<Record<string, { x: number, y: number }>> = {}
  const start = right ? grid.length - 1 : 0
  const end = right ? 0 : grid.length
  const step = right ? -1 : 1

  for (let i = 0; i < grid.length; i++) {
    let position = start
    let lastMerged: Tile | null = null

    for (let j = start; right ? j >= end : j < end; j += step) {
      const y = horizontal ? i : j
      const x = horizontal ? j : i

      const tile = grid[y][x]
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
        grid[y][x] = null
        grid[newY][newX] = tile

        emptyTiles[`${ y }${ x }`] = { x, y }
        delete emptyTiles[`${ newY }${ newX }`]

        moved = true
      }

      const targetY = horizontal ? i : position + step * (-1)
      const targetX = horizontal ? position + step * (-1) : i

      if (targetY < 0 || targetX < 0 || targetY >= grid.length || targetX >= grid.length) {
        position += step
        continue
      }

      const targetTile = grid[targetY][targetX]

      // Merge only if target tile has not been merged before
      if (targetTile && lastMerged !== targetTile && tile.value === targetTile.value) {
        grid[newY][newX] = null
        grid[targetY][targetX]!.value *= 2

        emptyTiles[`${ newY }${ newX }`] = { x: newX, y: newY }
        delete emptyTiles[`${ targetY }${ targetX }`]

        lastMerged = grid[targetY][targetX]
        moved = true

        continue
      }

      position += step
    }
  }

  return { moved, emptyTiles }
}

export const addTile = (grid: Grid, emptyTiles: Partial<Record<string, { x: number, y: number }>>): void => {
  const emptyTilesArray = Object.values(emptyTiles).filter(Boolean)
  const { y, x } = emptyTilesArray[Math.floor(Math.random() * emptyTilesArray.length)]!
  grid[y][x] = { value: Math.random() < 0.9 ? 2 : 4, y, x }
  delete emptyTiles[`${ y }${ x }`]
}
