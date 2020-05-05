import * as d3 from 'd3';
import * as d3Annotation from 'd3-svg-annotation';
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

export interface ProgressiveRunRateData {
  balls: number[];
  batsmanName?: string;
  inningsRunRateRequired?: number;
  runRateRequired?: number[];
  ballsRunsRequired?: [number, number][];
}

export const progressiveRunRate = (
  selector: string,
  data: ProgressiveRunRateData | null,
  options: Partial<ProgressiveRunRateOptions> = {},
) => {
  const { height, width, backgronudColor } = { ...defaultProgressiveRunRateOptions, ...options };
  d3.selectAll(selector).each((d, i, nodes: any) => {
    const element = d3.select(nodes[i]);
    let elementData = data;
    element.select('svg').remove();
    if (!elementData) {
      elementData = {
        balls: element
          .attr('data')
          .toString()
          .split(',')
          .map((r) => parseInt(r)),
      };
    }
    const svg = element
      .append('svg')
      .style('background-color', backgronudColor)
      .attr('viewBox', `0, 0, ${width}, ${height}`);

    if (elementData) {
      svg.append('g').call(progressiveRunRateCall(elementData, options));
    } else {
      throw new Error('No data provided');
    }
  });
};

export const progressiveRunRateCall = (
  ballsData: ProgressiveRunRateData,
  options: Partial<ProgressiveRunRateOptions> = {},
) => {
  const { margin, height, width, showGrid } = { ...defaultProgressiveRunRateOptions, ...options };

  const runsData = convertBallsToProgressiveRunRate(ballsData.balls);

  let extentCheck: any = [...runsData]
  if (ballsData.runRateRequired) {
    extentCheck = [...extentCheck, ...ballsData.runRateRequired];
  }
  if (ballsData.inningsRunRateRequired) {
    extentCheck = [...extentCheck, ...[ballsData.inningsRunRateRequired]];
  }

  const y = d3
    .scaleLinear()
    // @ts-ignore
    .domain(d3.extent(extentCheck, d => d))
    .nice()
    .range([height - margin.bottom, margin.top]);

  const x = d3
    .scaleLinear()
    .domain([0, runsData.length])
    .nice()
    .range([margin.left, width - margin.right]);

  const yAxis = (g) => g.attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

  const xAxis = (g) => g.attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));

  const chart = (g) => {
    const annotations: any[] = [];

    if (ballsData.batsmanName) {
      const nameAnnotationIdx = parseInt((ballsData.balls.length * (2 / 3)).toString());
      const finalRunRate = runsData[runsData.length - 1];
      annotations.push({
        note: {
          label: `SR ${finalRunRate.toFixed(2)} (${(
            (runsData[runsData.length - 1] / 100) *
            6
          ).toFixed(2)} RPO)`,
          title: ballsData.batsmanName,
        },
        x: x(nameAnnotationIdx + 1),
        y: y(runsData[nameAnnotationIdx]),
        dy: 30,
        dx: 100,
      });
    }

    g.append('g').call(xAxis);

    g.append('g').call(yAxis);

    g.append('path')
      .datum(runsData)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 1)
      .attr(
        'd',
        d3
          .line()
          .x((d, i) => x(i + 1))
          // @ts-ignore
          .y((d) => y(d)),
      );

    if (ballsData.runRateRequired) {
      g.append('path')
        .datum(ballsData.runRateRequired)
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 1)
        .attr(
          'd',
          d3
            .line()
            .x((d, i) => x(i + 1))
            // @ts-ignore
            .y((d) => y(d)),
        );
    }

    if (ballsData.inningsRunRateRequired) {
      annotations.push({
        note: {
          label: `${((ballsData.inningsRunRateRequired / 100) * 6).toFixed(2)} RPO`,
          title: 'Innings Required Run Rate',
        },
        x: 100,
        y: y(ballsData.inningsRunRateRequired),
        dy: 30,
        dx: 100,
      });

      g.append('path')
        .datum(ballsData.balls)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1)
        .attr(
          'd',
          d3
            .line()
            .x((d, i) => x(i + 1))
            // @ts-ignore
            .y((d) => y(ballsData.inningsRunRateRequired)),
        );
    }

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

    g.append('g')
      // @ts-ignore
      .call(d3Annotation.annotation().annotations(annotations));

    g.call(generalFormatting);
  };

  return chart;
};
