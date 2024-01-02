<script lang="ts">
  import type { Zillow } from '../CDRZ';

  export let zillow: Zillow;
  export let style = '';
</script>

<table style="{style}">
  <thead>
    <tr>
      <th>Geographic level</th>
      <th align="right">Price (USD)</th>
      <th>Change</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>State</td>
      <td>$ {Math.round(zillow.zhvi[0]?.state || 0).toLocaleString('en-us')}</td>
      <td>+ {Math.round(zillow.zhvi[0].increaseRates.state)} %</td>
    </tr>
    <tr>
      <td>County</td>
      <td>$ {Math.round(zillow.zhvi[0]?.county || 0).toLocaleString('en-us')}</td>
      <td>+ {Math.round(zillow.zhvi[0].increaseRates.county)} %</td>
    </tr>
    <tr>
      <td>Zip</td>
      <td>$ {Math.round(zillow.zhvi[0]?.zip || 0).toLocaleString('en-us')}</td>
      <td>+ {Math.round(zillow.zhvi[0].increaseRates.zip)} %</td>
    </tr>
    <tr>
      <td>MSA</td>
      <td>$ {Math.round(zillow.zhvi[0]?.msa || 0).toLocaleString('en-us')}</td>
      <td></td>
    </tr>
    <tr>
      <td>City</td>
      <td>$ {Math.round(zillow.zhvi[0]?.city || 0).toLocaleString('en-us')}</td>
      <td></td>
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
    padding: 0 20px 0 10px;
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

  tr:not(:has(th)):hover {
    background-color: color-mix(in srgb, currentColor, transparent 94%);
  }
</style>
