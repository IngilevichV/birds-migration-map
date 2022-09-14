import "./App.css";
import { Map } from "./components/Map";
import { useCallback } from "react";
import { useData } from "./hooks/useData";
import { useScales } from "./hooks/useScales";
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

  const { colorScale, widthScale } = useScales({ minMaxSpeed, minMaxAltitude });

  const handleDateChange = useCallback(
    (date) => {
      const filteredData = parsedData[selectedBird].filter(
        (el) => el.date <= date
      );
      setDataSlice(filteredData);
    },
    [selectedBird, parsedData, setDataSlice]
  );

  return (
    <div className="App">
      <Map
        data={dataSlice}
        colorScale={colorScale}
        widthScale={widthScale}
        birdsStats={birdsStats}
      />

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
      </div>
    </div>
  );
}

export default App;
