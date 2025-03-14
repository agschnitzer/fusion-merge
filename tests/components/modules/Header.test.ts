import Header from '$lib/components/modules/Header.svelte'
import userEvent from '@testing-library/user-event'
import { createRenderComponent } from '$utils/render-component'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

let mockPathname = '/'
vi.mock('$app/state', () => ({
  page: {
    url: {
      get pathname() { return mockPathname },
    },
  },
}))

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname = '/'
  })

  afterAll(vi.clearAllMocks)

  const renderComponent = createRenderComponent(Header)

  it('should render the navigation links', () => {
    const { container } = renderComponent()

    const nav = container.querySelector('nav')
    const links = container.querySelectorAll('a')
    const homeLink = links[0]
    const aboutLink = links[1]

    expect(nav).toBeInTheDocument()
    expect(links.length).toBe(2)

    expect(homeLink).toBeInTheDocument()
    expect(homeLink.querySelector('img')).toBeInTheDocument()
    expect(homeLink.querySelector('span')!.textContent).toContain('Play Fusion Merge')
    expect(homeLink.getAttribute('href')).toBe('/')

    expect(aboutLink).toBeInTheDocument()
    expect(aboutLink.textContent).toBe('About the game')
    expect(aboutLink.getAttribute('href')).toBe('/about/')
    expect(aboutLink.parentElement).toHaveClass('sr-only')
  })

  it('should render the logo', () => {
    const { container } = renderComponent()
    const logo = container.querySelector('img')

    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/app-icon.png')
    expect(logo).toHaveAttribute('alt', 'Fusion Merge App Icon')
  })

  it('should render the title', () => {
    const { getByText } = renderComponent()
    expect(getByText('Fusion Merge')).toBeInTheDocument()
  })

  it('should render the reset button on home page', () => {
    const { container } = renderComponent()

    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('New Game')
  })

  it('should call resetGame when reset button is clicked', async () => {
    const mockResetGame = vi.fn()
    const user = userEvent.setup()
    const { container } = renderComponent({ context: { resetGame: mockResetGame } })

    await user.click(container.querySelector('button')!)
    expect(mockResetGame).toHaveBeenCalled()
  })

  it('should render "Back to game" link on non-home pages', () => {
    mockPathname = '/about/'
    const { getByText } = renderComponent()
    const link = getByText('Back to game')

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('should not render reset button on non-home pages', () => {
    mockPathname = '/about/'
    const { container } = renderComponent()
    expect(container.querySelector('button')).not.toBeInTheDocument()
  })
})
