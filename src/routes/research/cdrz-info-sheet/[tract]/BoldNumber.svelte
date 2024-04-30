<div class="wrapper">
  <div class="number">
    {#if $$slots.prefix}
      <span class="prefix"><slot name="prefix" /></span>
    {/if}
    <span><slot /></span>
    {#if $$slots.suffix}
      <span class="suffix"><slot name="suffix" /></span>
    {/if}
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
    font-family: JetBrains Mono, monospace;
    font-size: 24px;
    font-weight: 500;
    display: flex;
    flex-direction: row;
  }

  .prefix,
  .suffix {
    font-size: 18px;
    line-height: 18px;
    margin-top: 1px;
  }

  .prefix {
    margin-right: 2px;
  }

  .suffix {
    margin-left: 2px;
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
