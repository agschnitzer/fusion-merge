import Footer from '$lib/components/modules/Footer.svelte'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRenderComponent } from '$utils/render-component'

let mockPathname = '/'
vi.mock('$app/state', () => ({
  page: {
    url: {
      get pathname() { return mockPathname },
    },
  },
}))

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname = '/'
  })

  afterAll(vi.clearAllMocks)

  const renderComponent = createRenderComponent(Footer)

  it('should render "About the game" link on home page', () => {
    const { getByText } = renderComponent()
    const link = getByText('About the game')

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/about/')
  })

  it('should render "Back to game" link on non-home pages', () => {
    mockPathname = '/about/'
    const { getByText } = renderComponent()
    const link = getByText('Back to game')

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('should display copyright notice with current year', () => {
    const { container } = renderComponent()
    const currentYear = new Date().getFullYear()
    expect(container.textContent).toContain(`© ${ currentYear } Alex Gschnitzer`)
  })
})
