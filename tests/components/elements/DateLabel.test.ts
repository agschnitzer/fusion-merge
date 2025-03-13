import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/svelte'
import DateLabel from '$lib/components/elements/DateLabel.svelte'
import '@testing-library/jest-dom'

describe('DateLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-05-15T12:00:00'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const setupTest = (props = {}) => render(DateLabel, {
    props: {
      children: () => '',
      date: '',
      ...props,
    },
  })

  it('should render invalid date when no date is provided', () => {
    const { container } = setupTest()
    expect(container.textContent).toContain('Invalid Date')
  })

  it('should render provided date correctly', () => {
    const testDate = new Date('2022-10-25').toISOString()
    const { container } = setupTest({ date: testDate })
    expect(container.textContent).toContain('October 25, 2022')
  })

  it('should apply provided class', () => {
    const { container } = setupTest({ class: 'custom-class' })
    const element = container.querySelector('p')
    expect(element).toHaveClass('custom-class')
  })
})
