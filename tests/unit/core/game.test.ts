import { createCanvas } from '$lib/core/canvas.svelte'
import { createGame } from '$lib/core/game.svelte'
import { createGrid } from '$lib/core/grid.svelte'
import { createInputController } from '$lib/helpers/input'
import type { CanvasState } from '$lib/types/canvas.type'
import type { Game } from '$lib/types/game.type'
import type { GridState } from '$lib/types/grid.type'
import type { InputController } from '$lib/types/input.type'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock dependencies
vi.mock('$lib/core/canvas.svelte', () => ({ createCanvas: vi.fn() }))

vi.mock('$lib/core/grid.svelte', () => ({ createGrid: vi.fn() }))

vi.mock('$lib/helpers/input', () => ({ createInputController: vi.fn() }))

describe('createGame()', () => {
  const initialTiles = [{ value: 2, row: 0, column: 0, mergedThisTurn: false }]
  const mockGridState: Partial<GridState> = {
    grid: [
      [null, null, null, null],
      [null, { value: 2, row: 1, column: 1, mergedThisTurn: false }, null, null],
      [null, null, { value: 4, row: 2, column: 2, mergedThisTurn: true }, null],
      [null, null, null, null],
    ],
    score: 0,
    highScore: 0,
    moveCount: 0,
    isGameOver: false,
    isGameWon: false,
    initializeGrid: vi.fn().mockReturnValue([]),
    resetGrid: vi.fn().mockReturnValue(initialTiles),
    moveTiles: vi.fn().mockReturnValue(true),
    addTile: vi.fn().mockReturnValue({ value: 2, row: 1, column: 1, mergedThisTurn: false }),
    checkGameOver: vi.fn(),
    saveGrid: vi.fn(),
  }
  const mockCanvasState: Partial<CanvasState> = {
    adjustCanvasSize: vi.fn(),
    initializeWithTiles: vi.fn().mockResolvedValue(undefined),
    animateGridMovement: vi.fn().mockResolvedValue(undefined),
    animateTileEntry: vi.fn().mockResolvedValue(undefined),
  }
  const mockInputController: Partial<InputController> = {
    getMoveDirection: vi.fn(),
  }
  const mockCanvas = document.createElement('canvas')

  beforeEach(() => {
    vi.clearAllMocks()

    // Reset game state flags
    vi.mocked(mockGridState).isGameOver = false
    vi.mocked(mockGridState).isGameWon = false

    // Setup mocks
    document.getElementById = vi.fn().mockReturnValue(mockCanvas)
    vi.mocked(createGrid).mockReturnValue(mockGridState as GridState)
    vi.mocked(createCanvas).mockReturnValue(mockCanvasState as CanvasState)
    vi.mocked(createInputController).mockReturnValue(mockInputController as InputController)
  })

  afterEach(vi.restoreAllMocks)

  it('should create a game with correct properties', () => {
    const game = createGame()

    expect(game.initialWidth).toBe(526)
    expect(game.canvasId).toBe('game-canvas')
    expect(game.state).toBe(mockGridState)
    expect(game.input).toBe(mockInputController)
    expect(game.canvas).toBeUndefined()
  })

  it('should initialize the game correctly', () => {
    const game = createGame()
    game.initializeGame()

    expect(mockGridState.initializeGrid).toHaveBeenCalled()
    expect(createCanvas).toHaveBeenCalledWith(mockCanvas, mockGridState.grid)
    expect(mockCanvasState.adjustCanvasSize).toHaveBeenCalled()
  })

  it('should reset the game correctly', async () => {
    vi.mocked(mockGridState.resetGrid)!.mockReturnValue(initialTiles)

    const game = createGame()
    game.initializeGame()

    // Reset the game
    await game.resetGame()

    expect(mockGridState.resetGrid).toHaveBeenCalled()
    expect(mockGridState.saveGrid).toHaveBeenCalled()
    expect(mockCanvasState.initializeWithTiles).toHaveBeenCalledWith(initialTiles)
  })

  describe('movement handling', () => {
    let game: Game

    beforeEach(() => {
      game = createGame()
      game.initializeGame()
    })

    it('should not process movement when game is over/won', async () => {
      // Test game over
      vi.mocked(mockGridState).isGameOver = true
      await game.handleGameMovement(new KeyboardEvent('keydown'))
      expect(mockInputController.getMoveDirection).not.toHaveBeenCalled()

      // Test game won
      vi.mocked(mockGridState).isGameOver = false
      vi.mocked(mockGridState).isGameWon = true
      await game.handleGameMovement(new KeyboardEvent('keydown'))
      expect(mockInputController.getMoveDirection).not.toHaveBeenCalled()
    })

    it('should ignore invalid directions', async () => {
      const getMoveDirectionMock = vi.fn().mockReturnValue(null)
      vi.mocked(mockInputController).getMoveDirection = getMoveDirectionMock

      await game.handleGameMovement(new KeyboardEvent('keydown'))

      expect(getMoveDirectionMock).toHaveBeenCalled()
      expect(mockGridState.moveTiles).not.toHaveBeenCalled()
    })

    it('should not add tile if no tiles moved', async () => {
      vi.mocked(mockInputController.getMoveDirection)!.mockReturnValue('up')
      vi.mocked(mockGridState.moveTiles)!.mockReturnValue(false)

      await game.handleGameMovement(new KeyboardEvent('keydown'))

      expect(mockGridState.moveTiles).toHaveBeenCalledWith('up')
      expect(mockGridState.addTile).not.toHaveBeenCalled()
    })

    it('should handle keyboard movement correctly', async () => {
      // Make sure movement direction is valid
      vi.mocked(mockInputController.getMoveDirection)!.mockReturnValue('right')

      // Ensure moveTiles returns true to indicate tiles moved successfully
      vi.mocked(mockGridState.moveTiles)!.mockReturnValue(true)

      // Explicitly mock the animation implementation
      vi.mocked(mockCanvasState.animateGridMovement)!.mockImplementation(async () => {
        // Implementation that ensures this is called
        return Promise.resolve()
      })

      const game = createGame()
      game.initializeGame()

      // Call and wait for the movement handler to complete
      await game.handleGameMovement(new KeyboardEvent('keydown'))

      // Verify the right sequence of calls
      expect(mockGridState.moveTiles).toHaveBeenCalledWith('right')
      expect(mockCanvasState.animateGridMovement).toHaveBeenCalled()
      expect(mockGridState.addTile).toHaveBeenCalled()
      expect(mockCanvasState.animateTileEntry).toHaveBeenCalled()
      expect(mockGridState.checkGameOver).toHaveBeenCalled()
      expect(mockGridState.saveGrid).toHaveBeenCalled()
    })

    it('should handle pointer movement correctly', async () => {
      vi.mocked(mockInputController.getMoveDirection)!.mockReturnValue('left')

      // Create a minimal pointer event
      const pointerEvent = new Event('pointerdown') as PointerEvent

      await game.handleGameMovement(pointerEvent)

      expect(mockInputController.getMoveDirection).toHaveBeenCalledWith(pointerEvent)
      expect(mockGridState.moveTiles).toHaveBeenCalledWith('left')
    })
  })
})
