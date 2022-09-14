import { Card } from "../Card";
import Eric from "../../images/gull-1.jpeg";
import Nico from "../../images/gull-2.png";
import Sanne from "../../images/gull-3.png";

const imgMap = { Eric, Nico, Sanne };

export const Panel = ({
  data,
  handleBirdClick,
  handleDateChange,
  colorScale,
  widthScale,
  selectedBird,
  allData,
}) => {
  if (!Object.keys(data).length || !selectedBird) return null;

  return (
    <div
      style={{
        background: "rgb(0, 0, 0, 0.5)",
        position: "absolute",
        top: 20,
        left: 20,
        padding: 20,
        color: "white",
        borderRadius: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {Object.keys(data).map((name, i) => (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              textAlign: "center",
              marginRight: 20,
              marginLeft: 20,
            }}
          >
            <img
              src={imgMap[name]}
              width={70}
              height={70}
              style={{
                borderRadius: "50%",
                cursor: "pointer",
                border: `5px solid ${
                  name === selectedBird ? "yellow" : "white"
                }`,
              }}
              alt="bird"
              onClick={() => {
                handleBirdClick(Object.keys(data)[i]);
              }}
            />
            <span>{Object.keys(data)[i]}</span>
          </div>
        ))}
      </div>

      <Card
        minDate={data[selectedBird].dateMin}
        maxDate={data[selectedBird].dateMax}
        name={selectedBird}
        handleDateChange={handleDateChange}
        colorScale={colorScale}
        widthScale={widthScale}
        data={allData[selectedBird]}
      />
    </div>
  );
};
