import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, type RenderResult } from '@testing-library/svelte'
import Score from '$lib/components/elements/Score.svelte'
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

describe('Score', () => {
  beforeEach(vi.resetAllMocks)

  const setupTest = (): RenderResult<Score> => {
    const mockGame = {
      state: {
        score: 100,
        highScore: 500,
      },
    }
    vi.mocked(getContext).mockReturnValue(mockGame)

    return render(Score)
  }

  it('should render current score and high score', () => {
    const { container } = setupTest()

    const scoreElements = container.querySelectorAll('.score-card span:not(.sr-only)')
    expect(scoreElements[0].textContent).toBe('100')
    expect(scoreElements[1].textContent).toBe('500')
  })

  it('should apply correct styling to score cards', () => {
    const { container } = setupTest()
    const scoreCards = container.querySelectorAll('.score-card')

    expect(scoreCards.length).toBe(2)
    expect(scoreCards[0]).toHaveClass('border-text')
    expect(scoreCards[0]).toHaveClass('bg-highlight')
  })

  it('should include screen reader text for accessibility', () => {
    const { container } = setupTest()
    const srElements = container.querySelectorAll('.sr-only')

    expect(srElements.length).toBe(2)
    expect(srElements[0].textContent).toBe(':')
    expect(srElements[1].textContent).toBe('score:')
  })
})
