<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { appSettings } from '$stores/appSettings';
  import { cdrzOptionsStore } from '$stores/cdrzOptionsStore';
  import { formatISODate } from '$utils/formatISODate';
  import { IconButton, TextBlock } from 'fluent-svelte';
  import type { PageData } from './$types';
  import BoldNumber from './BoldNumber.svelte';
  import CdrzMap from './CdrzMap.svelte';
  import ElectionsTurnoutBarChart from './ElectionsTurnoutBarChart.svelte';
  import EthnicityBarChart from './EthnicityBarChart.svelte';
  import GiniTable from './GiniTable.svelte';
  import PresidentialElectionTable from './PresidentialElectionTable.svelte';
  import RaceBarChart from './RaceBarChart.svelte';
  import RentersOwnerPie from './RentersOwnerPie.svelte';
  import RiskRating from './RiskRating.svelte';
  import SectionHeading from './SectionHeading.svelte';
  import SubHeading from './SubHeading.svelte';
  import SubSection from './SubSection.svelte';
  import UrbanRuralPie from './UrbanRuralPie.svelte';
  import ZillowTable from './ZillowTable.svelte';

  export let data: PageData;
  export let fixedSidebarEnabled: boolean;
  export let showRemoveButton = false;
  export let hideBackToAll = false;

  $: year = $cdrzOptionsStore.year;
  $: showMore = $cdrzOptionsStore.showMore;

  $: cdrz = year === 2010 && data.cdrz2010 ? data.cdrz2010 : data.cdrz;

  function removeThisTract() {
    const currentTracts = data.tracts;
    const newTracts = currentTracts.filter((tract) => tract !== data.cdrz.tract);

    // get everything before the last slash
    const parentPath = $page.url.pathname.split('/').slice(0, -1).join('/');

    // go to the URL, which should be the sdame as the old one but with the
    // tract for this single CDRZ component removed
    // NOTE: this component will be unmounted when navigation occurs
    goto(`${parentPath}/${newTracts.join(',')}`);
  }
</script>

<article
  class:useFixedWidth="{true}"
  class:fixedSidebarEnabled="{fixedSidebarEnabled}"
  class:showBorderRight="{$cdrzOptionsStore.compareSideBySide}"
>
  <div class="back">
    <a href="/research/cdrz-info-sheet" class:hideBackToAll="{hideBackToAll}">← Back to all</a>
    <span>{data.cdrz.nickname}</span>
  </div>

  {#if showRemoveButton}
    <IconButton class="remove-icon" on:click="{removeThisTract}">
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z"
        ></path>
      </svg>
    </IconButton>
  {/if}

  <!-- <div class="note">All numbers are based on 2020 data unless otherwise specified.</div> -->

  <div class="top-grid">
    <section id="mapSection" style="min-height: 250px;">
      {#key $appSettings.basemap}
        <CdrzMap tract="{cdrz.tract}" />
      {/key}
    </section>
    <section>
      <SectionHeading noTopMargin>Places within this tract</SectionHeading>
      <ul>
        {#each cdrz.places.sort((a, b) => (b.type === 'poi' ? -1 : 0)) as place}
          <li>{place.name}</li>
        {/each}
      </ul>

      <UrbanRuralPie
        size="{100}"
        urbanFraction="{cdrz.urban.fraction}"
        ruralFraction="{cdrz.rural.fraction}"
      />
    </section>
  </div>
  <section>
    <SectionHeading>Demographics</SectionHeading>

    <div class="grid">
      <SubSection>
        <SubHeading slot="heading">Population</SubHeading>
        <BoldNumber>
          {cdrz.population.total.toLocaleString('en-us')}
        </BoldNumber>
      </SubSection>

      <SubSection>
        <SubHeading slot="heading">Population density</SubHeading>
        <BoldNumber>
          {parseInt(`${cdrz.population.personsPerSquareMileDensity}`).toLocaleString('en-us')}
          <svelte:fragment slot="units">people per square mile</svelte:fragment>
        </BoldNumber>
      </SubSection>

      <SubSection style="grid-column: 1 / 3">
        <SubHeading slot="heading">Race</SubHeading>
        <RaceBarChart data="{cdrz}" />
      </SubSection>

      <SubSection style="grid-column: 1 / 3">
        <SubHeading slot="heading">Ethnicity</SubHeading>
        <EthnicityBarChart data="{cdrz}" />
      </SubSection>
    </div>
  </section>

  {#if cdrz.income?.[0] || cdrz.gini}
    <section>
      <SectionHeading>Income</SectionHeading>

      <div class="grid">
        {#if cdrz.income?.[0]}
          {@const income = cdrz.income[0]}
          <SubSection>
            <SubHeading slot="heading">Median income</SubHeading>
            <TextBlock style="padding-bottom: 10px;">
              In {income.dollarYear} US dollars.
              <i>
                From American Community Survey Estimates, {income.dataYears.start} - {income
                  .dataYears.end}.
              </i>
            </TextBlock>
            <BoldNumber>
              {income.median.value.toLocaleString('en-us')}
              <svelte:fragment slot="prefix">$</svelte:fragment>
              <svelte:fragment slot="units">
                ± {income.median.marginOfError.toLocaleString('en-us')}
              </svelte:fragment>
              <!-- <svelte:fragment slot="caption">Median</svelte:fragment> -->
            </BoldNumber>
          </SubSection>
        {/if}

        {#if cdrz.gini}
          {@const gini = cdrz.gini}
          <SubSection>
            <SubHeading slot="heading">Gini coefficient</SubHeading>
            <TextBlock style="padding-bottom: 10px;">
              The Gini coefficient is a measure of income inequality.
              {#if showMore}
                0 indicates perfect equality and 1 indicates maximum inequality.
              {/if}
              <i>
                From American Community Survey Estimates, {gini.yearStart} - {gini.yearEnd}.
              </i>
            </TextBlock>
            <BoldNumber>
              {gini.tract}
            </BoldNumber>
            {#if showMore}
              <GiniTable
                gini="{gini}"
                lastGini="{(year === 2020 && data.cdrz2010?.gini) || undefined}"
                style="margin-top: 10px;"
              />
              <TextBlock style="opacity: 0.8;">
                Negative percentages indicate reduced inequality.
              </TextBlock>
            {/if}
          </SubSection>
        {/if}
      </div>
    </section>
  {/if}

  {#if cdrz.elections?.[0]}
    {@const election = cdrz.elections[0]}
    <section>
      <SectionHeading>Voting</SectionHeading>
      <TextBlock>
        From the South Carolina Election Commission
        <!-- prettier-ignore -->
        <span>(<a href="https://scvotes.gov/">https://scvotes.gov/</a>).</span>
        {#if showMore}
          <i>
            Election precincts do not align with Census tracts. Preicincts were associated with a
            tract if the precinct centroid was contained by the tract. No tract contained more than
            one precinct centroid.
          </i>
        {/if}
      </TextBlock>

      <TextBlock>Precinct: {election.precinct}</TextBlock>

      <SubSection>
        <SubHeading slot="heading">Turnout</SubHeading>
        <div>{election.name || formatISODate(election.date)}</div>
        <ElectionsTurnoutBarChart data="{cdrz}" />
      </SubSection>

      {#if election.turnout?.state?.democraticPresident && election.turnout.county.democraticPresident && election.turnout.precinct.democraticPresident}
        <SubSection>
          <SubHeading slot="heading">Presidential election results</SubHeading>
          <div>{election.name?.replace('(SC)', '').trim() || formatISODate(election.date)}</div>
          {#if showMore}
            <i>
              Results are shown in percentage points. Percentage points are calculated as the
              difference between a candidate's percent of the popular vote and all of their
              oponents' percents of the popular vote.
            </i>
          {/if}
          <PresidentialElectionTable election="{election}" style="margin-top: 10px;" />
        </SubSection>
      {/if}
    </section>
  {/if}

  <section>
    <SectionHeading>Housing</SectionHeading>

    <div class="grid">
      {#if cdrz.zillow?.zhvi[0]}
        <SubSection>
          <SubHeading slot="heading">Median house value</SubHeading>
          <TextBlock>
            From Zillow Home Value Index, {formatISODate(cdrz.zillow.zhvi[0].reportedAt)}.
            {#if showMore}
              <i>Tract-level data is not made available by Zillow.</i>
            {/if}
          </TextBlock>
          <div class="zhvi">
            <BoldNumber>
              {Math.round(cdrz.zillow?.zhvi[0]?.zip || 0).toLocaleString('en-us')}
              <svelte:fragment slot="prefix">$</svelte:fragment>
              <svelte:fragment slot="units">&nbsp;&nbsp;&nbsp;In this ZIP code</svelte:fragment>
            </BoldNumber>
          </div>
          {#if showMore}
            <ZillowTable zillow="{cdrz.zillow}" style="margin-top: 20px;" />
            <TextBlock style="margin-top: 6px;">
              <i>
                Changes were calculated from {formatISODate(
                  cdrz.zillow.zhvi[0].increaseRates.startedAt
                )} to {formatISODate(cdrz.zillow.zhvi[0].increaseRates.endedAt)}.
              </i>
            </TextBlock>
          {/if}
        </SubSection>
      {/if}

      <SubSection>
        <SubHeading slot="heading">Renters &amp; owners</SubHeading>
        <RentersOwnerPie
          size="{100}"
          renters="{cdrz.tenure.renter.fraction}"
          owners="{cdrz.tenure.owner.fraction}"
          style="margin-top: 6px;"
        />
      </SubSection>
    </div>
  </section>

  {#if cdrz.risks}
    <section>
      <SectionHeading>Hazard risk index</SectionHeading>
      <TextBlock>
        From the National Risk Index ({formatISODate(cdrz.risks.timestamp, false, true, false)}).
        <a
          href="https://hazards.fema.gov/nri/report/viewer?dataLOD=Census%20tracts&dataIDs={data
            .cdrz.tract}#SectionRiskIndex"
        >
          View the whole report.
        </a>
      </TextBlock>

      <div class="columns">
        <SubSection>
          <SubHeading slot="heading">Composite ratings</SubHeading>
          <div class="ratings">
            <h4>Composite NRI</h4>
            <RiskRating
              rating="{cdrz.risks.compositeNRI.rating}"
              score="{cdrz.risks.compositeNRI.score}"
            />
            <h4>Expected annual loss</h4>
            <RiskRating
              rating="{cdrz.risks.compositeExpectedAnnualLoss.rating}"
              score="{cdrz.risks.compositeExpectedAnnualLoss.score}"
            />
            <h4>Social vulnerability</h4>
            <RiskRating
              rating="{cdrz.risks.socialVulnerability.rating}"
              score="{cdrz.risks.socialVulnerability.score}"
            />
            <h4>Community resilience</h4>
            <RiskRating
              rating="{cdrz.risks.communityResilience.rating}"
              score="{cdrz.risks.communityResilience.score}"
            />
          </div>
        </SubSection>

        <SubSection>
          <SubHeading slot="heading">Hazards</SubHeading>
          <div class="ratings">
            {#each Object.entries(cdrz.risks.natural) as [key, value]}
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
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
  }
  article.fixedSidebarEnabled {
    width: calc(100% - 300px);
  }
  article.useFixedWidth {
    width: 8in;
  }
  article.showBorderRight {
    border-right: 1px solid color-mix(in srgb, currentColor, transparent 86%);
  }
  @media print {
    article {
      border: none;
    }
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
    display: flex;
    margin: 0 0 16px 0;
    align-items: center;
    justify-content: space-between;
  }
  .back.hideBackToAll {
    visibility: hidden;
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

  article :global(.remove-icon) {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
