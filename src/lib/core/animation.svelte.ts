import type { CanvasState } from '$lib/types/canvas.type'
import type { Grid } from '$lib/types/grid.type'

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

        context.fillStyle = `hsl(${ 45 * tile.value }, 56%, 78%)`
        context.fillRect((tile.x + (x - tile.x) * t) * tileSize, (tile.y + (y - tile.y) * t) * tileSize, tileSize, tileSize)
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
    /**
     * Returns the canvas element.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {HTMLCanvasElement} The canvas element.
     */
    get element(): HTMLCanvasElement { return canvas },
    draw,
    animate,
  }
}
