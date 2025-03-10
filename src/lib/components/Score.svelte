<!-- @component Component that renders the score of the game -->
<script lang="ts">
  let { score } = $props()
</script>

<p class="px-4 flex items-center text-3xl uppercase bg-highlight rounded-lg">Score {score}</p>
