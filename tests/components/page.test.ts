import Score from '$lib/components/elements/Score.svelte'
import Canvas from '$lib/components/modules/Canvas.svelte'
import { tick } from 'svelte'
import { expect, describe, it, vi, beforeEach, afterAll } from 'vitest'
import { createRenderComponent } from '$utils/render-component'
import Page from '$routes/+page.svelte'

// Mock Score component
vi.mock('$lib/components/elements/Score.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $set: vi.fn(),
    $destroy: vi.fn(),
  })),
}))

// Mock Canvas component
vi.mock('$lib/components/modules/Canvas.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $set: vi.fn(),
    $destroy: vi.fn(),
  })),
}))

describe('Home Page', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    Object.defineProperty(document, 'fonts', {
      value: {
        ready: Promise.resolve(),
      },
      writable: true,
    })
  })

  afterAll(vi.resetAllMocks)

  const renderComponent = createRenderComponent(Page, {
    props: {
      data: {
        meta: {
          structuredData: {
            name: 'Fusion Merge',
          },
        },
      },
    },
  })

  it('should render the Score component', () => {
    renderComponent()
    expect(vi.mocked(Score)).toHaveBeenCalled()
  })

  it('should render the Canvas component', () => {
    renderComponent()
    expect(vi.mocked(Canvas)).toHaveBeenCalled()
  })

  it('should initialize the game after the fonts are loaded', async () => {
    const mockInitializeGame = vi.fn()

    // Create a controllable promise for font loading
    const fontLoadingPromise = Promise.resolve()
    Object.defineProperty(document, 'fonts', {
      value: {
        ready: fontLoadingPromise,
      },
      writable: true,
    })

    // Render with proper Svelte context using Map
    const { component } = renderComponent({
      context: {
        initializeGame: mockInitializeGame,
      },
    })

    // Wait for the fonts.ready promise to resolve
    await fontLoadingPromise

    // Use tick to wait for the next update cycle
    await tick()

    // Now the initialization should have been called
    expect(mockInitializeGame).toHaveBeenCalled()
  })

  it('should render structured data for SEO', () => {
    renderComponent()
    const scripts = document.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts.length).toBeGreaterThan(0)
    expect(scripts[0].textContent).toContain('Fusion Merge')
  })
})
