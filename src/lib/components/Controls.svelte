<!-- @component Component that renders the controls for the game -->
<script lang="ts">
  let { reset } = $props()
</script>

<button onclick={reset} class="px-3 py-2 font-medium text-2xl bg-slate-700 text-slate-100 rounded-md cursor-pointer">New Game</button>
