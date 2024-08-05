import SFPro from "@/assets/fonts/SF-Pro-Display-Regular.otf";
import { Timeframe } from "@/interfaces/data";
import useColorPalette from "@/util/palette";
import { Line, RoundedRect, Text, useFont } from "@shopify/react-native-skia";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { SharedValue } from "react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper";
import { useDerivedValue } from "react-native-reanimated";
import { ChartBounds } from "victory-native";

interface ValPosSkia {
    value: any;
    position: any;
}

const BOX_Y = 10;

export default function ToolTip({
    isActive,
    x,
    y,
    points,
    timeframe,
    scrollPosition,
    chartBounds,
    data,
}: {
    isActive: boolean;
    x: ValPosSkia;
    y: ValPosSkia;
    points: any[];
    timeframe: Timeframe;
    scrollPosition: SharedValue<number>;
    chartBounds: ChartBounds;
    data: { x: number; y: number }[];
}) {
    const scheme = useColorScheme();
    const palette = useColorPalette();
    const fontLarge = useFont(SFPro, 30);
    const fontSmall = useFont(SFPro, 15);

    // const data = useAtomValue(formattedDataAtom);

    const memoedData = data.toReversed();
    const [clickedDataIndex, setClickedDataIndex] = useState<number | null>(
        null,
    );

    const [shown, setShown] = useState(false);
    useEffect(() => {
        if (isActive) setShown(!shown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    useEffect(() => {
        setClickedDataIndex(
            points?.findIndex((row) => row.x == x.position.value),
        );
        setShown(true);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [points, timeframe, data]);

    useEffect(() => {
        setShown(false);
    }, [timeframe]);

    useEffect(() => {
        if (scrollPosition.value > x.position.value) {
            setShown(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!shown || !memoedData || !y.value.value || clickedDataIndex === null)
        return null;

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
                color={
                    scheme == "dark" ? "rgb(35, 35, 35)" : "rgb(230, 230, 230)"
                }
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
                text={realTime.toLocaleString(undefined, {
                    dateStyle: timeframe != "Y" ? "medium" : undefined,
                    timeStyle: timeframe == "D" ? "medium" : undefined,
                    month: timeframe == "Y" ? "long" : undefined,
                })}
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
