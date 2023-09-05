<aside class="legend">
  <h1>Legend</h1>
  <slot />
</aside>

<style>
  h1 {
    font-size: 16px;
    margin: 0 0 6px 0;
  }

  .legend {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: white;
    z-index: 400;
    padding: 10px;
    border-radius: 3px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  }
</style>
