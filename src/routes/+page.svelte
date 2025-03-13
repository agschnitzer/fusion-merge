<script lang="ts">
  import Canvas from '$lib/components/modules/Canvas.svelte'
  import Score from '$lib/components/elements/Score.svelte'
  import type { Game } from '$lib/types/game.type'
  import { getContext } from 'svelte'

  let { data } = $props()

  const game: Game = getContext('game')
  $effect(() => {
    document.fonts.ready.then(game.initializeGame)
  })
</script>

<svelte:window onkeydown={game.handleGameMovement} onresize={game.canvas.adjustCanvasSize}/>

<svelte:head>
  {@html `<script type="application/ld+json">${JSON.stringify(data.meta.structuredData)}</script>`}
</svelte:head>

<Score/>
<Canvas/>

