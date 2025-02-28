import { colors } from '$lib/colors';
import { barWithLabelY } from '$lib/plot/marks';
import { hasKey } from '$utils';
import { notEmpty } from '$utils/notEmpty';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';
import type { PageData } from './[neighborhood]/plots/[plot]/$types';
import { calcProportionMOE } from './calcProportionMOE';

export const plotConfigs: Record<string, PlotConfigFunction> = {
  median_household_income(neighborhood, data) {
    const max = Math.max(
      ...data.flatMap((d) =>
        [
          d.median_household_income,
          d.median_household_income__black,
          d.median_household_income__white,
          d.median_household_income__hispanic,
        ].filter(notEmpty)
      )
    );

    return {
      title: 'Median household income',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Median household income',
        tickFormat: (d) => {
          return `$${d / 1000}k`;
        },
        domain: [0, max],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'median_household_income',
          yErrorMargin: 'Mmedian_household_income',
          labelFormat: '$,.0f',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  median_household_income__white(neighborhood, data) {
    const max = Math.max(
      ...data.flatMap((d) =>
        [
          d.median_household_income,
          d.median_household_income__black,
          d.median_household_income__white,
          d.median_household_income__hispanic,
        ].filter(notEmpty)
      )
    );

    const noData =
      data.map((d) => d.median_household_income__white).filter((x) => !!x).length === 0;

    return {
      title: 'Median household income (White householder)',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Median household income',
        tickFormat: (d) => {
          return `$${d / 1000}k`;
        },
        domain: noData ? undefined : [0, max],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: noData
        ? [Plot.text(['No data'], { x: 0, y: 0 })]
        : [
            barWithLabelY(data, {
              x: 'year',
              y: 'median_household_income__white',
              yErrorMargin: 'Mmedian_household_income__white',
              labelFormat: '$,.0f',
              fill: colors.vibrant.teal,
              labelFill: 'black',
            }),
          ],
    };
  },
  median_household_income__black(neighborhood, data) {
    const max = Math.max(
      ...data.flatMap((d) =>
        [
          d.median_household_income,
          d.median_household_income__black,
          d.median_household_income__white,
          d.median_household_income__hispanic,
        ].filter(notEmpty)
      )
    );

    const noData =
      data.map((d) => d.median_household_income__black).filter((x) => !!x).length === 0;

    return {
      title: 'Median household income (Black householder)',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Median household income',
        tickFormat: (d) => {
          return `$${d / 1000}k`;
        },
        domain: noData ? undefined : [0, max],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: noData
        ? [Plot.text(['No data'], { x: 0, y: 0 })]
        : [
            barWithLabelY(data, {
              x: 'year',
              y: 'median_household_income__black',
              yErrorMargin: 'Mmedian_household_income__black',
              labelFormat: '$,.0f',
              fill: colors.vibrant.teal,
              labelFill: 'black',
            }),
          ],
    };
  },
  median_household_income__hispanic(neighborhood, data) {
    const max = Math.max(
      ...data.flatMap((d) =>
        [
          d.median_household_income,
          d.median_household_income__black,
          d.median_household_income__white,
          d.median_household_income__hispanic,
        ].filter(notEmpty)
      )
    );

    const noData =
      data.map((d) => d.median_household_income__hispanic).filter((x) => !!x).length === 0;

    return {
      title: 'Median household income (Hispanic or Latino householder)',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Median household income',
        tickFormat: (d) => {
          return `$${d / 1000}k`;
        },
        domain: noData ? undefined : [0, max],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: noData
        ? [Plot.text(['No data'], { x: 0, y: 0 })]
        : [
            barWithLabelY(data, {
              x: 'year',
              y: 'median_household_income__hispanic',
              yErrorMargin: 'Mmedian_household_income__hispanic',
              labelFormat: '$,.0f',
              fill: colors.vibrant.teal,
              labelFill: 'black',
            }),
          ],
    };
  },
  population__total(neighborhood, data) {
    const maxDigits = Math.max(...data.map((d) => d.population__total?.toString?.()?.length || 0));

    return {
      title: 'Total Population',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period', type: 'band' },
      y: {
        label: 'Total Population',
        tickFormat: (d) => d.toLocaleString(),
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: maxDigits > 3 ? 50 : 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'population__total',
          yErrorMargin: 'Mpopulation__total',
          labelFormat: '.0f',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  education__high_school_or_higher(neighborhood, data) {
    return {
      title: 'Education: High school degree',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `Includes regular high school degrees and GED or alternative credentials. <br /><i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent with high school degree',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(
          data.map((d) => {
            const education__high_school =
              d['education__regular_high_school_diploma'] +
              d['education__ged_or_alternative_credential'];

            const educationHighSchoolOrHigherFields = [
              'education__regular_high_school_diploma',
              'education__ged_or_alternative_credential',
              'education__some_college_no_degree',
              'education__associates_degree',
              'education__bachelors_degree',
              'education__masters_degree',
              'education__professional_school_degree',
              'education__doctorate_degree',
            ] as const satisfies string[];

            const education__high_school_or_higher = educationHighSchoolOrHigherFields
              .map((field) => d[field])
              .reduce((a, b) => a + b, 0);

            const education__high_school_or_higher_percent =
              education__high_school_or_higher / d['population__total'];

            const Meducation__high_school_or_higher_percent = calcProportionMOE(
              d,
              educationHighSchoolOrHigherFields,
              'population__total'
            );

            return {
              education__high_school_or_higher_percent,
              Meducation__high_school_or_higher_percent,
              ...d,
            };
          }),
          {
            x: 'year',
            y: 'education__high_school_or_higher_percent',
            yErrorMargin: 'Meducation__high_school_or_higher_percent',
            labelFormat: '.1%',
            fill: colors.vibrant.teal,
            labelFill: 'black',
          }
        ),
      ],
    };
  },
  education__some_college_or_higher(neighborhood, data) {
    return {
      title: 'Education: Some college or higher',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent with some college education',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(
          data.map((d) => {
            const educationSomeCollegeOrHigherFields = [
              'education__some_college_no_degree',
              'education__associates_degree',
              'education__bachelors_degree',
              'education__masters_degree',
              'education__professional_school_degree',
              'education__doctorate_degree',
            ] as const satisfies string[];

            const education__some_college_or_higher = educationSomeCollegeOrHigherFields
              .map((field) => d[field])
              .reduce((a, b) => a + b, 0);

            const education__some_college_or_higher_percent =
              education__some_college_or_higher / d['population__total'];

            const Meducation__some_college_or_higher_percent = calcProportionMOE(
              d,
              educationSomeCollegeOrHigherFields,
              'population__total'
            );

            return {
              education__some_college_or_higher_percent,
              Meducation__some_college_or_higher_percent,
              ...d,
            };
          }),
          {
            x: 'year',
            y: 'education__some_college_or_higher_percent',
            yErrorMargin: 'Meducation__some_college_or_higher_percent',
            labelFormat: '.1%',
            fill: colors.vibrant.teal,
            labelFill: 'black',
          }
        ),
      ],
    };
  },
  education__college_degree(neighborhood, data) {
    return {
      title: 'Education: College graduate',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent with a college degree',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(
          data.map((d) => {
            const educationCollegeDegreeFields = [
              'education__associates_degree',
              'education__bachelors_degree',
              'education__masters_degree',
              'education__professional_school_degree',
              'education__doctorate_degree',
            ] as const satisfies string[];

            const education__college_degree = educationCollegeDegreeFields
              .map((field) => d[field])
              .reduce((a, b) => a + b, 0);

            const education__college_degree_percent =
              education__college_degree / d['population__total'];

            const Meducation__college_degree_percent = calcProportionMOE(
              d,
              educationCollegeDegreeFields,
              'population__total'
            );

            return {
              education__college_degree_percent,
              Meducation__college_degree_percent,
              ...d,
            };
          }),
          {
            x: 'year',
            y: 'education__college_degree_percent',
            yErrorMargin: 'Meducation__college_degree_percent',
            labelFormat: '.1%',
            fill: colors.vibrant.teal,
            labelFill: 'black',
          }
        ),
      ],
    };
  },
  poverty__below_poverty_household_fraction(neighborhood, data) {
    return {
      title: 'Households below the poverty line',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent of households',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'poverty__below_poverty_household_fraction',
          yErrorMargin: 'Mpoverty__below_poverty_household_fraction',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  internet__broadband__total(neighborhood, data) {
    return {
      title: 'Households with access to broadband internet',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent households',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'internet__broadband__total_percent',
          yErrorMargin: 'Minternet__broadband__total_percent',
          labelFormat: '.0%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  internet__broadband__white_percent(neighborhood, data) {
    return {
      title: 'White households with access to broadband internet',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'internet__broadband__white_percent',
          yErrorMargin: 'Minternet__broadband__white_percent',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  internet__broadband__black_percent(neighborhood, data) {
    return {
      title: 'Black households with access to broadband internet',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'internet__broadband__black_percent',
          yErrorMargin: 'Minternet__broadband__black_percent',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  internet__broadband__hispanic_percent(neighborhood, data) {
    return {
      title: 'Hispanic or Latino households with access to broadband internet',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'internet__broadband__hispanic_percent',
          yErrorMargin: 'Minternet__broadband__hispanic_percent',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  has_computer__total__percent(neighborhood, data) {
    return {
      title: 'Households with access to a computer or smartphone',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent with access to a computer',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(
          data.map((d) => {
            const has_computer__total = d['has_computer__total'] || 0;
            const no_computer__total = d['no_computer__total'] || 0;

            const has_computer__total__percent =
              has_computer__total / (has_computer__total + no_computer__total);

            const Mhas_computer__total__percent = calcProportionMOE(
              d,
              ['has_computer__total', 'no_computer__total'],
              'population__total'
            );

            return {
              has_computer__total__percent,
              Mhas_computer__total__percent,
              ...d,
            };
          }),
          {
            x: 'year',
            y: 'has_computer__total__percent',
            yErrorMargin: 'Mhas_computer__total__percent',
            labelFormat: '.1%',
            fill: colors.vibrant.teal,
            labelFill: 'black',
          }
        ),
      ],
    };
  },
  has_computer__white_percent(neighborhood, data) {
    return {
      title: 'White households with access to a computer or smartphone',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'has_computer__white_percent',
          yErrorMargin: 'Mhas_computer__white_percent',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  has_computer__black_percent(neighborhood, data) {
    return {
      title: 'Black households with access to a computer or smartphone',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'has_computer__black_percent',
          yErrorMargin: 'Mhas_computer__black_percent',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  has_computer__hispanic_percent(neighborhood, data) {
    return {
      title: 'Hispanic or Latino households with access to a computer or smartphone',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'has_computer__hispanic_percent',
          yErrorMargin: 'Mhas_computer__hispanic_percent',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  industry__service_fraction(neighborhood, data) {
    return {
      title: 'Workers in the service industry',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `People who are employed by employers in the following industries are considered: educational services, health care, social assistance, arts, entertainment, recreation, accomodation, and food services. <br /><i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'industry__service_fraction',
          yErrorMargin: 'Mindustry__service_fraction',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  food_stamps__received_fraction(neighborhood, data) {
    return {
      title: 'Households in Supplemental Nutrition Assistance Program',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `Households that received SNAP benefits in the last 12 months are included in this rate. <br /><i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'food_stamps__received_fraction',
          yErrorMargin: 'Mfood_stamps__received_fraction',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  geographic_mobility__different_county_same_state_fraction(neighborhood, data) {
    return {
      title: 'Migration from a different county in South Carolina',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent',
        tickFormat: '.0%',
        domain: [0, 0.2],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'geographic_mobility__different_county_same_state_fraction',
          yErrorMargin: 'Mgeographic_mobility__different_county_same_state_fraction',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
      style: `
        g[aria-label='y-axis tick label'] {
          text:last-child {
            fill: hsl(0, 100.00%, 50%);
            @media (prefers-color-scheme: dark) {
              fill:hsl(0, 100.00%, 75%);
            }
          }
        }
      `,
    };
  },
  geographic_mobility__different_state_fraction(neighborhood, data) {
    return {
      title: 'Migration from outside South Carolina',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent',
        tickFormat: '.0%',
        domain: [0, 0.2],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'geographic_mobility__different_state_fraction',
          yErrorMargin: 'Mgeographic_mobility__different_state_fraction',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
      style: `
        g[aria-label='y-axis tick label'] {
          text:last-child {
            fill: hsl(0, 100.00%, 50%);
            @media (prefers-color-scheme: dark) {
              fill:hsl(0, 100.00%, 75%);
            }
          }
        }
      `,
    };
  },
  population__children_living_with_grandparent_householder_fraction(neighborhood, data) {
    return {
      title: 'Caregivers who are grandparents',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent grandparents caring for their grandchildren',
        tickFormat: '.0%',
        domain: [0, 0.2],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'population__children_living_with_grandparent_householder_fraction',
          yErrorMargin: 'Mpopulation__children_living_with_grandparent_householder_fraction',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
      style: `
        g[aria-label='y-axis tick label'] {
          text:last-child {
            fill: hsl(0, 100.00%, 50%);
            @media (prefers-color-scheme: dark) {
              fill:hsl(0, 100.00%, 75%);
            }
          }
        }
      `,
    };
  },
  household_vehicles__none_fraction(neighborhood, data) {
    return {
      title: 'Households without vehicles',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Percent of households',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'household_vehicles__none_fraction',
          yErrorMargin: 'Mhousehold_vehicles__none_fraction',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  insurance_coverage__with_insurance_fraction(neighborhood, data) {
    return getHealthInsurancePlotConfig(neighborhood, data, 'Overall');
  },
  insurance_coverage__black__with_insurance_fraction(neighborhood, data) {
    return getHealthInsurancePlotConfig(neighborhood, data, 'Black');
  },
  insurance_coverage__white__with_insurance_fraction(neighborhood, data) {
    return getHealthInsurancePlotConfig(neighborhood, data, 'White');
  },
  insurance_coverage__hispanic__with_insurance_fraction(neighborhood, data) {
    return getHealthInsurancePlotConfig(neighborhood, data, 'Hispanic or Latino');
  },
  insurance_coverage__RACE_BREAKDOWN__with_insurance_fraction(neighborhood, data) {
    const tidyData = getTidyInsuranceData(data);
    const facetNames = tidyData.filter((d) => !!d.fraction).map((d) => d.group);
    const { facetOrder, legendColors, facetColors } = getRaceBreakdownColors(facetNames);

    return {
      title: 'With health insurance',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      fx: { label: 'Survey period' },
      x: { axis: null, domain: facetOrder },
      y: {
        label: 'Percent with insurance coverage',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      color: {
        legend: true,
        domain: facetOrder,
        range: legendColors,
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(tidyData, {
          x: 'group',
          fx: 'year',
          y: 'fraction',
          yErrorMargin: 'moe',
          labelFormat: '.1%',
          labelFill: (d) => (d.group === 'Overall' ? '#666' : facetColors.get(d.group)),
          fill: 'group',
        }),
        Plot.ruleY([0]),
      ],
    };
  },
  tenure__renter_fraction(neighborhood, data) {
    return getRenterPlotConfig(neighborhood, data, 'Overall');
  },
  tenure__black__renter_fraction(neighborhood, data) {
    return getRenterPlotConfig(neighborhood, data, 'Black');
  },
  tenure__white__renter_fraction(neighborhood, data) {
    return getRenterPlotConfig(neighborhood, data, 'White');
  },
  tenure__hispanic__renter_fraction(neighborhood, data) {
    return getRenterPlotConfig(neighborhood, data, 'Hispanic or Latino');
  },
  tenure__RACE_BREAKDOWN__renter_fraction(neighborhood, data) {
    const tidyData = getTidyRenterData(data);
    const facetNames = tidyData.filter((d) => !!d.fraction).map((d) => d.group);
    const { facetOrder, legendColors, facetColors } = getRaceBreakdownColors(facetNames);

    return {
      title: 'Renter households',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `The Census categorizes households into renter-occupied and owner-occupied status. This figure shows the percentage of households that rent instead of own. Overall includes all households. <br /> <i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      fx: { label: 'Survey period' },
      x: { axis: null, domain: facetOrder },
      y: {
        label: 'Percent households who rent',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      color: {
        legend: true,
        domain: facetOrder,
        range: legendColors,
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(tidyData, {
          x: 'group',
          fx: 'year',
          y: 'fraction',
          yErrorMargin: 'moe',
          labelFormat: '.1%',
          labelFill: (d) => (d.group === 'Overall' ? '#666' : facetColors.get(d.group)),
          fill: 'group',
        }),
        Plot.ruleY([0]),
      ],
    };
  },
  employment__unemployed_fraction(neighborhood, data) {
    return getUnemploymentFractionPlotConfig(neighborhood, data, 'Overall');
  },
  employment__black__unemployed_fraction(neighborhood, data) {
    return getUnemploymentFractionPlotConfig(neighborhood, data, 'Black');
  },
  employment__white__unemployed_fraction(neighborhood, data) {
    return getUnemploymentFractionPlotConfig(neighborhood, data, 'White');
  },
  employment__hispanic__unemployed_fraction(neighborhood, data) {
    return getUnemploymentFractionPlotConfig(neighborhood, data, 'Hispanic or Latino');
  },
  employment__RACE_BREAKDOWN__unemployed_fraction(neighborhood, data) {
    const tidyData = getTidyUnemploymentData(data);
    const facetNames = tidyData.filter((d) => !!d.fraction).map((d) => d.group);
    const { facetOrder, legendColors, facetColors } = getRaceBreakdownColors(facetNames);

    return {
      title: 'Unemployment',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      fx: { label: 'Survey period' },
      x: { axis: null, domain: facetOrder },
      y: {
        label: 'Percent unemployed population',
        tickFormat: '.0%',
        domain: [0, 1],
      },
      color: {
        legend: true,
        domain: facetOrder,
        range: legendColors,
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(tidyData, {
          x: 'group',
          fx: 'year',
          y: 'fraction',
          yErrorMargin: 'moe',
          labelFormat: '.1%',
          labelFill: (d) => (d.group === 'Overall' ? '#666' : facetColors.get(d.group)),
          fill: 'group',
        }),
        Plot.ruleY([0]),
      ],
    };
  },
  population__RACE_ETHNICITY_BREAKDOWN(neighborhood, data) {
    const tidyData = data.flatMap(({ year, ...data }) => {
      return [
        {
          year,
          group: 'White (not Hispanic or Latino)',
          amount: data.ethnicity__not_hispanic_or_latino__white,
          moe:
            hasKey(data, 'Methnicity__not_hispanic_or_latino__white') &&
            data.Methnicity__not_hispanic_or_latino__white,
        },
        {
          year,
          group: 'Black (not Hispanic or Latino)',
          amount: data.ethnicity__not_hispanic_or_latino__black,
          moe:
            hasKey(data, 'Methnicity__not_hispanic_or_latino__black') &&
            data.Methnicity__not_hispanic_or_latino__black,
        },
        {
          year,
          group: 'Hispanic or Latino',
          amount: data.ethnicity__hispanic_or_latino,
          moe:
            hasKey(data, 'Methnicity__hispanic_or_latino') && data.Methnicity__hispanic_or_latino,
        },
        {
          year,
          group: 'Other race (not Hispanic or Latino)',
          amount:
            data.ethnicity__not_hispanic_or_latino__other_race +
            data.ethnicity__not_hispanic_or_latino__amer_indian_alaskan_native +
            data.ethnicity__not_hispanic_or_latino__asian +
            data.ethnicity__not_hispanic_or_latino__pacific_islander,
          moe: Math.sqrt(
            [
              'ethnicity__not_hispanic_or_latino__other_race',
              'ethnicity__not_hispanic_or_latino__amer_indian_alaskan_native',
              'ethnicity__not_hispanic_or_latino__asian',
              'ethnicity__not_hispanic_or_latino__pacific_islander',
            ]
              // @ts-expect-error
              .map((field) => hasKey(data, 'M' + field) && data['M' + field])
              .filter((val) => typeof val === 'number')
              .map((num) => num ** 2)
              .reduce((a, b) => a + b, 0)
          ),
        },
        {
          year,
          group: 'Two or more races (not Hispanic or Latino)',
          amount: data.ethnicity__not_hispanic_or_latino__two_or_more_races,
          moe:
            hasKey(data, 'ethnicity__not_hispanic_or_latino__two_or_more_races') &&
            data.ethnicity__not_hispanic_or_latino__two_or_more_races,
        },
      ];
    });

    const facetNames = Array.from(new Set(tidyData.filter((d) => !!d.amount).map((d) => d.group)));

    const facetColors = new Map([
      ['White (not Hispanic or Latino)', colors.vibrant.orange],
      ['Black (not Hispanic or Latino)', colors.vibrant.blue],
      ['Hispanic or Latino', colors.vibrant.teal],
      ['Other race (not Hispanic or Latino)', colors.vibrant.gray],
      ['Two or more races (not Hispanic or Latino)', colors.vibrant.magenta],
    ]);

    for (const [facetName] of facetColors) {
      if (!facetNames.includes(facetName)) {
        facetColors.delete(facetName);
      }
    }

    const facetOrder = Array.from(facetColors.keys());
    const legendColors = Array.from(facetColors.values());

    return {
      title: 'Population breakdown',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      fx: { label: 'Survey period' },
      x: { axis: null, domain: facetOrder },
      y: {
        label: 'Population',
      },
      color: {
        legend: true,
        domain: facetOrder,
        range: legendColors,
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 50,
      marks: [
        barWithLabelY(tidyData, {
          x: 'group',
          fx: 'year',
          y: 'amount',
          yErrorMargin: 'moe',
          labelFormat: '.0f',
          fill: 'group',
        }),
        Plot.ruleY([0]),
      ],
    };
  },
  disability__AGE_BREAKDOWN(neighborhood, data) {
    const tidyData = data.flatMap(({ year, ...data }) => {
      return [
        {
          year,
          group: '<5',
          amount: data.disability__under_5__male + data.disability__under_5__female,
          moe: Math.sqrt(
            ['disability__under_5__male', 'disability__under_5__female']
              // @ts-expect-error
              .map((field) => hasKey(data, 'M' + field) && data['M' + field])
              .filter((val) => typeof val === 'number')
              .map((num) => num ** 2)
              .reduce((a, b) => a + b, 0)
          ),
        },
        {
          year,
          group: '5-17',
          amount: data['disability__5-17__male'] + data['disability__5-17__female'],
          moe: Math.sqrt(
            ['disability__5-17__male', 'disability__5-17__female']
              // @ts-expect-error
              .map((field) => hasKey(data, 'M' + field) && data['M' + field])
              .filter((val) => typeof val === 'number')
              .map((num) => num ** 2)
              .reduce((a, b) => a + b, 0)
          ),
        },
        {
          year,
          group: '18-34',
          amount: data['disability__18-34__male'] + data['disability__18-34__female'],
          moe: Math.sqrt(
            ['disability__18-34__male', 'disability__18-34__female']
              // @ts-expect-error
              .map((field) => hasKey(data, 'M' + field) && data['M' + field])
              .filter((val) => typeof val === 'number')
              .map((num) => num ** 2)
              .reduce((a, b) => a + b, 0)
          ),
        },
        {
          year,
          group: '35-64',
          amount: data['disability__35-64__male'] + data['disability__35-64__female'],
          moe: Math.sqrt(
            ['disability__35-64__male', 'disability__35-64__female']
              // @ts-expect-error
              .map((field) => hasKey(data, 'M' + field) && data['M' + field])
              .filter((val) => typeof val === 'number')
              .map((num) => num ** 2)
              .reduce((a, b) => a + b, 0)
          ),
        },
        {
          year,
          group: '65-74',
          amount: data['disability__65-74__male'] + data['disability__65-74__female'],
          moe: Math.sqrt(
            ['disability__65-74__male', 'disability__65-74__female']
              // @ts-expect-error
              .map((field) => hasKey(data, 'M' + field) && data['M' + field])
              .filter((val) => typeof val === 'number')
              .map((num) => num ** 2)
              .reduce((a, b) => a + b, 0)
          ),
        },
        {
          year,
          group: '≥75',
          amount: data.disability__75_over__male + data.disability__75_over__female,
          moe: Math.sqrt(
            ['disability__75_over__male', 'disability__75_over__female']
              // @ts-expect-error
              .map((field) => hasKey(data, 'M' + field) && data['M' + field])
              .filter((val) => typeof val === 'number')
              .map((num) => num ** 2)
              .reduce((a, b) => a + b, 0)
          ),
        },
      ];
    });

    const facetNames = Array.from(new Set(tidyData.filter((d) => !!d.amount).map((d) => d.group)));

    const facetColors = new Map([
      ['<5', colors.vibrant.gray],
      ['5-17', colors.vibrant.gray],
      ['18-34', colors.vibrant.gray],
      ['35-64', colors.vibrant.gray],
      ['65-74', colors.vibrant.gray],
      ['≥75', colors.vibrant.gray],
    ]);

    for (const [facetName] of facetColors) {
      if (!facetNames.includes(facetName)) {
        facetColors.delete(facetName);
      }
    }

    const facetOrder = Array.from(facetColors.keys());
    const legendColors = Array.from(facetColors.values());

    return {
      title: 'Disability by age',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      fx: { label: 'Survey period' },
      x: { axis: null, domain: facetOrder },
      y: {
        label: 'Population',
      },
      color: {
        legend: true,
        domain: facetOrder,
        // range: legendColors,
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 50,
      marks: [
        barWithLabelY(tidyData, {
          x: 'group',
          fx: 'year',
          y: 'amount',
          yErrorMargin: 'moe',
          labelFormat: '.0f',
          fill: 'group',
        }),
        Plot.ruleY([0]),
      ],
    };
  },
};

export const blockPlotConfigs: Record<string, BlockPlotConfigFunction> = {
  population__total(neighborhood, data) {
    // @ts-expect-error while the data object has different keys, all of the keys
    // needed for this plot are the same
    const plotConfig = plotConfigs.population__total(neighborhood, data);
    plotConfig.subtitle = `${neighborhood} (decennial census)`;
    if (plotConfig.x) plotConfig.x.label = 'Year';
    return plotConfig;
  },
  population__RACE_ETHNICITY_BREAKDOWN(neighborhood, data) {
    // @ts-expect-error while the data object has different keys, all of the keys
    // needed for this plot are the same
    const plotConfig = plotConfigs.population__RACE_ETHNICITY_BREAKDOWN(neighborhood, data);
    plotConfig.subtitle = `${neighborhood} (decennial census)`;
    if (plotConfig.fx) plotConfig.fx.label = 'Year';
    return plotConfig;
  },
  housing_units(neighborhood, data) {
    const tidyData = data.flatMap((d) => {
      return [
        {
          year: d.year,
          group: 'Occupied',
          amount: d.housing_units__occupied,
        },
        {
          year: d.year,
          group: 'Vacant',
          amount: d.housing_units__vacant,
        },
      ];
    });

    return {
      title: 'Housing units',
      subtitle: `${neighborhood} (decennial census)`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      fx: { label: 'Year' },
      x: { axis: null, domain: ['Occupied', 'Vacant'] },
      y: {
        label: 'Total',
        tickFormat: '.0f',
      },
      color: {
        legend: true,
        domain: ['Occupied', 'Vacant'],
        range: [colors.vibrant.teal, colors.vibrant.gray],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(tidyData, {
          x: 'group',
          fx: 'year',
          y: 'amount',
          yErrorMargin: 'moe',
          labelFormat: '.0f',
          fill: 'group',
          labelFill: 'black',
        }),
      ],
    };
  },
  tenure__renter_fraction(neighborhood, data, url) {
    const plotConfig = plotConfigs.tenure__renter_fraction(
      neighborhood,
      // @ts-expect-error while the data object has different keys, all of the keys
      // needed for this plot are the same
      data.map(({ housing__owner_occupied, housing__renter_occupied, year }) => ({
        tenure__owner: housing__owner_occupied,
        tenure__renter: housing__renter_occupied,
        year,
      })),
      url
    );
    plotConfig.subtitle = `${neighborhood} (decennial census)`;
    if (plotConfig.x) plotConfig.x.label = 'Year';
    return plotConfig;
  },
  population__18_over_under(neighborhood, data) {
    const tidyData = data.flatMap((d) => {
      return [
        {
          year: d.year,
          group: 'Under 18',
          amount:
            (d['age__under_5__male'] ?? 0) +
            (d['age__5-9__male'] ?? 0) +
            (d['age__10-14__male'] ?? 0) +
            (d['age__15-17__male'] ?? 0) +
            (d['age__under_5__female'] ?? 0) +
            (d['age__5-9__female'] ?? 0) +
            (d['age__10-14__female'] ?? 0) +
            (d['age__15-17__female'] ?? 0),
        },
        {
          year: d.year,
          group: 'Over 18',
          amount:
            (d.population__total ?? 0) -
            ((d['age__under_5__male'] ?? 0) +
              (d['age__5-9__male'] ?? 0) +
              (d['age__10-14__male'] ?? 0) +
              (d['age__15-17__male'] ?? 0) +
              (d['age__under_5__female'] ?? 0) +
              (d['age__5-9__female'] ?? 0) +
              (d['age__10-14__female'] ?? 0) +
              (d['age__15-17__female'] ?? 0)),
        },
      ];
    });

    const maxDigits = Math.max(...tidyData.map((d) => d.amount?.toString?.()?.length || 0));

    return {
      title: 'Population under and over 18',
      subtitle: `${neighborhood} (decennial census)`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      fx: { label: 'Year' },
      x: { axis: null, domain: ['Under 18', 'Over 18'] },
      y: {
        label: 'Total',
        tickFormat: '.0f',
      },
      color: {
        legend: true,
        domain: ['Under 18', 'Over 18'],
        range: [colors.vibrant.lightblue, colors.vibrant.blue],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: maxDigits > 3 ? 50 : 40,
      marks: [
        barWithLabelY(tidyData, {
          x: 'group',
          fx: 'year',
          y: 'amount',
          yErrorMargin: 'moe',
          labelFormat: '.0f',
          fill: 'group',
          labelFill: 'black',
        }),
      ],
    };
  },
  age__under_5(neighborhood, data) {
    const tidyData = data.map((d) => {
      return {
        year: d.year,
        age__under_5: (d.age__under_5__male || 0) + (d.age__under_5__female || 0),
        // Mage__under_5: (d.Mage__under_5__male || 0) + (d.Mage__under_5__female || 0),
      };
    });

    const maxDigits = Math.max(...tidyData.map((d) => d.age__under_5?.toString?.()?.length || 0));

    return {
      title: 'Children under age 5',
      subtitle: `${neighborhood} (decennial census)`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period', type: 'band' },
      y: {
        label: 'Total Population',
        tickFormat: (d) => d.toLocaleString(),
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: maxDigits > 3 ? 50 : 40,
      marks: [
        barWithLabelY(tidyData, {
          x: 'year',
          y: 'age__under_5',
          yErrorMargin: 'Mage__under_5',
          labelFormat: '.0f',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  age__65_over(neighborhood, data) {
    const tidyData = data.map((d) => {
      return {
        year: d.year,
        age__65_over:
          (d['age__65-66__male'] || 0) +
          (d['age__67-69__male'] || 0) +
          (d['age__70-74__male'] || 0) +
          (d['age__75-79__male'] || 0) +
          (d['age__80-84__male'] || 0) +
          (d['age__85_over__male'] || 0) +
          (d['age__65-66__female'] || 0) +
          (d['age__67-69__female'] || 0) +
          (d['age__70-74__female'] || 0) +
          (d['age__75-79__female'] || 0) +
          (d['age__80-84__female'] || 0) +
          (d['age__85_over__female'] || 0),
      };
    });

    const maxDigits = Math.max(...tidyData.map((d) => d.age__65_over?.toString?.()?.length || 0));

    return {
      title: 'Senior population (65 and over)',
      subtitle: `${neighborhood} (decennial census)`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period', type: 'band' },
      y: {
        label: 'Total Population',
        tickFormat: (d) => d.toLocaleString(),
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: maxDigits > 3 ? 50 : 40,
      marks: [
        barWithLabelY(tidyData, {
          x: 'year',
          y: 'age__65_over',
          yErrorMargin: 'Mage__65_over',
          labelFormat: '.0f',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  households__with_seniors__1_person_percent(neighborhood, data) {
    const tidyData = data.map((d) => {
      return {
        year: d.year,
        households__with_seniors__1_person_percent:
          (d.households__with_seniors__1_person || 0) / (d.households__total || 0),
      };
    });

    return {
      title: 'Seniors (age 65 and over) living alone',
      subtitle: `${neighborhood} (decennial census)`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period', type: 'band' },
      y: {
        label: 'Total Population',
        tickFormat: '.0%',
        domain: [0, 0.2],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(tidyData, {
          x: 'year',
          y: 'households__with_seniors__1_person_percent',
          yErrorMargin: 'Mhouseholds__with_seniors__1_person_percent',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
      style: `
        g[aria-label='y-axis tick label'] {
          text:last-child {
            fill: hsl(0, 100.00%, 50%);
            @media (prefers-color-scheme: dark) {
              fill:hsl(0, 100.00%, 75%);
            }
          }
        }
      `,
    };
  },
  households__with_seniors__1_person(neighborhood, data) {
    return {
      title: 'Seniors (age 65 and over) living alone',
      subtitle: `${neighborhood} (decennial census)`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period', type: 'band' },
      y: {
        label: 'Total Population',
        tickFormat: '.0f',
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'households__with_seniors__1_person',
          yErrorMargin: 'Mhouseholds__with_seniors__1_person',
          labelFormat: '.0f',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  population_pyramid(neighborhood, data, url) {
    const year = url.searchParams.get('year') || '2020';

    const tidyData = data
      .flatMap((d) => {
        const M = { year: d.year, sex: 'M' };
        const F = { year: d.year, sex: 'F' };

        return [
          { ...M, age_start: 0, age_end: 5, population: d.age__under_5__male },
          { ...M, age_start: 5, age_end: 10, population: d['age__5-9__male'] },
          { ...M, age_start: 10, age_end: 15, population: d['age__10-14__male'] },
          {
            ...M,
            age_start: 15,
            age_end: 20,
            population: (d['age__15-17__male'] || 0) + (d['age__18-19__male'] || 0),
          },
          {
            ...M,
            age_start: 20,
            age_end: 25,
            population:
              (d['age__20__male'] || 0) + (d['age__21__male'] || 0) + (d['age__22-24__male'] || 0),
          },
          { ...M, age_start: 25, age_end: 30, population: d['age__25-29__male'] },
          { ...M, age_start: 30, age_end: 35, population: d['age__30-34__male'] },
          { ...M, age_start: 35, age_end: 40, population: d['age__35-39__male'] },
          { ...M, age_start: 40, age_end: 45, population: d['age__40-44__male'] },
          { ...M, age_start: 45, age_end: 50, population: d['age__45-49__male'] },
          { ...M, age_start: 50, age_end: 55, population: d['age__50-54__male'] },
          { ...M, age_start: 55, age_end: 60, population: d['age__55-59__male'] },
          {
            ...M,
            age_start: 60,
            age_end: 65,
            population: (d['age__60-61__male'] || 0) + (d['age__62-64__male'] || 0),
          },
          {
            ...M,
            age_start: 65,
            age_end: 70,
            population: (d['age__65-66__male'] || 0) + (d['age__67-69__male'] || 0),
          },
          { ...M, age_start: 70, age_end: 75, population: d['age__70-74__male'] },
          { ...M, age_start: 75, age_end: 80, population: d['age__75-79__male'] },
          { ...M, age_start: 80, age_end: 85, population: d['age__80-84__male'] },
          { ...M, age_start: 85, age_end: null, population: d['age__85_over__male'] },
          { ...M, age_start: 90, age_end: null, population: null },

          { ...F, age_start: 0, age_end: 5, population: d.age__under_5__female },
          { ...F, age_start: 5, age_end: 10, population: d['age__5-9__female'] },
          { ...F, age_start: 10, age_end: 15, population: d['age__10-14__female'] },
          {
            ...F,
            age_start: 15,
            age_end: 20,
            population: (d['age__15-17__female'] || 0) + (d['age__18-19__female'] || 0),
          },
          {
            ...F,
            age_start: 20,
            age_end: 25,
            population:
              (d['age__20__female'] || 0) +
              (d['age__21__female'] || 0) +
              (d['age__22-24__female'] || 0),
          },
          { ...F, age_start: 25, age_end: 30, population: d['age__25-29__female'] },
          { ...F, age_start: 30, age_end: 35, population: d['age__30-34__female'] },
          { ...F, age_start: 35, age_end: 40, population: d['age__35-39__female'] },
          { ...F, age_start: 40, age_end: 45, population: d['age__40-44__female'] },
          { ...F, age_start: 45, age_end: 50, population: d['age__45-49__female'] },
          { ...F, age_start: 50, age_end: 55, population: d['age__50-54__female'] },
          { ...F, age_start: 55, age_end: 60, population: d['age__55-59__female'] },
          {
            ...F,
            age_start: 60,
            age_end: 65,
            population: (d['age__60-61__female'] || 0) + (d['age__62-64__female'] || 0),
          },
          {
            ...F,
            age_start: 65,
            age_end: 70,
            population: (d['age__65-66__female'] || 0) + (d['age__67-69__female'] || 0),
          },
          { ...F, age_start: 70, age_end: 75, population: d['age__70-74__female'] },
          { ...F, age_start: 75, age_end: 80, population: d['age__75-79__female'] },
          { ...F, age_start: 80, age_end: 85, population: d['age__80-84__female'] },
          { ...F, age_start: 85, age_end: null, population: d['age__85_over__female'] },
          { ...F, age_start: 90, age_end: null, population: null },
        ];
      })
      .filter((d) => d.year === year);

    const gap = 20;
    const labelOffset = 26;
    const maxPopulation = d3.max(tidyData, (d) => d.population) || 0;
    const ticks = d3.ticks(0, maxPopulation, 4);

    const yAxis = [
      Plot.text(d3.range(0, 95, 10), { y: (d) => d }),
      Plot.text(['or'], { y: 90, dy: 10, fontWeight: 400, opacity: 0.7 }),
      Plot.text(['more'], { y: 90, dy: 20, fontWeight: 400, opacity: 0.7 }),
      Plot.text(['Years'], { y: 80, dy: 10, fontWeight: 400 }),
      Plot.ruleY(d3.range(5, 95, 5), {
        x1: (d) => (d % 10 == 0 ? 0 : 0.5),
        x2: 2,
        dx: gap / 2,
        strokeWidth: 0.7,
      }),
      Plot.ruleY(d3.range(5, 95, 5), {
        x1: (d) => (d % 10 == 0 ? 0 : -0.5),
        x2: -2,
        dx: -gap / 2,
        strokeWidth: 0.7,
      }),
    ];

    const xAxis = [
      Plot.ruleY([0], { x1: 0, x2: maxPopulation, dx: gap, strokeWidth: 0.5 }),
      Plot.ruleX(ticks, { x: (d) => d, y: 0, insetBottom: -5, dx: gap }),
      Plot.text(ticks, { x: (d) => d, y: 0, dx: gap, dy: 12 }),

      Plot.ruleY([0], { x1: 0, x2: -maxPopulation, dx: -gap, strokeWidth: 0.5 }),
      Plot.ruleX(ticks, { x: (d) => -d, y: 0, insetBottom: -5, dx: -gap }),
      Plot.text(ticks, { x: (d) => -d, y: 0, dx: -gap, dy: 12 }),

      Plot.text(['← Male'], {
        x: 0,
        y: 0,
        dx: -gap,
        dy: 25,
        textAnchor: 'end',
      }),
      Plot.text(['Female → '], {
        x: 0,
        y: 0,
        dx: gap,
        dy: 25,
        textAnchor: 'start',
      }),
    ];

    return {
      title: 'Population pyramid',
      subtitle: `${neighborhood}, ${year} (decinnial census)`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: {
        tickFormat: Math.abs,
        ticks: 5,
        label: 'Population',
        axis: null,
        domain: [-maxPopulation - 0, maxPopulation + 0],
      },
      y: { axis: null, domain: [0, 90] },
      marginTop: 10,
      marginRight: gap + labelOffset,
      marginBottom: 36,
      marginLeft: gap + labelOffset,
      marks: [
        yAxis,
        xAxis,
        Plot.areaX(tidyData, {
          y: 'age_start',
          x: (d) => -d.population,
          dx: -gap,
          fill: colors.vibrant.blue,
          filter: (d) => d.sex === 'M',
          curve: 'step-before',
          // curve: 'catmull-rom',
        }),
        Plot.areaX(tidyData, {
          y: 'age_start',
          x: 'population',
          dx: gap,
          fill: colors.vibrant.magenta,
          filter: (d) => d.sex === 'F',
          curve: 'step-before',
        }),
        Plot.textX(tidyData, {
          y: (d) => d.age_start + 2.5,
          x: (d) => -d.population,
          lineAnchor: 'middle',
          textAnchor: 'end',
          dx: -labelOffset,
          filter: (d) => d.sex === 'M',
          text: 'population',
          opacity: 0.5,
        }),
        Plot.textX(tidyData, {
          y: (d) => d.age_start + 2.5,
          x: (d) => d.population,
          lineAnchor: 'middle',
          textAnchor: 'start',
          dx: labelOffset,
          filter: (d) => d.sex === 'F',
          text: 'population',
          opacity: 0.5,
        }),
      ],
    };
  },
};

type PlotData = PageData['neighborhoodsData'] | PageData['tractsData'];
type BlockPlotData = PageData['neighborhoodBlocksData'];

type PlotConfigFunction = (neighborhood: string, data: PlotData, url: URL) => Plot.PlotOptions;
type BlockPlotConfigFunction = (
  neighborhood: string,
  data: BlockPlotData,
  url: URL
) => Plot.PlotOptions;

type RaceBreakdownVariant = 'Overall' | 'Black' | 'White' | 'Hispanic or Latino';

function getTidyInsuranceData(data: PlotData) {
  return data.flatMap(({ year, ...data }) => {
    function calcFields<T extends typeof data>(d: T, withKey: keyof T, withoutKey: keyof T) {
      const numerator = d[withKey];
      if (!numerator || typeof numerator !== 'number') return null;

      const denominator = [withKey, withoutKey]
        .map((key) => d[key])
        .filter((x) => typeof x === 'number')
        .reduce((a, b) => a + b, 0);
      if (!numerator || typeof numerator !== 'number') return null;

      return {
        fraction: numerator / denominator,
        moe: calcProportionMOE(
          d,
          withKey.toString(),
          [withKey, withoutKey].map((key) => key.toString())
        ),
      };
    }

    return [
      {
        year,
        group: 'Overall',
        ...calcFields(
          data,
          'insurance_coverage__with_insurance',
          'insurance_coverage__without_insurance'
        ),
      },
      {
        year,
        group: 'Black',
        ...calcFields(
          data,
          'insurance_coverage__black__with_insurance',
          'insurance_coverage__black__without_insurance'
        ),
      },
      {
        year,
        group: 'White',
        ...calcFields(
          data,
          'insurance_coverage__white__with_insurance',
          'insurance_coverage__white__without_insurance'
        ),
      },
      {
        year,
        group: 'Hispanic or Latino',
        ...calcFields(
          data,
          'insurance_coverage__hispanic__with_insurance',
          'insurance_coverage__hispanic__without_insurance'
        ),
      },
    ];
  }) satisfies {
    year: string;
    group: RaceBreakdownVariant;
    fraction?: number;
    moe?: number;
  }[];
}

function getRaceBreakdownColors(facetNames: RaceBreakdownVariant[]) {
  const facetColors = new Map([
    ['White', colors.vibrant.orange],
    ['Black', colors.vibrant.blue],
    ['Hispanic or Latino', colors.vibrant.teal],
    ['Overall', colors.vibrant.gray],
  ] as const);

  for (const [facetName] of facetColors) {
    if (!facetNames.includes(facetName)) {
      facetColors.delete(facetName);
    }
  }

  return {
    facetOrder: Array.from(facetColors.keys()),
    legendColors: Array.from(facetColors.values()),
    facetColors,
  };
}

function getHealthInsurancePlotConfig(
  neighborhood: string,
  data: PlotData,
  variant: RaceBreakdownVariant
) {
  const tidyData = getTidyInsuranceData(data);

  return {
    title:
      'With health insurance' +
      (variant === 'Overall' ? ' (all population)' : ` (${variant} population)`),
    subtitle: `${neighborhood}, 2009-2023`,
    caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
    x: { label: 'Survey period' },
    y: {
      label: 'Percent with insurance coverage',
      tickFormat: '.0%',
      domain: [0, 1],
    },
    marginTop: 30,
    marginRight: 0,
    marginBottom: 36,
    marginLeft: 40,
    marks: [
      barWithLabelY(
        tidyData.filter(({ group }) => group === variant),
        {
          x: 'year',
          y: 'fraction',
          yErrorMargin: 'moe',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }
      ),
    ],
  };
}

function getTidyRenterData(data: PlotData) {
  return data.flatMap(({ year, ...data }) => {
    function calcFields<T extends typeof data>(d: T, renterKey: keyof T, ownerKey: keyof T) {
      const numerator = d[renterKey];
      if (!numerator || typeof numerator !== 'number') return null;

      const denominator = [renterKey, ownerKey]
        .map((key) => d[key])
        .filter((x) => typeof x === 'number')
        .reduce((a, b) => a + b, 0);
      if (!numerator || typeof numerator !== 'number') return null;

      return {
        fraction: numerator / denominator,
        moe: calcProportionMOE(
          d,
          renterKey.toString(),
          [renterKey, ownerKey].map((key) => key.toString())
        ),
      };
    }

    return [
      {
        year,
        group: 'Overall',
        ...calcFields(data, 'tenure__renter', 'tenure__owner'),
      },
      {
        year,
        group: 'Black',
        ...calcFields(data, 'tenure__black__renter', 'tenure__black__owner'),
      },
      {
        year,
        group: 'White',
        ...calcFields(data, 'tenure__white__renter', 'tenure__white__owner'),
      },
      {
        year,
        group: 'Hispanic or Latino',
        ...calcFields(data, 'tenure__hispanic__renter', 'tenure__hispanic__owner'),
      },
    ] satisfies {
      year: string;
      group: RaceBreakdownVariant;
      fraction?: number;
      moe?: number;
    }[];
  });
}

function getRenterPlotConfig(neighborhood: string, data: PlotData, variant: RaceBreakdownVariant) {
  const tidyData = getTidyRenterData(data);

  return {
    title: 'Renters' + (variant === 'Overall' ? ' (all households)' : ` (${variant} households)`),
    subtitle: `${neighborhood}, 2009-2023`,
    caption: `The Census categorizes households into renter-occupied and owner-occupied status. This figure shows the percentage of households that rent instead of own. <i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
    x: { label: 'Survey period' },
    y: {
      label: 'Percent households who rent',
      tickFormat: '.0%',
      domain: [0, 1],
    },
    marginTop: 30,
    marginRight: 0,
    marginBottom: 36,
    marginLeft: 40,
    marks: [
      barWithLabelY(
        tidyData.filter(({ group }) => group === variant),
        {
          x: 'year',
          y: 'fraction',
          yErrorMargin: 'moe',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }
      ),
    ],
  };
}

function getTidyUnemploymentData(data: PlotData) {
  return data.flatMap(({ year, ...data }) => {
    function calcFields<T extends typeof data>(d: T, employedKey: keyof T, unemployedKey: keyof T) {
      const numerator = d[unemployedKey];
      if (!numerator || typeof numerator !== 'number') return null;

      const denominator = [employedKey, unemployedKey]
        .map((key) => d[key])
        .filter((x) => typeof x === 'number')
        .reduce((a, b) => a + b, 0);
      if (!numerator || typeof numerator !== 'number') return null;

      return {
        fraction: numerator / denominator,
        moe: calcProportionMOE(
          d,
          unemployedKey.toString(),
          [employedKey, unemployedKey].map((key) => key.toString())
        ),
      };
    }

    return [
      {
        year,
        group: 'Overall',
        ...calcFields(data, 'employment__employed', 'employment__unemployed'),
      },
      {
        year,
        group: 'Black',
        ...calcFields(data, 'employment__black__employed', 'employment__black__unemployed'),
      },
      {
        year,
        group: 'White',
        ...calcFields(data, 'employment__white__employed', 'employment__white__unemployed'),
      },
      {
        year,
        group: 'Hispanic or Latino',
        ...calcFields(data, 'employment__hispanic__employed', 'employment__hispanic__unemployed'),
      },
    ] satisfies {
      year: string;
      group: RaceBreakdownVariant;
      fraction?: number;
      moe?: number;
    }[];
  });
}

function getUnemploymentFractionPlotConfig(
  neighborhood: string,
  data: PlotData,
  variant: RaceBreakdownVariant
) {
  const tidyData = getTidyUnemploymentData(data);

  return {
    title:
      'Unemployment' + (variant === 'Overall' ? ' (all population)' : ` (${variant} population)`),
    subtitle: `${neighborhood}, 2009-2023`,
    caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
    x: { label: 'Survey period' },
    y: {
      label: 'Percent unemployed population',
      tickFormat: '.0%',
      domain: [0, 1],
    },
    marginTop: 30,
    marginRight: 0,
    marginBottom: 36,
    marginLeft: 40,
    marks: [
      barWithLabelY(
        tidyData.filter(({ group }) => group === variant),
        {
          x: 'year',
          y: 'fraction',
          yErrorMargin: 'moe',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }
      ),
    ],
  };
}
