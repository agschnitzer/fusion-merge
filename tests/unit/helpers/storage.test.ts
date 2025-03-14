import * as environment from '$app/environment'
import { decode, encode, loadGameState, saveGameState } from '$lib/helpers/storage'
import type { GameState } from '$lib/types/grid.type'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock browser environment
vi.mock('$app/environment', () => ({ browser: true }))

const mockStore: Record<string, string> = {}
const mockLocalStorage = {
  getItem: vi.fn(key => mockStore[key] || null),
  setItem: vi.fn((key, value) => { mockStore[key] = value }),
}

// Sample game state for tests
const testState: GameState = {
  grid: [[{ value: 2, row: 0, column: 0, mergedThisTurn: false }]],
  score: 10,
  highScore: 100,
  isGameOver: false,
  isGameWon: false,
  moveCount: 5,
}

beforeEach(() => {
  // Setup mocks
  vi.stubGlobal('localStorage', mockLocalStorage)
  vi.stubGlobal('btoa', vi.fn(str => str ? 'encoded:' + str : ''))
  vi.stubGlobal('atob', vi.fn(str => str.startsWith('encoded:') ? str.slice(8) : ''))

  vi.clearAllMocks()
  Object.keys(mockStore).forEach(key => delete mockStore[key])
})

afterAll(vi.restoreAllMocks)

describe('encode() and decode()', () => {
  it('should encode and decode strings correctly', () => {
    const testStr = 'test-string'
    const encoded = encode(testStr)

    expect(encoded).toBe('encoded:test-string')
    expect(decode(encoded)).toBe(testStr)
  })

  it('should handle empty strings', () => {
    expect(encode('')).toBe('')
    expect(decode('')).toBe('')
  })
})

describe('saveGameState() and loadGameState()', () => {
  it('should save game state to localStorage', () => {
    saveGameState('game', testState)

    expect(localStorage.setItem).toHaveBeenCalledWith('game', `encoded:${ JSON.stringify(testState) }`)
  })

  it('should load game state from localStorage', () => {
    // Setup storage with encoded state
    mockStore['game'] = 'encoded:' + JSON.stringify(testState)

    const result = loadGameState('game')

    expect(localStorage.getItem).toHaveBeenCalledWith('game')
    expect(result).toEqual(testState)
  })

  it('should handle browser environment correctly', () => {
    const browserSpy = vi.spyOn(environment, 'browser', 'get').mockReturnValue(false)

    saveGameState('game', testState)
    const result = loadGameState('game')

    expect(localStorage.setItem).not.toHaveBeenCalled()
    expect(result).toBeNull()

    browserSpy.mockRestore()
  })

  it('should return null when state does not exist', () => {
    expect(loadGameState('non-existent')).toBeNull()
  })
})
