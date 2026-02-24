import { hasKey } from '$utils';

export function geolocate(map: maplibregl.Map) {
  const currentCenter = map.getCenter();

  return new Promise<GeolocationPosition>((resolve, reject) => {
    // get the geolocate control from the map
    // @ts-expect-error _geolocateButton exists when the control is a geolocate control
    const geolocateControl = map?._controls.find((control) => control._geolocateButton) as
      | maplibregl.GeolocateControl
      | undefined;

    if (!geolocateControl) {
      reject(new Error('Could not find geolocate control'));
      return;
    }

    function handleGeolocate(pos: GeolocationPosition) {
      resolve({ coords: pos.coords, timestamp: pos.timestamp });
      done();
    }

    function handleError(error: GeolocationPositionError) {
      reject(new Error(error.message));
      done();
    }

    function handleOutOfMaxBounds() {
      reject(new Error('Position out of maximum bounds'));
      done();
    }

    function done() {
      geolocateControl?.off('geolocate', handleGeolocate);
      geolocateControl?.off('error', handleError);
      geolocateControl?.off('outofmaxbounds', handleOutOfMaxBounds);
      map.setCenter(currentCenter);
    }

    geolocateControl.once('geolocate', handleGeolocate);
    geolocateControl.once('error', handleError);
    geolocateControl.once('outofmaxbounds', handleOutOfMaxBounds);

    geolocateControl.trigger();
  });
}

export function getLocationFeatures(map: maplibregl.Map, location: GeolocationCoordinates) {
  const point = map.project([location.longitude, location.latitude]);
  const precinctPolygonLayers = map
    .getStyle()
    .layers.filter((l) => hasKey(l, 'source') && l.source === 'voteMarginShapes')
    .map((l) => l.id);
  return map.queryRenderedFeatures(point, { layers: precinctPolygonLayers });
}

export type GeolocationPosition = Parameters<maplibregl.GeolocateControl['_onSuccess']>[0];
export type GeolocationCoordinates = Parameters<
  maplibregl.GeolocateControl['_onSuccess']
>[0]['coords'];
export type GeolocationPositionError = Parameters<maplibregl.GeolocateControl['_onError']>[0];
