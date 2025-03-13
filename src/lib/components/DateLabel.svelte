<script lang="ts">
  let { children, date, class: styles } = $props()

  /**
   * Convert a date string to a human-readable format.
   * @since 1.0.0
   * @version 1.0.0
   *
   * @param {string} date The date string to convert.
   * @returns {string} A human-readable date string.
   */
  export const dateToString = (date: string): string => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
</script>

<p class={styles}>
  {@render children()}
  <time datetime={date}>{dateToString(date)}</time>
</p>
