import type { CanvasOptions, CanvasState } from '$lib/types/canvas.type'
import type { Coordinates, Grid, Tile } from '$lib/types/grid.type'

/**
 * Creates a canvas state for a game.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {HTMLCanvasElement} canvas The canvas element to draw on.
 * @param {Grid} grid The grid of tiles.
 * @returns {CanvasState} A canvas state object.
 */
export const createCanvas = (canvas: HTMLCanvasElement, grid: Grid): CanvasState => {
  const tileGap = Math.min(Math.max(canvas.width / grid.length * 0.07, 8), 12)
  const options: CanvasOptions = {
    canvasWidth: canvas.width,
    animationDuration: 100,
    pulseScaleFactor: 0.15,
    gridSize: grid.length,
    tileSize: (canvas.width - tileGap * (grid.length + 1)) / grid.length,
    tileGap,
    tileBorderRadius: 8,
    backgroundColor: 'hsl(231,19%,20%)',
    emptyTileBackgroundColor: 'hsla(240, 10%, 44%,0.25)',
    emptyTileBorderColor: 'hsla(234, 19%, 11%, 0.5)',
    defaultTextColor: 'hsl(218, 36%, 18%)',
    atomSymbols: ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'],
    atomTileBackgroundColors: [
      'hsl(200, 100%, 90%)',
      'hsl(40, 100%, 85%)',
      'hsl(340, 90%, 80%)',
      'hsl(150, 50%, 70%)',
      'hsl(200, 40%, 60%)',
      'hsl(0, 0%, 90%)',
      'hsl(220, 80%, 60%)',
      'hsl(180, 100%, 70%)',
      'hsl(80, 100%, 75%)',
      'hsl(0, 100%, 70%)',
    ],
    atomTextColors: [
      'hsl(220, 100%, 30%)',
      'hsl(30, 100%, 25%)',
      'hsl(350, 100%, 30%)',
      'hsl(160, 100%, 20%)',
      'hsl(210, 100%, 20%)',
      'hsl(0, 0%, 20%)',
      'hsl(230, 100%, 20%)',
      'hsl(190, 100%, 20%)',
      'hsl(90, 100%, 20%)',
      'hsl(10, 100%, 20%)',
    ],
  }

  let animationFrameId: number | null = $state(null)

  const canvasContext = canvas.getContext('2d')!
  let backgroundCanvas = canvas.cloneNode() as HTMLCanvasElement

  /**
   * Calculates the starting position of a tile.
   * @since 1.0.0
   * @version 1.0.0
   * @private
   *
   * @param {number} x The x-coordinate of the tile.
   * @param {number} y The y-coordinate of the tile.
   * @returns {Coordinates} The starting position of the tile.
   */
  const getTileStart = (x: number, y: number): Coordinates => ({
    x: options.tileGap + x * (options.tileSize + options.tileGap),
    y: options.tileGap + y * (options.tileSize + options.tileGap),
  })

  /**
   * Calculates the center position of a tile.
   * @since 1.0.0
   * @version 1.0.0
   * @private
   *
   * @param {number} x The x-coordinate of the tile.
   * @param {number} y The y-coordinate of the tile.
   * @returns {Coordinates} The center position of the tile.
   */
  const getTileCenter = (x: number, y: number): Coordinates => {
    const start = getTileStart(x, y)

    return {
      x: start.x + options.tileSize / 2,
      y: start.y + options.tileSize / 2,
    }
  }

  /**
   * Draws text on the canvas.
   * @since 1.0.0
   * @version 1.0.0
   * @private
   *
   * @param {string} text The text content to draw.
   * @param {number} x The x-coordinate of the text.
   * @param {number} y The y-coordinate of the text.
   * @param {number} size The font size of the text.
   * @param {string} color The color of the text.
   */
  const drawText = (text: string, x: number, y: number, size: number, color: string): void => {
    canvasContext.fillStyle = color
    canvasContext.font = `${ size }px 'Jersey', sans-serif`
    canvasContext.textAlign = 'center'
    canvasContext.textBaseline = 'middle'

    canvasContext.fillText(text, x, y)
  }

  /**
   * Draws a tile shape on the canvas.
   * @since 1.0.0
   * @version 1.0.0
   * @private
   *
   * @param {number} x The x-coordinate of the tile.
   * @param {number} y The y-coordinate of the tile.
   * @param {string} backgroundColor The background colour of the tile.
   * @param {CanvasRenderingContext2D} [ctx = context] The canvas rendering context.
   */
  const drawTileShape = (x: number, y: number, backgroundColor: string, ctx: CanvasRenderingContext2D = canvasContext): void => {
    const tileStart = getTileStart(x, y)

    ctx.fillStyle = backgroundColor
    ctx.beginPath()
    ctx.roundRect(tileStart.x, tileStart.y, options.tileSize, options.tileSize, options.tileBorderRadius)
    ctx.fill()
  }

  /**
   * Draws an atom tile on the canvas.
   * @since 1.0.0
   * @version 1.0.0
   * @private
   *
   * @param {number} x The x-coordinate of the tile.
   * @param {number} y The y-coordinate of the tile.
   * @param {number} value The value of the tile.
   */
  const drawAtomTile = (x: number, y: number, value: number): void => {
    drawTileShape(x, y, options.atomTileBackgroundColors[value - 1])

    const tileStart = getTileStart(x, y)
    const tileCenter = getTileCenter(x, y)
    const numberOffset = options.tileSize / 6

    // Draw the atom symbol
    drawText(options.atomSymbols[value - 1], tileCenter.x, tileCenter.y, options.tileSize * 0.45, options.backgroundColor)

    // Draw the atom number
    drawText(
        value.toString(),
        tileStart.x + options.tileSize - numberOffset,
        tileStart.y + numberOffset,
        options.tileSize * 0.3,
        options.atomTextColors[value - 1],
    )
  }

  /**
   * Draws a scaled atom tile on the canvas.
   * @since 1.0.0
   * @version 1.0.0
   * @private
   *
   * @param {number} x The x-coordinate of the tile.
   * @param {number} y The y-coordinate of the tile.
   * @param {number} value The value of the tile.
   * @param {number} scale The scale factor for the tile.
   */
  const drawScaledAtomTile = (x: number, y: number, value: number, scale: number): void => {
    const tileCenter = getTileCenter(x, y)

    canvasContext.save()
    canvasContext.translate(tileCenter.x, tileCenter.y)
    canvasContext.scale(scale, scale)
    canvasContext.translate(-tileCenter.x, -tileCenter.y)

    drawAtomTile(x, y, value)
    canvasContext.restore()
  }

  /**
   * Draws the animated grid on the canvas.
   * @since 1.0.0
   * @version 1.0.0
   * @private
   *
   * @param {number} t The animation progress (0 to 1).
   */
  const drawAnimatedGrid = (t: number = 1): void => {
    resetCanvas()

    for (let row = 0; row < options.gridSize; row++) {
      for (let column = 0; column < options.gridSize; column++) {
        const tile = grid[row][column]
        if (!tile) continue

        const { row: tileRow, column: tileColumn, value, mergedThisTurn } = tile
        const animatedX = tileColumn + (column - tileColumn) * t
        const animatedY = tileRow + (row - tileRow) * t

        // Apply scaling effect for merged tiles, otherwise draw normally
        if (mergedThisTurn) {
          const pulseScale = 1 + options.pulseScaleFactor * Math.sin(Math.PI * t)
          drawScaledAtomTile(animatedX, animatedY, value, pulseScale)
        } else {
          drawAtomTile(animatedX, animatedY, value)
        }
      }
    }
  }

  /**
   * Resets the canvas to its initial state.
   * @since 1.0.0
   * @version 1.0.0
   * @private
   */
  const resetCanvas = (): void => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    canvasContext.drawImage(backgroundCanvas, 0, 0)
  }

  /**
   * Stops the current animation.
   * @since 1.0.0
   * @version 1.0.0
   * @private
   */
  const stopAnimation = (): void => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  /**
   * Animates a callback function over a specified duration.
   * @since 1.0.0
   * @version 1.0.0
   * @private
   *
   * @param {(t: number) => void} callback The callback function to call on each animation frame.
   * @returns {Promise<void>} A promise that resolves when the animation is complete.
   */
  const animate = (callback: (t: number) => void): Promise<void> => {
    stopAnimation()

    const startTime = performance.now()
    return new Promise(resolve => {
      /**
       * Animation loop function.
       * @since 1.0.0
       * @version 1.0.0
       *
       * @param {number} time The current time in milliseconds.
       */
      const animationLoop = (time: number): void => {
        const t = Math.min((time - startTime) / options.animationDuration, 1)
        callback(t)

        if (t === 1) {
          stopAnimation()
          return resolve()
        }

        animationFrameId = requestAnimationFrame(animationLoop)
      }

      animationFrameId = requestAnimationFrame(animationLoop)
    })
  }

  /**
   * Animates the entry of a tile or tiles into the canvas.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {Tile | Tile[]} tile The tile or tiles to animate.
   * @returns {Promise<void>} A promise that resolves when the animation is complete.
   */
  const animateTileEntry = (tile: Tile | Tile[]): Promise<void> => animate(t => {
    const tiles = Array.isArray(tile) ? tile : [tile]
    tiles.forEach(({ column, row, value }) =>
        drawScaledAtomTile(column, row, value, 0.5 + 0.5 * t + options.pulseScaleFactor * Math.sin(Math.PI * t) * (1 - t)))
  })

  /**
   * Animates the movement of the grid.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @returns {Promise<void>} A promise that resolves when the animation is complete.
   */
  const animateGridMovement = (): Promise<void> => animate(drawAnimatedGrid)

  /**
   * Initializes the canvas with the given tiles.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {Tile[]} tiles The tiles to draw on the canvas.
   */
  const initializeWithTiles = (tiles: Tile[]): Promise<void> => {
    resetCanvas()
    return animateTileEntry(tiles)
  }

  /**
   * Adjusts the canvas size based on the current window size.
   * @since 1.0.0
   * @version 1.0.0
   */
  const adjustCanvasSize = (): void => {
    const canvasWidth = Math.min(window.innerWidth - 48, options.canvasWidth)
    const pixelRatio = window.devicePixelRatio || 1
    const backgroundCanvasContext = backgroundCanvas.getContext('2d')!

    canvas.style.width = `${ canvasWidth }px`
    canvas.style.height = `${ canvasWidth }px`

    // Adjust the canvas size to match the device pixel ratio
    canvas.width = canvasWidth * pixelRatio
    canvas.height = canvasWidth * pixelRatio
    canvasContext.scale(pixelRatio, pixelRatio)

    // Draw the background
    backgroundCanvasContext.fillStyle = options.backgroundColor
    backgroundCanvasContext.fillRect(0, 0, canvas.width, canvas.height)

    options.tileGap = Math.min(Math.max(canvasWidth / options.gridSize * 0.07, 8), 12)
    options.tileSize = (canvasWidth - options.tileGap * (options.gridSize + 1)) / options.gridSize

    // Draw the empty tiles
    for (let row = 0; row < options.gridSize; row++) {
      for (let column = 0; column < options.gridSize; column++) {
        drawTileShape(column, row, options.emptyTileBackgroundColor, backgroundCanvasContext)

        backgroundCanvasContext.strokeStyle = options.emptyTileBorderColor
        backgroundCanvasContext.stroke()
      }
    }

    drawAnimatedGrid()
  }

  return {
    /**
     * Returns the canvas options.
     * @since 1.0.0
     * @version 1.0.0
     *
     * @returns {CanvasOptions} The canvas options.
     */
    get _options(): CanvasOptions { return options },
    animateTileEntry,
    animateGridMovement,
    initializeWithTiles,
    adjustCanvasSize,
  }
}
