import SFPro from "@/assets/fonts/SF-Pro-Display-Regular.otf";
import { chartTimeWindowAtom } from "@/atom/nav";
import ToolTip from "@/components/trends/tooltip";
import useColorPalette from "@/util/palette";
import { formattedDataAtom } from "@/util/trends";
import { useFont } from "@shopify/react-native-skia";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import Animated, {
    scrollTo,
    useAnimatedRef,
    useAnimatedStyle,
    useDerivedValue,
    useScrollViewOffset,
    useSharedValue,
} from "react-native-reanimated";
import { Bar, CartesianChart, useChartPressState } from "victory-native";
import ChartAxis, { canvasInfoAtom } from "./axis";

const screenWidth = Dimensions.get("screen").width;

const tickCountDivisorMap = {
    D: 4,
    W: 1,
    M: 2,
    Y: 5,
};

const chartWidthDivisorMap = {
    D: 24,
    W: 9,
    M: 24,
    Y: 20,
};

const tickFormatMap: { [key: string]: (t: Date) => string } = {
    D: (t) => {
        const hours = t.getHours();
        const period = hours >= 12 ? "am" : "pm";
        const formattedHour = hours % 12 || 12;
        return `${formattedHour}${period}`;
    },
    W: (t) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][t.getDay()],
    M: (t) => t.getDate().toString(),
    Y: (t) =>
        [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ][t.getMonth()],
};

function formatDateToDayMonth(date) {
    const daysSuffixes = ["th", "st", "nd", "rd"];
    const day = date.getUTCDate();
    const suffix =
        day % 10 <= 3 && (day < 11 || day > 13)
            ? daysSuffixes[day % 10]
            : daysSuffixes[0];
    const month = date.toLocaleString("default", { month: "short" });
    return `${day}${suffix} ${month}`;
}

export default function TrendsChart() {
    const font = useFont(SFPro);
    const timeframe = useAtomValue(chartTimeWindowAtom);
    const data = useAtomValue(formattedDataAtom);
    const { state, isActive } = useChartPressState({ x: "", y: { y: 0 } });
    const palette = useColorPalette();
    const setCanvasInfo = useSetAtom(canvasInfoAtom);

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollPosition = useScrollViewOffset(scrollRef);
    const scrollViewWidth = useSharedValue(screenWidth);

    const memoedData = useMemo(
        () =>
            data.map((val) => ({
                x: tickFormatMap[timeframe](new Date(val.x)),
                y: val.y,
            })),
        [data, timeframe],
    );

    useDerivedValue(() => {
        scrollTo(scrollRef, scrollPosition.value, 0, false);
    });

    useEffect(() => {
        const percentageOffset = (
            data.length / chartWidthDivisorMap[timeframe]
        ).toFixed(2);

        const newValue = screenWidth * percentageOffset;

        scrollViewWidth.value = newValue;

        setTimeout(() => {
            console.log("running..");
            scrollPosition.value = newValue;
        }, 100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.length, scrollViewWidth, timeframe]);

    const animatedStyles = useAnimatedStyle(() => ({
        width: scrollViewWidth.value,
        height: 300,
    }));

    if (!data || data.length === 0) {
        return (
            <View className="h-full justify-center text-center">
                <ActivityIndicator />
                <Text className="text-center dark:text-white">
                    Loading Analytics, Please Wait...
                </Text>
            </View>
        );
    }

    const zeroCount = memoedData.reduce(
        (curr, row) => curr + (row.y == 0 ? 1 : 0),
        0,
    );
    const hasNoData = zeroCount == memoedData.length;

    if (hasNoData) {
        return (
            <View className="h-[300px] justify-center items-center">
                <Text className="dark:text-white">
                    No data for this period.
                </Text>
            </View>
        );
    }
    return (
        <View className="flex-row">
            <Animated.ScrollView
                showsHorizontalScrollIndicator={false}
                ref={scrollRef}
                horizontal
                onScroll={(e) => {
                    scrollPosition.value = e.nativeEvent.contentOffset.x;
                }}
            >
                <Animated.View style={animatedStyles}>
                    <CartesianChart
                        data={memoedData.toReversed()}
                        xKey="x"
                        yKeys={["y"]}
                        chartPressState={state}
                        domain={{ y: [0] }}
                        domainPadding={{
                            bottom: 0,
                            left: 30,
                            top: 100,
                            right: 40,
                        }}
                        axisOptions={{
                            font: font,
                            // axisSide: { x: "bottom", y: "right" },
                            tickCount: {
                                x:
                                    memoedData.length /
                                    tickCountDivisorMap[timeframe],
                                // y: 4,
                                y: 0,
                            },
                            labelColor: palette.fg,
                            lineColor: palette.border,
                        }}
                    >
                        {({ points, chartBounds }) => {
                            setCanvasInfo([points.y, chartBounds]);
                            return (
                                <>
                                    <Bar
                                        points={points.y}
                                        chartBounds={chartBounds}
                                        // color="red"
                                        // barWidth={barWidthMap[timeframe]}
                                        color="#5cb5e1"
                                        roundedCorners={{
                                            topLeft: 4,
                                            topRight: 4,
                                        }}
                                        // innerPadding={0.55}
                                        animate={{ type: "timing" }}
                                    />

                                    <ToolTip
                                        isActive={isActive}
                                        x={state.x}
                                        y={state.y.y}
                                        points={points.y}
                                        data={data}
                                        timeframe={timeframe}
                                        scrollPosition={scrollPosition}
                                        chartBounds={chartBounds}
                                    />
                                </>
                            );
                        }}
                        {/*
                <VictoryLine
                    data={
                        memoedData?.map((row) => ({ x: row.x, y: 2200 })) ?? []
                    }
                /> */}
                    </CartesianChart>
                </Animated.View>
            </Animated.ScrollView>
            <ChartAxis />
            <Text className="absolute top-3 right-10 dark:text-white">
                {formatDateToDayMonth(new Date(data[data.length - 1].x))}-
                {formatDateToDayMonth(new Date(data[0].x))}
            </Text>
        </View>
    );
}
