<script lang="ts">
  import PageTitle from '$lib/PageTitle.svelte';
  import { formatISODate } from '$utils/formatISODate';
  import BoldNumber from './BoldNumber.svelte';
  import CdrzMap from './CdrzMap.svelte';
  import RentersOwnerPie from './RentersOwnerPie.svelte';
  import SectionHeading from './SectionHeading.svelte';
  import SubHeading from './SubHeading.svelte';
  import SubSection from './SubSection.svelte';
  import UrbanRuralPie from './UrbanRuralPie.svelte';

  export let data;
</script>

<PageTitle>
  Climate Disaster Resilience Zone (CDRZ) info sheet
  <svelte:fragment slot="caption">
    South Carolina Tract <code>{data.cdrz.tract}</code>
  </svelte:fragment>
</PageTitle>

<article>
  <div class="top-grid">
    <section id="mapSection">
      <CdrzMap />
    </section>
    <section>
      <SectionHeading noTopMargin>Places within this tract</SectionHeading>
      <ul>
        {#each data.cdrz.places as place}
          <li>{place.name}</li>
        {/each}
      </ul>
      <UrbanRuralPie
        size="{100}"
        urbanFraction="{data.cdrz.urban}"
        ruralFraction="{data.cdrz.rural}"
      />
    </section>
  </div>
  <section>
    <SectionHeading>Demographics</SectionHeading>

    <div class="grid">
      <SubSection>
        <SubHeading slot="heading">Population</SubHeading>
        <BoldNumber>
          {data.cdrz.zillow?.totalPopulation?.toLocaleString('en-US') || 'unavailable'}
        </BoldNumber>
      </SubSection>

      <SubSection>
        <SubHeading slot="heading">Race</SubHeading>
        placeholder
      </SubSection>

      <SubSection>
        <SubHeading slot="heading">Income</SubHeading>
        <BoldNumber>
          00
          <svelte:fragment slot="prefix">$</svelte:fragment>
          <svelte:fragment slot="units">thousand</svelte:fragment>
          <svelte:fragment slot="caption">Median</svelte:fragment>
        </BoldNumber>
      </SubSection>

      <SubSection>
        <SubHeading slot="heading">Ethnicity</SubHeading>
        placeholder
      </SubSection>

      <SubSection>
        <SubHeading slot="heading">Renters &amp; owners</SubHeading>
        <RentersOwnerPie
          size="{100}"
          renters="{data.cdrz.ownership?.total?.renters ?? 0.5}"
          owners="{data.cdrz.ownership?.total?.owners ?? 0.5}"
        />
      </SubSection>
    </div>
  </section>
  <section>
    <SectionHeading>Voting</SectionHeading>
  </section>
  <section>
    <SectionHeading>Housing</SectionHeading>

    <div class="grid">
      {#if data.cdrz.zillow?.zhvi[0]}
        <SubSection>
          <SubHeading slot="heading">Zillow Home Value Index (ZHVI)</SubHeading>
          As of {formatISODate(data.cdrz.zillow.zhvi[0].reportedAt)}
          <div class="zhvi">
            <BoldNumber>
              {Math.round((data.cdrz.zillow?.zhvi[0]?.state || 0) / 1000)}
              <svelte:fragment slot="prefix">$</svelte:fragment>
              <svelte:fragment slot="units">thousand</svelte:fragment>
              <svelte:fragment slot="caption">State</svelte:fragment>
            </BoldNumber>
            <BoldNumber>
              {Math.round((data.cdrz.zillow?.zhvi[0]?.county || 0) / 1000)}
              <svelte:fragment slot="prefix">$</svelte:fragment>
              <svelte:fragment slot="units">thousand</svelte:fragment>
              <svelte:fragment slot="caption">County</svelte:fragment>
            </BoldNumber>
            <BoldNumber>
              {Math.round((data.cdrz.zillow?.zhvi[0]?.zip || 0) / 1000)}
              <svelte:fragment slot="prefix">$</svelte:fragment>
              <svelte:fragment slot="units">thousand</svelte:fragment>
              <svelte:fragment slot="caption">Zip</svelte:fragment>
            </BoldNumber>
            <BoldNumber>
              {Math.round((data.cdrz.zillow?.zhvi[0]?.msa || 0) / 1000)}
              <svelte:fragment slot="prefix">$</svelte:fragment>
              <svelte:fragment slot="units">thousand</svelte:fragment>
              <svelte:fragment slot="caption">MSA</svelte:fragment>
            </BoldNumber>
            <BoldNumber>
              {Math.round((data.cdrz.zillow?.zhvi[0]?.city || 0) / 1000)}
              <svelte:fragment slot="prefix">$</svelte:fragment>
              <svelte:fragment slot="units">thousand</svelte:fragment>
              <svelte:fragment slot="caption">City</svelte:fragment>
            </BoldNumber>
          </div>
        </SubSection>

        <SubSection>
          <SubHeading slot="heading">ZHVI Change</SubHeading>
          Cacluated from {formatISODate(data.cdrz.zillow.zhvi[0].increaseRates.startedAt)} to {formatISODate(
            data.cdrz.zillow.zhvi[0].increaseRates.endedAt
          )}
          <div class="zhvi">
            <BoldNumber>
              {Math.round(data.cdrz.zillow.zhvi[0].increaseRates.state)}
              <svelte:fragment slot="suffix">%</svelte:fragment>
              <svelte:fragment slot="units"><span class="warning">increase</span></svelte:fragment>
              <svelte:fragment slot="caption">State</svelte:fragment>
            </BoldNumber>
            <BoldNumber>
              {Math.round(data.cdrz.zillow.zhvi[0].increaseRates.county)}
              <svelte:fragment slot="suffix">%</svelte:fragment>
              <svelte:fragment slot="units"><span class="warning">increase</span></svelte:fragment>
              <svelte:fragment slot="caption">County</svelte:fragment>
            </BoldNumber>
            <BoldNumber>
              {Math.round(data.cdrz.zillow.zhvi[0].increaseRates.zip)}
              <svelte:fragment slot="suffix">%</svelte:fragment>
              <svelte:fragment slot="units"><span class="warning">increase</span></svelte:fragment>
              <svelte:fragment slot="caption">Zip</svelte:fragment>
            </BoldNumber>
          </div>
        </SubSection>
      {/if}
    </div>
  </section>
</article>

<style>
  article {
    width: 8in;
    border-right: 1px solid green;
    padding: 20px;
    box-sizing: border-box;
  }

  .top-grid {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 20px;
  }

  section {
    display: flex;
    flex-direction: column;
  }

  section .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding: 20px 0;
  }

  div.zhvi {
    display: flex;
    flex-direction: row;
    column-gap: 20px;
    row-gap: 12px;
    margin-top: 6px;
    flex-wrap: wrap;
  }

  .warning {
    background-color: #ff000029;
  }
  @media (prefers-color-scheme: dark) {
    .warning {
      background-color: rgb(255 255 255 / 16%);
      color: yellow;
    }
  }
</style>
