import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, type RenderResult } from '@testing-library/svelte'
import Footer from '$lib/components/modules/Footer.svelte'
import '@testing-library/jest-dom'

// Mock pathname
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
    mockPathname = '/'
  })

  const setupTest = (pathname = '/'): RenderResult<Footer> => {
    mockPathname = pathname
    return render(Footer)
  }

  it('should render About the game link on home page', () => {
    const { getByText } = setupTest()
    const link = getByText('About the game')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/about/')
  })

  it('should render Back to game link on non-home pages', () => {
    const { getByText } = setupTest('/about/')
    const link = getByText('Back to game')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('should display copyright notice with current year', () => {
    const { container } = setupTest()
    const currentYear = new Date().getFullYear()
    expect(container.textContent).toContain(`© ${ currentYear } Alex Gschnitzer`)
  })
})
