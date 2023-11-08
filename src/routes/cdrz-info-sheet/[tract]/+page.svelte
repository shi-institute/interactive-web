<script>
  import PageTitle from '$lib/PageTitle.svelte';
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
        <SubHeading slot="heading">Race</SubHeading>
        placeholder
      </SubSection>

      <SubSection>
        <SubHeading slot="heading">Ethnicity</SubHeading>
        placeholder
      </SubSection>

      <SubSection>
        <SubHeading slot="heading">Renters &amp; owners</SubHeading>
        <RentersOwnerPie
          size="{100}"
          renters="{data.cdrz.ownership.total.renters}"
          owners="{data.cdrz.ownership.total.owners}"
        />
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
    </div>
  </section>
  <section>
    <SectionHeading>Voting</SectionHeading>
  </section>
  <section>
    <SectionHeading>Housing</SectionHeading>
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
</style>
