<script lang="ts">
  import { fade } from 'svelte/transition';

  export let src: string;
</script>

<div>
  <p in:fade={{ delay: 400, duration: 200 }}>
    Loading <a href={src}>{src}</a>
  </p>
  <iframe title="" {src} frameborder="0" />
</div>

<style>
  iframe {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  p {
    position: absolute;
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
    word-break: break-all;
  }

  div {
    position: relative;
    width: 100%;
    height: var(--content-height);
  }
</style>
