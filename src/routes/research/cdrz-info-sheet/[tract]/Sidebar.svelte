<script lang="ts">
  import { appSettings, basemapNames } from '$stores/appSettings';
  import { cdrzOptionsStore } from '$stores/cdrzOptionsStore';
  import { ComboBox, TextBlock, ToggleSwitch } from 'fluent-svelte';

  export let pageTitleElemVisibleHeight: number;
  export let noBorderLeft = false;
</script>

<aside class:noBorderLeft="{noBorderLeft}">
  <div class="sticky-wrapper" style="--pageTitleElemVisibleHeight: {pageTitleElemVisibleHeight}px;">
    <div class="wrapper-internal">
      <TextBlock variant="bodyStrong" style="padding: 24px 0 0px 0;">Options</TextBlock>

      <TextBlock variant="body" class="cdrz-info-sidebar--field-title">Year</TextBlock>
      <TextBlock variant="caption" class="cdrz-info-sidebar--field-caption">
        Choose the year for census data
      </TextBlock>
      <div>
        <ComboBox
          style="width: 100%;"
          items="{[
            { name: '2020', value: 2020 },
            { name: '2010', value: 2010 },
          ]}"
          bind:value="{$cdrzOptionsStore.year}"
        />
      </div>

      <TextBlock variant="body" class="cdrz-info-sidebar--field-title">
        Details and descriptions
      </TextBlock>
      <div>
        <ToggleSwitch bind:checked="{$cdrzOptionsStore.showMore}">Show more details</ToggleSwitch>
      </div>

      <TextBlock variant="body" class="cdrz-info-sidebar--field-title">Compare</TextBlock>
      <div>
        <ToggleSwitch bind:checked="{$cdrzOptionsStore.compareSideBySide}">
          Show multiple tracts side-by-side
        </ToggleSwitch>
      </div>

      <TextBlock variant="body" class="cdrz-info-sidebar--field-title">Basemap style</TextBlock>
      <div>
        <ComboBox
          style="width: 100%;"
          items="{basemapNames.map((name) => ({ name, value: name }))}"
          bind:value="{$appSettings.basemap}"
        />
      </div>
    </div>
  </div>
</aside>

<style>
  aside {
    flex-grow: 1;
    flex-shrink: 0;
    border-left: 1px solid color-mix(in srgb, currentColor, transparent 86%);
  }
  aside.noBorderLeft {
    border-left: none;
  }
  @media print {
    aside {
      display: none;
    }
  }

  aside :global(.cdrz-info-sidebar--field-title) {
    display: block;
    padding-top: 10px;
  }

  aside :global(.cdrz-info-sidebar--field-caption) {
    display: block;
    margin-top: -2px;
    margin-bottom: 4px;
  }

  .sticky-wrapper {
    position: sticky;
    top: 0;
    height: calc(100vh - var(--headerVisibleHeight) - var(--pageTitleElemVisibleHeight));
    overflow: auto;
    padding: 0 20px;
  }

  .wrapper-internal {
    max-width: 280px;
  }
</style>
