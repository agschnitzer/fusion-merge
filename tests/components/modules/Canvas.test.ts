import GameOver from '$lib/components/elements/GameOver.svelte'
import Canvas from '$lib/components/modules/Canvas.svelte'
import userEvent from '@testing-library/user-event'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRenderComponent } from '../../utils/render-component'

// Mock GameOver component
vi.mock('$lib/components/elements/GameOver.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $set: vi.fn(),
    $destroy: vi.fn(),
  })),
}))

describe('Canvas', () => {
  beforeEach(vi.resetAllMocks)

  afterAll(vi.resetAllMocks)

  const renderComponent = createRenderComponent(Canvas, {
    context: {
      canvasId: 'test-canvas',
      initialWidth: 500,
      state: {
        isGameOver: false,
        isGameWon: false,
      },
    },
  })

  it('should render canvas with correct attributes', () => {
    const { container } = renderComponent()
    const canvas = container.querySelector('canvas')

    expect(canvas).toBeInTheDocument()
    expect(canvas?.id).toBe('test-canvas')
    expect(canvas?.width).toBe(500)
    expect(canvas?.height).toBe(500)
    expect(canvas).toHaveClass('aspect-square')
    expect(canvas).toHaveClass('bg-main')
    expect(canvas).toHaveClass('touch-none')
  })

  it('should trigger correct event handlers when pointer events occur', async () => {
    const updatePointerStartPositionMock = vi.fn()
    const throttlePointerEventMock = vi.fn()
    const resetSwipeStateMock = vi.fn()
    const user = userEvent.setup()
    const { container } = renderComponent({
      context: {
        input: {
          updatePointerStartPosition: updatePointerStartPositionMock,
          throttlePointerEvent: throttlePointerEventMock,
          resetSwipeState: resetSwipeStateMock,
        },
      },
    })
    const canvas = container.querySelector('canvas')

    expect(canvas).toBeInTheDocument()
    // Test pointerdown
    await user.pointer({ target: canvas!, keys: '[TouchA>]', coords: { x: 100, y: 100 } })
    expect(updatePointerStartPositionMock).toHaveBeenCalled()

    // Test pointermove
    await user.pointer({ target: canvas!, pointerName: 'TouchA', coords: { x: 120, y: 120 } })
    expect(throttlePointerEventMock).toHaveBeenCalled()

    // Test pointerup
    await user.pointer({ target: canvas!, keys: '[/TouchA]', coords: { x: 120, y: 120 } })
    expect(resetSwipeStateMock).toHaveBeenCalled()
  })

  it('should not render GameOver component when game is not over', () => {
    renderComponent()
    const GameOverMock = vi.mocked(GameOver)
    expect(GameOverMock).not.toHaveBeenCalled()
  })

  it('should render GameOver component when game is over', () => {
    renderComponent({ context: { state: { isGameOver: true } } })
    expect(vi.mocked(GameOver)).toHaveBeenCalled()
  })

  it('should render GameOver component when game is won', () => {
    renderComponent({ context: { state: { isGameWon: true } } })
    expect(vi.mocked(GameOver)).toHaveBeenCalled()
  })
})
