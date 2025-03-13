<script lang="ts">
  import { page } from '$app/state'
</script>

<footer class="py-4 flex flex-wrap justify-between items-center 2xs:gap-x-4">
  {#if page.url.pathname === '/'}
    <a href="/about/" class="heading-3">About the game</a>
  {:else}
    <a href="/" class="heading-3">Back to game</a>
  {/if}
  <p class="label">&copy; {new Date().getFullYear()} Alex Gschnitzer</p>
</footer>
