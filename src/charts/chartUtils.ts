export const generalFormatting = (g) => g.selectAll('text').attr('font-family', 'sans-serif');

export const generateGrid = (x, y, width: number, height: number, margin) => {
  return (g) =>
    g
      .attr('stroke', 'blue')
      .attr('stroke-opacity', 0.1)
      .call((g2) =>
        g2
          .append('g')
          .selectAll('line')
          .data(x.ticks())
          .join('line')
          .attr('x1', (d) => 0.5 + x(d))
          .attr('x2', (d) => 0.5 + x(d))
          .attr('y1', margin.top)
          .attr('y2', height - margin.bottom),
      )
      .call((g2) =>
        g2
          .append('g')
          .selectAll('line')
          .data(y.ticks())
          .join('line')
          .attr('y1', (d) => 0.5 + y(d))
          .attr('y2', (d) => 0.5 + y(d))
          .attr('x1', margin.left)
          .attr('x2', width - margin.right),
      );
};

export const autoBox = (d, i, nodes) => {
  const { x, y, width, height } = nodes[i].getBBox();
  return [x, y, width, height];
};
