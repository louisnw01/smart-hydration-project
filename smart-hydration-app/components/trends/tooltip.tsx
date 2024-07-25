import { Line, RoundedRect, Text, useFont } from "@shopify/react-native-skia";
import {
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
} from "react-native-reanimated";
import SFPro from "@/assets/fonts/SF-Pro-Display-Regular.otf";
import useColorPalette from "@/util/palette";
import { atom, useAtom, useAtomValue } from "jotai";
import { colorSchemeAtom } from "@/atom/user";
import { Dimensions, useColorScheme } from "react-native";
import { formattedDataAtom } from "@/util/trends";
import { useEffect, useMemo, useState } from "react";
import { chartTimeWindowAtom } from "@/atom/nav";

interface ValPosSkia {
  value: any;
  position: any;
}

const screenWidth = Dimensions.get("screen").width;

const BOX_Y = 10;

export default function ToolTip({
  isActive,
  x,
  y,
  points,
  timeframe,
  scrollPosition,
  chartBounds,
}: {
  isActive: boolean;
  x: ValPosSkia;
  y: ValPosSkia;
}) {
  const scheme = useColorScheme();
  const palette = useColorPalette();
  const fontLarge = useFont(SFPro, 30);
  const fontSmall = useFont(SFPro, 15);
  const fontMedium = useFont(SFPro, 23);

  const data = useAtomValue(formattedDataAtom);

  const memoedData = useMemo(() => data.toReversed(), [data]);

  const [clickedDataIndex, setClickedDataIndex] = useState(null);

  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (isActive) setShown(!shown);
  }, [isActive]);

  useEffect(() => {
    setClickedDataIndex(points?.findIndex((row) => row.y == y.position.value));
    setShown(true);
  }, [x.position.value]);

  useEffect(() => {
    setShown(false);
  }, [timeframe]);

  useEffect(() => {
    if (scrollPosition.value > x.position.value) {
      setShown(false);
    }
  }, [scrollPosition.value]);

  const [width, height] = [200, 80];

  const xPos = useDerivedValue(() => {
    const width = 200;

    if (x.position.value - width / 2 < scrollPosition.value) {
      if (x.position.value - 20 < scrollPosition.value) {
        return x.position.value - 20;
      }
      return scrollPosition.value;
    } else if (x.position.value - scrollPosition.value > 215) {
      if (x.position.value - scrollPosition.value > 265) {
        return x.position.value - 150;
      }
      return scrollPosition.value + 215 - width / 2;
    } else {
      return x.position.value - width / 2;
    }
  }, [scrollPosition, x.position.value]);

  const textXPos = useDerivedValue(() => xPos.value + 20, [xPos]);
  if (!shown || !memoedData || !y.value.value) return null;

  if (
    memoedData[clickedDataIndex] == null ||
    memoedData[clickedDataIndex] == undefined
  )
    return null;

  const realTime = new Date(memoedData[clickedDataIndex].x);

  return (
    <>
      <RoundedRect
        x={xPos}
        y={BOX_Y}
        r={10}
        width={width}
        height={height}
        color={scheme == "dark" ? "rgb(35, 35, 35)" : "rgb(230, 230, 230)"}
        strokeWidth={3}
      />
      <Text
        x={textXPos}
        y={BOX_Y + 20}
        text="Total"
        font={fontSmall}
        antiAlias={true}
        color={palette.fg}
      />
      <Text
        x={textXPos}
        y={BOX_Y + 50}
        text={`${y.value.value.toFixed(0)}ml`}
        font={fontLarge}
        color={palette.fg}
      />
      <Text
        x={textXPos}
        y={BOX_Y + 70}
        text={realTime.toLocaleString(undefined, { dateStyle: "medium" })}
        font={fontSmall}
        color={palette.fg}
      />

      <Line
        p1={{ x: x.position.value, y: BOX_Y + height }}
        p2={{ x: x.position.value, y: y.position.value }}
        strokeWidth={3}
        color={palette.border}
      />
    </>
  );
}
