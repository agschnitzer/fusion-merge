import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import DateLabel, { dateToString } from '$lib/components/DateLabel.svelte'

describe('DateLabel', () => {
  it('renders with correct structure', () => {
    const { container } = render(DateLabel, {
      props: {
        date: '2023-01-01',
        children: () => 'Published on:',
        class: undefined,
      },
    })

    const paragraph = container.querySelector('p')
    const timeElement = container.querySelector('time')

    expect(paragraph).toBeDefined()
    expect(timeElement).toBeDefined()
    expect(timeElement?.textContent).toBe('January 1, 2023')
    expect(timeElement?.getAttribute('datetime')).toBe('2023-01-01')
  })

  it('applies custom class when provided', () => {
    const { container } = render(DateLabel, {
      props: {
        date: '2023-01-01',
        class: 'custom-class',
        children: () => 'Published on:',
      },
    })

    const paragraph = container.querySelector('p')
    expect(paragraph?.classList.contains('custom-class')).toBe(true)
  })

  describe('dateToString', () => {
    it('formats dates correctly', () => {
      expect(dateToString('2023-01-01')).toBe('January 1, 2023')
      expect(dateToString('2023-12-25')).toBe('December 25, 2023')
      expect(dateToString('2023/07/04')).toBe('July 4, 2023')
    })
  })
})
