import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest'
import { createInputController } from '$lib/helpers/input'

const mockPointer = (x: number, y: number, type: string = 'touch'): PointerEvent => ({
  x, y, pointerType: type,
  preventDefault: vi.fn(),
} as unknown as PointerEvent)

const mockKeyboard = (key: string): KeyboardEvent => new KeyboardEvent('keydown', { key })

let controller: ReturnType<typeof createInputController>

beforeEach(() => {
  controller = createInputController()
  vi.useFakeTimers()
  vi.spyOn(performance, 'now').mockImplementation(() => Date.now())
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('updatePointerStartPosition()', () => {
  it('should update pointer position for touch events', () => {
    const event = mockPointer(150, 200)
    controller.updatePointerStartPosition(event)

    // Test swipe detection to verify position was updated
    expect(controller.getMoveDirection(mockPointer(200, 200))).toBe('right')
  })

  it('should ignore non-touch pointer events', () => {
    const event = mockPointer(150, 200, 'mouse')
    controller.updatePointerStartPosition(event)

    // The position is not updated, so no direction should be detected
    expect(controller.getMoveDirection(mockPointer(200, 200, 'touch'))).toBeNull()
  })
})

describe('throttlePointerEvent()', () => {
  it('should throttle multiple calls', () => {
    const callback = vi.fn()

    // The first call should execute
    controller.throttlePointerEvent(mockPointer(100, 100), callback)
    expect(callback).toHaveBeenCalledTimes(1)

    // Second immediate call should be throttled
    controller.throttlePointerEvent(mockPointer(120, 120), callback)
    expect(callback).toHaveBeenCalledTimes(1)

    // After time passes, callback should execute again
    vi.advanceTimersByTime(1000)
    controller.throttlePointerEvent(mockPointer(140, 140), callback)
    expect(callback).toHaveBeenCalledTimes(2)
  })
})

describe('getMoveDirection()', () => {
  it('should handle keyboard arrow keys', () => {
    expect(controller.getMoveDirection(mockKeyboard('ArrowUp'))).toBe('up')
    expect(controller.getMoveDirection(mockKeyboard('ArrowDown'))).toBe('down')
    expect(controller.getMoveDirection(mockKeyboard('ArrowLeft'))).toBe('left')
    expect(controller.getMoveDirection(mockKeyboard('ArrowRight'))).toBe('right')
    expect(controller.getMoveDirection(mockKeyboard('a'))).toBeNull()
  })

  describe('swipe detection', () => {
    beforeEach(() => controller.updatePointerStartPosition(mockPointer(100, 100)))

    it('should detect swipes in all directions', () => {
      expect(controller.getMoveDirection(mockPointer(150, 100))).toBe('right')

      controller.resetSwipeState()
      expect(controller.getMoveDirection(mockPointer(50, 100))).toBe('left')

      controller.resetSwipeState()
      expect(controller.getMoveDirection(mockPointer(100, 50))).toBe('up')

      controller.resetSwipeState()
      expect(controller.getMoveDirection(mockPointer(100, 150))).toBe('down')
    })

    it('should ignore small movements and non-touch events', () => {
      expect(controller.getMoveDirection(mockPointer(102, 100))).toBeNull()
      expect(controller.getMoveDirection(mockPointer(100, 102))).toBeNull()
      expect(controller.getMoveDirection(mockPointer(150, 100, 'mouse'))).toBeNull()
    })

    it('should prioritize axis with larger movement', () => {
      expect(controller.getMoveDirection(mockPointer(150, 120))).toBe('right')
      controller.resetSwipeState()
      expect(controller.getMoveDirection(mockPointer(120, 150))).toBe('down')
    })

    it('should handle uninitialized pointer positions', () => {
      // Create a fresh controller without initializing pointer position
      const freshController = createInputController()

      // Attempting to get the direction without an initialized position should return null
      expect(freshController.getMoveDirection(mockPointer(150, 150))).toBeNull()
    })
  })
})

describe('resetSwipeState()', () => {
  it('should process only one swipe until reset', () => {
    controller.updatePointerStartPosition(mockPointer(100, 100))

    // The first swipe is detected
    expect(controller.getMoveDirection(mockPointer(150, 100))).toBe('right')

    // The second swipe is ignored
    expect(controller.getMoveDirection(mockPointer(50, 100))).toBeNull()

    // After reset, swipe is detected again
    controller.resetSwipeState()
    expect(controller.getMoveDirection(mockPointer(50, 100))).toBe('left')
  })

  it('should reset state when updating start position', () => {
    controller.updatePointerStartPosition(mockPointer(100, 100))
    expect(controller.getMoveDirection(mockPointer(150, 100))).toBe('right')

    // Update start position (which should reset swipe state)
    controller.updatePointerStartPosition(mockPointer(200, 200))
    expect(controller.getMoveDirection(mockPointer(150, 200))).toBe('left')
  })
})
