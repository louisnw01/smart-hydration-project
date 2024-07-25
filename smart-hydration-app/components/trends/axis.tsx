import { interpolate, useFont } from "@shopify/react-native-skia";
import SFPro from "@/assets/fonts/SF-Pro-Display-Regular.otf";
import useColorPalette from "@/util/palette";
import { Dimensions, useColorScheme, View, Text } from "react-native";
import { ChartBounds, PointsArray } from "victory-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { canvasInfoAtom } from "./chart";

const screenWidth = Dimensions.get("screen").width;
const axisWidth = 50;

const NUM_TICKS = 4;

export default function ChartAxis({}: {}) {
  // const scheme = useColorScheme();
  const palette = useColorPalette();
  // const fontSmall = useFont(SFPro, 15);
  const [tickPoints, setTickPoints] = useState([]);
  // const axisX = useDerivedValue(() => {
  //   return scrollPosition.value + (screenWidth - axisWidth - 35);
  // });
  //
  const [points, chartBounds] = useAtomValue(canvasInfoAtom);

  useEffect(() => {
    if (!points || !chartBounds) return;
    const newHighestY = points.reduce(
      (prev, curr) => (curr.yValue > prev.yValue ? curr : prev),
      points[0]
    );
    const rangeCoords = [chartBounds.bottom - 8, newHighestY.y - 8];
    const rangeValues = [0, newHighestY.yValue];

    const tickSpace = newHighestY.yValue / NUM_TICKS;

    const tickPoints = [];
    for (let i = 0; i < NUM_TICKS; i++) {
      const yTickValue = Math.round(((i + 1) * tickSpace) / 1000) * 1000;

      const test = interpolate(yTickValue, rangeValues, rangeCoords);

      tickPoints.push({ yValue: yTickValue, y: test });
    }
    setTickPoints(tickPoints);
  }, [points, chartBounds]);

  return (
    <View className="w-16 ml-2 h-[300px] bg-white dark:bg-black">
      {tickPoints.map((point, idx) => {
        return (
          <Text
            className="absolute dark:text-white"
            style={{
              top: point.y,
            }}
            // font={fontSmall}
            // x={axisX}
            // y={point.y}
            // color="white"
          >
            {`${point.yValue}`}
          </Text>
        );
      })}
    </View>
  );
}

// <RoundedRect
//      x={axisX}
//      y={0}
//      width={axisWidth}
//      height={chartBounds.bottom}
//      r={2}
//      color="red"
//    />

//  </View>
