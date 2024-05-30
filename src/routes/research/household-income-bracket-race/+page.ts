import { browser } from '$app/environment';
import { colors } from '$lib/colors';
import { shiLogoB64Black, shiLogoB64White } from '$lib/shiLogoB64';
import { opWonkOptionsStore } from '$stores/opWonkOptionsStore';
import * as Plot from '@observablehq/plot';
import { html } from 'htl';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load = (async ({ data }) => {
  function getData(
    yearsACS: (typeof data.acsYearsUnique)[number],
    city: (typeof data.citiesUnique)[number]
  ) {
    return data.tidyDataAllYears
      .filter((d) => d.yearsACS === yearsACS && d.cityName === city)
      .map(({ incomeBracket, ...rest }) => {
        const rename = (bracket: string) => {
          if (bracket === '> $200,000') return '≥ 200k';
          if (bracket === '$150,000-$199,999') return '150k-200k';
          if (bracket === '$125,000-$149,999') return '125k-150k';
          if (bracket === '$100,000-$124,999') return '100k-125k';
          if (bracket === '$75,000-$99,999') return '75k-100k';
          if (bracket === '$60,000-$74,999') return '60k-75k';
          if (bracket === '$50,000-$59,999') return '50k-60k';
          if (bracket === '$45,000-$49,999') return '45k-50k';
          if (bracket === '$40,000-$44,999') return '40k-45k';
          if (bracket === '$35,000-$39,999') return '35k-40k';
          if (bracket === '$30,000-$34,999') return '30k-35k';
          if (bracket === '$25,000-$29,999') return '25k-30k';
          if (bracket === '$20,000-$24,999') return '20k-25k';
          if (bracket === '$15,000-$19,999') return '15k-20k';
          if (bracket === '$10,000-$14,999') return '10k-15k';
          if (bracket === '< $10,000') return '< 10k';
          return bracket;
        };

        return {
          ...rest,
          incomeBracket: rename(incomeBracket),
          householdsShare: rest.households / rest.totalPlaceHouseholds,
        };
      });
  }

  function getRegroupedData(
    yearsACS: (typeof data.acsYearsUnique)[number],
    city: (typeof data.citiesUnique)[number],
    mode = 15
  ) {
    const renamed = getData(yearsACS, city)
      .filter((d) => d.yearsACS === yearsACS && d.cityName === city)
      .map(({ incomeBracket, ...rest }) => {
        const rename = (bracket: string) => {
          if (mode == 15) {
            if (bracket === '≥ 200k') return '≥ 200k';
            if (bracket === '150k-200k') return '150k-200k';
            if (bracket === '125k-150k') return '100k-150k';
            if (bracket === '100k-125k') return '100k-150k';
            if (bracket === '75k-100k') return '75k-100k';
            if (bracket === '60k-75k') return '60k-75k';
            if (bracket === '50k-60k') return '45k-60k';
            if (bracket === '45k-50k') return '45k-60k';
            if (bracket === '40k-45k') return '30k-45k';
            if (bracket === '35k-40k') return '30k-45k';
            if (bracket === '30k-35k') return '30k-45k';
            if (bracket === '25k-30k') return '15k-30k';
            if (bracket === '20k-25k') return '15k-30k';
            if (bracket === '15k-20k') return '15k-30k';
            if (bracket === '10k-15k') return '< 15k';
            if (bracket === '< 10k') return '< 15k';
          }
          if (mode == 10) {
            if (bracket === '≥ 200k') return '≥ 200k';
            if (bracket === '150k-200k') return '150k-200k';
            if (bracket === '125k-150k') return '100k-150k';
            if (bracket === '100k-125k') return '100k-150k';
            if (bracket === '75k-100k') return '75k-100k';
            if (bracket === '60k-75k') return '60k-75k';
            if (bracket === '50k-60k') return '50k-60k';
            if (bracket === '45k-50k') return '40k-50k';
            if (bracket === '40k-45k') return '40k-50k';
            if (bracket === '35k-40k') return '30k-40k';
            if (bracket === '30k-35k') return '30k-40k';
            if (bracket === '25k-30k') return '20k-30k';
            if (bracket === '20k-25k') return '20k-30k';
            if (bracket === '15k-20k') return '10k-20k';
            if (bracket === '10k-15k') return '10k-20k';
            if (bracket === '< 10k') return '< 10k';
          }
          return bracket;
        };

        return {
          ...rest,
          incomeBracket: rename(incomeBracket),
          householdsShare: rest.households / rest.totalPlaceHouseholds,
        };
      });

    return Object.entries(Object.groupBy(renamed, (d) => d.incomeBracket)).flatMap(([, data]) => {
      return data?.reduce((acc, curr) => {
        const raceMatch = acc.find((d: typeof curr) => d.race === curr.race);
        if (!raceMatch) return [...acc, JSON.parse(JSON.stringify(curr))];

        raceMatch.households += curr.households;
        raceMatch.totalPlaceHouseholds += curr.totalPlaceHouseholds;
        raceMatch.householdsShare += curr.householdsShare;

        return acc;
      }, []);
    });
  }

  function getBrackets() {
    const dataFunc = get(opWonkOptionsStore).consolidate ? getRegroupedData : getData;
    return (
      Array.from(
        new Set(
          dataFunc('2018-2022', 'Greenville, SC').map((d) =>
            d.incomeBracket
              // start at 0k if less than is present
              .replace('< ', '0k-')
              .replace('≥ ', '')
              // convert to true numerical value
              .replaceAll('k', '000')
          )
        )
      ) // split range into array [start, end]
        .map((bracket) => bracket.split('-').map((num: string | number) => parseInt(`${num}`)))
        // extend last bracket to 1 million
        .map((arr) => (arr.length === 1 ? [...arr, 1000000] : arr))
    );
  }

  function scaleHelpers(_brackets: ReturnType<typeof getBrackets>) {
    return {
      domain: [0, _brackets.length],
      placeIntoDomain(dataPoint: number) {
        // for example. if < 10k is 0 and 10k-15k is 1, a value of 5000 should become 0.5,
        // a value of 10000 should become 1, and a value 0f 12500 should become 1.5

        const index = _brackets.findIndex(([start, end]) => dataPoint >= start && dataPoint < end);
        const [start, end] = _brackets[index];

        const normalizedStart = 0;
        const normalizedEnd = end - start;
        const normalizedDataPoint = dataPoint - start;
        const pointBetween = normalizedDataPoint / (end - start);

        return index + pointBetween;
      },
    };
  }

  /**
   * untested
   */
  function getPercentAboveIncome(
    yearsACS: (typeof data.acsYearsUnique)[number],
    city: (typeof data.citiesUnique)[number],
    amount = 100000
  ) {
    return getData(yearsACS, city)
      .map((d) => {
        const startBracketAmount = d.incomeBracket
          .replace('<', '')
          .replaceAll('$', '')
          .replaceAll(',', '')
          .split('-')[0];
        return { ...d, startBracketAmount: parseInt(startBracketAmount) };
      })
      .filter((d) => d.startBracketAmount >= amount)
      .reduce((acc, d) => (acc += d.householdsShare), 0);
  }

  function generatePlotOptions(
    yearsACS: (typeof data.acsYearsUnique)[number],
    city: (typeof data.citiesUnique)[number],
    {
      width = 800,
      textAdjustment = 0,
      showYAxis = true,
      showTitle = true,
      showLegend = true,
      height = 400,
      showYearsNextToCity = false,
      showYGrid = true,
      showPercentOfHouseholds = false,
      labelBracketValues = false,
      consolidate = false,
      showAreaMedianHouseholdIncome = false,
      showBlackMedianHouseholdIncome = false,
      showWhiteMedianHouseholdIncome = false,
      xAxisDomain = undefined,
    }
  ) {
    const dataFunc = consolidate ? getRegroupedData : getData;
    const plotData = dataFunc(yearsACS, city, 15).map((d) => {
      const householdsShare = d.race === 'black' ? d.householdsShare * -1 : d.householdsShare;
      return {
        ...d,
        households: d.race === 'black' ? d.households * -1 : d.households,
        householdsShare,
        householdsPercent: householdsShare * 100,
      };
    });

    const xColumnName = showPercentOfHouseholds ? 'householdsPercent' : 'households';

    const totalWhiteHouseholds = plotData
      .filter(({ race }) => race === 'white')
      .map((d) => d.households)
      .reduce((acc, households) => acc + households, 0);
    const totalBlackHouseholds =
      -1 *
      plotData
        .filter(({ race }) => race === 'black')
        .map((d) => d.households)
        .reduce((acc, households) => acc + households, 0);

    const maxXValue = Math.max(...plotData.map((d) => d[xColumnName]));
    const minXValue = Math.min(...plotData.map((d) => d[xColumnName]));

    const maxXMagnitude = Math.max(Math.abs(maxXValue), Math.abs(minXValue));
    const xDomain = xAxisDomain || [
      -1 * maxXMagnitude - textAdjustment,
      maxXMagnitude + textAdjustment,
    ];

    const endYear = parseInt(yearsACS.split('-')[1]);

    const marginTop = 14;
    const marginRight = 20;
    const marginBottom = 40;
    const marginLeft = showYAxis ? 74 : 0;

    const widthPerPixel = (width - marginLeft - marginRight) / (xDomain[1] * 2);

    const {
      placeMedianHouseholdIncome,
      placeWhiteMedianHouseholdIncome,
      placeBlackMedianHouseholdIncome,
    } = plotData[0];

    // const html = (strings: TemplateStringsArray, ...values: any[]) => {
    //   let str = '';
    //   strings.forEach((string, i) => {
    //     str += string + (values[i] || '');
    //   });
    //   return str;
    // };

    return {
      caption: browser
        ? html`
            <div style="padding-right: 6px; padding-top: 8px;">
              In ${city}, there were
              <span
                style="text-shadow: 0px 0px 2px rgba(0,0,0,0.1); font-weight: 500; color: ${colors
                  .vibrant.blue};"
              >
                ${totalBlackHouseholds.toLocaleString()} Black households
              </span>
              and
              <span
                style="text-shadow: 0px 0px 2px rgba(0,0,0,0.2); font-weight: 500; color: ${colors
                  .vibrant.orange};"
              >
                ${totalWhiteHouseholds.toLocaleString()} White households
              </span>
              . Upper bounds are exclusive. Dollar amounts are in ${endYear} inflation-adjusted
              values.
              <br />
              <i>Data: US Census (American Community Survey)</i>
            </div>
          `
        : `In ${city}, there were ${totalBlackHouseholds.toLocaleString()} Black households and` +
          `${totalWhiteHouseholds.toLocaleString()} White households. Upper bounds are exclusive.` +
          `Dollar amounts are in ${endYear} inflation-adjusted values.\n` +
          `Data: US Census (American Community Survey)`,
      color: { legend: true },
      width,
      x: {
        domain: xDomain,
        label: `← Black · ${showPercentOfHouseholds ? 'Percent of ' : ''}Households · White →`,
        labelAnchor: 'center',
        tickFormat: (data, index, array) => {
          // if (index === 0 || index === array.length - 1) {
          //   return "";
          // }
          return Math.abs(data);
        },
        grid: showYGrid,
      },
      y: {
        domain: plotData.map((d) => d.incomeBracket).reverse(),
        label: 'Income bracket (US$)',
        labelArrow: 'down',
        labelAnchor: 'top',
        axis: showYAxis,
        tickSize: 0, // don’t draw ticks
        padding: 0.1,
      },
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      height,
      marks: [
        // shi logo watermark
        Plot.image([{}], {
          frameAnchor: 'top-right',
          dy: 0,
          dx: -15,
          src: () =>
            window?.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
              ? shiLogoB64White
              : shiLogoB64Black,
          r: 15,
          preserveAspectRatio: 'xMidYMin slice',
          opacity: () =>
            window?.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 0.3
              : 0.8,
          tip: true,
          href: () => 'https://www.furman.edu/shi-institute/sustainability-research/',
          target: '_blank',
          title:
            'This figure was created by The Shi Institute for Sustainable Communities at Furman University',
        }),

        // Plot.frame({ stroke: '#ccc' }),

        Plot.barX(plotData, {
          x: xColumnName,
          y: 'incomeBracket',
          fill: (d) => (d.race === 'black' ? colors.vibrant.blue : colors.vibrant.orange),
        }),
        ...(labelBracketValues
          ? [
              ...createBarLabelMarks(
                plotData.filter((d) => d.race === 'black'),
                {
                  widthPerPixel,
                  xColumnName,
                  showPercentOfHouseholds,
                  side: 'left',
                }
              ),
              ...createBarLabelMarks(
                plotData.filter((d) => d.race === 'white'),
                {
                  widthPerPixel,
                  xColumnName,
                  showPercentOfHouseholds,
                }
              ),
            ]
          : []),
        Plot.ruleX([0]),
        (_, __, ___, dimensions) => {
          if (
            !showAreaMedianHouseholdIncome &&
            !showBlackMedianHouseholdIncome &&
            !showWhiteMedianHouseholdIncome
          )
            return undefined;

          const { domain, placeIntoDomain } = scaleHelpers(getBrackets());

          const pmhi = placeIntoDomain(placeMedianHouseholdIncome);
          const pmhiWhite = placeWhiteMedianHouseholdIncome
            ? placeIntoDomain(placeWhiteMedianHouseholdIncome)
            : undefined;
          const pmhiBlack = placeBlackMedianHouseholdIncome
            ? placeIntoDomain(placeBlackMedianHouseholdIncome)
            : undefined;

          return Plot.plot({
            marginTop: marginTop + 5, // ordinal scales add space above and below, and this adjusts the nominal scale to match
            marginRight,
            marginBottom: marginBottom + 5,
            marginLeft,
            width: dimensions.width,
            height: dimensions.height,
            y: {
              domain,
              axis: false,
              nice: false,
              tickSize: 0, // don’t draw ticks
            },
            marks: [
              ...(showWhiteMedianHouseholdIncome
                ? createMedianIncomeLineMarks(
                    pmhiWhite,
                    placeWhiteMedianHouseholdIncome,
                    colors.vibrant.orange
                  )
                : []),
              ...(showBlackMedianHouseholdIncome
                ? createMedianIncomeLineMarks(
                    pmhiBlack,
                    placeBlackMedianHouseholdIncome,
                    colors.vibrant.blue
                  )
                : []),
              ...(showAreaMedianHouseholdIncome
                ? createMedianIncomeLineMarks(
                    pmhi,
                    placeMedianHouseholdIncome,
                    window?.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? '#aaa'
                      : '#777'
                  )
                : []),
            ],
            x: { type: 'band', axis: null },
          });
        },
      ],
    };
  }

  function createMedianIncomeLineMarks(y, label, color) {
    if (isNaN(y) || isNaN(label)) return [];

    const toUSD = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return [
      // dotted color background
      Plot.ruleY([y], {
        stroke:
          window?.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? '#212121'
            : '#fff',
        strokeDasharray: '4',
        strokeWidth: 1.2,
      }),
      // dotted color
      Plot.ruleY([y], {
        stroke: color,
        strokeDasharray: '4',
      }),
      // label
      Plot.text([toUSD.format(label)], {
        y: y,
        frameAnchor: 'left',
        textAnchor: 'start',
        fontWeight: 500,
        monospace: true,
        fontSize: 12,
        fill: color,
        stroke:
          window?.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? '#212121'
            : '#fff',
        strokeWidth: 10,
      }),
    ];
  }

  function createBarLabelMarks(
    plotData,
    { xColumnName, showPercentOfHouseholds, widthPerPixel, side }
  ) {
    return [
      // outside text
      Plot.textX(plotData, {
        x: xColumnName,
        y: 'incomeBracket',
        text: (d) => {
          return createBarLabelText(d, {
            widthPerPixel,
            xColumnName,
            showPercentOfHouseholds,
            mode: 'outside',
          });
        },
        textAnchor: side === 'left' ? 'end' : 'start',
        dx: side === 'left' ? -3 : 3,
        opacity: 0.8,
        fontSize: 10,
      }),
      // inside text
      Plot.textX(plotData, {
        x: xColumnName,
        y: 'incomeBracket',
        text: (d) => {
          return createBarLabelText(d, {
            widthPerPixel,
            xColumnName,
            showPercentOfHouseholds,
            mode: 'inside',
          });
        },
        textAnchor: side === 'left' ? 'start' : 'end',
        dx: side === 'left' ? 3 : -3,
        opacity: 0.8,
        fill: '#fff',
        fontSize: 9,
      }),
    ];
  }

  function createBarLabelText(d, { xColumnName, showPercentOfHouseholds, widthPerPixel, mode }) {
    const numericValue = Math.abs(d[xColumnName]);
    const value = (() => {
      if (showPercentOfHouseholds) return `${numericValue.toFixed(2)}%`;
      return numericValue;
    })();

    const barWidthPixels = widthPerPixel * numericValue;
    const characterWidthPixels = 6;
    const labelWidthPixels = `${value}`.length * characterWidthPixels;
    const labelMarginPixels = 3.5;

    const condition = barWidthPixels > labelWidthPixels + labelMarginPixels * 3;

    if (mode === 'inside' && condition) return value;
    if (mode === 'outside' && !condition) return value;
    return '';
  }

  return {
    ...data,
    getData,
    getRegroupedData,
    getBrackets,
    scaleHelpers,
    getPercentAboveIncome,
    generatePlotOptions,
  };
}) satisfies PageLoad;
