import DateLabel from '$lib/components/elements/DateLabel.svelte'
import { expect, describe, it, vi, beforeEach, afterAll } from 'vitest'
import { createRenderComponent } from '$utils/render-component'
import AboutPage from '$routes/about/+page.svelte'

// Mock DateLabel component
vi.mock('$lib/components/elements/DateLabel.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $set: vi.fn(),
    $destroy: vi.fn(),
  })),
}))

describe('About Page', () => {
  beforeEach(vi.resetAllMocks)

  afterAll(vi.resetAllMocks)
  
  const renderComponent = createRenderComponent(AboutPage, {
    props: {
      data: {
        heading: 'About Test Heading',
        text: [
          'First paragraph of text',
          'Second paragraph with <strong>HTML</strong>',
        ],
        sections: [
          {
            id: 'test-section',
            heading: 'Test Section Heading',
            list: [
              'List item 1',
              'List item 2 with <em>emphasis</em>',
            ],
            text: [
              'Section text paragraph',
            ],
          },
          {
            id: 'another-section',
            heading: 'Another Section',
            list: null,
            text: [
              'Just text in this section',
            ],
          },
        ],
        meta: {
          publishedOn: '2023-05-15T12:00:00Z',
        },
      },
    },
  })

  it('should render the main heading correctly', () => {
    const { getByRole } = renderComponent()
    expect(getByRole('heading', { name: 'About Test Heading', level: 2 })).toBeInTheDocument()
  })

  it('should render the paragraphs with HTML content', () => {
    const { getByText } = renderComponent()

    expect(getByText('First paragraph of text')).toBeInTheDocument()
    const paragraphWithHtml = getByText(/Second paragraph with/i)
    expect(paragraphWithHtml).toBeInTheDocument()
    expect(paragraphWithHtml.querySelector('strong')).toHaveTextContent('HTML')
  })

  it('should render sections with correct headings and content', () => {
    const { getByRole, getAllByRole, getByText } = renderComponent()
    expect(getByRole('heading', { name: 'Test Section Heading', level: 3 })).toBeInTheDocument()
    expect(getByRole('heading', { name: 'Another Section', level: 3 })).toBeInTheDocument()

    // Check list items
    const listItems = getAllByRole('listitem')
    expect(listItems).toHaveLength(2)
    expect(listItems[0]).toHaveTextContent('List item 1')
    expect(listItems[1]).toHaveTextContent('List item 2 with emphasis')
    expect(listItems[1].querySelector('em')).toHaveTextContent('emphasis')

    // Check section text
    expect(getByText('Section text paragraph')).toBeInTheDocument()
    expect(getByText('Just text in this section')).toBeInTheDocument()
  })

  it('should render the DateLabel component', () => {
    renderComponent()
    expect(vi.mocked(DateLabel)).toHaveBeenCalled()
  })

  it('should have correct ARIA attributes', () => {
    const { container } = renderComponent()

    const mainArticle = container.querySelector('article')
    expect(mainArticle).toHaveAttribute('aria-labelledby', 'about-heading')

    const sections = container.querySelectorAll('section[aria-labelledby]')
    expect(sections).toHaveLength(2)
    expect(sections[0]).toHaveAttribute('aria-labelledby', 'section-test-section-heading')
    expect(sections[1]).toHaveAttribute('aria-labelledby', 'section-another-section-heading')
  })
})
