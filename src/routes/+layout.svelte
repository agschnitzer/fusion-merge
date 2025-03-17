<script lang="ts">
  import '../app.css'
  import { page } from '$app/state'
  import DateLabel from '$lib/components/elements/DateLabel.svelte'
  import Footer from '$lib/components/modules/Footer.svelte'
  import Header from '$lib/components/modules/Header.svelte'
  import { createGame } from '$lib/core/game.svelte'
  import { setContext } from 'svelte'

  let { children } = $props()

  const game = createGame()
  setContext('game', game)
</script>

<svelte:head>
  <link rel="canonical" href={page.data.meta.url}>

  <title>{page.data.meta.title}</title>
  <meta property="og:title" content={page.data.meta.title}>
  <meta name="og:site_name" content={page.data.meta.title}>
  <meta property="twitter:title" content={page.data.meta.title}>

  <meta name="description" content={page.data.meta.description}>
  <meta property="og:description" content={page.data.meta.description}>
  <meta property="twitter:description" content={page.data.meta.description}>

  <meta property="og:locale" content="en_GB">
  <meta property="og:type" content="website">
  <meta property="og:url" content={page.data.meta.url}>
  <meta name="twitter:card" content="summary_large_image">

  <meta property="og:image" content={page.data.meta.image.src}>
  <meta property="twitter:image" content={page.data.meta.image.src}>
  <meta property="og:image:alt" content={page.data.meta.image.alt}>
  <meta property="twitter:image:alt" content={page.data.meta.image.alt}>
  <meta property="og:image:width" content={page.data.meta.image.width.toString()}>
  <meta property="og:image:height" content={page.data.meta.image.height.toString()}>
  <meta property="og:image:type" content={page.data.meta.image.format}>
</svelte:head>

<DateLabel date={page.data.meta.publishedOn} class="sr-only">Published on</DateLabel>
<DateLabel date={page.data.meta.updatedAt} class="sr-only">Last updated on</DateLabel>

<div class="w-fit mx-auto px-6">
  <Header/>
  <main class="max-w-2xl">{@render children()}</main>
  <Footer/>
</div>
