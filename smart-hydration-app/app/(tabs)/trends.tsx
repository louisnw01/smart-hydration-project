import PageWrapper from "@/components/common/page-wrapper";
import React, {useMemo} from "react";
import {Pressable, ScrollView, Text, View} from "react-native";
import {
    VictoryContainer,
    VictoryChart,
    VictoryZoomContainer,
    VictoryBar,
    VictoryLine,
    VictoryAxis,
} from "victory-native";
// import SFPro from "../../assets/fonts/SF-Pro-Display-Regular.otf";
// import { useFont } from "@shopify/react-native-skia";
import {useAtomValue, useSetAtom} from "jotai";
import {chartTimeWindowAtom} from "@/atom/nav";
import {custom} from "@/constants/chart-theme";
import {
    averageDailyHydrationComparison,
    averageHydrationMonthComparison,
    formattedDataAtom,
    formattedDataEAtom,
    getMostProductiveDay,
} from "@/util/trends";

const tickFormatMap: { [key: string]: (t: number) => string } = {
    D: (t: number) => {
        const hours = new Date(t).getHours();
        // 12pm

        return `${hours === 12 ? 12 : hours % 12}${hours > 12 ? "pm" : "am"}`;
    },
    W: (t: number) => ["S", "M", "T", "W", "T", "F", "S"][new Date(t).getDay()],
    M: (t: number) => new Date(t).getDate().toString(),
    Y: (t: number) =>
        ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][
            new Date(t).getMonth()
            ],
};

function RecentChart() {
    useAtomValue(formattedDataEAtom);
    const timeframe = useAtomValue(chartTimeWindowAtom);
    const data = useAtomValue(formattedDataAtom);

    const memoedData = useMemo(() => data, [data]);

    // alert(JSON.stringify(dateData));

    // alert(JSON.stringify(dateData));

    return (
        <VictoryContainer responsive={true}>
            <VictoryChart
                theme={custom}
                containerComponent={
                    <VictoryZoomContainer zoomDimension="x" allowPan={true}/>
                }
                domainPadding={{x: 20}}
                padding={{bottom: 130, left: 50, top: 30, right: 60}}
            >
                <VictoryAxis
                    scale={{x: "time"}}
                    tickFormat={tickFormatMap[timeframe]}
                />
                <VictoryBar
                    style={{data: {fill: "#5cb5e1"}}}
                    data={memoedData}
                    // scale={{ x: "time" }}

                    cornerRadius={4}
                />
                <VictoryLine
                    data={memoedData?.map((row) => ({x: row.x, y: 2200})) ?? []}
                />
            </VictoryChart>
        </VictoryContainer>
    );
}

function InsightsPane() {
    useAtomValue(formattedDataEAtom);
    const data = useAtomValue(formattedDataAtom);
    if (!data) return null;

    const [currentAverage, prevAverage] = averageHydrationMonthComparison(data);

    // this function ASSUMES that if there is 0ml drunk on a day, they drank
    // from elsewhere (ie days where 0ml was drunk are not counted in the avg)
    const [amountDrankToday, avgAmountDrankByNow] =
        averageDailyHydrationComparison(data);
    const dailyAvgDiff = amountDrankToday - avgAmountDrankByNow;
    const monthAvgDiff = currentAverage - prevAverage;
    const avgPercent = (monthAvgDiff / prevAverage) * -100;
    const mostProductiveDay = getMostProductiveDay(data);

    return (
        <>
            <View className="mt-5 bg-gray-200 flex dark:bg-neutral-800 rounded-2xl px-6 py-4 h-30">
                <Text>
                    You seem to be drinking {Math.abs(avgPercent).toFixed(0)}%{" "}
                    {monthAvgDiff > 0 ? "more" : "less"} this month
                </Text>
            </View>

            <View className="mt-5 bg-gray-200 flex dark:bg-neutral-800 rounded-2xl px-6 py-4 h-30">
                <Text>Last week, you drank the most on {mostProductiveDay}</Text>
            </View>

            <View className="mt-5 bg-gray-200 flex dark:bg-neutral-800 rounded-2xl px-6 py-4 h-30">
                <Text>
                    You seem to have drank {Math.abs(dailyAvgDiff).toFixed(0)}ml{" "}
                    {dailyAvgDiff > 0 ? "more" : "less"} than you usually would!
                </Text>
            </View>
        </>
    );
}

export default function TrendsPage() {
    const setChartTimeWindow = useSetAtom(chartTimeWindowAtom);

    return (
        <PageWrapper>
            {/* <PageHeading text="Trends" /> */}

            {/*<ScrollView>*/}

            {/*</ScrollView>*/}

            <ScrollView className="flex flex-1 mt-4">
                <View className="flex mx-8 mt-8">
                    <View className="w-full h-72 bg-gray-100 rounded-3xl overflow-hidden">
                        <RecentChart/>
                    </View>
                    <View className="flex flex-row justify-evenly mt-4">
                        <Pressable className="bg-gray-200 rounded-3xl">
                            <Text
                                className="text-lg px-4"
                                onPress={() => setChartTimeWindow("D")}
                            >
                                D
                            </Text>
                        </Pressable>
                        <Pressable className="bg-gray-200 rounded-3xl">
                            <Text
                                className="text-lg px-4"
                                onPress={() => setChartTimeWindow("W")}
                            >
                                W
                            </Text>
                        </Pressable>
                        <Pressable className="bg-gray-200 rounded-3xl">
                            <Text
                                className="text-lg px-4"
                                onPress={() => setChartTimeWindow("M")}
                            >
                                M
                            </Text>
                        </Pressable>
                        <Pressable className="bg-gray-200 rounded-3xl">
                            <Text
                                className="text-lg px-4"
                                onPress={() => setChartTimeWindow("Y")}
                            >
                                Y
                            </Text>
                        </Pressable>
                    </View>
                    {/*<Text className="w-full h-72 bg-gray-800 mt-12 text-3xl text-white text-center" >chart</Text>*/}
                    {/* <Text className="w-full h-72 bg-gray-200 mt-12 text-3xl text-white text-center rounded-lg text-black"> */}
                    <InsightsPane/>
                    {/* </Text> */}
                    {/*<Text className="w-full h-72 bg-gray-800 mt-12 text-3xl text-white text-center" >more insights</Text>*/}
                </View>
            </ScrollView>
        </PageWrapper>
    );
}
