import { colors } from '$lib/colors';
import { barWithLabelY } from '$lib/plot/marks';
import { notEmpty } from '$utils/notEmpty';
import * as Plot from '@observablehq/plot';
import type { PageData } from './[neighborhood=gvlspnbg_neighborhood_24]/plots/[plot]/$types';
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
    return {
      title: 'Total Population',
      subtitle: `${neighborhood} neighborhood, 2009-2023`,
      caption: `<i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
      x: { label: 'Survey period' },
      y: {
        label: 'Total Population',
        tickFormat: (d) => d.toLocaleString(),
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
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
      title: 'Renters',
      subtitle: `${neighborhood}, 2009-2023`,
      caption: `The Census categorizes households into renter-occupied and owner-occupied status. This figure shows the percentage of households that rent instead of own. Overall includes all households. <br /> <i>Data: US Census Bureau American Community Survey (5-year estimates)</i>`,
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
};

type PlotData = PageData['neighborhoodsData'] | PageData['tractsData'];

type PlotConfigFunction = (neighborhood: string, data: PlotData) => Plot.PlotOptions;

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
