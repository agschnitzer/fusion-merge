import type { Coordinates, Direction } from '$lib/types/grid.type'
import type { InputController } from '$lib/types/input.type'

/**
 * Creates an input controller for handling keyboard and pointer inputs.
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
  const pointerPosition: Coordinates = { x: 0, y: 0 }

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
    if (event instanceof KeyboardEvent) return keyMappings[event.key] ?? null

    if (event.pointerType !== 'touch') return null

    const xDiff = event.x - pointerPosition.x
    const yDiff = event.y - pointerPosition.y
    const absXDiff = Math.abs(xDiff)
    const absYDiff = Math.abs(yDiff)

    if (absXDiff > absYDiff) return absXDiff >= minSwipeDistance ? (xDiff > 0 ? 'right' : 'left') : null
    return absYDiff >= minSwipeDistance ? (yDiff > 0 ? 'down' : 'up') : null
  }

  return {
    updatePointerStartPosition,
    getMoveDirection,
  }
}
