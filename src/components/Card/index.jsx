import React from "react";
import ReactSlider from "react-slider";
import { ColorBox } from "../ColorBox";
import { useState, useEffect } from "react";
import { Histogram } from "../Histogram";

export const Card = ({
  minDate,
  maxDate,
  name,
  handleDateChange,
  colorScale,
  widthScale,
  data,
}) => {
  const [date, setDate] = useState(null);
  const [animation, setAnimation] = useState(false);
  useEffect(() => {
    setDate(maxDate);
  }, [name, maxDate]);

  useEffect(() => {
    if (date == null || !animation) return;

    let timerId = setInterval(() => {
      // if (date == null) return;
      // console.log(selectedDate);
      setDate(date + 10000000);
      handleDateChange(date + 10000000);
    }, 1);

    if (date >= maxDate[1]) {
      clearInterval(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [date, maxDate, animation, handleDateChange]);

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "400px",
          }}
        >
          <div
            style={{
              marginRight: "15px",
              paddingTop: "40px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: 12 }}>
              {new Date(minDate).toLocaleDateString()}
            </p>
            <p style={{ margin: 0, fontSize: 12 }}>
              {new Date(minDate).toLocaleTimeString()}
            </p>
          </div>

          <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            defaultValue={maxDate}
            min={minDate}
            max={maxDate}
            onChange={(v) => {
              handleDateChange(v);
              setDate(v);
            }}
            value={date}
          />

          <div
            style={{
              marginLeft: "15px",
              paddingTop: "40px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: 12 }}>
              {new Date(maxDate).toLocaleDateString()}
            </p>
            <p style={{ margin: 0, fontSize: 12 }}>
              {new Date(maxDate).toLocaleTimeString()}
            </p>
          </div>
          {/* <div
          onClick={() => {
            if (!animation) {
              setDate(minDate);
              handleDateChange(minDate);
            }
            setAnimation(!animation);
          }}
        >
          pl
        </div> */}
        </div>

        <div
          style={{
            paddingTop: 40,
            marginLeft: 20,
            fontSize: 12,
            cursor: "pointer",
          }}
          onClick={() => {
            if (!animation) {
              setDate(minDate);
              handleDateChange(minDate);
            }
            setAnimation(!animation);
          }}
        >
          play
        </div>
      </div>

      <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ marginRight: 15 }}>
            <h5 style={{ marginBottom: 0 }}>Speed: </h5>
            <ColorBox id={name} colorScale={colorScale} />
            <span style={{ marginLeft: 10 }}>
              {colorScale.domain()[1].toFixed(2)}-
              {colorScale.domain()[0].toFixed(2)}
            </span>
          </div>

          <div>
            <h5 style={{ marginBottom: 0 }}>Altitude: </h5>
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg width={30} height={17}>
                <circle r={3} cx={8} cy={8} fill={colorScale.range()[1]} />
                <circle r={7} cx={21} cy={8} fill={colorScale.range()[1]} />
              </svg>
              <span style={{ marginLeft: 10 }}>
                {widthScale.domain()[0].toFixed(2)}-
                {widthScale.domain()[1].toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Histogram data={data} />
    </>
  );
};
