import React from "react";

const gradientElementsNumber = 100;
const colorDataGradient = new Array(gradientElementsNumber)
  .fill(0)
  .map((_d, i) => i);

export const ColorBox = ({ id, colorScale }) => {
  const values = colorDataGradient.map(
    (i) =>
      ((colorScale.domain()[1] - colorScale.domain()[0]) * i) /
        gradientElementsNumber +
      colorScale.domain()[0]
  );

  return (
    <svg width={50} height={10}>
      <g id="colorBox">
        <rect
          x={0}
          y={0}
          width={50}
          height={10}
          fill={`url(#${id})`}
          rx={1}
          ry={1}
        />

        <linearGradient x1="100%" y1={0} x2={0} y2={0} id={id}>
          {values.map((d, i) => (
            <stop offset={i + "%"} key={i} stopColor={colorScale(d)} />
          ))}
        </linearGradient>
      </g>
    </svg>
  );
};
