import DateLabel from '$lib/components/elements/DateLabel.svelte'
import { createRenderComponent } from '../../utils/render-component'
import { describe, expect, it, vi } from 'vitest'

describe('DateLabel', () => {
  const renderComponent = createRenderComponent(DateLabel, {
    props: {
      children: vi.fn(),
      date: undefined,
    },
  })

  it('should apply specified styles to the paragraph', () => {
    const className = 'custom-class'
    const { container } = renderComponent({ props: { class: className } })
    expect(container.querySelector('p')).toHaveClass(className)
  })

  it('should render provided date correctly', () => {
    const { getByText } = renderComponent({ props: { date: new Date('2025-01-01').toISOString() } })
    expect(getByText('January 1, 2025')).toBeInTheDocument()
  })

  it('should render invalid date when no date is provided', () => {
    const { getByText } = renderComponent()
    expect(getByText('Invalid Date')).toBeInTheDocument()
  })
})
