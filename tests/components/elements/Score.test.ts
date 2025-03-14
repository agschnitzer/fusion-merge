import Score from '$lib/components/elements/Score.svelte'
import { createRenderComponent } from '../../utils/render-component'
import { describe, expect, it } from 'vitest'

describe('Score', () => {
  const renderComponent = createRenderComponent(Score, {
    context: {
      state: {
        score: 100,
        highScore: 500,
      },
    },
  })

  it('should display current score and high score', () => {
    const { container } = renderComponent()
    const scoreElements = container.querySelectorAll('.score-card span:not(.sr-only)')

    expect(scoreElements[0].textContent).toBe('100')
    expect(scoreElements[1].textContent).toBe('500')
  })

  it('should display 0 when score or highScore is undefined', () => {
    const { container } = renderComponent({ context: { state: { score: undefined, highScore: undefined } } })
    const scoreElements = container.querySelectorAll('.score-card span:not(.sr-only)')

    expect(scoreElements[0].textContent).toBe('0')
    expect(scoreElements[1].textContent).toBe('0')
  })

  it('should apply correct styling to score elements', () => {
    const { container } = renderComponent()
    const scoreCards = container.querySelectorAll('.score-card')

    expect(scoreCards.length).toBe(2)
    expect(scoreCards[0]).toHaveClass('border-text')
    expect(scoreCards[0]).toHaveClass('bg-highlight')
  })

  it('should include screen reader text for accessibility', () => {
    const { container } = renderComponent()
    const scoreElements = container.querySelectorAll('.sr-only')

    expect(scoreElements.length).toBe(2)
    expect(scoreElements[0].textContent).toBe(':')
    expect(scoreElements[1].textContent).toBe('score:')
  })
})
