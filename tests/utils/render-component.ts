import type { Game } from '$lib/types/game.type'
import type { Component, ComponentProps } from 'svelte'
import { render, type RenderResult } from '@testing-library/svelte'

/**
 * Represents the context for rendering a component in a test.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @template T The type of the component being rendered.
 * @property {Partial<Game['state']>} [state] The default state object to pass to the component.
 * @property {Partial<Game['input']>} [input] The default input controller object to pass to the component.
 */
type Context = Omit<Partial<Game>, 'state' | 'input'> & {
  state?: Partial<Game['state']>
  input?: Partial<Game['input']>
}

/**
 * Represents the options for rendering a component in a test.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @template T The type of the component being rendered.
 * @property {Partial<ComponentProps<T>>} [props] The default props to pass to the component.
 * @property {Context} [context] The default context to pass to the component.
 */
type RenderOptions<T extends Component> = {
  props?: Partial<ComponentProps<T>>,
  context?: Context
}

/**
 * Returns a function that renders a Svelte component.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @template T The type of the component being rendered.
 * @param {ReturnType<typeof render>['component']} component The Svelte component to render.
 * @param {RenderOptions<T>} defaultOptions The default options to use when rendering the component.
 * @returns {<T extends Component>(options?: RenderOptions<T>) => RenderResult<T>} A function that takes options and returns the rendered component.
 */
export const createRenderComponent = <T extends Component>(
    component: ReturnType<typeof render>['component'],
    defaultOptions: RenderOptions<T> = {},
): <T extends Component>(options?: RenderOptions<T>) => RenderResult<T> => <T extends Component>(options?: RenderOptions<T>): RenderResult<T> =>
    render(component, {
      props: {
        ...defaultOptions?.props,
        ...options?.props,
      },
      context: new Map([['game', {
        ...defaultOptions?.context,
        ...options?.context,
        state: {
          ...defaultOptions?.context?.state,
          ...options?.context?.state,
        },
      }]]),
    })
