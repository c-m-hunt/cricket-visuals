import * as d3 from 'd3';
import { ChartOptions } from './../types';
import { BatsmanInnings } from './../cricketTypes';
import { convertInningsToRunsAndNOs } from '../utils/converter';

export interface FormSparkOptions extends ChartOptions {
  maxRuns?: number;
}

export const defaultFormSparkOptions: FormSparkOptions = {
  backgronudColor: 'transparent',
  foregroundColor: 'blue',
  height: 300,
  width: 800,
  margin: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
};

export const formSpark = (selector: string, data: (string | number)[] | null, options: Partial<FormSparkOptions> = {}) => {
  const { height, width, backgronudColor } = { ...defaultFormSparkOptions, ...options };
  const element = d3.select(selector)
  element.select('svg').remove();
  if (!data) {
    data = element.attr("data").split(",")
  }
  const svg = element
    .append('svg')
    .style('background-color', backgronudColor)
    .attr('viewBox', `0, 0, ${width}, ${height}`);

  if (data) {
    svg.append('g').call(formSparkCall(data, options));
  } else {
    throw new Error("No data provided")
  }
};

export const formSparkCall = (data: (string | number)[], options: Partial<FormSparkOptions> = {}) => {
  const convertedData = convertInningsToRunsAndNOs(data);
  const { margin, height, width, foregroundColor, maxRuns } = { ...defaultFormSparkOptions, ...options };

  // @ts-ignore
  let yExtent: number[] = d3.extent(convertedData, (d) => d[0]);
  if (maxRuns) {
    yExtent = [0, maxRuns];
  }

  const y = d3
    .scaleLinear()
    .domain(yExtent)
    .nice()
    .range([height - margin.bottom, margin.top]);

  const x = d3
    .scaleLinear()
    .domain([0, convertedData.length])
    .nice()
    .range([margin.left, width - margin.right]);

  const chart = (g) => {
    g.selectAll('rect')
      .data(convertedData)
      .join('rect')
      .attr('fill', (d: BatsmanInnings) => (d[1] ? d3.hsl(foregroundColor).brighter(1) : foregroundColor))
      .attr('x', (_: BatsmanInnings, i: number) => x(i))
      .attr('y', (d: BatsmanInnings) => y(d[0]))
      .attr('height', (d: BatsmanInnings) => y(0) - y(d[0]))
      .attr('width', x(1) - x(0));
  };

  return chart;
};
