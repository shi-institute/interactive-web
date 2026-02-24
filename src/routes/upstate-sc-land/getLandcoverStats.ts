export async function getLandcoverStats() {
  const conus_landcover_projections_2006_2100_stats = await import(
    './conus_landcover_projections_2006-2100_stats.json'
  );

  const landcoverStats = conus_landcover_projections_2006_2100_stats.default.map((obj) => ({
    ...obj,
    ...Object.fromEntries(
      Object.entries(obj.pixels).map(([key, value]) => [
        `millionSqKm${key.replaceAll(' ', '').replaceAll('/', '')}`,
        (value * 0.25) / // each pixel represents 0.25 square kilometers
          1000000, // we want to show by millions of square kilometers
      ])
    ),
  }));

  return landcoverStats;
}
