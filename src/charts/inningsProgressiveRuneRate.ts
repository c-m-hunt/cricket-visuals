import * as d3 from 'd3';
import { ChartOptions } from './../types';
import { convertBallsToProgressiveRunRate } from '../utils/converter';
import { generalFormatting, generateGrid } from './chartUtils';

interface ProgressiveRunRateOptions extends ChartOptions {
  showGrid: boolean;
}

export const defaultProgressiveRunRateOptions: ProgressiveRunRateOptions = {
  backgronudColor: 'transparent',
  foregroundColor: 'blue',
  height: 300,
  width: 1500,
  margin: {
    top: 10,
    bottom: 20,
    left: 30,
    right: 10,
  },
  showGrid: false,
};

export const progressiveRunRate = (
  selector: string,
  data: number[] | null,
  options: Partial<ProgressiveRunRateOptions> = {},
) => {
  const { height, width, backgronudColor } = { ...defaultProgressiveRunRateOptions, ...options };
  const element = d3.select(selector);
  element.select('svg').remove();
  const svg = element
    .append('svg')
    .style('background-color', backgronudColor)
    .attr('viewBox', `0, 0, ${width}, ${height}`);

  if (data) {
    svg.append('g').call(progressiveRunRateCall(data, options));
  } else {
    throw new Error('No data provided');
  }
};

export const progressiveRunRateCall = (ballsData: number[], options: Partial<ProgressiveRunRateOptions> = {}) => {
  const { margin, height, width, showGrid } = { ...defaultProgressiveRunRateOptions, ...options };

  const data = convertBallsToProgressiveRunRate(ballsData);

  const y = d3
    .scaleLinear()
    // @ts-ignore
    .domain(d3.extent(data, (d) => d))
    .nice()
    .range([height - margin.bottom, margin.top]);

  const x = d3
    .scaleLinear()
    .domain([0, data.length])
    .nice()
    .range([margin.left, width - margin.right]);

  const yAxis = (g) => g.attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

  const xAxis = (g) => g.attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));

  const chart = (g) => {
    g.append('g').call(xAxis);

    g.append('g').call(yAxis);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line()
          .x((d, i) => x(i + 1))
          .y((d) => y(d)),
      );

    if (showGrid) {
      g.append('g').call(generateGrid(x, y, width, height, margin));
    }

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 50)
      .attr('x', 0 - height / 2)
      .text('Strike rate');

    g.append('text')
      .attr('y', height - 25)
      .attr('x', width / 2)
      .text('Balls');

    g.call(generalFormatting);
  };

  return chart;
};
