import GameOver from '$lib/components/elements/GameOver.svelte'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { createRenderComponent } from '../../utils/render-component'
import { describe, expect, it, vi } from 'vitest'

describe('GameOver', () => {
  const renderComponent = createRenderComponent(GameOver, {
    context: {
      state: {
        score: 100,
        moveCount: 42,
        isGameOver: true,
        isGameWon: false,
      },
    },
  })

  it('should display "Game Over" when game is over', () => {
    const { container } = renderComponent()

    expect(container.querySelector('h2')?.textContent).toBe('Game Over')
  })

  it('should display "Fusion Complete" when game is won', () => {
    const { container } = renderComponent({ context: { state: { isGameOver: false, isGameWon: true } } })

    expect(container.querySelector('h2')?.textContent).toBe('Fusion Complete')
  })

  it('should display score and moveCount correctly', () => {
    const { container } = renderComponent()

    const scoreText = container.querySelector('p')?.textContent
    expect(scoreText).toContain('You scored 100 points in 42 moves.')
  })

  it('should display 0 when score or moveCount is undefined', () => {
    const { container } = renderComponent({ context: { state: { score: undefined, moveCount: undefined } } })

    expect(container.querySelector('p')?.textContent).toBe('You scored 0 points in 0 moves.')
  })

  it('should render button and call resetGame when it is clicked', async () => {
    const resetGameMock = vi.fn()
    const user = userEvent.setup()
    const { container } = renderComponent({ context: { state: { isGameOver: true, isGameWon: false }, resetGame: resetGameMock } })

    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
    expect(button?.textContent).toBe('Play again')
    await user.click(button!)
    expect(resetGameMock).toHaveBeenCalledTimes(1)
  })

  it('should have correct accessibility attributes', () => {
    const { getByRole } = renderComponent()
    const alertElement = getByRole('alert')

    expect(alertElement).toBeInTheDocument()
    expect(alertElement).toHaveAttribute('aria-atomic', 'true')
    expect(alertElement).toHaveAttribute('aria-live', 'assertive')
  })
})
