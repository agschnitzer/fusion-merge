/**
 * Represents the state of the canvas.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface CanvasState
 * @property {boolean} animating Whether the canvas is drawing or not.
 * @property {number} animationDuration The duration of the animation.
 * @property {HTMLCanvasElement} element The canvas element.
 * @property {(t?: number) => void} draw Draws the tiles on the canvas.
 * @property {(time: number, startTime: number) => void} animate Animates the tiles on the canvas.
 */
export interface CanvasState {
  animating: boolean
  animationDuration: number
  element: HTMLCanvasElement
  draw: (t?: number) => void
  animate: (time: number, startTime: number) => void
}
