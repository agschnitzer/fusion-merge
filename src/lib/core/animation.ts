import type { Grid } from '$lib/types/grid.type'

export const draw = (canvas: HTMLCanvasElement, grid: Grid, t: number = 1): void => {
  const tileSize = canvas.width / 4

  const context = canvas.getContext('2d')!
  context.clearRect(0, 0, canvas.width, canvas.height)

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      const tile = grid[y][x]
      if (!tile) continue

      context.fillStyle = `hsl(${ 45 * tile.value }, 56%, 78%)`
      context.fillRect((tile.x + (x - tile.x) * t) * tileSize, (tile.y + (y - tile.y) * t) * tileSize, tileSize, tileSize)
    }
  }
}

export const animateTiles = (canvas: HTMLCanvasElement, grid: Grid, time: number, startTime: number): void => {
  const t = Math.min((time - startTime) / 500, 1)

  draw(canvas, grid, t)

  if (t === 1) return

  requestAnimationFrame((time: number): void => animateTiles(canvas, grid, time, startTime))
}
