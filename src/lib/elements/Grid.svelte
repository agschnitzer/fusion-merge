<script lang="ts">
  import type { Grid, Tile } from '$lib/types/grid.type'

  let canvas: HTMLCanvasElement
  let animating = false
  let startTime = 0

  const size = 4
  const grid: Grid = [
    [
      { value: 2, y: 0, x: 0 },
      null,
      null,
      null,
    ],
    [
      null,
      null,
      null,
      null,
    ],
    [
      null,
      null,
      { value: 2, y: 2, x: 2 },
      null,
    ],
    [
      null,
      null,
      null,
      null
    ],
  ]

  const move = (event: KeyboardEvent): void => {
    const params: Record<string, [boolean, boolean]> = {
      ArrowRight: [true, true],
      ArrowLeft: [false, true],
      ArrowDown: [true, false],
      ArrowUp: [false, false],
    }

    if (params[event.key]) moveTiles(...params[event.key])
  }

  const moveTiles = (right: boolean = true, horizontal: boolean = true) => {
    if (animating) return

    let moved = false

    const emptyTiles: Partial<Record<string, { x: number, y: number }>>= {}
    const start = right ? size - 1 : 0
    const end = right ? 0 : size
    const step = right ? -1 : 1

    for (let i = 0; i < size; i++) {
      let position = start
      let lastMerged: Tile | null = null

      for (let j = start; right ? j >= end : j < end; j += step) {
        const y = horizontal ? i : j
        const x = horizontal ? j : i

        const tile = grid[y][x]
        if (!tile) {
          emptyTiles[`${y}${x}`] = { x, y }
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

          emptyTiles[`${y}${x}`] = { x, y }
          emptyTiles[`${newY}${newX}`] = undefined

          moved = true
        }

        const targetY = horizontal ? i : position + step * (-1)
        const targetX = horizontal ? position + step * (-1) : i

        if (targetY < 0 || targetX < 0 || targetY >= size || targetX >= size) {
          position += step
          continue
        }

        const targetTile = grid[targetY][targetX]

        // Merge only if target tile has not been merged before
        if (targetTile && lastMerged !== targetTile && tile.value === targetTile.value) {
          grid[newY][newX] = null
          grid[targetY][targetX]!.value *= 2

          emptyTiles[`${newY}${newX}`] = { x: newX, y: newY }
          emptyTiles[`${targetY}${targetX}`] = undefined
          lastMerged = grid[targetY][targetX]
          moved = true

          continue
        }

        position += step
      }
    }

    if (!moved) return

    animating = true
    startTime = performance.now()
    requestAnimationFrame(animateTiles)

    const emptyTilesArray = Object.values(emptyTiles).filter(Boolean)
    const { y, x } = emptyTilesArray[Math.floor(Math.random() * emptyTilesArray.length)]!
    grid[y][x] = { value: Math.random() < 0.9 ? 2 : 4, y, x }

    animating = true
    startTime = performance.now()
    requestAnimationFrame(animateTiles)
  }

  const animateTiles = (timestamp: number): void => {
    const t = Math.min((timestamp - startTime) / 125, 1)

    draw(t)

    if (t === 1) {
      animating = false
      return
    }

    requestAnimationFrame(animateTiles)
  }

  const draw = (t: number = 1): void => {
    const tileSize = canvas.width / 4

    const context = canvas.getContext('2d')!
    context.clearRect(0, 0, canvas.width, canvas.height)

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const tile = grid[y][x]
        if (!tile) continue

        context.fillStyle = `hsl(${ 45 * tile.value }, 56%, 78%)`
        context.fillRect((tile.x + (x - tile.x) * t) * tileSize, (tile.y + (y - tile.y) * t) * tileSize, tileSize, tileSize)
      }
    }
  }

  $effect(() => {
    draw()
    canvas.focus()
  })
</script>

<canvas bind:this={canvas} width="400" height="400" class="mt-10 mx-auto bg-slate-50 border" onkeydown={move} tabindex="0"></canvas>
