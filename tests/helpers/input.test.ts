import { describe, it, expect, beforeEach } from 'vitest'
import { createInputController } from '$lib/helpers/input'

const { updatePointerStartPosition, getMoveDirection } = createInputController()

/**
 * Creates a mock pointer event for testing.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {number} x The x-coordinate of the pointer event.
 * @param {number} y The y-coordinate of the pointer event.
 * @param {string} pointerType The pointer type ('touch', 'mouse', etc).
 * @param {number} button The button used (0 for left click).
 * @returns {PointerEvent} A mock pointer event object.
 */
const createPointerEvent = (x: number, y: number, pointerType: string = 'touch', button: number = 0): PointerEvent => ({
  x,
  y,
  pointerType,
  button,
  preventDefault: () => { },
} as unknown as PointerEvent)

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

  describe('pointer event handling', () => {
    beforeEach(() => {
      const startEvent = createPointerEvent(100, 100)
      updatePointerStartPosition(startEvent)
    })

    it('should update pointer position correctly for touch events', () => {
      const startEvent = createPointerEvent(200, 200)
      updatePointerStartPosition(startEvent)

      const endEvent = createPointerEvent(150, 200)
      expect(getMoveDirection(endEvent)).toBe('left')
    })

    it('should ignore non-touch pointer events', () => {
      const mouseEvent = createPointerEvent(200, 200, 'mouse')
      updatePointerStartPosition(mouseEvent)

      const endEvent = createPointerEvent(150, 200, 'mouse')
      expect(getMoveDirection(endEvent)).toBeNull()
    })

    it('should detect right swipe', () => {
      const endEvent = createPointerEvent(150, 100)
      expect(getMoveDirection(endEvent)).toBe('right')
    })

    it('should detect left swipe', () => {
      const endEvent = createPointerEvent(50, 100)
      expect(getMoveDirection(endEvent)).toBe('left')
    })

    it('should detect up swipe', () => {
      const endEvent = createPointerEvent(100, 50)
      expect(getMoveDirection(endEvent)).toBe('up')
    })

    it('should detect down swipe', () => {
      const endEvent = createPointerEvent(100, 150)
      expect(getMoveDirection(endEvent)).toBe('down')
    })

    it('should return null for small movements below threshold', () => {
      const endEvent = createPointerEvent(110, 105) // Small movement
      expect(getMoveDirection(endEvent)).toBeNull()
    })

    it('should prioritize horizontal movement when it has greater magnitude', () => {
      const endEvent = createPointerEvent(150, 120) // More horizontal than vertical
      expect(getMoveDirection(endEvent)).toBe('right')
    })

    it('should prioritize vertical movement when it has greater magnitude', () => {
      const endEvent = createPointerEvent(120, 150) // More vertical than horizontal
      expect(getMoveDirection(endEvent)).toBe('down')
    })

    it('should return null for non-touch pointer events', () => {
      const mouseEvent = createPointerEvent(150, 100, 'mouse')
      expect(getMoveDirection(mouseEvent)).toBeNull()
    })
  })
})
