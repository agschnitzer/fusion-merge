import type { CanvasOptions, CanvasState } from '$lib/types/canvas.type'
import type { Grid, Tile } from '$lib/types/grid.type'

/**
 * Creates a canvas state for the game.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {HTMLCanvasElement} canvas The canvas element to draw on.
 * @param {Grid} grid The grid of tiles.
 * @param {number} width The width of the canvas.
 * @returns {CanvasState} A canvas state object.
 */
export const createCanvas = (canvas: HTMLCanvasElement, grid: Grid, width: number): CanvasState => {
  const options: CanvasOptions = {
    gap: 10,
    borderRadius: 8,
    animationDuration: 120,
    scaleFactor: 0.15,
    backgroundColor: 'hsl(231,19%,20%)',
    emptyTileColor: 'hsla(240, 10%, 44%,0.25)',
    emptyTileBorderColor: 'hsla(234, 19%, 11%, 0.5)',
    textColor: '#1d293d',
    atoms: ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'],
    atomColors: [
      'hsl(0, 45%, 70%)',      // H (Hydrogen) - softer red
      'hsl(40, 45%, 75%)',     // He (Helium) - softer orange/yellow
      'hsl(260, 45%, 70%)',    // Li (Lithium) - softer purple
      'hsl(120, 35%, 65%)',    // Be (Beryllium) - softer green
      'hsl(190, 50%, 65%)',    // B (Boron) - softer sky blue
      'hsl(220, 40%, 50%)',    // C (Carbon) - softer dark blue
      'hsl(160, 40%, 65%)',    // N (Nitrogen) - softer teal
      'hsl(200, 50%, 70%)',    // O (Oxygen) - softer bright blue
      'hsl(60, 50%, 75%)',     // F (Fluorine) - softer yellow
      'hsl(280, 40%, 75%)',    // Ne (Neon) - softer light purple/pink
    ],
    atomTextColors: [
      'hsl(0, 60%, 25%)',      // H text - dark red
      'hsl(40, 70%, 25%)',     // He text - dark amber
      'hsl(260, 60%, 25%)',    // Li text - dark purple
      'hsl(120, 50%, 25%)',    // Be text - dark green
      'hsl(190, 65%, 25%)',    // B text - dark sky blue
      'hsl(220, 70%, 20%)',    // C text - very dark blue
      'hsl(160, 60%, 25%)',    // N text - dark teal
      'hsl(200, 70%, 25%)',    // O text - dark blue
      'hsl(60, 70%, 25%)',     // F text - dark yellow
      'hsl(280, 60%, 25%)',    // Ne text - dark purple
    ],
  }

  const size = grid.length
  const context = canvas.getContext('2d')!

  let background = canvas.cloneNode() as HTMLCanvasElement
  let tileSize = (canvas.width - options.gap * (size + 1)) / size
  let animating = false
  let animationId: number

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
    context.fillStyle = options.atomColors[value - 1]
    drawTile(x, y)

    context.fillStyle = options.backgroundColor
    context.font = `bold ${ canvas.width / 18 }px 'Jersey', sans-serif`
    context.textAlign = 'center'
    context.textBaseline = 'middle'

    context.fillText(
        options.atoms[value - 1],
        options.gap + x * (tileSize + options.gap) + tileSize / 2,
        options.gap + y * (tileSize + options.gap) + tileSize / 2,
    )

    context.fillStyle = options.atomTextColors[value - 1]
    context.font = `bold ${ canvas.width / 28 }px 'Jersey', sans-serif`
    context.textAlign = 'right'
    context.textBaseline = 'top'

    context.fillText(
        value.toString(),
        options.gap + x * (tileSize + options.gap) + tileSize - 10,
        options.gap + y * (tileSize + options.gap) + 6,
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

        const { column, row, value, mergedThisTurn } = tile
        const xPos = column + (j - column) * t
        const yPos = row + (i - row) * t

        mergedThisTurn ? drawScaleTile(xPos, yPos, value, 1 + options.scaleFactor * Math.sin(Math.PI * t)) : drawGameTile(xPos, yPos, value)
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
    if (animating) cancelAnimation()
    animating = true
    const startTime = performance.now()

    return new Promise(resolve => {
      const animationLoop = (time: number): void => {
        const t = Math.min((time - startTime) / options.animationDuration, 1)
        callback(t)

        if (t === 1) {
          cancelAnimation()
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
   * @param { Tile | Tile[]} tile The tile to animate.
   * @returns {Promise<void>} A promise that resolves when the animation is complete.
   */
  const animateTile = (tile: Tile | Tile[]): Promise<void> => animate(t => {
    const tiles = Array.isArray(tile) ? tile : [tile]

    tiles.forEach(({ column, row, value }) =>
        drawScaleTile(column, row, value, 0.5 + 0.5 * t + options.scaleFactor * Math.sin(Math.PI * t) * (1 - t)))
  })

  /**
   * Cancels the current animation.
   * @since 1.0.0
   * @version 1.0.0
   */
  const cancelAnimation = (): void => {
    if (animating) {
      cancelAnimationFrame(animationId)
      animating = false
    }
  }

  /**
   * Clears the canvas and draws the background.
   * @since 1.0.0
   * @version 1.0.0
   */
  const clear = (): void => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(background, 0, 0)
  }

  /**
   * Resizes the canvas to fit the window.
   * @since 1.0.0
   * @version 1.0.0
   */
  const resize = (): void => {
    const canvasWidth = Math.min(window.innerWidth - 32, width)
    canvas.style.width = `${ canvasWidth }px`
    canvas.style.height = `${ canvasWidth }px`

    const pixelRatio = window.devicePixelRatio || 1
    canvas.width = canvasWidth * pixelRatio
    canvas.height = canvasWidth * pixelRatio
    context.scale(pixelRatio, pixelRatio)

    tileSize = (canvasWidth - options.gap * (size + 1)) / size

    background = canvas.cloneNode() as HTMLCanvasElement
    const backgroundContext = background.getContext('2d')!

    backgroundContext.fillStyle = options.backgroundColor
    backgroundContext.fillRect(0, 0, canvas.width, canvas.height)

    backgroundContext.fillStyle = options.emptyTileColor
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        drawTile(x, y, backgroundContext)
        backgroundContext.strokeStyle = options.emptyTileBorderColor
        backgroundContext.stroke()
      }
    }

    draw()
  }

  resize()

  return {
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
    reset: (tiles: Tile[]): Promise<void> => {
      clear()
      return animateTile(tiles)
    },
    resize,
  }
}
