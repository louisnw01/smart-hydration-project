import PageWrapper from "@/components/common/page-wrapper";
import React, { useMemo } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { CartesianChart, Bar } from "victory-native";
import SFPro from "@/assets/fonts/SF-Pro-Display-Regular.otf";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { chartTimeWindowAtom } from "@/atom/nav";
import {
    amountDrankTodayAtom,
    averageHydrationMonthComparison,
    avgAmountDrankByTimeNowAtom,
    avgAmountDrankLastMonthAtom,
    avgAmountDrankThisMonthAtom,
    FormattedData,
    formattedDataAtom,
    mostHydratedDayOfWeekAtom,
} from "@/util/trends";
import { Entypo } from "@expo/vector-icons";
import { useFont } from "@shopify/react-native-skia";
import Switcher from "@/components/trends/switcher";

const tickFormatMap: { [key: string]: (t: Date) => string } = {
    D: (t) => {
        const hours = t.getHours();
        return `${hours === 12 ? 12 : hours % 12}${hours > 12 ? "pm" : "am"}`;
    },
    W: (t) => ["S", "M", "T", "W", "T", "F", "S"][t.getDay()],
    M: (t) => t.getDate().toString(),
    Y: (t) =>
        ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][
            t.getMonth()
        ],
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
                <Text className="text-center">
                    Loading Analytics, Please Wait...
                </Text>
            </View>
        );
    }

    return (
        <View className="w-full h-72 px-5">
            <CartesianChart
                data={memoedData.toReversed()}
                xKey="x"
                yKeys={["y"]}
                // theme={custom}
                // domainPadding={{ x: 20 };
                domain={{ y: [0] }}
                domainPadding={{ bottom: 0, left: 40, top: 40, right: 40 }}
                axisOptions={{
                    font: font,
                    // formatXLabel: (val) => tickFormatMap[timeframe](val),
                    tickCount: {
                        x: 8,
                        y: 0,
                    },
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
            <Text className="absolute top-3 right-4">
                {formatDateToDayMonth(new Date(data[0].x))}-
                {formatDateToDayMonth(new Date(data[data.length - 1].x))}
            </Text>
        </View>
    );
}

function getCorrectTimeframeWord(timeframe) {
    switch (timeframe) {
        case "D":
            return "in the last hour!";
        case "W":
            return "today!";
        case "M":
            return "in the last week!";
        case "Y":
            return "in the last month!";
        default:
            return "recently!";
    }
}

function getAmountBetween(
    data: FormattedData[],
    start: number,
    end: number,
): number {
    const now = new Date();
    const dayInMS = 1000 * 60 * 60 * 24;

    const startDate = new Date(now.getTime() - start * dayInMS);
    const startTimestamp = startDate.getTime();

    const endDate = new Date(now.getTime() - end * dayInMS);
    const endTimestamp = endDate.getTime();

    let amount = 0;

    for (const row of data) {
        const time = new Date(row.x);
        const timestamp = time.getTime();
        if (timestamp >= startTimestamp && timestamp <= endTimestamp) {
            amount += row.y;
        }
    }
    return amount;
}

function InsightsPane({ heading, children }) {
    return (
        <View className="mt-5 bg-gray-200 flex dark:bg-neutral-800 rounded-2xl px-6 py-4 h-1/4">
            <View className="flex flex-col justify-between">
                <Text
                    style={{
                        flex: 1,
                        flexWrap: "wrap",
                        fontWeight: "bold",
                    }}
                >
                    {heading}
                </Text>
                {children}
            </View>
        </View>
    );
}

function TodayVsAvgInsight() {
    const amountDrankToday = useAtomValue(amountDrankTodayAtom);
    const avgAmountDrankByNow = useAtomValue(avgAmountDrankByTimeNowAtom);

    if (amountDrankToday == null || avgAmountDrankByNow == null) return null;

    const dailyAvgDiff = amountDrankToday - avgAmountDrankByNow;

    return (
        <View className="mt-5 bg-gray-200 flex dark:bg-neutral-800 rounded-2xl px-6 py-4 h-30">
            <Text className="font-bold">
                {`So far today, you're drinking ${dailyAvgDiff > 0 ? "more" : "less"} than you normally would.`}
            </Text>
            <View className="flex-row">
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: "bold",
                        color: dailyAvgDiff > 0 ? "green" : "orange",
                    }}
                >
                    {Math.abs(dailyAvgDiff).toFixed(0)}ml{" "}
                </Text>
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: "bold",
                        color: dailyAvgDiff > 0 ? "green" : "orange",
                    }}
                >
                    {dailyAvgDiff > 0 ? "More" : "Less"}
                </Text>
                <Entypo
                    className="py-2"
                    name={
                        dailyAvgDiff > 0 ? "arrow-long-up" : "arrow-long-down"
                    }
                    size={24}
                    color={dailyAvgDiff > 0 ? "green" : "orange"}
                />
            </View>
        </View>
    );
}

function MonthVsLastMonthInsight() {
    const avgAmountThisMonth = useAtomValue(avgAmountDrankThisMonthAtom);
    const avgAmountLastMonth = useAtomValue(avgAmountDrankLastMonthAtom);
    return (
        <InsightsPane
            heading={`On average, you're drinking ${avgAmountThisMonth > avgAmountLastMonth ? "more" : "less"} this month when compared to last month`}
        >
            <Text>{avgAmountThisMonth}ml this month</Text>
            <Text>{avgAmountLastMonth}ml last month</Text>
        </InsightsPane>
    );
}

function MostHydratedDayOfWeek() {
    const { name, value } = useAtomValue(mostHydratedDayOfWeekAtom);
    return (
        <InsightsPane heading="You tend to drink the most on:">
            <View className="flex-row justify-between">
                <Text
                    className="font-bold"
                    style={{
                        color: "#5cb5e1",
                    }}
                >
                    {name}s
                </Text>
                <Text
                    className="font-bold"
                    style={{
                        color: "#5bb450",
                    }}
                >
                    {value}ml
                </Text>
            </View>
        </InsightsPane>
    );
}

function Insights() {
    // useAtomValue(formattedDataEAtom);
    const data = useAtomValue(formattedDataAtom);
    const timeframe = useAtomValue(chartTimeWindowAtom);

    if (!data || data.length === 0) {
        return (
            <View className="h-3/4 justify-center text-center">
                <ActivityIndicator />
                <Text className="text-center">
                    Loading Insights, Please Wait...
                </Text>
            </View>
        );
    }
    // const [currentAverage, prevAverage] = averageHydrationMonthComparison(data);

    const [amountDrankToday, avgAmountDrankByNow] = [0, 0];

    // const monthAvgDiff = currentAverage - prevAverage;
    // const avgPercent = (monthAvgDiff / prevAverage) * 100;
    // const [mostProductiveDay, mostProdConsumption] = getMostProductiveDay(data);
    const percentChangeToday =
        ((avgAmountDrankByNow - amountDrankToday) / avgAmountDrankByNow) * 100;

    let displayedPercentage = 0;

    let timeframe1 = 0;
    let timeframe2 = 0;
    switch (timeframe) {
        case "D":
            timeframe1 = amountDrankToday;
            timeframe2 = avgAmountDrankByNow;
            displayedPercentage = percentChangeToday;
        case "W":
            timeframe1 = getAmountBetween(data, 1, 0);
            timeframe2 = getAmountBetween(data, 2, 1);
            displayedPercentage =
                ((timeframe1 - timeframe2) / timeframe2) * 100;
            break;
        case "M":
            timeframe1 = getAmountBetween(data, 7, 0);
            timeframe2 = getAmountBetween(data, 14, 7);
            displayedPercentage =
                ((timeframe1 - timeframe2) / timeframe2) * 100;
            break;
        case "Y":
            timeframe1 = getAmountBetween(data, 30, 0);
            timeframe2 = getAmountBetween(data, 60, 20);
            displayedPercentage =
                ((timeframe1 - timeframe2) / timeframe2) * 100;
            break;
    }
    //alert(timeframe2)
    return (
        <>
            <TodayVsAvgInsight />

            <MonthVsLastMonthInsight />

            <MostHydratedDayOfWeek />
        </>
    );
}

export default function TrendsPage() {
    return (
        <PageWrapper>
            <ScrollView className="flex flex-1">
                <View className="flex mx-8 mt-8 pb-32">
                    <View className="bg-gray-100 rounded-3xl pb-3 overflow-hidden dark:bg-neutral-900">
                        <RecentChart />

                        <Switcher />
                    </View>

                    <Insights />
                </View>
            </ScrollView>
        </PageWrapper>
    );
}
