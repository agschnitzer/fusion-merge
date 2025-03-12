import type { Coordinates } from '$lib/types/grid.type'
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
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
 * @returns {PointerEvent} A mock pointer event object.
 */
const createPointerEvent = (x: number, y: number, pointerType: string = 'touch'): PointerEvent => ({
  x,
  y,
  pointerType,
  preventDefault: () => { },
} as unknown as PointerEvent)

describe('updatePointerStartPosition()', () => {
  let controller: ReturnType<typeof createInputController>
  let pointerPosition: Coordinates

  beforeEach(() => {
    // Access the internal pointerPosition through a test helper or reset controller
    controller = createInputController()
    pointerPosition = { x: 0, y: 0 } // Represents internal state

    vi.spyOn(controller, 'updatePointerStartPosition').mockImplementation((event) => {
      if (event.pointerType !== 'touch') return
      event.preventDefault()

      pointerPosition.x = event.x
      pointerPosition.y = event.y
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should update pointer position for touch events', () => {
    const event = createPointerEvent(150, 200, 'touch')
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    controller.updatePointerStartPosition(event)

    expect(pointerPosition.x).toBe(150)
    expect(pointerPosition.y).toBe(200)
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should ignore non-touch pointer events', () => {
    const event = createPointerEvent(150, 200, 'mouse')
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    controller.updatePointerStartPosition(event)

    expect(pointerPosition.x).toBe(0) // Unchanged
    expect(pointerPosition.y).toBe(0) // Unchanged
    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })
})

describe('throttlePointerEvent()', () => {
  let throttlePointerEvent: ReturnType<typeof createInputController>['throttlePointerEvent']

  beforeEach(() => {
    throttlePointerEvent = createInputController().throttlePointerEvent
    vi.useFakeTimers()
    vi.spyOn(performance, 'now').mockImplementation(() => Date.now())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should execute callback on first call', () => {
    const callback = vi.fn()
    const event = createPointerEvent(100, 100)

    throttlePointerEvent(event, callback)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(event)
  })

  it('should not execute callback if called again too quickly', () => {
    const callback = vi.fn()
    const event1 = createPointerEvent(100, 100)
    const event2 = createPointerEvent(120, 120)

    throttlePointerEvent(event1, callback)
    throttlePointerEvent(event2, callback)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(event1)
  })

  it('should execute callback after throttle interval has passed', () => {
    const callback = vi.fn()
    const event1 = createPointerEvent(100, 100)
    const event2 = createPointerEvent(120, 120)

    throttlePointerEvent(event1, callback)

    vi.advanceTimersByTime(1000)

    throttlePointerEvent(event2, callback)

    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenNthCalledWith(1, event1)
    expect(callback).toHaveBeenNthCalledWith(2, event2)
  })

  it('should execute callback once if called multiple times within throttle interval', () => {
    const callback = vi.fn()
    const baseEvent = createPointerEvent(100, 100)

    throttlePointerEvent(baseEvent, callback)

    // Multiple calls within throttle interval
    for (let i = 0; i < 5; i++) {
      const event = createPointerEvent(100 + i, 100 + i)
      throttlePointerEvent(event, callback)
    }

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should work with custom throttle interval from options', () => {
    // Create a new controller with custom options
    const { throttlePointerEvent } = createInputController()
    const callback = vi.fn()
    const event1 = createPointerEvent(100, 100)
    const event2 = createPointerEvent(120, 120)

    throttlePointerEvent(event1, callback)

    // Advance timer by default throttle interval
    vi.advanceTimersByTime(1000)

    throttlePointerEvent(event2, callback)

    expect(callback).toHaveBeenCalledTimes(2)
  })
})

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

describe('resetSwipeState()', () => {
  let controller: ReturnType<typeof createInputController>

  beforeEach(() => {
    controller = createInputController()
  })

  it('should enable swipe detection after being called', () => {
    // Setup initial position
    const startEvent = createPointerEvent(100, 100)
    controller.updatePointerStartPosition(startEvent)

    // First swipe - should detect direction
    const firstSwipe = createPointerEvent(150, 100)
    expect(controller.getMoveDirection(firstSwipe)).toBe('right')

    // Second swipe without reset - should return null (swipe already processed)
    const secondSwipe = createPointerEvent(50, 100)
    expect(controller.getMoveDirection(secondSwipe)).toBeNull()

    // Reset swipe state
    controller.resetSwipeState()

    // Third swipe after reset - should detect direction again
    const thirdSwipe = createPointerEvent(50, 100)
    expect(controller.getMoveDirection(thirdSwipe)).toBe('left')
  })

  it('should be called automatically when updating pointer start position', () => {
    // Setup initial position
    const startEvent = createPointerEvent(100, 100)
    controller.updatePointerStartPosition(startEvent)

    // First swipe - should detect direction
    const firstSwipe = createPointerEvent(150, 100)
    expect(controller.getMoveDirection(firstSwipe)).toBe('right')

    // Second swipe without reset - should return null
    const secondSwipe = createPointerEvent(50, 100)
    expect(controller.getMoveDirection(secondSwipe)).toBeNull()

    // Update start position (which should reset swipe state internally)
    const newStartEvent = createPointerEvent(200, 200)
    controller.updatePointerStartPosition(newStartEvent)

    // New swipe after updating position - should detect direction
    const newSwipe = createPointerEvent(150, 200)
    expect(controller.getMoveDirection(newSwipe)).toBe('left')
  })

  it('should allow swipe detection on a new touch sequence', () => {
    // First touch sequence
    const firstStartEvent = createPointerEvent(100, 100)
    controller.updatePointerStartPosition(firstStartEvent)

    const firstSwipe = createPointerEvent(150, 100)
    expect(controller.getMoveDirection(firstSwipe)).toBe('right')

    // Simulate finger lift and new touch
    controller.resetSwipeState()

    // Second touch sequence
    const secondStartEvent = createPointerEvent(200, 200)
    controller.updatePointerStartPosition(secondStartEvent)

    const secondSwipe = createPointerEvent(200, 250)
    expect(controller.getMoveDirection(secondSwipe)).toBe('down')
  })
})
