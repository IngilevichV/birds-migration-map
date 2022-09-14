import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { PathLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { rgb } from "d3";

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiaW5naWxldmljaHYiLCJhIjoiY2w2MXVpdTl0MWx6cjNmb2FiOTk0OHYwMyJ9.LNQz1dMCp1fS5H1-GKBHPw";

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -2.938084,
  latitude: 43.263659,
  zoom: 4,
  pitch: 0,
  bearing: 0,
};

const ATTRIBUTE_TRANSITION = {
  enter: (value, chunk) => {
    return chunk.length ? chunk.subarray(chunk.length - value.length) : value;
  },
};

const DEFAULT_COLOR = [0, 0, 0, 255];

class MultiColouredPathLayer extends PathLayer {
  initializeState() {
    super.initializeState();
    this.state.attributeManager.addInstanced({
      instanceColors: {
        size: this.props.colorFormat.length,
        vertexOffset: 0,
        type: 0x1401, // UNSIGNED_BYTE
        normalized: true,
        accessor: "getColor",
        transition: ATTRIBUTE_TRANSITION,
        defaultValue: DEFAULT_COLOR,
        shaderAttributes: {
          instanceColors: {
            vertexOffset: 0,
          },
          instanceLastColour: {
            vertexOffset: 1,
          },
        },
      },
      instanceNextWidths: {
        size: 1,
        vertexOffset: 0,
        type: 0x1406, // FLOAT
        accessor: "getWidth",
        transform: (widthArray) =>
          widthArray.reduce((acc, w, i) => {
            if (i > 0) acc.push(w / widthArray[i - 1]);
            return acc;
          }, []),
        defaultValue: 1,
      },
    });
  }

  getShaders() {
    return {
      ...super.getShaders(),
      inject: {
        "vs:#decl": `          
          attribute vec4 instanceLastColour;
          attribute float instanceNextWidths;
          `,
        "vs:#main-start": `
          geometry.uv = positions;
          `,
        "vs:DECKGL_FILTER_SIZE": `
          float widthAtVertex = mix(1.0, instanceNextWidths, geometry.uv.x);
          size *= widthAtVertex;
          `,
        "vs:#main-end": `
          vec4 firstColor = vec4( instanceColors.rgb, instanceColors.a * opacity );
          vec4 lastColor = vec4( instanceLastColour.rgb, instanceLastColour.a * opacity );
          
          vColor = mix( firstColor, lastColor, positions.x );          
          `,
      },
    };
  }
}

export const Map = ({ data, colorScale, widthScale }) => {
  const [pathData, setPathData] = useState([]);

  useEffect(() => {
    const newPathData = [];

    if (!data.length) return;

    const path = [];
    const color = [];
    const width = [];

    data.forEach(({ point, altitude, speed }) => {
      const { r, g, b } = rgb(colorScale(speed));
      path.push(point);
      color.push([r, g, b]);
      width.push(widthScale(altitude));
    });
    newPathData.push({ color, path, width });

    setPathData(newPathData);
  }, [data, colorScale, widthScale]);

  const layers = [
    new MultiColouredPathLayer({
      map_id: "map",
      id: "normal",
      data: pathData,
      getPath: (d) => d.path,
      getColor: (d) => d.color,
      getWidth: (d) => d.width,
      autoHighlight: true,
      rounded: true,
    }),
  ];

  if (!pathData.length) return null;

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <StaticMap
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v8"
      ></StaticMap>
    </DeckGL>
  );
};
