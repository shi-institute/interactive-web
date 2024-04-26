<script lang="ts">
  import type { Election } from '../CDRZ';

  export let election: Election;
  export let style = '';

  const [candidateD, candidateR] = election.name?.startsWith('2020 General Election')
    ? ['Biden', 'Trump']
    : ['Democratic', 'Republican'];

  const statePercentagePoints =
    (election.turnout.state.republicanPresident - election.turnout.state.democraticPresident) * 100;
  const countyPercentagePoints =
    (election.turnout.county.republicanPresident - election.turnout.county.democraticPresident) *
    100;
  const precinctPercentagePoints =
    (election.turnout.precinct.republicanPresident -
      election.turnout.precinct.democraticPresident) *
    100;
</script>

<table style="{style}">
  <thead>
    <tr>
      <th>Geographic level</th>
      <th align="right">Result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>State</td>
      <td class:rep="{statePercentagePoints > 0}" class:dem="{statePercentagePoints < 0}">
        {#if statePercentagePoints > 0}
          {candidateR}
        {:else}
          {candidateD}
        {/if}
        + {Math.abs(statePercentagePoints).toFixed(0)}
      </td>
    </tr>
    <tr>
      <td>County</td>
      <td class:rep="{countyPercentagePoints > 0}" class:dem="{countyPercentagePoints < 0}">
        {#if countyPercentagePoints > 0}
          {candidateR}
        {:else}
          {candidateD}
        {/if}
        + {Math.abs(countyPercentagePoints).toFixed(0)}
      </td>
    </tr>
    <tr>
      <td>Precincts ☄</td>
      <td class:rep="{precinctPercentagePoints > 0}" class:dem="{precinctPercentagePoints < 0}">
        {#if precinctPercentagePoints > 0}
          {candidateR}
        {:else}
          {candidateD}
        {/if}
        + {Math.abs(precinctPercentagePoints).toFixed(0)}
      </td>
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

  tr:not(:has(th)):hover {
    background-color: color-mix(in srgb, currentColor, transparent 94%);
  }

  td.dem {
    color: hsl(245, 96%, 38%);
  }
  td.rep {
    color: hsl(358, 82%, 51%);
  }
  @media (prefers-color-scheme: dark) {
    td.dem {
      color: hsl(245, 96%, 80%);
    }
    td.rep {
      color: hsl(358, 82%, 80%);
    }
  }
</style>
