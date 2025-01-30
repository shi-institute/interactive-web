import { colors } from '$lib/colors';
import { barWithLabelY } from '$lib/plot/marks';
import { capitalize } from '$utils/capitalize';
import * as Plot from '@observablehq/plot';
import type { PageData } from './$types';

export const plotConfigs: Record<string, PlotConfigFunction> = {
  median_household_income(neighborhood, data) {
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
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'median_household_income',
          labelFormat: '$,.0f',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
  median_household_income__white(neighborhood, data) {
    {
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
                labelFormat: '$,.0f',
                fill: colors.vibrant.teal,
                labelFill: 'black',
              }),
            ],
      };
    }
  },
  median_household_income__black(neighborhood, data) {
    {
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
                labelFormat: '$,.0f',
                fill: colors.vibrant.teal,
                labelFill: 'black',
              }),
            ],
      };
    }
  },
  median_household_income__hispanic(neighborhood, data) {
    {
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
                labelFormat: '$,.0f',
                fill: colors.vibrant.teal,
                labelFill: 'black',
              }),
            ],
      };
    }
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

            const education__high_school_or_higher =
              d['education__regular_high_school_diploma'] +
              d['education__ged_or_alternative_credential'] +
              d['education__some_college_no_degree'] +
              d['education__associates_degree'] +
              d['education__bachelors_degree'] +
              d['education__masters_degree'] +
              d['education__professional_school_degree'] +
              d['education__doctorate_degree'];

            const education__high_school_or_higher_percent =
              education__high_school_or_higher / d['population__total'];

            return { education__high_school_or_higher_percent, ...d };
          }),
          {
            x: 'year',
            y: 'education__high_school_or_higher_percent',
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
            const education__some_college_or_higher =
              d['education__some_college_no_degree'] +
              d['education__associates_degree'] +
              d['education__bachelors_degree'] +
              d['education__masters_degree'] +
              d['education__professional_school_degree'] +
              d['education__doctorate_degree'];

            const education__some_college_or_higher_percent =
              education__some_college_or_higher / d['population__total'];

            return { education__some_college_or_higher_percent, ...d };
          }),
          {
            x: 'year',
            y: 'education__some_college_or_higher_percent',
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
            const education__college_degree =
              d['education__associates_degree'] +
              d['education__bachelors_degree'] +
              d['education__masters_degree'] +
              d['education__professional_school_degree'] +
              d['education__doctorate_degree'];

            const education__college_degree_percent =
              education__college_degree / d['population__total'];

            return { education__college_degree_percent, ...d };
          }),
          {
            x: 'year',
            y: 'education__college_degree_percent',
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
        label: 'Households with internet',
        tickFormat: (d) => d.toLocaleString(),
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'internet__broadband__total',
          labelFormat: '.0f',
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

            return { has_computer__total__percent, ...d };
          }),
          {
            x: 'year',
            y: 'has_computer__total__percent',
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
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'geographic_mobility__different_county_same_state_fraction',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
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
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'geographic_mobility__different_state_fraction',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
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
        domain: [0, 1],
      },
      marginTop: 30,
      marginRight: 0,
      marginBottom: 36,
      marginLeft: 40,
      marks: [
        barWithLabelY(data, {
          x: 'year',
          y: 'population__children_living_with_grandparent_householder_fraction',
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
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
          labelFormat: '.1%',
          fill: colors.vibrant.teal,
          labelFill: 'black',
        }),
      ],
    };
  },
};

type PlotConfigFunction = (
  neighborhood: string,
  data: PageData['neighborhoodsData']
) => Plot.PlotOptions;
