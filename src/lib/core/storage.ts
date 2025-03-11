import { browser } from '$app/environment'
import type { GameState } from '$lib/types/grid.type'

/**
 * Encodes a string using Base64 encoding.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {string} str The string to encode.
 * @returns {string} The Base64 encoded string.
 */
export const encode = (str: string): string => btoa(str)

/**
 * Decodes a Base64 encoded string.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {string} str The Base64 encoded string to decode.
 * @returns {string} The decoded string.
 */
const decode = (str: string): string => atob(str)

/**
 * Loads the game state from local storage.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {string} key The key to load the game state from local storage.
 * @returns {GameState | null} The loaded game state or null if not found.
 */
export const loadGameState = (key: string): GameState | null => {
  if (!browser) return null

  const state = localStorage.getItem(key)
  return state ? JSON.parse(decode(state)) : null
}

/**
 * Saves the game state to local storage.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {string} key The key to save the game state to local storage.
 * @param {GameState} state The game state to save.
 */
export const saveGameState = (key: string, state: GameState): void => {
  if (!browser) return

  localStorage.setItem(key, encode(JSON.stringify(state)))
}
