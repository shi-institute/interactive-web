export function isEsriFeatureLayer(layer: __esri.Layer): layer is __esri.FeatureLayer {
  return layer.constructor.name === 'FeatureLayer';
}
