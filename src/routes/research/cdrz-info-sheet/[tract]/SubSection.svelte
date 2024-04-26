<script lang="ts">
  export let style = '';
</script>

<div style="{style}">
  <slot name="heading" />
  <div class="indent">
    <slot />
  </div>
</div>

<style>
  div.indent {
    margin-left: 22px;
  }
</style>
