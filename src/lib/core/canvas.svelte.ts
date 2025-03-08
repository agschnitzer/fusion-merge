import type { CanvasState } from '$lib/types/canvas.type'
import type { Grid } from '$lib/types/grid.type'

/**
 * Creates a canvas state for the game.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {number} size The size of the grid.
 * @param {HTMLCanvasElement} canvas The canvas element to draw on.
 * @param {Grid} grid The grid of tiles.
 * @returns {CanvasState} A canvas state object.
 */
export const createCanvas = (size: number, canvas: HTMLCanvasElement, grid: Grid): CanvasState => {
  let animating = false
  const animationDuration = 125

  /**
   * Draws the grid on the canvas.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {number} t The animation progress.
   */
  const draw = (t: number = 1): void => {
    const tileSize = canvas.width / size

    const context = canvas.getContext('2d')!
    context.clearRect(0, 0, canvas.width, canvas.height)

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid.length; x++) {
        const tile = grid[y][x]
        if (!tile) continue

        const xCoordinate = tile.x + (x - tile.x) * t
        const yCoordinate = tile.y + (y - tile.y) * t

        context.fillStyle = `hsl(223, 50%, ${ 100 - 6 * tile.value }%)`
        context.fillRect(xCoordinate * tileSize, yCoordinate * tileSize, tileSize, tileSize)

        context.fillStyle = '#0f172b'
        context.font = 'bold 2em sans-serif'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText(tile.value.toString(), (xCoordinate + 0.5) * tileSize, (yCoordinate + 0.5) * tileSize)
      }
    }
  }

  /**
   * Animates the tiles on the canvas.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {number} time The current time.
   * @param {number} startTime The start time.
   */
  const animate = (time: number, startTime: number): void => {
    animating = true

    const t = Math.min((time - startTime) / 125, 1)

    draw(t)

    if (t === 1) {
      animating = false
      return
    }

    requestAnimationFrame((time: number): void => animate(time, startTime))
  }

  return {
    /**
     * Returns the animation state.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {boolean} The animation state.
     */
    get animating(): boolean { return animating },
    /**
     * Returns the duration of the animation.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {number} The duration of the animation.
     */
    get animationDuration(): number { return animationDuration },
    draw,
    animate,
  }
}
