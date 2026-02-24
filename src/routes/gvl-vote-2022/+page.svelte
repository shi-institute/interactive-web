<script lang="ts">
  import { expoOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import Map from './GvlVote2022Map.svelte';
  import { geolocate, getLocationFeatures } from './helpers';

  let map: maplibregl.Map | undefined = undefined;
  let location: GeolocationCoordinates | undefined = undefined;
  $: locationFeatures = map && location ? getLocationFeatures(map, location) : undefined;

  function getLocation() {
    if (map) {
      geolocate(map)
        .then((loc) => (location = loc.coords))
        .finally(() => {
          map?.easeTo({
            padding: {
              left: 1000,
            },
            duration: 1000,
            zoom: 12,
          });
        });
    }
  }
</script>

<div class="map-wrapper">
  <Map bind:map />
</div>

<section id="startStep" class:show={!location}>
  <div in:fly={{ y: 40, duration: 270, easing: expoOut }}>
    <h1>How did your precinct vote in 2022?</h1>
    <p>
      See the generalized voting behavior for your voting precinct and how it compares to nearby
      precincts.
    </p>
    <p>To begin, grant access to your location.</p>
    <button on:click={getLocation}>Go to location</button>
  </div>
</section>

<section id="yourPreinct" />

{location}

<style>
  section:not(.show) {
    display: none !important;
  }

  #startStep {
    background-color: #212121;
    width: 100%;
    height: calc(100% - var(--header-height));
    position: absolute;
    top: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .map-wrapper {
    width: 100%;
    height: calc(100% - var(--header-height));
    position: absolute;
    top: var(--header-height);
    left: 0;
    z-index: 0;
  }
</style>
