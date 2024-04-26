<script lang="ts">
  import { appSettings } from '$stores/appSettings';
  import { themeMode } from '$stores/themeMode';
  import { getBasemapLocation } from '$utils/getBasemapLocation';
  import {
    FillLayer,
    GeoJSON,
    LineLayer,
    MapLibre,
    RasterLayer,
    RasterTileSource,
  } from 'svelte-maplibre';
  import cdrz_shapes from '../SC_FEMA_CDRZ.geo.json';

  export let map: maplibregl.Map | undefined = undefined;
  export let tract: string;

  let setListener = false;
  $: {
    if (map && !setListener) {
      map.once('idle', trigger);
    }
  }

  function trigger() {
    const features = map?.querySourceFeatures('cdrzShapes');
    const match = features.find((feature) => feature.properties['Tract FIPS'] === tract.slice(-6));

    const x = match?.geometry.coordinates[0].map((arr) => arr[0]);
    const xMin = Math.min(...x);
    const xMax = Math.max(...x);

    const y = match?.geometry.coordinates[0].map((arr) => arr[1]);
    const yMin = Math.min(...y);
    const yMax = Math.max(...y);

    map?.fitBounds(
      [
        [xMin, yMin],
        [xMax, yMax],
      ],
      { padding: 50 }
    );
  }
</script>

<div>
  <MapLibre
    bind:map="{map}"
    style="{getBasemapLocation($appSettings.basemap)[+($themeMode === 'dark')]}"
    center="{[-82.4013, 34.8622]}"
    zoom="{4}"
  >
    <GeoJSON id="cdrzShapes" data="{cdrz_shapes}" promoteId="Tract FIPS">
      <FillLayer
        paint="{{
          'fill-color': ['match', ['get', 'Tract FIPS'], tract.slice(-6), '#c04a5f', '#ddd'],
          'fill-opacity': 0.5,
        }}"
        beforeLayerType="symbol"
        manageHoverState
      />
      <LineLayer
        id="cdrzLines"
        layout="{{ 'line-cap': 'round', 'line-join': 'round' }}"
        paint="{{ 'line-color': 'gray', 'line-width': 1 }}"
        beforeLayerType="symbol"
      />
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
  div {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
