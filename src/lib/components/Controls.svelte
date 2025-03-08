<!-- @component Component that renders the controls for the game -->
<script lang="ts">
  let { reset } = $props()
</script>

<button onclick={reset} class="px-3 py-2 font-medium bg-slate-700 text-slate-50 rounded-md">New Game</button>
