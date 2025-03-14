<script lang="ts">
  import type { Game } from '$lib/types/game.type'
  import { getContext } from 'svelte'

  const game: Game = getContext('game')
</script>

<div class="mb-2 flex flex-wrap justify-between gap-2 text-2xl uppercase">
  <p class="score-card border-text bg-highlight">
    Score<span class="sr-only">:</span>
    <span>{game?.state.score ?? 0}</span>
  </p>
  <p class="score-card">
    Best<span class="sr-only">score:</span>
    <span>{game?.state.highScore ?? 0}</span>
  </p>
</div>
