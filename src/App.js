import "./App.css";
import { Map } from "./components/Map";
import { useEffect, useState, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { useData } from "./useData";
import { useScales } from "./useScales";
// import ReactSlider from "react-slider";
// import { Card } from "./components/Card";
import { Panel } from "./components/Panel";

function App() {
  const {
    parsedData,
    dataSlice,
    minMaxSpeed,
    minMaxAltitude,
    birdsStats,
    handleBirdClick,
    setDataSlice,
    selectedBird,
  } = useData();
  // const [selectedBird, setSelectedBird] = useState(Object.keys(parsedData)[0]);

  // useEffect(() => {
  //   setSelectedBird(Object.keys(parsedData)[0]);
  // }, [parsedData]);

  const { colorScale, widthScale } = useScales({ minMaxSpeed, minMaxAltitude });

  // const colorScale = useMemo(
  //   () =>
  //     d3
  //       .scaleSequential()
  //       .domain([minMaxSpeed[1], minMaxSpeed[0]])
  //       .interpolator(d3.interpolatePlasma),
  //   [minMaxSpeed]
  // );

  // const widthScale = useMemo(
  //   () =>
  //     d3
  //       .scaleLinear()
  //       .domain([minMaxAltitude[0], minMaxAltitude[1]])
  //       .range([100, 100000]),
  //   [minMaxAltitude]
  // );

  // const handleBirdClick = useCallback(
  //   (name) => {
  //     setDataSlice(parsedData[name]);
  //   },
  //   [parsedData]
  // );

  const handleDateChange = useCallback(
    (date) => {
      const filteredData = parsedData[selectedBird].filter(
        (el) => el.date <= date
      );
      setDataSlice(filteredData);
    },
    [selectedBird, parsedData, setDataSlice]
  );

  // useEffect(() => {
  //   d3.csv(data).then((d) => {
  //     const birdsData = {};
  //     let altitudeMin = Number.MAX_SAFE_INTEGER;
  //     let altitudeMax = 0;
  //     let speedMin = Number.MAX_SAFE_INTEGER;
  //     let speedMax = 0;
  //     let dateMin = Number.MAX_SAFE_INTEGER;
  //     let dateMax = 0;
  //     const birdsDataTemp = {};

  //     d.forEach(
  //       ({ bird_name, altitude, latitude, longitude, speed_2d, date_time }) => {
  //         altitudeMin = Math.min(altitudeMin, altitude);
  //         altitudeMax = Math.max(altitudeMax, altitude);
  //         speedMin = Math.min(speedMin, speed_2d);
  //         speedMax = Math.max(speedMax, speed_2d);
  //         const parsedDate = new Date(date_time).getTime();
  //         dateMin = Math.min(parsedDate, dateMin);
  //         dateMax = Math.max(parsedDate, dateMax);

  //         if (birdsDataTemp[bird_name]) {
  //           birdsDataTemp[bird_name].altitudeMin = Math.min(
  //             birdsDataTemp[bird_name].altitudeMin,
  //             altitude
  //           );
  //           birdsDataTemp[bird_name].altitudeMax = Math.max(
  //             birdsDataTemp[bird_name].altitudeMax,
  //             altitude
  //           );
  //           birdsDataTemp[bird_name].speedMin = Math.min(
  //             birdsDataTemp[bird_name].speedMin,
  //             speed_2d
  //           );
  //           birdsDataTemp[bird_name].speedMax = Math.max(
  //             birdsDataTemp[bird_name].speedMin,
  //             speed_2d
  //           );
  //           birdsDataTemp[bird_name].dateMin = Math.min(
  //             parsedDate,
  //             birdsDataTemp[bird_name].dateMin
  //           );
  //           birdsDataTemp[bird_name].dateMax = Math.max(
  //             parsedDate,
  //             birdsDataTemp[bird_name].dateMax
  //           );
  //         } else {
  //           birdsDataTemp[bird_name] = {
  //             altitudeMin: altitude,
  //             altitudeMax: altitude,
  //             speedMin: speed_2d,
  //             speedMax: speed_2d,
  //             dateMin: parsedDate,
  //             dateMax: parsedDate,
  //           };
  //         }

  //         const el = {
  //           altitude: parseFloat(altitude),
  //           point: [parseFloat(longitude), parseFloat(latitude)],
  //           speed: parseFloat(speed_2d),
  //           date: parsedDate,
  //         };
  //         if (!birdsData[bird_name]) {
  //           birdsData[bird_name] = [el];
  //         } else {
  //           birdsData[bird_name].push(el);
  //         }
  //       }
  //     );

  //     setMinMaxSpeed([speedMin, speedMax]);

  //     setMinMaxAltitude([altitudeMin, altitudeMax]);

  //     setParsedData(birdsData);
  //     setDataSlice(Object.values(birdsData)[0]);
  //     setBirdsStats(birdsDataTemp);

  //     // setMinMaxDate([dateMin, dateMax]);
  //     // setSelectedDate(dateMax);
  //   });
  // }, []);

  // useEffect(() => {
  //   if (!Object.keys(birdsDates).length) return;

  //   const newData = {};
  //   Object.entries(parsedData).forEach(([key, d]) => {
  //     const date = birdsDates[key];
  //     const filteredData = d.filter((el) => el.date <= date);
  //     newData[key] = filteredData;
  //   });
  //   setDataSlice(newData);
  // }, [parsedData, birdsDates]);

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

  return (
    <div className="App">
      <Map
        data={dataSlice}
        colorScale={colorScale}
        widthScale={widthScale}
        birdsStats={birdsStats}
      />

      {/* <div style={{ position: "absolute", top: 10, left: 10, width: "100%" }}>
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
      </div> */}

      <div>
        <Panel
          data={birdsStats}
          handleBirdClick={handleBirdClick}
          handleDateChange={handleDateChange}
          colorScale={colorScale}
          widthScale={widthScale}
          selectedBird={selectedBird}
          allData={parsedData}
        />
        {/* {Object.entries(birdsStats).map(([key, value], i) => (
          <div
            key={key}
            style={{
              position: "absolute",
              top: (i + 1) * 10 + 20,
              left: 10,
              width: "100%",
            }}
          >
            {minMaxDate ? (
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                defaultValue={value.dateMax}
                min={value.dateMin}
                max={value.dateMax}
                onChange={(v) => setBirdsDates({ ...birdsDates, [key]: v })}
                value={birdsDates[key]}
              />
            ) : null}
          </div>
        ))} */}
      </div>
    </div>
  );
}

export default App;
