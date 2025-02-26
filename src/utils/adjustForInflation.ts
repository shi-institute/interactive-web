import CPI from './cpi.json';
const cpiData = CPI as unknown as Record<
  number,
  Record<
    | 'Jan'
    | 'Feb'
    | 'Mar'
    | 'Apr'
    | 'May'
    | 'Jun'
    | 'Jul'
    | 'Aug'
    | 'Sep'
    | 'Oct'
    | 'Nov'
    | 'Dec'
    | 'Annual',
    number
  >
>;

// CPI data:

/**
 * Adjusts a value for inflation based on CPI.
 * @param amount - The amount to adjust.
 * @param baseYear - The year of the original amount.
 * @param targetYear - The year to adjust to.
 * @returns - The inflation-adjusted amount.
 * @throws - Error if CPI data is not available for the given years.
 */
export function adjustForInflation(
  amount: number | undefined | null,
  baseYear: number,
  targetYear: number
): number | null {
  // Ensure both base year and target year CPI data are available
  if (!(baseYear in cpiData) || !(targetYear in cpiData)) {
    throw new Error('CPI data not available for the given years.');
  }

  if (amount === null || amount === undefined) {
    return null;
  }

  const baseYearCPI = cpiData[baseYear]['Annual'];
  const targetYearCPI = cpiData[targetYear]['Annual'];

  // Calculate the adjustment factor
  const adjustmentFactor = targetYearCPI / baseYearCPI;

  // Adjust the amount
  return amount * adjustmentFactor;
}
