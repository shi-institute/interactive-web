import countyFipsData from './countyFIPS.json';
// data source from https://raw.githubusercontent.com/ChuckConnell/articles/refs/heads/master/fips2county.tsv
// (https://medium.com/towards-data-science/the-ultimate-state-county-fips-tool-1e4c54dc9dff)

export function fipsToCountyName(stateFIPS: number, countyFIPS: number) {
  const FIPS = stateFIPS.toString().padStart(2, '0') + countyFIPS.toString().padStart(3, '0');
  const match = countyFipsData.find((d) => d.CountyFIPS === FIPS);
  return [match?.CountyName || '', match] as const;
}
