<script lang="ts">
  export let data;
</script>

<section>
  <ul>
    {#each data.docsPageData as { pathname, attributes }}
      <li>
        <a href="{pathname}">{attributes.title}</a>
      </li>
    {/each}
  </ul>
</section>
