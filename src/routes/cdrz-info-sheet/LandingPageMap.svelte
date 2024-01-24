<script lang="ts">
  import { goto } from '$app/navigation';
  import { getBasemapLocation } from '$utils/getBasemapLocation';
  import {
    FillLayer,
    GeoJSON,
    LineLayer,
    MapLibre,
    MarkerLayer,
    RasterLayer,
    RasterTileSource,
  } from 'svelte-maplibre';
  import { appSettings } from '../../stores/appSettings';
  import { themeMode } from '../../stores/themeMode';
  import cdrz_shapes from './SC_FEMA_CDRZ.geo.json';

  export let map: maplibregl.Map | undefined = undefined;

  let setListener = false;
  $: {
    if (map && !setListener) {
      map.once('idle', zoomToLayer);
    }
  }

  function zoomToLayer() {
    const features = map?.querySourceFeatures('cdrzShapes');
    if (!features) return;

    const xCoords: number[] = [];
    const yCoords: number[] = [];
    features.forEach((feature) => {
      console.log(feature.geometry.coordinates);
      xCoords.push(...feature.geometry.coordinates[0].map((arr) => arr[0]));
      yCoords.push(...feature.geometry.coordinates[0].map((arr) => arr[1]));
    });

    const xMin = Math.min(...xCoords);
    const xMax = Math.max(...xCoords);

    const yMin = Math.min(...yCoords);
    const yMax = Math.max(...yCoords);

    map?.fitBounds(
      [
        [xMin, yMin],
        [xMax, yMax],
      ],
      { padding: 50 }
    );
  }

  function goToTract(tract: string) {
    goto(`/cdrz-info-sheet/${tract}`);
  }
</script>

<div class="map-wrapper">
  <MapLibre
    bind:map="{map}"
    style="{getBasemapLocation($appSettings.basemap)[+($themeMode === 'dark')]}"
    center="{[-82.4013, 34.8622]}"
    zoom="{4}"
  >
    <GeoJSON id="cdrzShapes" data="{cdrz_shapes}" promoteId="Tract FIPS">
      <FillLayer
        on:click="{(evt) => goToTract(evt.detail.features?.[0]?.properties?.['NRI ID'])}"
        paint="{{
          'fill-color': '#c04a5f',
          'fill-opacity': 0.5,
        }}"
        beforeLayerType="symbol"
        hoverCursor="pointer"
        manageHoverState
      />
      <LineLayer
        id="cdrzLines"
        layout="{{ 'line-cap': 'round', 'line-join': 'round' }}"
        paint="{{ 'line-color': 'gray', 'line-width': 1 }}"
        beforeLayerType="symbol"
      />
      <MarkerLayer zIndex="{10}" interactive="{false}" let:feature>
        <button class="tract-label" on:click="{() => goToTract(feature.properties?.['NRI ID'])}">
          {parseInt(feature.properties?.['Tract FIPS'])}
          <br />
          <span style="font-size: 80%; font-style: italic; font-weight: normal;">
            {feature.properties?.County}
          </span>
        </button>
      </MarkerLayer>
    </GeoJSON>
    {#if $appSettings.basemap === 'OpenStreetMap'}
      <RasterTileSource
        tiles="{['https://tile.openstreetmap.org/{z}/{x}/{y}.png']}"
        tileSize="{256}"
        id="osm"
      >
        <RasterLayer paint="{{ 'raster-opacity': 0.3 }}" id="osm-raster" />
      </RasterTileSource>
    {/if}
  </MapLibre>
</div>

<style>
  .map-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .tract-label {
    appearance: none;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    text-shadow: 1px 1px 3px white;
    font-weight: bold;
  }
  @media (prefers-color-scheme: dark) {
    .tract-label {
      text-shadow: 1px 1px 3px black;
    }
  }
</style>
