import type { Coordinates, Direction } from '$lib/types/grid.type'
import type { InputController } from '$lib/types/input.type'

/**
 * Creates an input controller for handling keyboard and touch inputs.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @returns {InputController} An object containing methods to handle input events.
 */
export const createInputController = (): InputController => {
  const minSwipeDistance = 30
  const keyMappings: Record<string, Direction> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  }
  const touchPosition: Coordinates = { x: 0, y: 0 }

  /**
   * Updates the starting position of a touch event.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {TouchEvent} event The start touch event.
   */
  const updateTouchStartPosition = (event: TouchEvent): void => {
    event.preventDefault()

    const touch = event.changedTouches?.[0]
    if (!touch) return

    ({ clientX: touchPosition.x, clientY: touchPosition.y } = touch)
  }

  /**
   * Determines the direction of movement based on a keyboard or touch event.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {KeyboardEvent | TouchEvent} event The keyboard or touch event.
   * @returns {Direction | null} A direction string ('up', 'down', 'left', 'right') or null if no valid direction is detected.
   */
  const getMoveDirection = (event: KeyboardEvent | TouchEvent): Direction | null => {
    // Return early if the event is not a touch event
    if (event instanceof KeyboardEvent) return keyMappings[event.key] ?? null

    const touch = event.changedTouches?.[0]
    if (!touch) return null

    const xDiff = touch.clientX - touchPosition.x
    const yDiff = touch.clientY - touchPosition.y
    const absXDiff = Math.abs(xDiff)
    const absYDiff = Math.abs(yDiff)

    if (absXDiff > absYDiff) return absXDiff >= minSwipeDistance ? (xDiff > 0 ? 'right' : 'left') : null
    return absYDiff >= minSwipeDistance ? (yDiff > 0 ? 'down' : 'up') : null
  }

  return {
    updateTouchStartPosition,
    getMoveDirection,
  }
}
