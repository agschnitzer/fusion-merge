import type { GridState } from '$lib/types/grid.type'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createGrid } from '$lib/core/grid.svelte'

describe('createGrid()', () => {
  let state: GridState
  const size = 4

  beforeEach(() => {
    // Reset random to be predictable
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5)
    state = createGrid(size)
  })

  afterEach(vi.restoreAllMocks)

  it('should create a grid of the correct size', () => {
    expect(state.grid.length).toBe(size)
    state.grid.forEach(row => expect(row.length).toBe(size))
  })

  it('should initialize with two random tiles', () => {
    // Count non-null cells
    const nonEmptyCount = state.grid.flat().filter(cell => cell !== null).length
    expect(nonEmptyCount).toBe(2)
  })

  it('should move tiles in the specified direction', () => {
    state.grid = [
      [{ value: 1, x: 0, y: 0 }, null, null, null],
      [null, { value: 3, x: 1, y: 1 }, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    // Move left
    const moved = state.moveTiles('left')

    // Check the grid has changed as expected
    expect(moved).toBe(true)
    expect(state.grid[0][0]?.value).toBe(1)
    expect(state.grid[1][0]?.value).toBe(3)
    expect(state.grid[1][1]).toBe(null)
  })

  it('should merge tiles of the same value', () => {
    state.grid = [
      [{ value: 1, x: 0, y: 0 }, { value: 1, x: 1, y: 0 }, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    const initialScore = state.score
    state.moveTiles('left')

    // Check that tiles merged and score increased
    expect(state.grid[0][0]?.value).toBe(2)
    expect(state.score).toBeGreaterThan(initialScore)
  })

  it('should add a random tile after moving', () => {
    state.grid = [
      [{ value: 2, x: 0, y: 0 }, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    state.addRandomTile()

    // Count non-null cells, should be 2 now
    const nonEmptyCount = state.grid.flat().filter(cell => cell !== null).length
    expect(nonEmptyCount).toBe(2)
  })

  it('should detect game over correctly', () => {
    state.grid = [
      [{ value: 2, x: 0, y: 0 }, { value: 3, x: 1, y: 0 }, { value: 2, x: 2, y: 0 }, { value: 3, x: 3, y: 0 }],
      [{ value: 3, x: 0, y: 1 }, { value: 2, x: 1, y: 1 }, { value: 3, x: 2, y: 1 }, { value: 2, x: 3, y: 1 }],
      [{ value: 2, x: 0, y: 2 }, { value: 3, x: 1, y: 2 }, { value: 2, x: 2, y: 2 }, { value: 3, x: 3, y: 2 }],
      [{ value: 3, x: 0, y: 3 }, { value: 2, x: 1, y: 3 }, { value: 3, x: 2, y: 3 }, { value: 2, x: 3, y: 3 }],
    ]

    // Try moving in all directions to trigger game over check
    state.moveTiles('left')
    state.moveTiles('right')
    state.moveTiles('up')
    state.moveTiles('down')

    expect(state.gameOver).toBe(true)
  })

  it('should reset the grid to initial state', () => {
    state.grid = [
      [{ value: 1, x: 0, y: 0 }, null, null, null],
      [null, { value: 3, x: 1, y: 1 }, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    // Reset the grid
    state.reset()

    expect(state.gameOver).toBe(false)
    expect(state.score).toBe(0)

    const nonEmptyCount = state.grid.flat().filter(cell => cell !== null).length
    expect(nonEmptyCount).toBe(2)
  })
})
