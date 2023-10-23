<script lang="ts">
  import type { FeatureCollection } from 'geojson';
  import {
    FillLayer,
    GeolocateControl,
    LineLayer,
    GeoJSON as MapGeoJSON,
    MapLibre,
    MarkerLayer,
    SymbolLayer,
  } from 'svelte-maplibre';
  import _margins from './gvlVoteMargins.json';
  import _states from './states.json';

  const states = _states as unknown as FeatureCollection;
  const margins = _margins as unknown as FeatureCollection;

  export let map: maplibregl.Map | undefined = undefined;

  let currentZoom = 10;
  $: scaleFactor = (currentZoom / 9) ** 3;

  $: mod = {
    ...margins,
    features: margins.features.map((feature) => {
      return {
        ...feature,
        geometry: {
          type: 'Point',
          coordinates: [
            feature.properties!.precinctLongitude,
            feature.properties!.precinctLatitude,
          ],
        },
      };
    }),
  };
</script>

<MapLibre
  bind:map
  on:zoom={(evt) => (currentZoom = evt.detail.map.getZoom())}
  style={{
    version: 8,
    sources: {},
    layers: [],
  }}
  standardControls
  center={[-82.4013, 34.8622]}
  zoom={10}
>
  <MapGeoJSON id="voteMarginPoints" data={mod} promoteId="GISJOIN">
    <MarkerLayer interactive let:feature>
      {@const isDem = feature.properties?.margin < 0}
      {@const margin = Math.abs(feature.properties?.margin)}
      {@const magnitude = (margin / 20) * scaleFactor}
      {@const topMargin = 2}
      {@const rightMargin = 2}
      {@const arrowMagnitude = magnitude / 2}
      <div class="marker">
        <svg
          width={magnitude + rightMargin}
          height={magnitude + topMargin}
          style="transform: {isDem ? 'scaleX(-1)' : 'none'};"
        >
          <g stroke-width="1.4" stroke={isDem ? 'blue' : 'red'}>
            <line x1="0" y1={magnitude + topMargin} x2={magnitude + 0} y2={topMargin} />
            <line x1={magnitude - arrowMagnitude} y1={topMargin} x2={magnitude} y2={topMargin} />
            <line x1={magnitude} y1={topMargin + arrowMagnitude} x2={magnitude} y2={topMargin} />
          </g>
        </svg>
      </div>
    </MarkerLayer>
  </MapGeoJSON>
  <MapGeoJSON id="voteMarginShapes" data={margins} promoteId="GISJOIN">
    <LineLayer
      layout={{ 'line-cap': 'round', 'line-join': 'round' }}
      paint={{ 'line-color': '#666', 'line-width': 0.1 }}
    />
    <FillLayer paint={{ 'fill-color': 'transparent' }} />
  </MapGeoJSON>
</MapLibre>
