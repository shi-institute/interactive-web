<div class="page-title-wrapper">
  <h1><slot /></h1>
  <p class="caption"><slot name="caption" /></p>
</div>

<style>
  .page-title-wrapper {
    background-color: #212121;
    color: #e0e0e0;
    padding: 10px;
    margin: 0;
    border-bottom: 1px solid #3d3d3d;
  }

  h1 {
    margin: 0;
    font-size: 1.5em;
  }

  .caption {
    margin: 0 0 4px 0;
  }
</style>
