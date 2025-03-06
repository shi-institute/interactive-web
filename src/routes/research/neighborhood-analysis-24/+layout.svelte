<script lang="ts">
  import { colors } from '$lib/colors';

  export let data;

  const css = `
    figure {
      --fds-accent-plot: ${colors.vibrant.teal};
    }
  `;
</script>

<span>
  {#if !data.isDeployedPreview}
    {@html `<` + `style>${css}</style>`}
  {/if}
</span>

<slot />
