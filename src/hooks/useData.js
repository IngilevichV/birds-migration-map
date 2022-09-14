import * as d3 from "d3";
import data from "../data/bird_migration.csv";
import { useEffect, useState, useCallback } from "react";

export const useData = () => {
  const [parsedData, setParsedData] = useState({});
  const [dataSlice, setDataSlice] = useState({});
  const [minMaxSpeed, setMinMaxSpeed] = useState([0, 0]);
  const [minMaxAltitude, setMinMaxAltitude] = useState([0, 0]);
  const [birdsStats, setBirdsStats] = useState({});
  const [selectedBird, setSelectedBird] = useState(Object.keys(parsedData)[0]);

  useEffect(() => {
    setSelectedBird(Object.keys(parsedData)[0]);
  }, [parsedData]);

  useEffect(() => {
    d3.csv(data).then((d) => {
      const birdsData = {};
      let altitudeMin = Number.MAX_SAFE_INTEGER;
      let altitudeMax = 0;
      let speedMin = Number.MAX_SAFE_INTEGER;
      let speedMax = 0;
      let dateMin = Number.MAX_SAFE_INTEGER;
      let dateMax = 0;
      const birdsDataTemp = {};

      d.forEach(
        ({ bird_name, altitude, latitude, longitude, speed_2d, date_time }) => {
          altitudeMin = Math.min(altitudeMin, altitude);
          altitudeMax = Math.max(altitudeMax, altitude);
          speedMin = Math.min(speedMin, speed_2d);
          speedMax = Math.max(speedMax, speed_2d);
          const parsedDate = new Date(date_time).getTime();
          dateMin = Math.min(parsedDate, dateMin);
          dateMax = Math.max(parsedDate, dateMax);

          if (birdsDataTemp[bird_name]) {
            birdsDataTemp[bird_name].altitudeMin = Math.min(
              birdsDataTemp[bird_name].altitudeMin,
              altitude
            );
            birdsDataTemp[bird_name].altitudeMax = Math.max(
              birdsDataTemp[bird_name].altitudeMax,
              altitude
            );
            birdsDataTemp[bird_name].speedMin = Math.min(
              birdsDataTemp[bird_name].speedMin,
              speed_2d
            );
            birdsDataTemp[bird_name].speedMax = Math.max(
              birdsDataTemp[bird_name].speedMin,
              speed_2d
            );
            birdsDataTemp[bird_name].dateMin = Math.min(
              parsedDate,
              birdsDataTemp[bird_name].dateMin
            );
            birdsDataTemp[bird_name].dateMax = Math.max(
              parsedDate,
              birdsDataTemp[bird_name].dateMax
            );
          } else {
            birdsDataTemp[bird_name] = {
              altitudeMin: altitude,
              altitudeMax: altitude,
              speedMin: speed_2d,
              speedMax: speed_2d,
              dateMin: parsedDate,
              dateMax: parsedDate,
            };
          }

          const el = {
            altitude: parseFloat(altitude),
            point: [parseFloat(longitude), parseFloat(latitude)],
            speed: parseFloat(speed_2d),
            date: parsedDate,
          };
          if (!birdsData[bird_name]) {
            birdsData[bird_name] = [el];
          } else {
            birdsData[bird_name].push(el);
          }
        }
      );

      setMinMaxSpeed([speedMin, speedMax]);
      setMinMaxAltitude([altitudeMin, altitudeMax]);
      setParsedData(birdsData);
      setDataSlice(Object.values(birdsData)[0]);
      setBirdsStats(birdsDataTemp);
    });
  }, []);

  const handleBirdClick = useCallback(
    (name) => {
      setDataSlice(parsedData[name]);
      setSelectedBird(name);
    },
    [parsedData]
  );

  return {
    parsedData,
    dataSlice,
    minMaxSpeed,
    minMaxAltitude,
    birdsStats,
    handleBirdClick,
    setDataSlice,
    selectedBird,
  };
};
