import Footer from '$lib/components/modules/Footer.svelte'
import Header from '$lib/components/modules/Header.svelte'
import { createGame } from '$lib/core/game.svelte'
import { expect, describe, it, vi, beforeEach, afterAll } from 'vitest'
import { createRenderComponent } from '$utils/render-component'
import Layout from '$routes/+layout.svelte'

vi.mock('$app/state', () => ({
  page: {
    data: {
      meta: {
        title: 'Test Title',
        description: 'Test Description',
        url: 'http://test-url',
        publishedOn: new Date('2025-01-01').toISOString(),
        updatedAt: new Date('2025-01-01').toISOString(),
        image: {
          src: '/test-image.png',
          alt: 'Test Image',
          width: 1200,
          height: 630,
          format: 'image/png',
        },
      },
    },
  },
}))

// Mock Header component
vi.mock('$lib/components/modules/Header.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $set: vi.fn(),
    $destroy: vi.fn(),
  })),
}))

// Mock Footer component
vi.mock('$lib/components/modules/Footer.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $set: vi.fn(),
    $destroy: vi.fn(),
  })),
}))

vi.mock('$lib/core/game.svelte', () => ({
  createGame: vi.fn().mockReturnValue({ ready: Promise.resolve() }),
}))

describe('Layout', () => {
  beforeEach(vi.resetAllMocks)

  afterAll(vi.resetAllMocks)

  const renderComponent = createRenderComponent(Layout, {
    props: {
      children: vi.fn(),
    },
  })

  it('should render the Header component', () => {
    renderComponent()
    expect(vi.mocked(Header)).toHaveBeenCalled()
  })

  it('should render the Footer component', () => {
    renderComponent()
    expect(vi.mocked(Footer)).toHaveBeenCalled()
  })

  it('should set the page title in document head', () => {
    renderComponent()
    const title = document.querySelector('title')
    expect(title?.textContent).toBe('Test Title')
  })

  it('should set meta description in document head', () => {
    renderComponent()
    const metaDescription = document.querySelector('meta[name="description"]')
    expect(metaDescription).toHaveAttribute('content', 'Test Description')
  })

  it('should set canonical URL in document head', () => {
    renderComponent()
    const canonicalLink = document.querySelector('link[rel="canonical"]')
    expect(canonicalLink).toHaveAttribute('href', 'http://test-url')
  })

  it('should set OpenGraph and Twitter meta tags', () => {
    renderComponent()
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Test Title')
    expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute('content', 'Test Description')
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute('content', 'http://test-url')
    expect(document.querySelector('meta[property="twitter:title"]')).toHaveAttribute('content', 'Test Title')
  })

  it('should set OpenGraph image meta tags', () => {
    renderComponent()
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute('content', '/test-image.png')
    expect(document.querySelector('meta[property="og:image:alt"]')).toHaveAttribute('content', 'Test Image')
    expect(document.querySelector('meta[property="og:image:width"]')).toHaveAttribute('content', '1200')
    expect(document.querySelector('meta[property="og:image:height"]')).toHaveAttribute('content', '630')
    expect(document.querySelector('meta[property="og:image:type"]')).toHaveAttribute('content', 'image/png')
  })

  it('should create a game instance', () => {
    renderComponent()
    expect(vi.mocked(createGame)).toHaveBeenCalled()
  })
})
