import type { Coordinates, Direction } from '$lib/types/grid.type'
import type { InputController, InputControllerOptions } from '$lib/types/input.type'

/**
 * Creates an input controller for handling keyboard and pointer inputs.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @returns {InputController} An object containing methods to handle input events.
 */
export const createInputController = (): InputController => {
  const options: InputControllerOptions = {
    minSwipeDistance: 5,
    keyMappings: {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    },
    throttleInterval: 80,
  }

  const pointerPosition: Coordinates = { x: 0, y: 0 }
  let lastCallTime = 0
  let swipeProcessed = false

  /**
   * Updates the starting position of a pointer event.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {TouchEvent} event The start pointer event.
   */
  const updatePointerStartPosition = (event: PointerEvent): void => {
    if (event.pointerType !== 'touch') return
    event.preventDefault()

    pointerPosition.x = event.x
    pointerPosition.y = event.y
    resetSwipeState()
  }

  /**
   * Throttles pointer event callbacks to prevent excessive function calls.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {PointerEvent} event The pointer event to process.
   * @param {(event: PointerEvent) => void} callback The function to execute when throttle permits.
   */
  const throttlePointerEvent = (event: PointerEvent, callback: (event: PointerEvent) => void): void => {
    event.preventDefault()
    const currentTime = performance.now()

    if (currentTime - lastCallTime < options.throttleInterval) return
    lastCallTime = currentTime

    callback(event)
  }

  /**
   * Determines the direction of movement based on a keyboard or pointer event.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {KeyboardEvent | PointerEvent} event The keyboard or pointer event.
   * @returns {Direction | null} A direction string ('up', 'down', 'left', 'right') or null if no valid direction is detected.
   */
  const getMoveDirection = (event: KeyboardEvent | PointerEvent): Direction | null => {
    // Return early if the event is not a pointer event
    if (event instanceof KeyboardEvent) return options.keyMappings[event.key] ?? null

    if (event.pointerType !== 'touch' || swipeProcessed) return null

    const xDiff = event.x - pointerPosition.x
    const yDiff = event.y - pointerPosition.y
    const absXDiff = Math.abs(xDiff)
    const absYDiff = Math.abs(yDiff)

    let direction: Direction | null

    if (absXDiff > absYDiff) {
      direction = absXDiff >= options.minSwipeDistance ? (xDiff > 0 ? 'right' : 'left') : null
    } else {
      direction = absYDiff >= options.minSwipeDistance ? (yDiff > 0 ? 'down' : 'up') : null
    }

    swipeProcessed = !!direction
    return direction
  }

  /**
   * Resets the state of the swipe detection.
   * @since 1.0.0
   * @version 1.0.0
   */
  const resetSwipeState = () => swipeProcessed = false

  return {
    updatePointerStartPosition,
    throttlePointerEvent,
    getMoveDirection,
    resetSwipeState,
  }
}
