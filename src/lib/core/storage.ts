import { browser } from '$app/environment'
import type { Grid } from '$lib/types/grid.type'

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
 * @returns {Grid | null} The loaded game state or null if not found.
 */
export const loadGameState = (key: string): Grid | null => {
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
 * @param {Grid} state The game state to save.
 */
export const saveGameState = (key: string, state: Grid): void => {
  if (!browser) return

  localStorage.setItem(key, encode(JSON.stringify(state)))
}

/**
 * Loads the score from local storage.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {string} key The key to load the score from local storage.
 * @returns {number} The loaded score or 0 if not found.
 */
export const loadScore = (key: string): number => {
  if (!browser) return 0

  const score = localStorage.getItem(key)

  return score ? parseInt(decode(score)) : 0
}

/**
 * Saves the score to local storage.
 * @since 1.0.0
 * @version 1.0.0
 *
 * @param {string} key The key to save the score to local storage.
 * @param {number} score The score to save.
 */
export const saveScore = (key: string, score: number): void => {
  if (!browser) return

  localStorage.setItem(key, encode(score.toString()))
}
