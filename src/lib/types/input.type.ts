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
   * Updates the starting position of a pointer event.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {PointerEvent} event The start pointer event.
   */
  updatePointerStartPosition: (event: PointerEvent) => void
  /**
   * Throttles pointer event callbacks to prevent excessive function calls.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {PointerEvent} event The pointer event to process.
   * @param {(event: PointerEvent) => void} callback The function to execute when throttle permits.
   */
  throttlePointerEvent: (event: PointerEvent, callback: (event: PointerEvent) => void) => void
  /**
   * Determines the direction of movement based on a keyboard or pointer event.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {KeyboardEvent | PointerEvent} event The keyboard or pointer event.
   * @returns {Direction | null} A direction string ('up', 'down', 'left', 'right') or null if no valid direction is detected.
   */
  getMoveDirection: (event: KeyboardEvent | PointerEvent) => Direction | null
}

/**
 * Represents options for the input controller.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface InputControllerOptions
 */
export interface InputControllerOptions {
  /** Minimum distance for swipe detection in pixels. */
  minSwipeDistance: number
  /** Key mappings for keyboard events to direction strings. */
  keyMappings: Record<string, Direction>
  /** Throttle interval in milliseconds for pointer events. */
  throttleInterval: number
}
