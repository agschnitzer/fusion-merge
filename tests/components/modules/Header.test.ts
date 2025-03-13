import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, type RenderResult } from '@testing-library/svelte'
import Header from '$lib/components/modules/Header.svelte'
import '@testing-library/jest-dom'
import { getContext } from 'svelte'

// Mock pathname
let mockPathname = '/'
vi.mock('$app/state', () => ({
  page: {
    url: {
      get pathname() { return mockPathname },
    },
  },
}))

// Mock game context
const mockGame = { resetGame: vi.fn() }
vi.mock('svelte', async (importOriginal) => {
  const actual = await importOriginal() as object

  return {
    ...actual,
    getContext: vi.fn(),
  }
})

describe('Header', () => {
  beforeEach(() => {
    mockPathname = '/'
    vi.clearAllMocks()

    // Configure getContext mock to return our mockGame
    vi.mocked(getContext).mockReturnValue(mockGame)
  })

  const setupTest = (pathname = '/'): RenderResult<Header> => {
    mockPathname = pathname
    return render(Header)
  }

  it('should render the navigation links', () => {
    const { container } = setupTest()

    const nav = container.querySelector('nav')
    const links = container.querySelectorAll('a')
    expect(nav).toBeInTheDocument()

    expect(links.length).toBe(2)
    expect(links[0].textContent).toBe('Play Fusion Merge')
    expect(links[0].getAttribute('href')).toBe('/')

    expect(links[1].textContent).toBe('About the game')
    expect(links[1].getAttribute('href')).toBe('/about/')

  })

  it('should render the title', () => {
    const { getByText } = setupTest()
    expect(getByText('Fusion Merge')).toBeInTheDocument()
  })

  it('should render reset button on home page', () => {
    const { container } = setupTest()
    expect(container.querySelector('button')).toBeInTheDocument()
  })

  it('should call resetGame when reset button is clicked', async () => {
    const { container } = setupTest()
    await fireEvent.click(container.querySelector('button')!)
    expect(mockGame.resetGame).toHaveBeenCalled()
  })

  it('should render Back to game link on non-home pages', () => {
    const { getByText } = setupTest('/about/')
    const link = getByText('Back to game')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('should not render reset button on non-home pages', () => {
    const { container } = setupTest('/about/')
    expect(container.querySelector('button')).not.toBeInTheDocument()
  })
})
