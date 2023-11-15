<script lang="ts">
  import PageTitle from '$lib/PageTitle.svelte';
  import { formatISODate } from '$utils/formatISODate';
  import { ToggleSwitch } from 'fluent-svelte';
  import BoldNumber from './BoldNumber.svelte';
  import CdrzMap from './CdrzMap.svelte';
  import EthnicityBarChart from './EthnicityBarChart.svelte';
  import RaceBarChart from './RaceBarChart.svelte';
  import RentersOwnerPie from './RentersOwnerPie.svelte';
  import RiskRating from './RiskRating.svelte';
  import SectionHeading from './SectionHeading.svelte';
  import SubHeading from './SubHeading.svelte';
  import SubSection from './SubSection.svelte';
  import UrbanRuralPie from './UrbanRuralPie.svelte';

  export let data;

  let showMore = false;
</script>

<PageTitle>
  Climate Disaster Resilience Zone (CDRZ) info sheet
  <svelte:fragment slot="caption">
    South Carolina Tract <code>{data.cdrz.tract}</code>
  </svelte:fragment>
</PageTitle>

<a href="/cdrz-info-sheet" class="back">← Back to all</a>

<article>
  <ToggleSwitch bind:checked="{showMore}">Show more details</ToggleSwitch>
  <div class="note">All numbers are based on 2020 data unless otherwise specified.</div>

  <div class="top-grid">
    <section id="mapSection" style="min-height: 250px;">
      <CdrzMap tract="{data.cdrz.tract}" />
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
        urbanFraction="{data.cdrz.urban.fraction}"
        ruralFraction="{data.cdrz.rural.fraction}"
      />
    </section>
  </div>
  <section>
    <SectionHeading>Demographics</SectionHeading>

    <div class="grid">
      <SubSection>
        <SubHeading slot="heading">Population</SubHeading>
        <BoldNumber>
          {data.cdrz.population.total}
        </BoldNumber>
      </SubSection>

      <SubSection>
        <SubHeading slot="heading">Population density</SubHeading>
        <BoldNumber>
          {data.cdrz.population.personsPerSquareMileDensity.toFixed(0)}
          <svelte:fragment slot="units">people per square mile</svelte:fragment>
        </BoldNumber>
      </SubSection>

      <SubSection style="grid-column: 1 / 3">
        <SubHeading slot="heading">Race</SubHeading>
        <RaceBarChart data="{data.cdrz}" />
      </SubSection>

      <SubSection style="grid-column: 1 / 3">
        <SubHeading slot="heading">Ethnicity</SubHeading>
        <EthnicityBarChart data="{data.cdrz}" />
      </SubSection>

      {#if showMore}
        <SubSection>
          <SubHeading slot="heading">Income</SubHeading>
          <BoldNumber>
            00
            <svelte:fragment slot="prefix">$</svelte:fragment>
            <svelte:fragment slot="units">thousand</svelte:fragment>
            <svelte:fragment slot="caption">Median</svelte:fragment>
          </BoldNumber>
        </SubSection>
      {/if}

      <SubSection>
        <SubHeading slot="heading">Renters &amp; owners</SubHeading>
        <RentersOwnerPie
          size="{100}"
          renters="{data.cdrz.tenure.renter.fraction}"
          owners="{data.cdrz.tenure.owner.fraction}"
        />
      </SubSection>
    </div>
  </section>

  {#if showMore}
    <section>
      <SectionHeading>Voting</SectionHeading>
    </section>
  {/if}

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
            {#if showMore}
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
            {/if}
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

  {#if data.cdrz.risks}
    <section>
      <SectionHeading>Hazard risk index</SectionHeading>
      <div>
        From the National Risk Index.
        <a
          href="https://hazards.fema.gov/nri/report/viewer?dataLOD=Census%20tracts&dataIDs={data
            .cdrz.tract}#SectionRiskIndex"
        >
          View the whole report.
        </a>
      </div>

      <div class="columns">
        <SubSection>
          <SubHeading slot="heading">Composite ratings</SubHeading>
          <div class="ratings">
            <h4>Composite NRI</h4>
            <RiskRating
              rating="{data.cdrz.risks.compositeNRI.rating}"
              score="{data.cdrz.risks.compositeNRI.score}"
            />
            <h4>Expected annual loss</h4>
            <RiskRating
              rating="{data.cdrz.risks.compositeExpectedAnnualLoss.rating}"
              score="{data.cdrz.risks.compositeExpectedAnnualLoss.score}"
            />
            <h4>Social vulnerability</h4>
            <RiskRating
              rating="{data.cdrz.risks.socialVulnerability.rating}"
              score="{data.cdrz.risks.socialVulnerability.score}"
            />
            <h4>Community resilience</h4>
            <RiskRating
              rating="{data.cdrz.risks.communityResilience.rating}"
              score="{data.cdrz.risks.communityResilience.score}"
            />
          </div>
        </SubSection>

        <SubSection>
          <SubHeading slot="heading">Hazards</SubHeading>
          <div class="ratings">
            {#each Object.entries(data.cdrz.risks.natural) as [key, value]}
              {#if showMore || (value.rating !== 'Not Applicable' && value.rating !== 'Insufficient Data')}
                <h4>{key}</h4>
                <RiskRating rating="{value.rating}" score="{value.score}" />
              {/if}
            {/each}
          </div>
        </SubSection>
      </div>
    </section>
  {/if}
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

  section .columns {
    --gap: 20px;
    columns: 2;
    column-gap: var(--gap);
    padding: var(--gap) 0;
  }
  section .columns > :global(*) {
    padding-top: var(--gap);
    -webkit-column-break-inside: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
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

  .back {
    display: block;
    margin: 16px 20px 0;
  }
  @media print {
    .back {
      display: none;
    }
  }

  .ratings {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    row-gap: 3px;
    margin-top: 6px;
  }

  .ratings h4 {
    margin: 0;
    font-weight: 400;
  }

  .note {
    font-size: 14px;
    font-style: italic;
    margin-bottom: 20px;
  }
</style>
