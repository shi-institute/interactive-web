export function calcProportionMOE(
  data: Record<string, unknown>,
  numeratorFields: string | string[],
  denominatorFields: string | string[]
): number {
  if (typeof numeratorFields === 'string') {
    numeratorFields = [numeratorFields];
  }

  if (typeof denominatorFields === 'string') {
    denominatorFields = [denominatorFields];
  }

  const numerator = numeratorFields
    .map((field) => data[field])
    .filter((val) => typeof val === 'number')
    .reduce((a, b) => a + b, 0);
  const denominator = denominatorFields
    .map((field) => data[field])
    .filter((val) => typeof val === 'number')
    .reduce((a, b) => a + b, 0);

  const proportion = numerator / denominator;

  const moeNumerator = Math.sqrt(
    numeratorFields
      .map((field) => data['M' + field])
      .filter((val) => typeof val === 'number')
      .map((num) => num ** 2)
      .reduce((a, b) => a + b, 0)
  );
  const moeDenominator = Math.sqrt(
    denominatorFields
      .map((field) => data['M' + field])
      .filter((val) => typeof val === 'number')
      .map((num) => num ** 2)
      .reduce((a, b) => a + b, 0)
  );

  const radicandPart1 = moeNumerator ** 2;
  const radicandPart2 = proportion ** 2 * moeDenominator ** 2;
  const radicand =
    radicandPart1 - radicandPart2 < 0
      ? radicandPart1 + radicandPart2
      : radicandPart1 - radicandPart2;

  return (1 / denominator) * Math.sqrt(radicand);
}
