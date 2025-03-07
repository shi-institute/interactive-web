<script lang="ts">
  import { dev } from '$app/environment';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import ThemeSwitchButton from '$lib/ThemeSwitchButton.svelte';
  import 'fluent-svelte/theme.css';
  import 'leaflet/dist/leaflet.css';
  import NProgress from 'nprogress';
  import { onDestroy, onMount } from 'svelte';

  export let data;

  let headerVisibleHeight = 30;
  let headerElem: HTMLElement;

  let observer: IntersectionObserver;
  onMount(() => {
    observer = new IntersectionObserver(handleIntersect, {
      threshold: [
        0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.13, 0.14, 0.15,
        0.16, 0.17, 0.18, 0.19, 0.2, 0.21, 0.22, 0.23, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29, 0.3,
        0.31, 0.32, 0.33, 0.34, 0.35, 0.36, 0.37, 0.38, 0.39, 0.4, 0.41, 0.42, 0.43, 0.44, 0.45,
        0.46, 0.47, 0.48, 0.49, 0.5, 0.51, 0.52, 0.53, 0.54, 0.55, 0.56, 0.57, 0.58, 0.59, 0.6,
        0.61, 0.62, 0.63, 0.64, 0.65, 0.66, 0.67, 0.68, 0.69, 0.7, 0.71, 0.72, 0.73, 0.74, 0.75,
        0.76, 0.77, 0.78, 0.79, 0.8, 0.81, 0.82, 0.83, 0.84, 0.85, 0.86, 0.87, 0.88, 0.89, 0.9,
        0.91, 0.92, 0.93, 0.94, 0.95, 0.96, 0.97, 0.98, 0.99, 1, 1,
      ],
    });
    if (headerElem) observer.observe(headerElem);
  });
  onDestroy(() => {
    if (headerElem) observer?.unobserve(headerElem);
    observer?.disconnect();
  });

  function handleIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach((entry) => {
      headerVisibleHeight = entry.intersectionRect.height;
    });
  }

  // configure the navigation progress bar
  NProgress.configure({
    parent: 'body',
    easing: 'ease',
    speed: 500,
    trickle: true,
    trickleSpeed: 200,
    showSpinner: false,
  });

  // show progress bar on page navigate
  let navigating = false;
  let showWorkingCursor = false;
  let showBusyCursor = false;
  beforeNavigate((evt) => {
    if (!evt.willUnload) {
      navigating = true;
      setTimeout(() => {
        if (navigating) {
          showWorkingCursor = true;
        }
      }, 100);
      setTimeout(() => {
        if (navigating) {
          showBusyCursor = true;
        }
      }, 1000);
      setTimeout(() => {
        if (navigating) {
          NProgress.start();
        }
      }, 120);
    }
  });

  // hide progress bar on navigation end
  afterNavigate(() => {
    navigating = false;
    showWorkingCursor = false;
    showBusyCursor = false;
    NProgress.done();
  });
</script>

{#if !data.isEmbedded}
  <header bind:this="{headerElem}">
    <div class="left">
      <nav>
        <ul>
          {#if data.isDeployedPreview}
            <span class="preview">Deployment Preview</span>
          {:else if dev}
            <span class="preview">Dev</span>
          {/if}
          <a href="https://www.furman.edu/shi-institute/sustainability-research/">
            Shi Applied Research
          </a>
          <a href="/research">All Visualizations</a>
          {#if dev}
            <a href="/research/sitemap">Sitemap</a>
          {/if}
        </ul>
      </nav>
      <div class="title"></div>
    </div>
    <div class="meta">
      <ThemeSwitchButton />
    </div>
  </header>
{/if}

<main style="--headerVisibleHeight: {headerVisibleHeight}px;">
  <slot />
  <style>
    /* purple accent color */
    :root {
      /* light mode */
      --fds-accent-dark-1: 253, 54%, 47%;
      --fds-accent-dark-2: 253, 54%, 47%;
      --fds-accent-dark-p: 253, 54%, 47%; /* used by plots */

      /* dark mode */
      --fds-accent-light-2: 253, 49%, 80%;
      --fds-accent-light-3: 253, 49%, 80%;
      --fds-accent-light-p: 253, 49%, 68%; /* used by plots */
    }
  </style>
  {#if data.isDeployedPreview}
    <style>
      :root {
        --fds-accent-dark-1: 15, 99%, 39%;
        --fds-accent-dark-2: 15, 99%, 39%;
        --fds-accent-dark-p: 15, 99%, 39%;

        --fds-accent-light-2: 22, 99%, 60%;
        --fds-accent-light-3: 22, 99%, 60%;
        --fds-accent-light-p: 22, 99%, 58%;
      }
    </style>
  {/if}
  {#if showBusyCursor}
    <style>
      #pageArea {
        cursor: wait;
      }
      #pageArea > main {
        pointer-events: none;
        user-select: none;
      }
    </style>
  {:else if showWorkingCursor}
    <style>
      #pageArea {
        cursor: progress;
      }
    </style>
  {/if}
</main>

<style>
  header {
    --height: var(--header-height);
    background-color: black;
    color: #e0e0e0;
    height: var(--height);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px 0 0;
    font-size: 13px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  ul {
    height: var(--height);
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  nav a {
    height: var(--height);
    display: inline-flex;
    align-items: center;
    color: inherit;
    text-decoration: none;
    padding: 0 10px;
  }
  nav a:hover {
    background-color: rgba(255, 255, 255, 0.18);
  }
  nav a:active {
    background-color: rgba(255, 255, 255, 0.26);
  }

  main {
    flex-grow: 1;
  }

  .preview {
    background-color: var(--fds-accent-default);
    color: var(--fds-text-on-accent-primary);
    padding: 1px 10px;
    font-weight: 500;
    font-size: 14px;
    font-family: var(--fds-font-family-text);
    border-radius: 12px;
    margin: 0 4px 0 8px;
    user-select: none;
  }
</style>
