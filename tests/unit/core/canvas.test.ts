import { createCanvas } from '$lib/core/canvas.svelte'
import type { CanvasState } from '$lib/types/canvas.type'
import type { Tile } from '$lib/types/grid.type'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('createCanvas()', () => {
  let canvasState: CanvasState
  let mockContext: CanvasRenderingContext2D
  let canvas: HTMLCanvasElement

  beforeEach(() => {
    canvas = document.createElement('canvas')
    canvas.width = 526
    canvas.height = 526

    // Mock canvas contexts
    mockContext = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      beginPath: vi.fn(),
      roundRect: vi.fn(),
      fill: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      scale: vi.fn(),
      translate: vi.fn(),
      drawImage: vi.fn(),
      stroke: vi.fn(),
    } as unknown as CanvasRenderingContext2D

    // Mock getContext
    HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => mockContext)

    // Mock animation frame
    global.cancelAnimationFrame = vi.fn()
    global.requestAnimationFrame = vi.fn().mockImplementation((callback) => {
      callback(performance.now() + 100)
      return 1
    })

    // Mock performance.now
    global.performance.now = vi.fn().mockReturnValue(0)

    canvasState = createCanvas(canvas, [
      [null, null, null, null],
      [null, { value: 2, row: 1, column: 1, mergedThisTurn: false }, null, null],
      [null, null, { value: 4, row: 2, column: 2, mergedThisTurn: true }, null],
      [null, null, null, null],
    ])
  })

  afterEach(vi.restoreAllMocks)

  it('should initialize the canvas with the correct size', () => {
    canvasState.adjustCanvasSize()

    // Check if context functions were called
    expect(mockContext.scale).toHaveBeenCalled()
    expect(mockContext.fillRect).toHaveBeenCalled()
    expect(mockContext.beginPath).toHaveBeenCalled()
    expect(mockContext.roundRect).toHaveBeenCalled()
    expect(mockContext.fill).toHaveBeenCalled()
    expect(mockContext.stroke).toHaveBeenCalled()
    expect(mockContext.clearRect).toHaveBeenCalled()
    expect(mockContext.drawImage).toHaveBeenCalled()

    expect(canvas.width).toBe(526)
    expect(canvas.height).toBe(526)
    expect(canvas.style.width).toBe('526px')
    expect(canvas.style.height).toBe('526px')
  })

  it('should initialize tile size and gap based on canvas dimensions', () => {
    // Check that the tile size and gap are calculated based on the canvas width
    expect(canvasState._options.tileSize).toBeGreaterThan(0)
    expect(canvasState._options.tileGap).toBeGreaterThan(0)

    // Verify that tileSize * gridSize + tileGap * (gridSize + 1) ≈ canvasWidth
    const expectedCanvasWidth = canvasState._options.tileSize * canvasState._options.gridSize + canvasState._options.tileGap * (canvasState._options.gridSize + 1)
    expect(Math.abs(expectedCanvasWidth - Math.min(window.innerWidth - 48, canvasState._options.canvasWidth))).toBeLessThan(1)
  })

  it('should change tileGap and tileSize when canvas is resized', () => {
    const initialTileGap = canvasState._options.tileGap
    const initialTileSize = canvasState._options.tileSize

    Object.defineProperty(window, 'innerWidth', { value: 300, configurable: true })

    canvasState.adjustCanvasSize()

    // Gap and size should be recalculated
    expect(canvasState._options.tileGap).not.toBe(initialTileGap)
    expect(canvasState._options.tileSize).not.toBe(initialTileSize)
  })

  it('should maintain proper aspect ratio when resizing', () => {
    canvasState.adjustCanvasSize()

    // Width and height should be equal (square canvas)
    expect(canvas.style.width).toBe(canvas.style.height)
  })

  it('should adjust canvas size based on window dimensions', () => {
    Object.defineProperty(window, 'innerWidth', { value: 400 })
    Object.defineProperty(window, 'devicePixelRatio', { value: 2 })

    canvasState.adjustCanvasSize()

    // Canvas size should be adjusted based on window dimensions
    expect(canvas.width).toBe(704)
    expect(canvas.height).toBe(704)
    expect(canvas.style.width).toBe('352px')
    expect(canvas.style.height).toBe('352px')

    expect(mockContext.scale).toHaveBeenCalledWith(2, 2) // devicePixelRatio
  })

  it('should not adjust canvas size on larger screens', () => {
    const currentCanvasWidth = canvas.width

    Object.defineProperty(window, 'innerWidth', { value: 1000 })
    Object.defineProperty(window, 'devicePixelRatio', { value: 1 })

    canvasState.adjustCanvasSize()

    // Canvas size should not change
    expect(canvas.width).toBe(currentCanvasWidth)
    expect(canvas.height).toBe(currentCanvasWidth)
    expect(canvas.style.width).toBe('526px')
    expect(canvas.style.height).toBe('526px')
  })

  it('should handle multiple tile animations simultaneously', async () => {
    const testTiles: Tile[] = [
      { value: 1, row: 0, column: 0, mergedThisTurn: false },
      { value: 2, row: 1, column: 1, mergedThisTurn: false },
    ]

    await canvasState.animateTileEntry(testTiles)

    expect(mockContext.save).toHaveBeenCalledTimes(2)
    expect(mockContext.restore).toHaveBeenCalledTimes(2)
    expect(mockContext.scale).toHaveBeenCalledTimes(2)
  })

  it('should animate grid movement', async () => {
    await canvasState.animateGridMovement()

    // Should clear the canvas and redraw
    expect(mockContext.clearRect).toHaveBeenCalled()
    expect(mockContext.drawImage).toHaveBeenCalled()

    // Should draw tiles with transformations for merged tiles
    expect(mockContext.save).toHaveBeenCalled()
    expect(mockContext.translate).toHaveBeenCalled()
  })

  it('should reset canvas when initializing with new tiles', async () => {
    const testTiles: Tile[] = [
      { value: 2, row: 0, column: 0, mergedThisTurn: false },
    ]

    await canvasState.initializeWithTiles(testTiles)

    // Should clear and redraw the canvas
    expect(mockContext.clearRect).toHaveBeenCalled()
    expect(mockContext.drawImage).toHaveBeenCalled()
  })
})
