import { interpolate } from "@shopify/react-native-skia";
import { atom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export const canvasInfoAtom = atom([null, null]);

const NUM_TICKS = 4;

export default function ChartAxis() {
    const [tickPoints, setTickPoints] = useState([]);

    const [points, chartBounds] = useAtomValue(canvasInfoAtom);

    useEffect(() => {
        if (!points || !chartBounds) return;
        const newHighestY = points.reduce(
            (prev, curr) => (curr.yValue > prev.yValue ? curr : prev),
            points[0],
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
            <FlatList
                scrollEnabled={false}
                data={tickPoints}
                renderItem={({ item }) => (
                    <Text
                        className="absolute dark:text-white"
                        style={{
                            top: item.y,
                        }}
                    >
                        {`${item.yValue}`}
                    </Text>
                )}
            />
        </View>
    );
}
