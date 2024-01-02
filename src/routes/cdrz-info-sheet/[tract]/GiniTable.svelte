<script lang="ts">
  import type { Gini } from '../CDRZ';

  export let gini: Gini;
  export let lastGini: Gini | undefined = undefined;
  export let style = '';
</script>

<table style="{style}">
  <thead>
    <tr>
      <th>Geo. level</th>
      <th align="right">Gini</th>
      {#if lastGini}
        <th>Change</th>
      {/if}
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>State</td>
      <td>{gini.state}</td>
      {#if lastGini}
        <td>{Math.round(((lastGini.state - gini.state) / lastGini.state) * 100)} %</td>
      {/if}
    </tr>
    <tr>
      <td>County</td>
      <td>{gini.county}</td>
      {#if lastGini}
        <td>{Math.round(((lastGini.county - gini.county) / lastGini.county) * 100)} %</td>
      {/if}
    </tr>
    <tr>
      <td>Tract</td>
      <td>{gini.tract}</td>
      {#if lastGini}
        <td>{Math.round(((lastGini.tract - gini.tract) / lastGini.tract) * 100)} %</td>
      {/if}
    </tr>
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
    border: 1px solid color-mix(in srgb, currentColor, transparent 86%);
    font-size: 14px;
  }

  tr:has(th) {
    border-bottom: 1px solid color-mix(in srgb, currentColor, transparent 86%);
  }

  th {
    height: 30px;
  }

  tr {
    height: 26px;
  }

  th {
    padding: 0 10px 0 10px;
  }
  td {
    padding: 0 0 0 10px;
  }

  tr th:nth-child(2),
  tr th:nth-child(3) {
    text-align: right;
    padding-right: 0px;
  }

  tr td:nth-child(2),
  tr td:nth-child(3) {
    text-align: right;
    padding-left: 20px;
    padding-right: 0;
  }

  tr :where(td, th):first-child {
    padding-left: 12px !important;
  }
  tr :where(td, th):last-child {
    padding-right: 12px !important;
  }
</style>
