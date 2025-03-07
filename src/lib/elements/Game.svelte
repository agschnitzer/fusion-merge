<script lang="ts">
  import { animateTiles } from '$lib/core/animation'
  import { addTile, moveTiles } from '$lib/core/game'
  import type { Grid } from '$lib/types/grid.type'
  import { draw } from '$lib/core/animation'

  let { width = 400 } = $props()

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
      null,
    ],
  ]

  let canvas: HTMLCanvasElement
  let animating = false

  const onkeydown = (event: KeyboardEvent): void => {
    const params: Record<string, [boolean, boolean]> = {
      ArrowRight: [true, true],
      ArrowLeft: [false, true],
      ArrowDown: [true, false],
      ArrowUp: [false, false],
    }
    if (!params[event.key] || animating) return

    const { moved, emptyTiles } = moveTiles(grid, ...params[event.key])
    if (!moved) return

    animating = true
    requestAnimationFrame((time: number): void => animateTiles(canvas, grid, time, performance.now()))
    animating = false

    addTile(grid, emptyTiles)

    animating = true
    requestAnimationFrame((time: number): void => animateTiles(canvas, grid, time, performance.now()))
    animating = false
  }

  $effect(() => draw(canvas, grid))
</script>

<svelte:window {onkeydown}/>

<canvas bind:this={canvas} {width} height={width} class="mt-10 mx-auto bg-slate-50 border"></canvas>
