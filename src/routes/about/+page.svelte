<script lang="ts">
  import DateLabel from '$lib/components/DateLabel.svelte'

  let { data } = $props()

  const headingId = 'about-heading'
</script>

{#snippet paragraphs(text: string[])}
  {#each text as p}
    <p>{@html p}</p>
  {/each}
{/snippet}

<article aria-labelledby={headingId} class="mb-4 space-y-6 font-sans">
  <header class="mb-4">
    <h2 id={headingId} class="heading-2">{data.heading}</h2>
  </header>
  <div class="space-y-4">
    {@render paragraphs(data.text)}
  </div>

  {#each data.sections as { id, heading, list, text }}
    {@const headingId = `section-${id}-heading`}
    <section aria-labelledby={headingId} class="space-y-4">
      <header>
        <h3 id={headingId} class="heading-3">{heading}</h3>
      </header>
      {#if text}
        {@render paragraphs(text)}
      {/if}
      {#if list}
        <ul class="list-disc pl-4 space-y-2">
          {#each list as item}
            <li>{@html item}</li>
          {/each}
        </ul>
      {/if}
    </section>
  {/each}
  <footer>
    <DateLabel date={data.meta.publishedOn} class="label">
      Last updated on
    </DateLabel>
  </footer>
</article>
