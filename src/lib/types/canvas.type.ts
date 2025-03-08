/**
 * Represents the state of the canvas.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @interface CanvasState
 * @property {boolean} animating Indicates if the canvas is animating.
 * @property {number} animationDuration The duration of the animation.
 * @property {(t?: number) => void} draw Draws the tiles on the canvas.
 * @property {(time: number, startTime: number) => void} animate Animates the tiles on the canvas.
 */
export interface CanvasState {
  animating: boolean
  animationDuration: number
  draw: (t?: number) => void
  animate: (time: number, startTime: number) => void
}
