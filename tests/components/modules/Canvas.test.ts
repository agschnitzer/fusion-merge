import Canvas from '$lib/components/modules/Canvas.svelte'
import '@testing-library/jest-dom'
import GameOver from '$lib/components/elements/GameOver.svelte'
import { fireEvent, render, type RenderResult } from '@testing-library/svelte'
import { getContext } from 'svelte'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the svelte getContext function
vi.mock('svelte', async () => {
  const actual = await vi.importActual('svelte')
  return {
    ...actual,
    getContext: vi.fn(),
  }
})

// Mock GameOver component
vi.mock('$lib/components/elements/GameOver.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $set: vi.fn(),
    $destroy: vi.fn(),
  })),
}))

describe('Canvas', () => {
  const updatePointerStartPositionMock = vi.fn()
  const throttlePointerEventMock = vi.fn()
  const resetSwipeStateMock = vi.fn()
  const handleGameMovementMock = vi.fn()

  beforeEach(vi.resetAllMocks)

  const setupTest = (gameState = {}): RenderResult<Canvas> => {
    const mockGame = {
      canvasId: 'test-canvas',
      initialWidth: 500,
      state: {
        isGameOver: false,
        isGameWon: false,
        ...gameState,
      },
      input: {
        updatePointerStartPosition: updatePointerStartPositionMock,
        throttlePointerEvent: throttlePointerEventMock,
        resetSwipeState: resetSwipeStateMock,
      },
      handleGameMovement: handleGameMovementMock,
    }
    vi.mocked(getContext).mockReturnValue(mockGame)

    return render(Canvas)
  }

  it('should render canvas with correct attributes', () => {
    const { container } = setupTest()
    const canvas = container.querySelector('canvas')

    expect(canvas).toBeInTheDocument()
    expect(canvas?.id).toBe('test-canvas')
    expect(canvas?.width).toBe(500)
    expect(canvas?.height).toBe(500)
    expect(canvas).toHaveClass('aspect-square')
    expect(canvas).toHaveClass('bg-main')
    expect(canvas).toHaveClass('touch-none')
  })

  it('should trigger correct functions when pointer events occur', () => {
    const { container } = setupTest()
    const canvas = container.querySelector('canvas')

    if (!canvas) throw new Error('Canvas element not found')

    // Test pointerdown
    fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100 })
    expect(updatePointerStartPositionMock).toHaveBeenCalled()

    // Test pointermove
    fireEvent.pointerMove(canvas, { clientX: 120, clientY: 120 })
    expect(throttlePointerEventMock).toHaveBeenCalled()

    // Test pointerup
    fireEvent.pointerUp(canvas, { clientX: 150, clientY: 150 })
    expect(resetSwipeStateMock).toHaveBeenCalled()
  })

  it('should not render GameOver when game is not over', () => {
    setupTest()
    const GameOverMock = vi.mocked(GameOver)
    expect(GameOverMock).not.toHaveBeenCalled()
  })

  it('should render GameOver when game is over', () => {
    setupTest({ isGameOver: true })
    const GameOverMock = vi.mocked(GameOver)
    expect(GameOverMock).toHaveBeenCalled()
  })

  it('should render GameOver when game is won', () => {
    setupTest({ isGameWon: true })
    const GameOverMock = vi.mocked(GameOver)
    expect(GameOverMock).toHaveBeenCalled()
  })
})
