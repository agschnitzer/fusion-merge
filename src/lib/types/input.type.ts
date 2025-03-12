import type { Direction } from '$lib/types/grid.type'

/**
 * Represents a controller for handling input events.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface InputController
 */
export interface InputController {
  /**
   * Updates the starting position of a touch event.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {TouchEvent} event The start touch event.
   */
  updateTouchStartPosition: (event: TouchEvent) => void
  /**
   * Determines the direction of movement based on a keyboard or touch event.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {KeyboardEvent | TouchEvent} event The keyboard or touch event.
   * @returns {Direction | null} A direction string ('up', 'down', 'left', 'right') or null if no valid direction is detected.
   */
  getMoveDirection: (event: KeyboardEvent | TouchEvent) => Direction | null
}
