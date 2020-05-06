// @ts-nocheck
import { select, selectAll } from 'd3-selection';
import { scaleOrdinal } from 'd3-scale';
import { hsl } from 'd3-color';
import { quantize } from 'd3-interpolate';
import { interpolateRainbow } from 'd3-scale-chromatic';
import { partition, hierarchy } from 'd3-hierarchy';
import { arc } from 'd3-shape';
import { format as d3format } from 'd3-format';
import { ChartOptions } from './../types';
import { convertInningsContributionToHierarchy } from '../utils/converter';
import { autoBox, generalFormatting } from './chartUtils';

export const defaultInningsContributionOptions: ChartOptions = {
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
      score?: number;
      bowlers?: {
        [key: string]: number;
      };
    };
  };
}

export const inningsContribution = (
  selector: string,
  data: InningsContributionData,
  options: Partial<ChartOptions> = {},
) => {
  const { height, width, backgronudColor } = { ...defaultInningsContributionOptions, ...options };
  selectAll(selector).each((d, i, nodes: any) => {
    const element = select(nodes[i]);
    element.select('svg').remove();
    const svg = element
      .append('svg')
      .style('background-color', backgronudColor)
      .attr('viewBox', `0, 0, ${width}, ${height}`);

    svg.append('g').call(inningsContributionCall(data, options));
    svg.attr('viewBox', autoBox);
    svg.call(generalFormatting);
  });
};

export const inningsContributionCall = (dataIn: InningsContributionData, options: Partial<ChartOptions> = {}) => {
  const data = convertInningsContributionToHierarchy(dataIn);
  const { width } = { ...defaultInningsContributionOptions, ...options };

  const radius = width / 2;
  const partitionFn = (dataToConvert) =>
    partition().size([2 * Math.PI, radius])(
      hierarchy(dataToConvert).sum((d) => d.value),
      // .sort((a, b) => b.value - a.value),
    );

  const root = partitionFn(data);
  const color = scaleOrdinal(quantize(interpolateRainbow, data.children.length + 1));
  const format = d3format(',d');
  const arcFn = arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius / 2)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1 - 1);

  const addAngledText = (dy, getText) => {
    return (g) => {
      g.append('text')
        .attr('transform', (d) => {
          const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
          const y = (d.y0 + d.y1) / 2;
          return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        })
        .attr('dy', dy)
        .text((d) => getText(d));
    };
  };

  const chart = (g) => {
    g.append('g')
      .attr('fill-opacity', 0.6)
      .selectAll('path')
      .data(root.descendants().filter((d) => d.depth))
      .join('path')
      .attr('fill', (d) => {
        let lighten = false;
        while (d.depth > 1) {
          d = d.parent;
          lighten = true;
        }
        let outColor = color(d.data.name);
        if (lighten) {
          outColor = hsl(outColor).brighter(1);
        }
        return outColor;
      })
      .attr('d', arcFn)
      .append('title')
      .text(
        (d) =>
          `${d
            .ancestors()
            .map((d2) => d2.data.name)
            .reverse()
            .join('/')}\n${format(d.value)}`,
      );

    g.append('g')
      .attr('pointer-events', 'none')
      .attr('text-anchor', 'middle')
      .attr('font-size', 15)
      .attr('font-family', 'sans-serif')
      .selectAll('g')
      .data(root.descendants().filter((d) => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10))
      .join('g')
      .call(addAngledText('0.15em', (d) => d.data.name))
      .call(
        addAngledText('1.1em', (d) => {
          if (d.depth === 1) {
            return `${d.value}${dataIn.batsmen[d.data.name].notOut ? '*' : ''}`;
          }
        }),
      );

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
