<!-- @component Component that renders the controls for the game -->
<script lang="ts">
  let { reset } = $props()
</script>

<button onclick={reset} class="px-5 py-4 text-2xl bg-main text-default rounded-lg cursor-pointer">New Game</button>
