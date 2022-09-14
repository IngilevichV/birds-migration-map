import { useMemo } from "react";
import { scaleSequential, scaleLinear, interpolatePlasma } from "d3";

export const useScales = ({ minMaxSpeed, minMaxAltitude }) => {
  const colorScale = useMemo(
    () =>
      scaleSequential()
        .domain([minMaxSpeed[1], minMaxSpeed[0]])
        .interpolator(interpolatePlasma),
    [minMaxSpeed]
  );

  const widthScale = useMemo(
    () => scaleLinear().domain([0, minMaxAltitude[1]]).range([5000, 100000]),
    [minMaxAltitude]
  );

  return { colorScale, widthScale };
};
