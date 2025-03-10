import type { CanvasOptions, CanvasState } from '$lib/types/canvas.type'
import type { Grid, Tile } from '$lib/types/grid.type'

/**
 * Creates a canvas state for the game.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {HTMLCanvasElement} canvas The canvas element to draw on.
 * @param {Grid} grid The grid of tiles.
 * @returns {CanvasState} A canvas state object.
 */
export const createCanvas = (canvas: HTMLCanvasElement, grid: Grid): CanvasState => {
  const options: CanvasOptions = {
    gap: 10,
    borderRadius: 8,
    animationDuration: 140,
    scaleFactor: 0.15,
    backgroundColor: '#1d293d',
    emptyTileColor: 'hsl(223, 5%, 100%, 0.1)',
    textColor: '#1d293d',
  }

  const size = grid.length
  const tileSize = (canvas.width - options.gap * (size + 1)) / size

  let animating = false
  let animationId: number

  const context = canvas.getContext('2d')!
  const background = canvas.cloneNode() as HTMLCanvasElement
  const backgroundContext = background.getContext('2d')!

  /**
   * Draws a single tile on the canvas.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {number} x The x-coordinate of the tile.
   * @param {number} y The y-coordinate of the tile.
   * @param {CanvasRenderingContext2D} [ctx = context] The canvas context to draw on.
   */
  const drawTile = (x: number, y: number, ctx: CanvasRenderingContext2D = context): void => {
    ctx.beginPath()
    ctx.roundRect(
        options.gap + x * (tileSize + options.gap),
        options.gap + y * (tileSize + options.gap),
        tileSize,
        tileSize,
        options.borderRadius,
    )
    ctx.fill()
  }

  /**
   * Draws a game tile on the canvas.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {number} x The x-coordinate of the tile.
   * @param {number} y The y-coordinate of the tile.
   * @param {number} value The value of the tile.
   */
  const drawGameTile = (x: number, y: number, value: number): void => {
    context.fillStyle = `hsl(223, 50%, ${ Math.max(30, 100 - 7 * value) }%)`
    drawTile(x, y)

    context.fillStyle = options.textColor
    context.font = `bold 32px sans-serif`
    context.textAlign = 'center'
    context.textBaseline = 'middle'

    context.fillText(
        value.toString(),
        options.gap + x * (tileSize + options.gap) + tileSize / 2,
        options.gap + y * (tileSize + options.gap) + tileSize / 2,
    )
  }

  /**
   * Draws a scaled tile on the canvas.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {number} x The x-coordinate of the tile.
   * @param {number} y The y-coordinate of the tile.
   * @param {number} value The value of the tile.
   * @param {number} scale The scale factor for the tile.
   */
  const drawScaleTile = (x: number, y: number, value: number, scale: number): void => {
    const centerX = options.gap + x * (tileSize + options.gap) + tileSize / 2
    const centerY = options.gap + y * (tileSize + options.gap) + tileSize / 2

    context.save()
    context.translate(centerX, centerY)
    context.scale(scale, scale)
    context.translate(-centerX, -centerY)

    drawGameTile(x, y, value)
    context.restore()
  }

  /**
   * Draws the grid on the canvas.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {number} t The animation progress, from 0 to 1.
   */
  const draw = (t: number = 1): void => {
    clear()

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const tile = grid[i][j]
        if (!tile) continue

        const { x, y, value, merged } = tile
        const xPos = x + (j - x) * t
        const yPos = y + (i - y) * t

        merged ? drawScaleTile(xPos, yPos, value, 1 + options.scaleFactor * Math.sin(Math.PI * t)) : drawGameTile(xPos, yPos, value)
      }
    }
  }

  /**
   * Animates the canvas.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {Function} callback The function to call on each animation frame.
   * @returns {Promise<void>} A promise that resolves when the animation is complete.
   */
  const animate = (callback: (t: number) => void): Promise<void> => {
    animating = true
    const startTime = performance.now()

    return new Promise(resolve => {
      const animationLoop = (time: number): void => {
        const t = Math.min((time - startTime) / options.animationDuration, 1)
        callback(t)

        if (t === 1) {
          // Animation is complete
          cancelAnimationFrame(animationId)
          animating = false
          return resolve()
        }

        // Continue the animation if not complete
        animationId = requestAnimationFrame(animationLoop)
      }

      // Start the animation
      animationId = requestAnimationFrame(animationLoop)
    })
  }

  /**
   * Animates a single tile on the canvas.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {Tile} tile The tile to animate.
   * @returns {Promise<void>} A promise that resolves when the animation is complete.
   */
  const animateTile = ({ x, y, value }: Tile): Promise<void> =>
      animate(t => drawScaleTile(x, y, value, 0.3 + 0.7 * t + options.scaleFactor * Math.sin(Math.PI * t) * (1 - t)))

  /**
   * Clears the canvas and draws the background.
   * @since 1.0.0
   * @version 1.0.0
   */
  const clear = (): void => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(background, 0, 0)
  }

  backgroundContext.fillStyle = options.backgroundColor
  backgroundContext.fillRect(0, 0, canvas.width, canvas.height)

  backgroundContext.fillStyle = options.emptyTileColor
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      drawTile(x, y, backgroundContext)
    }
  }

  draw()

  return {
    /**
     * Indicates if the canvas is animating.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {boolean} `true` if the canvas is animating, `false` otherwise.
     */
    get animating(): boolean { return animating },
    /**
     * Animates the tiles on the canvas to their new positions.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {Promise<void>} A promise that resolves when the animation is complete.
     */
    animateMove: (): Promise<void> => animate(draw),
    animateTile,
    /**
     * Resets the canvas with the given tiles.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @param {Tile[]} tiles The tiles to draw on the canvas.
     */
    reset: (tiles: Tile[]): void => {
      clear()
      tiles.forEach(animateTile)
    },
  }
}
