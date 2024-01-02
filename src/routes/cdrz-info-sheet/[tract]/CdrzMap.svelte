<script lang="ts">
  import { FillLayer, GeoJSON, LineLayer, MapLibre } from 'svelte-maplibre';
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
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
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
  </MapLibre>
</div>

<style>
  div {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
