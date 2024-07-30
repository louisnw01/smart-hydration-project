import SFPro from "@/assets/fonts/SF-Pro-Display-Regular.otf";
import { mostHydratedDayOfWeekAtom } from "@/atom/hydration";
import { chartTimeWindowAtom } from "@/atom/nav";
import { getHydrationQAtom } from "@/atom/query";
import { ScrollPageWrapper } from "@/components/common/page-wrapper";
import WaterAmount from "@/components/common/water-amount";
import InsightsPane from "@/components/trends/insights-pane";
import MonthVsLastMonthInsight from "@/components/trends/month-vs-month";
import Switcher from "@/components/trends/switcher";
import TodayVsAvgInsight from "@/components/trends/today-vs-avg";
import useColorPalette from "@/util/palette";
import { formattedDataAtom } from "@/util/trends";
import { useFont } from "@shopify/react-native-skia";
import { useAtomValue } from "jotai";
import React, { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Bar, CartesianChart } from "victory-native";

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
    //alert(date)
    const day = date.getUTCDate();
    const suffix =
        day % 10 <= 3 && (day < 11 || day > 13)
            ? daysSuffixes[day % 10]
            : daysSuffixes[0];
    const month = date.toLocaleString("default", { month: "short" });
    return `${day}${suffix} ${month}`;
}

function RecentChart() {
    const font = useFont(SFPro);
    const timeframe = useAtomValue(chartTimeWindowAtom);
    const data = useAtomValue(formattedDataAtom);
    const palette = useColorPalette();

    const memoedData = useMemo(
        () =>
            data.map((val) => ({
                x: tickFormatMap[timeframe](new Date(val.x)),
                y: val.y,
            })),
        [data],
    );

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
            <View className="h-72 justify-center items-center">
                <Text className="dark:text-white">
                    No data for this period.
                </Text>
            </View>
        );
    }

    return (
        <View className="h-72">
            <CartesianChart
                data={hasNoData ? [] : memoedData.toReversed()}
                xKey="x"
                yKeys={["y"]}
                // theme={custom}
                // domainPadding={{ x: 20 };
                domain={{ y: [0] }}
                domainPadding={{ bottom: 0, left: 30, top: 30, right: 40 }}
                axisOptions={{
                    font: font,
                    // formatXLabel: (val) => tickFormatMap[timeframe](val),
                    tickCount: {
                        x: 8,
                        y: 0,
                    },
                    labelColor: palette.fg,
                    lineColor: palette.border,
                }}
            >
                {({ points, chartBounds }) => (
                    <Bar
                        points={points.y}
                        chartBounds={chartBounds}
                        // color="red"
                        color="#5cb5e1"
                        roundedCorners={{ topLeft: 4, topRight: 4 }}
                        innerPadding={0.55}
                        animate={{ type: "timing" }}
                    />
                )}
                {/* <VictoryAxis
                    scale={{ x: "time" }}
                    tickFormat={tickFormatMap[timeframe]}
                />
                <VictoryBar
                    style={{ data: { fill: "#5cb5e1" } }}
                    data={memoedData || undefined}
                    cornerRadius={4}
                />
                <VictoryLine
                    data={
                        memoedData?.map((row) => ({ x: row.x, y: 2200 })) ?? []
                    }
                /> */}
            </CartesianChart>
            <Text className="absolute top-3 right-4 dark:text-white">
                {formatDateToDayMonth(new Date(data[data.length - 1].x))}-
                {formatDateToDayMonth(new Date(data[0].x))}
            </Text>
        </View>
    );
}

function MostHydratedDayOfWeek() {
    const { name, value } = useAtomValue(mostHydratedDayOfWeekAtom);
    if (!value) return null;
    return (
        <InsightsPane heading={`You tend to drink the most on ${name}.`}>
            <WaterAmount value={value} />
        </InsightsPane>
    );
}

function Insights() {
    const data = useAtomValue(formattedDataAtom);
    const timeframe = useAtomValue(chartTimeWindowAtom);

    if (!data || data.length === 0) {
        return (
            <View className="h-3/4 justify-center text-center">
                <ActivityIndicator />
                <Text className="text-center dark:text-white">
                    Loading Insights, Please Wait...
                </Text>
            </View>
        );
    }
    return (
        <View className="flex gap-4 px-4 mt-3 mb-4">
            <Text className="font-bold text-2xl mt-5 dark:text-white">
                Insights
            </Text>
            <TodayVsAvgInsight />

            <MonthVsLastMonthInsight />

            <MostHydratedDayOfWeek />
        </View>
    );
}

export default function TrendsPage() {
    const { isLoading } = useAtomValue(getHydrationQAtom);

    return (
        <ScrollPageWrapper
            queryRefreshAtom={getHydrationQAtom}
            isLoading={isLoading}
            message="Loading your information..."
            className="bg-gray-100 dark:bg-black"
        >
            <View className="flex px-4 pb-5 bg-white dark:bg-black">
                <RecentChart />
                <Switcher />
            </View>
            <Insights />
        </ScrollPageWrapper>
    );
}
