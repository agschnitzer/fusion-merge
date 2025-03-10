<!-- @component Component that renders the score of the game -->
<script lang="ts">
  let { score } = $props()
</script>

<p class="px-4 flex items-center font-semibold text-3xl text-center uppercase text-slate-700 bg-slate-300 rounded-md">Score {score}</p>
