<div class="wrapper">
  <div class="number">
    <span class="prefix"><slot name="prefix" /></span>
    <span><slot /></span>
  </div>
  <div class="units"><slot name="units" /></div>
  <div class="caption"><slot name="caption" /></div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
  }

  .number {
    font-family: Rubik, sans-serif;
    font-size: 24px;
    font-weight: 500;
    display: flex;
    flex-direction: row;
  }

  .prefix {
    font-size: 18px;
    line-height: 18px;
    margin-right: 2px;
    margin-top: 1px;
  }

  .units {
    font-size: 14px;
    line-height: 14px;
  }

  .caption {
    font-size: 16px;
    line-height: 16px;
    font-weight: 500;
  }
</style>
