<script lang="ts">
  import Legend from '$lib/legend/Legend.svelte';
  import LegendEntry from '$lib/legend/LegendEntry.svelte';
  import { GeoJSON, LeafletMap, TileLayer } from 'svelte-leafletjs';
  import upstateSouthCarolinaShape from './UpstateSC.geo.json';

  const mapOptions = {
    center: [34.49465994964841, -82.08705370875796],
    zoom: 8,
  };
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileLayerOptions = {
    minZoom: 0,
    maxZoom: 20,
    maxNativeZoom: 19,
    attribution: '© OpenStreetMap contributors',
  };

  const upstateSouthCarolinaShapeOptions = {
    style() {
      return {
        color: 'black',
        opacity: 1,
        fillColor: 'transparent',
        fillOpacity: 0,
      };
    },
  };

  let leafletMap;
</script>

<div class="upstate-lulc-map">
  <LeafletMap bind:this={leafletMap} options={mapOptions}>
    <TileLayer url={tileUrl} options={tileLayerOptions} />
    <GeoJSON data={upstateSouthCarolinaShape} options={upstateSouthCarolinaShapeOptions} />
  </LeafletMap>

  <Legend>
    <LegendEntry type="rect" outline="black">Upstate South Carolina</LegendEntry>
  </Legend>
</div>

<style>
  .upstate-lulc-map {
    position: relative;
  }
</style>
