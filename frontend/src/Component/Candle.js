import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const CandlestickChart = ({ data }) => {
  const svgRef = useRef();
  const [chatWidth, setChartWidth] = useState(0);

  useEffect(() => {

    if(!data || data.length === 0) return;

    d3.select(svgRef.current).selectAll('svg').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height + margin.top + margin.bottom);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);


    const xScale = d3.scaleBand().range([0, width]).domain(data.map((d) => d.date));
    const yScale = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, (d) => d.high)]);

    g.selectAll('.candle')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'candle')
      .attr('x', d => xScale(d.date))
      .attr('y', d => yScale(Math.max(d.open, d.close)))
      .attr('width', xScale.bandwidth())
      .attr('height', d => Math.abs(yScale(d.open) - yScale(d.close)))
      .attr('fill', d => (d.close >= d.open ? 'green' : 'red'));


    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);


    g.append('g').attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');
    g.append('g').call(yAxis);

  }, [data]);

  return (
        <div ref={svgRef}></div>
  );
};

export default CandlestickChart;
