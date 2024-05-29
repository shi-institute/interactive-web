import storage from '$lib/store';

interface OpWonkOptions {
  yearsACS: string;
  yearsACS2: string;
  city: string;
  city2: string;
  showPercentOfHouseholds: boolean;
  compare: boolean;
  consolidate: boolean;
  showMedianHouseholdIncome: boolean;
  medianHouseholdIncomeMode: {
    ami: boolean;
    black_ami: boolean;
    white_ami: boolean;
  };
  labelBracketValues: boolean;
  bracketValuesLabelMode: 'total_household' | 'percent_of_place_households';
  useSameScaleWhenComparing: boolean;
}

export const opWonkOptionsStore = storage<OpWonkOptions>('opWonkOptions', {
  yearsACS: '2018-2022',
  yearsACS2: '2018-2022',
  city: 'Greenville, SC',
  city2: 'Greensboro, NC',
  showPercentOfHouseholds: false,
  compare: false,
  consolidate: false,
  showMedianHouseholdIncome: true,
  medianHouseholdIncomeMode: {
    ami: true,
    black_ami: false,
    white_ami: false,
  },
  labelBracketValues: true,
  bracketValuesLabelMode: 'total_household',
  useSameScaleWhenComparing: false,
});
