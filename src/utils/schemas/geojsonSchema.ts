import { z } from 'zod';

export const geojsonSchema = z
  .object({
    type: z.literal('FeatureCollection'),
    features: z.array(
      z
        .object({
          type: z.literal('Feature'),
          geometry: z.object({
            type: z
              .literal('Point')
              .or(z.literal('MultiPoint'))
              .or(z.literal('LineString'))
              .or(z.literal('MultiLineString'))
              .or(z.literal('Polygon'))
              .or(z.literal('MultiPolygon')),
            coordinates: z.any(),
          }),
          properties: z.record(z.any()),
        })
        .passthrough()
    ),
  })
  .passthrough();
