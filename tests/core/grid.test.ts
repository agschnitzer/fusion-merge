import { createGrid } from '$lib/core/grid.svelte'
import * as storage from '$lib/helpers/storage'
import type { Direction, GridState } from '$lib/types/grid.type'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('createGrid()', () => {
  const size = 4
  let state: GridState

  beforeEach(() => {
    // Reset random to be predictable
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5)
    state = createGrid(size)
    state.initializeGrid(true)
  })

  afterEach(vi.restoreAllMocks)

  it('should create a grid of the correct size', () => {
    expect(state.grid.length).toBe(size)
    state.grid.forEach(row => expect(row.length).toBe(size))
  })

  it('should initialize with two random tiles', () => expect(state.grid.flat().filter(Boolean).length).toBe(2))

  it('should move tiles in the specified direction', () => {
    state.grid = [
      [{ value: 1, row: 0, column: 0, mergedThisTurn: false }, null, null, null],
      [null, { value: 3, row: 1, column: 1, mergedThisTurn: false }, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    const moved = state.moveTiles('left')

    expect(moved).toBeTruthy()
    expect(state.grid[0][0]!.value).toBe(1)
    expect(state.grid[1][0]!.value).toBe(3)
    expect(state.grid[1][1]).toBeNull()
  })

  it('should merge tiles of the same value', () => {
    state.grid = [
      [{ value: 1, row: 0, column: 0, mergedThisTurn: false }, null, null, null],
      [{ value: 1, row: 1, column: 0, mergedThisTurn: false }, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    const initialScore = state.score
    state.moveTiles('up')

    const tile = state.grid[0][0]!
    expect(tile.value).toBe(2)
    expect(tile.row).toBe(0)
    expect(tile.column).toBe(0)
    expect(tile.mergedThisTurn).toBeTruthy()

    expect(state.grid[1][0]).toBeNull()
    expect(state.score).toBeGreaterThan(initialScore)
  })

  it('should add a random tile after moving', () => {
    state.grid = [
      [{ value: 2, row: 0, column: 0, mergedThisTurn: false }, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    const tile = state.addTile()
    expect(state.grid[tile.row][tile.column]).toBe(tile)
    expect(state.grid.flat().filter(Boolean).length).toBe(2)
  })

  it('should detect game over correctly', () => {
    state.grid = [
      [
        { value: 2, row: 0, column: 0, mergedThisTurn: false },
        { value: 3, row: 0, column: 1, mergedThisTurn: false },
        { value: 2, row: 0, column: 2, mergedThisTurn: false },
        { value: 3, row: 0, column: 3, mergedThisTurn: false },
      ],
      [
        { value: 3, row: 1, column: 0, mergedThisTurn: false },
        { value: 2, row: 1, column: 1, mergedThisTurn: false },
        { value: 3, row: 1, column: 2, mergedThisTurn: false },
        { value: 2, row: 1, column: 3, mergedThisTurn: false },
      ],
      [
        { value: 2, row: 2, column: 0, mergedThisTurn: false },
        { value: 3, row: 2, column: 1, mergedThisTurn: false },
        { value: 2, row: 2, column: 2, mergedThisTurn: false },
        { value: 3, row: 2, column: 3, mergedThisTurn: false },
      ],
      [
        { value: 3, row: 3, column: 0, mergedThisTurn: false },
        { value: 2, row: 3, column: 1, mergedThisTurn: false },
        { value: 3, row: 3, column: 2, mergedThisTurn: false },
        { value: 2, row: 3, column: 3, mergedThisTurn: false },
      ],
    ]

    const directions: Direction[] = ['up', 'down', 'left', 'right']
    directions.forEach(direction => expect(state.moveTiles(direction)).toBeFalsy())

    expect(state.isGameOver).toBe(true)
  })

  it('should reset the grid to initial state', () => {
    state.grid = [
      [{ value: 1, row: 0, column: 0, mergedThisTurn: false }, null, null, null],
      [null, { value: 3, row: 1, column: 1, mergedThisTurn: false }, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    const tiles = state.resetGrid()

    expect(state.isGameOver).toBe(false)
    expect(state.score).toBe(0)
    tiles.forEach(tile => expect(state.grid[tile.row][tile.column]).toBe(tile))
    expect(state.grid.flat().filter(Boolean).length).toBe(2)
  })

  it('should test movement in all directions', () => {
    state.grid = [
      [null, null, null, { value: 1, row: 0, column: 3, mergedThisTurn: false }],
      [null, null, null, { value: 1, row: 1, column: 3, mergedThisTurn: false }],
      [null, null, null, null],
      [null, null, null, null],
    ]

    // Test right - no movement
    expect(state.moveTiles('right')).toBeFalsy()

    // Test down
    expect(state.moveTiles('down')).toBeTruthy()
    expect(state.grid[0][3]).toBeNull()
    expect(state.grid[3][3]?.value).toBe(2)

    // Reset and test up
    state.grid = [
      [null, null, null, null],
      [null, null, null, null],
      [null, { value: 2, row: 2, column: 1, mergedThisTurn: false }, null, null],
      [null, { value: 2, row: 3, column: 1, mergedThisTurn: false }, null, null],
    ]

    expect(state.moveTiles('up')).toBeTruthy()
    expect(state.grid[0][1]?.value).toBe(3)
    expect(state.grid[2][1]).toBeNull()
    expect(state.grid[3][1]).toBeNull()
  })

  it('should reset mergedThisTurn flags after each move', () => {
    state.grid = [
      [{ value: 1, row: 0, column: 0, mergedThisTurn: true }, { value: 1, row: 0, column: 1, mergedThisTurn: true }, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    state.moveTiles('down')

    state.grid.forEach(row => {
      row.forEach(tile => {
        if (tile) expect(tile.mergedThisTurn).toBeFalsy()
      })
    })
  })

  it('should update high score when score increases beyond previous high', () => {
    state.grid = [
      [{ value: 10, row: 0, column: 0, mergedThisTurn: false }, { value: 10, row: 0, column: 1, mergedThisTurn: false }, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    const initialHighScore = state.highScore
    state.moveTiles('left')

    // 2^11 = 2048 points added to score
    expect(state.score).toBeGreaterThan(initialHighScore)
    expect(state.highScore).toBe(state.score)
  })

  it('should track move count correctly', () => {
    state.grid = [
      [{ value: 1, row: 0, column: 0, mergedThisTurn: false }, null, null, null],
      [null, { value: 2, row: 1, column: 1, mergedThisTurn: false }, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    expect(state.moveCount).toBe(0)
    state.moveTiles('left')
    expect(state.moveCount).toBe(1)

    state.moveTiles('left')
    expect(state.moveCount).toBe(1)

    state.moveTiles('right')
    expect(state.moveCount).toBe(2)
  })

  it('should save and load game state correctly', () => {
    const mockSaveGameState = vi.spyOn(storage, 'saveGameState')
    const mockLoadGameState = vi.spyOn(storage, 'loadGameState')

    mockLoadGameState.mockReturnValue({
      grid: [
        [{ value: 4, row: 0, column: 0, mergedThisTurn: false }, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
      score: 64,
      highScore: 128,
      isGameOver: false,
      moveCount: 10,
    })

    state.grid[0][0] = { value: 3, row: 0, column: 0, mergedThisTurn: false }

    // Save current state
    state.saveGrid()
    expect(mockSaveGameState).toHaveBeenCalledTimes(1)

    // Load saved state
    const tiles = state.initializeGrid(false)

    expect(mockLoadGameState).toHaveBeenCalledTimes(1)
    expect(state.grid[0][0]?.value).toBe(4)
    expect(state.score).toBe(64)
    expect(state.highScore).toBe(128)
    expect(state.moveCount).toBe(10)
    expect(tiles).toEqual([]) // No new tiles added when loading saved state
  })
})
