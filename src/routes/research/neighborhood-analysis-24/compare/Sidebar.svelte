<script lang="ts">
  import { page } from '$app/stores';
  import { FieldWrapper } from '$lib/common/FieldWrapper';
  import { SelectMany } from '$lib/common/Select';
  import { notEmpty } from '$utils/notEmpty';
  import { Button, ProgressRing, TextBlock, TextBox, ToggleSwitch } from 'fluent-svelte';
  import { queryParameters } from 'sveltekit-search-params';
  import { getPlotsList } from '../getPlotsList';
  import { getParams, queryParamsOptions } from './params';

  export let pageTitleElemVisibleHeight: number;
  export let noBorderLeft = false;
  export let inline = false;

  let copyLoading = false;
  let showAdvancedOptions = false;

  const { tractPlots, blockPlots } = getPlotsList($page.url);

  const availablePlotOptions = [...tractPlots, ...blockPlots].map(([title, key]) => ({
    label: title,
    _id: key,
  }));

  const params = queryParameters(getParams($page.url), queryParamsOptions);
</script>

<aside class:noBorderLeft="{noBorderLeft || inline}" class:inline="{inline}">
  <div class="sticky-wrapper" style="--pageTitleElemVisibleHeight: {pageTitleElemVisibleHeight}px;">
    <div class="wrapper-internal">
      {#if !inline}
        <TextBlock variant="subtitle" style="padding: 24px 0 16px 0;">
          Collection settings
        </TextBlock>
      {/if}

      <FieldWrapper
        label="Figures"
        forId="plots"
        description="{'Select and reorder the figures to display in this collection'}"
      >
        <SelectMany
          options="{availablePlotOptions}"
          selectedOptions="{$params.plots}"
          on:change="{(evt) => {
            const newOptions = evt.detail.map(({ _id, label }) => ({ _id, label }));
            $params.plots = newOptions;
          }}"
        />
      </FieldWrapper>

      {#if !inline}
        <FieldWrapper
          label="Share"
          forId="share"
          description="{'Share this figure collection with others. The URL will contain the figure collection settings.'}"
        >
          <Button
            style="width: 116px; height: 30px;"
            on:click="{() => {
              copyLoading = true;
              const url = new URL(window.location.href);
              navigator.clipboard
                .writeText(url.toString())
                .catch((err) => {
                  console.error('Failed to copy: ', err);
                })
                .finally(() => {
                  setTimeout(() => {
                    copyLoading = false;
                  }, 400);
                });
            }}"
          >
            {#if copyLoading}
              <ProgressRing style="--fds-accent-default: currentColor;" size="{16}" />
            {:else}
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                style="margin: 0 12px 0 0;"
              >
                <path
                  d="M5.503 4.627 5.5 6.75v10.504a3.25 3.25 0 0 0 3.25 3.25h8.616a2.251 2.251 0 0 1-2.122 1.5H8.75A4.75 4.75 0 0 1 4 17.254V6.75c0-.98.627-1.815 1.503-2.123ZM17.75 2A2.25 2.25 0 0 1 20 4.25v13a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-13A2.25 2.25 0 0 1 8.75 2h9Zm0 1.5h-9a.75.75 0 0 0-.75.75v13c0 .414.336.75.75.75h9a.75.75 0 0 0 .75-.75v-13a.75.75 0 0 0-.75-.75Z"
                  fill="currentColor"
                ></path>
              </svg>
              Copy URL
            {/if}
          </Button>
        </FieldWrapper>
      {/if}

      <FieldWrapper label="Title" forId="title">
        <TextBox id="title" bind:value="{$params.title}" />
      </FieldWrapper>

      <FieldWrapper label="Subtitle" forId="subtitle">
        <TextBox id="title" bind:value="{$params.subtitle}" />
      </FieldWrapper>

      {#if showAdvancedOptions}
        <FieldWrapper
          label="Neighborhoods and tracts"
          forId="neighborhoods"
          description="{'Type the neighborhoods and tracts to compare. The input is case-insensitive. For tracts, use the full 11-digit FIPS code.'}"
        >
          <SelectMany
            selectedOptions="{$params.neighborhoods.map((_id) => ({ _id, label: _id }))}"
            hideIds
            on:change="{(evt) => {
              $params.neighborhoods = evt.detail.map(({ label }) => label).filter(notEmpty);
            }}"
          />
        </FieldWrapper>

        <FieldWrapper
          label="Normalize y-axis scale"
          forId="normalizeYAxisScale"
          description="{'Use the same scale for the y-axis when comparing figures across neighborhoods and tracts.'}"
        >
          <ToggleSwitch id="normalizeYAxisScale" bind:checked="{$params.normalizeYAxisScale}" />
        </FieldWrapper>

        <FieldWrapper
          label="Plot width"
          forId="plotWidth"
          description="{'The width of the plot in pixels. The rendered width may be smaller due to padding. On smaller screens, the width will not exceed <code>90vw</code>. Smaller widths may cause some text in plots to overlap.'}"
        >
          <TextBox id="plotWidth" bind:value="{$params.plotWidth}" type="number" />
        </FieldWrapper>

        <FieldWrapper
          label="Plot height"
          forId="plotHeight"
          description="{'The height of every plot in pixels. Smaller heights may cause some text in plots to overlap.'}"
        >
          <TextBox id="plotHeight" bind:value="{$params.plotHeight}" type="number" />
        </FieldWrapper>
      {:else}
        {#if !inline}
          <hr />
        {/if}
        <Button
          on:click="{() => (showAdvancedOptions = !showAdvancedOptions)}"
          class="advanced-opts"
          variant="{inline ? 'hyperlink' : 'standard'}"
          style="{inline ? 'margin-left: -10px;' : ''}"
        >
          Show advanced options
        </Button>
      {/if}
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

  .sticky-wrapper {
    position: sticky;
    top: 0;
    height: calc(100vh - 40px);
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  aside.inline .sticky-wrapper {
    padding: 0;
    height: auto;
  }

  .wrapper-internal {
    max-width: 100%;
    padding-bottom: 20px;
  }

  hr {
    border: none;
    border-top: 1px solid var(--fds-surface-stroke-default);
    margin: 24px 0;
  }
</style>
