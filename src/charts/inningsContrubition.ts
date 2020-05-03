// @ts-nocheck
import * as d3 from 'd3';
import { ChartOptions } from './../types';
import { convertInningsContributionToHierarchy } from '../utils/converter';
import { autoBox, generalFormatting } from './chartUtils';

export interface InningsContributionOptions extends ChartOptions {}

export const defaultInningsContributionOptions: InningsContributionOptions = {
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

export interface InningsContributionData {
  teamName: string;
  score: string;
  batsmen: {
    [key: string]: {
      notOut: boolean;
      bowlers: {
        [key: string]: number;
      };
    };
  };
}

export const inningsContribution = (
  selector: string,
  data: InningsContributionData,
  options: Partial<InningsContributionOptions> = {},
) => {
  const { height, width, backgronudColor } = { ...defaultInningsContributionOptions, ...options };
  d3.selectAll(selector).each((d, i, nodes: any) => {
    const element = d3.select(nodes[i]);
    let elementData = data;
    element.select('svg').remove();
    const svg = element
      .append('svg')
      .style('background-color', backgronudColor)
      .attr('viewBox', `0, 0, ${width}, ${height}`);

    if (elementData) {
      svg.append('g').call(inningsContributionCall(elementData, options));
    } else {
      throw new Error('No data provided');
    }

    svg.attr('viewBox', autoBox);
    svg.call(generalFormatting);
  });
};

export const inningsContributionCall = (
  dataIn: InningsContributionData,
  options: Partial<InningsContributionOptions> = {},
) => {
  const data = convertInningsContributionToHierarchy(dataIn);
  const { margin, height, width, foregroundColor } = { ...defaultInningsContributionOptions, ...options };

  const radius = width / 2;
  const partition = (data) =>
    d3.partition().size([2 * Math.PI, radius])(
      d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value),
    );

  const root = partition(data);
  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
  const format = d3.format(',d');
  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius / 2)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1 - 1);

  const chart = (g) => {
    g.append('g')
      .attr('fill-opacity', 0.6)
      .selectAll('path')
      .data(root.descendants().filter((d) => d.depth))
      .join('path')
      .attr('fill', (d) => {
        const lighten = false;
        while (d.depth > 1) {
          d = d.parent;
          lighten = true;
        }
        const outColor = color(d.data.name);
        if (lighten) {
          outColor = d3.hsl(outColor).brighter(1);
        }
        return outColor;
      })
      .attr('d', arc)
      .append('title')
      .text(
        (d) =>
          `${d
            .ancestors()
            .map((d) => d.data.name)
            .reverse()
            .join('/')}\n${format(d.value)}`,
      );

    g.append('g')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .attr('font-size', 15)
      .attr('font-family', 'sans-serif')
      .selectAll('text')
      .data(root.descendants().filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10))
      .join('text')
      .attr('transform', function (d) {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr('dy', '0.35em')
      .text((d) => d.data.name);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', -10)
      .attr('font-size', 40)
      .text(dataIn.teamName);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', 10)
      .attr('font-size', 40)
      .attr('dy', 20)
      .text(dataIn.score);
  };

  return chart;
};
