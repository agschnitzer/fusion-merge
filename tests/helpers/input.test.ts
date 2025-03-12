import { describe, it, expect, beforeEach } from 'vitest'
import { createInputController } from '$lib/helpers/input'

const { updateTouchStartPosition, getMoveDirection } = createInputController()

/**
 * Creates a mock touch event for testing.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {number} x The x-coordinate of the touch event.
 * @param {number} y The y-coordinate of the touch event.
 * @returns {TouchEvent} A mock touch event object.
 */
const createTouchEvent = (x: number, y: number): TouchEvent => {
  const touch = { clientX: x, clientY: y } as Touch

  return {
    changedTouches: [touch],
    preventDefault: () => { },
  } as unknown as TouchEvent
}

describe('getMoveDirection()', () => {
  it('should return correct direction for arrow keys', () => {
    const keyboardEvents = {
      ArrowUp: new KeyboardEvent('keydown', { key: 'ArrowUp' }),
      ArrowDown: new KeyboardEvent('keydown', { key: 'ArrowDown' }),
      ArrowLeft: new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
      ArrowRight: new KeyboardEvent('keydown', { key: 'ArrowRight' }),
    }

    expect(getMoveDirection(keyboardEvents.ArrowUp)).toBe('up')
    expect(getMoveDirection(keyboardEvents.ArrowDown)).toBe('down')
    expect(getMoveDirection(keyboardEvents.ArrowLeft)).toBe('left')
    expect(getMoveDirection(keyboardEvents.ArrowRight)).toBe('right')
  })

  it('should return null for non-arrow keys', () => {
    const event = new KeyboardEvent('keydown', { key: 'a' })
    expect(getMoveDirection(event)).toBeNull()
  })

  describe('touch event handling', () => {
    beforeEach(() => {
      const startEvent = createTouchEvent(100, 100)
      updateTouchStartPosition(startEvent)
    })

    it('should update touch position correctly', () => {
      const startEvent = createTouchEvent(200, 200)
      updateTouchStartPosition(startEvent)

      // Swipe left from new position
      const endEvent = createTouchEvent(150, 200)
      expect(getMoveDirection(endEvent)).toBe('left')
    })

    it('should detect right swipe', () => {
      const endEvent = createTouchEvent(150, 100)
      expect(getMoveDirection(endEvent)).toBe('right')
    })

    it('should detect left swipe', () => {
      const endEvent = createTouchEvent(50, 100)
      expect(getMoveDirection(endEvent)).toBe('left')
    })

    it('should detect up swipe', () => {
      const endEvent = createTouchEvent(100, 50)
      expect(getMoveDirection(endEvent)).toBe('up')
    })

    it('should detect down swipe', () => {
      const endEvent = createTouchEvent(100, 150)
      expect(getMoveDirection(endEvent)).toBe('down')
    })

    it('should return null for small movements below threshold', () => {
      const endEvent = createTouchEvent(110, 105) // Small movement
      expect(getMoveDirection(endEvent)).toBeNull()
    })

    it('should prioritize horizontal movement when it has greater magnitude', () => {
      const endEvent = createTouchEvent(150, 120) // More horizontal than vertical
      expect(getMoveDirection(endEvent)).toBe('right')
    })

    it('should prioritize vertical movement when it has greater magnitude', () => {
      const endEvent = createTouchEvent(120, 150) // More vertical than horizontal
      expect(getMoveDirection(endEvent)).toBe('down')
    })

    it('should handle missing changedTouches gracefully', () => {
      const badEvent = { changedTouches: [] } as unknown as TouchEvent
      expect(getMoveDirection(badEvent)).toBeNull()
    })
  })
})


