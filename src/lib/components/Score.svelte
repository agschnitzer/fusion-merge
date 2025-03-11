<!-- @component Component that renders the score of the game -->
<script lang="ts">
  let { score, highScore } = $props()
</script>

<div class="xs:min-w-32 p-4 flex xs:block justify-between text-2xl uppercase bg-highlight rounded-lg">
  <p class="xs:leading-5">Score {score}</p>
  <p class="xs:text-xl xs:leading-4">Best {highScore}</p>
</div>

