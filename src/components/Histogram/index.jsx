import * as d3 from "d3";
import { useRef, useEffect } from "react";
const width = 450;
const height = 200;
const insetLeft = 0.5;
const margin = { left: 50, bottom: 20 };
const binsNumber = 20;

export const Histogram = ({ data }) => {
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);
  const X = d3.map(data, (d) => d.speed);
  const Y = d3.map(data, () => 1);

  const I = d3.range(X.length);
  const min = d3.min(X);
  const max = d3.max(X);
  const bins = d3
    .bin()
    .thresholds(binsNumber)
    .value((i) => X[i])(I);
  const xScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([margin.left, width - margin.left]);
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, (I) => d3.sum(I, (i) => Y[i]))])
    .range([height - margin.bottom, margin.bottom]);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  useEffect(() => {
    if (!xAxisRef.current) return;

    const axisContainer = d3.select(xAxisRef.current);

    axisContainer
      .attr("shape-rendering", "crispEdges")
      .style("font-size", "12px")
      .transition()
      .duration(300)
      .call(xAxis);
  }, [xAxis]);

  useEffect(() => {
    if (!yAxisRef.current) return;

    const axisContainer = d3.select(yAxisRef.current);

    axisContainer
      .attr("shape-rendering", "crispEdges")
      .style("font-size", "12px")
      .transition()
      .duration(300)
      .call(yAxis);
  }, [yAxis]);

  return (
    <svg width={width} height={height} overflow="visible">
      {bins.map((bin) => (
        <rect
          key={bin.x0}
          x={xScale(bin.x0) + insetLeft}
          y={yScale(d3.sum(bin, (i) => Y[i]))}
          width={Math.max(
            0,
            xScale(bin.x1) - xScale(bin.x0) - insetLeft - insetLeft
          )}
          height={yScale(0) - yScale(d3.sum(bin, (i) => Y[i]))}
          fill="#84a9ff"
        />
      ))}

      <g ref={xAxisRef} transform={`translate(0,${height - margin.bottom})`} />
      <text
        x={(width - margin.left) / 2}
        y={height + 15}
        fontSize={15}
        fill="white"
      >
        Speed
      </text>
      <g ref={yAxisRef} transform={`translate(${margin.left},0)`} />
    </svg>
  );
};
