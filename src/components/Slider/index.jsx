import "./App.css";
import { Map } from "./components/Map";
import { useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import data from "./data/bird_migration.csv";
import ReactSlider from "react-slider";

function App() {
  const [parsedData, setParsedData] = useState({});
  const [minMaxAltitude, setMinMaxAltitude] = useState([0, 0]);
  const [minMaxSpeed, setMinMaxSpeed] = useState([0, 0]);
  const [minMaxDate, setMinMaxDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dataSlice, setDataSlice] = useState({});
  const [birdsStats, setBirdsStats] = useState({});

  const colorScale = useMemo(
    () =>
      d3
        .scaleSequential()
        .domain([minMaxSpeed[1], minMaxSpeed[0]])
        .interpolator(d3.interpolatePlasma),
    [minMaxSpeed]
  );

  const widthScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([minMaxAltitude[0], minMaxAltitude[1]])
        .range([100, 100000]),
    [minMaxAltitude]
  );

  useEffect(() => {
    d3.csv(data).then((d) => {
      const birdsData = {};
      let altitudeMin = Number.MAX_SAFE_INTEGER;
      let altitudeMax = 0;
      let speedMin = Number.MAX_SAFE_INTEGER;
      let speedMax = 0;
      let dateMin = Number.MAX_SAFE_INTEGER;
      let dateMax = 0;
      const birdsStats = {};

      d.forEach(
        ({ bird_name, altitude, latitude, longitude, speed_2d, date_time }) => {
          altitudeMin = Math.min(altitudeMin, altitude);
          altitudeMax = Math.max(altitudeMax, altitude);
          speedMin = Math.min(speedMin, speed_2d);
          speedMax = Math.max(speedMax, speed_2d);
          const parsedDate = new Date(date_time).getTime();
          dateMin = Math.min(parsedDate, dateMin);
          dateMax = Math.max(parsedDate, dateMax);
          if (birdsStats[bird_name]) {
            birdsStats[bird_name].altitudeMin = Math.min(
              birdsStats[bird_name].altitudeMin,
              altitude
            );
            birdsStats[bird_name].altitudeMax = Math.min(
              birdsStats[bird_name].altitudeMax,
              altitude
            );
            birdsStats[bird_name].speedMin = Math.min(
              birdsStats[bird_name].speedMin,
              speed_2d
            );
            birdsStats[bird_name].speedMax = Math.min(
              birdsStats[bird_name].speedMin,
              speed_2d
            );
          } else {
            birdsStats[bird_name].altitudeMin = altitude;
            birdsStats[bird_name].altitudeMax = altitude;
            birdsStats[bird_name].speedMin = speed_2d;
            birdsStats[bird_name].speedMax = speed_2d;
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
      setDataSlice(birdsData);

      setMinMaxDate([dateMin, dateMax]);
      setSelectedDate(dateMax);
      setBirdsStats(birdsStats);
    });
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const newData = {};
    Object.entries(parsedData).forEach(([key, d]) => {
      const filteredData = d.filter((el) => el.date <= selectedDate);
      newData[key] = filteredData;
    });
    setDataSlice(newData);
  }, [parsedData, selectedDate]);

  // useEffect(() => {
  //   if (!minMaxDate) return;
  //   let timerId = setInterval(() => {
  //     if (!selectedDate) return;
  //     // console.log(selectedDate);
  //     setSelectedDate(selectedDate + 10000000);
  //   }, 1);

  //   // if (selectedDate >= minMaxDate[1]) {
  //   //   clearInterval(timerId);
  //   // }

  //   return () => {
  //     clearTimeout(timerId);
  //   };
  // }, [selectedDate, minMaxDate]);
  console.log(birdsStats);

  return (
    <div className="App">
      <Map data={dataSlice} colorScale={colorScale} widthScale={widthScale} />

      <div style={{ position: "absolute", top: 10, left: 10, width: "100%" }}>
        {minMaxDate ? (
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            defaultValue={minMaxDate[1]}
            min={minMaxDate[0]}
            max={minMaxDate[1]}
            onChange={(v) => setSelectedDate(v)}
            value={selectedDate}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
