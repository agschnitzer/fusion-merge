<script lang="ts">
  import type { Grid, Tile } from '$lib/types/grid.type'
  let canvas: HTMLCanvasElement
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

<canvas bind:this={canvas} width="400" height="400" class="mt-10 mx-auto bg-slate-50 border"></canvas>
