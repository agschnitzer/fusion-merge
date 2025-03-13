import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, type RenderResult } from '@testing-library/svelte'
import GameOver from '$lib/components/elements/GameOver.svelte'
import '@testing-library/jest-dom'
import { getContext } from 'svelte'

// Mock the svelte getContext function
vi.mock('svelte', async () => {
  const actual = await vi.importActual('svelte')
  return {
    ...actual,
    getContext: vi.fn(),
  }
})

describe('GameOver', () => {
  const resetGameMock = vi.fn()

  beforeEach(vi.resetAllMocks)

  const setupTest = (gameState = {}): RenderResult<GameOver> => {
    const mockGame = {
      state: {
        isGameOver: true,
        isGameWon: false,
        score: 100,
        moveCount: 42,
        ...gameState,
      },
      resetGame: resetGameMock,
    }
    vi.mocked(getContext).mockReturnValue(mockGame)

    return render(GameOver)
  }

  it('should display "Game Over" when game is over', () => {
    const { container } = setupTest()

    expect(container.querySelector('h2')?.textContent).toBe('Game Over')
    expect(container.querySelector('p')?.textContent).toBe('You scored 100 points in 42 moves.')
  })

  it('should display "Fusion Complete" when game is won', () => {
    const { container } = setupTest({ isGameOver: false, isGameWon: true, score: 500, moveCount: 30 })

    expect(container.querySelector('h2')?.textContent).toBe('Fusion Complete')
    expect(container.querySelector('p')?.textContent).toBe('You scored 500 points in 30 moves.')
  })

  it('should render 0 when score or moveCount is undefined', () => {
    const { container } = setupTest({ score: undefined, moveCount: undefined })

    expect(container.querySelector('p')?.textContent).toBe('You scored 0 points in 0 moves.')
  })

  it('should call resetGame when button is clicked', async () => {
    const { getByText } = setupTest()
    const button = getByText('Play again')

    await fireEvent.click(button)

    expect(resetGameMock).toHaveBeenCalledTimes(1)
  })

  it('should have correct accessibility attributes', () => {
    const { container } = setupTest()
    const alertElement = container.querySelector('[role="alert"]')

    expect(alertElement).toHaveAttribute('aria-atomic', 'true')
    expect(alertElement).toHaveAttribute('aria-live', 'assertive')
  })
})
