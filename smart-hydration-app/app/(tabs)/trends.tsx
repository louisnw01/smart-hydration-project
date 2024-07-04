import PageWrapper from "@/components/common/page-wrapper";
import React, { useMemo } from "react";
import {ActivityIndicator, Pressable, ScrollView, Text, View} from "react-native";
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
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import { chartTimeWindowAtom } from "@/atom/nav";
import { custom } from "@/constants/chart-theme";
import {
    averageDailyHydrationComparison,
    averageHydrationMonthComparison, FormattedData,
    formattedDataAtom,
    formattedDataEAtom,
    getMostProductiveDay,
} from "@/util/trends";
import {Entypo} from "@expo/vector-icons";
import {isLoading} from "expo-font";

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

function formatDateToDayMonth(date) {
    const daysSuffixes = ["th", "st", "nd", "rd"];
    //alert(date)
    const day = date.getUTCDate();
    const suffix = day % 10 <= 3 && (day < 11 || day > 13) ? daysSuffixes[day % 10] : daysSuffixes[0];
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day}${suffix} ${month}`;
}

function RecentChart() {
    useAtomValue(formattedDataEAtom);
    const timeframe = useAtomValue(chartTimeWindowAtom);
    const data = useAtomValue(formattedDataAtom);

    const memoedData = useMemo(() => data, [data]);
    //alert(data)
    if (!data || data.length === 0) { return (
        <View className="h-full justify-center text-center">
            <ActivityIndicator />
            <Text className="text-center">Loading Analytics, Please Wait...</Text>
        </View>
    );
    }
    return (
        <View>

            <VictoryChart
                theme={custom}
                domainPadding={{x: 20}}
                padding={{bottom: 130, left: 20, top: 30, right: 80}}
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
            <Text className="absolute top-3 right-4">
                { formatDateToDayMonth(new Date(data[0].x)) }
                -
                { formatDateToDayMonth(new Date(data[data.length - 1].x)) }
            </Text>
        </View>
    );
}

function getCorrectTimeframeWord(timeframe) {

    switch (timeframe) {
        case "D":
            return "in the last hour!"
        case "W":
            return "today!"
        case "M":
            return "in the last week!"
        case "Y":
            return "in the last month!"
        default:
            return "recently!"
    }
}

function getAmountBetween(data: FormattedData[], start: number, end: number): number {
    const now = new Date();
    const dayInMS = 1000 * 60 * 60 * 24;

    const startDate = new Date(now.getTime() - (start * dayInMS));
    const startTimestamp = startDate.getTime();

    const endDate = new Date(now.getTime() - (end * dayInMS));
    const endTimestamp = endDate.getTime();

    //alert(`Start Timestamp: ${startTimestamp}, End Timestamp: ${endTimestamp}`);

    let amount = 0;

    for (const row of data) {
        const time = new Date(row.x);
        const timestamp = time.getTime();
        if (timestamp >= startTimestamp) {
            //console.log(timestamp + " is greater than " + startTimestamp);
        }
        if (timestamp <= endTimestamp) {
            //console.log(timestamp + " is less than " + endTimestamp);
        }
        if (timestamp >= startTimestamp && timestamp <= endTimestamp) {
            amount += row.y;
            //console.log("Match found")
            //alert("match")
        }
    }

    return amount;
}

function InsightsPane() {
    useAtomValue(formattedDataEAtom);
    const data = useAtomValue(formattedDataAtom);
    const timeframe = useAtomValue(chartTimeWindowAtom);

    if (!data || data.length === 0) {

    return (
        <View className="h-3/4 justify-center text-center">
            <ActivityIndicator />
            <Text className="text-center">Loading Insights, Please Wait...</Text>
        </View>
    );
    }
    const [currentAverage, prevAverage] = averageHydrationMonthComparison(data);

    // this function ASSUMES that if there is 0ml drunk on a day, they drank
    // from elsewhere (ie days where 0ml was drunk are not counted in the avg)
    const [amountDrankToday, avgAmountDrankByNow] =
        averageDailyHydrationComparison(data);
    const dailyAvgDiff = amountDrankToday - avgAmountDrankByNow;
    const monthAvgDiff = currentAverage - prevAverage;
    const avgPercent = (monthAvgDiff / prevAverage) * 100;
    const [ mostProductiveDay, mostProdConsumption ] = getMostProductiveDay(data);
    const percentChangeToday = (avgAmountDrankByNow - amountDrankToday) / avgAmountDrankByNow * 100

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
            displayedPercentage = ((timeframe1 - timeframe2) / timeframe2) * 100;
            break;
        case "M":
            timeframe1 = getAmountBetween(data, 7, 0);
            timeframe2 = getAmountBetween(data, 14, 7);
            displayedPercentage = ((timeframe1 - timeframe2) / timeframe2) * 100;
            break;
        case "Y":
            timeframe1 = getAmountBetween(data, 30, 0);
            timeframe2 = getAmountBetween(data, 60, 20);
            displayedPercentage = ((timeframe1 - timeframe2) / timeframe2) * 100;
            break;
    }
    //alert(timeframe2)
    return <>
        <View className="mt-5 bg-gray-200 flex dark:bg-neutral-800 rounded-2xl px-6 py-4 h-1/4">
            <View className="flex flex-col justify-between">
                <Text style={{
                    flex: 1,
                    flexWrap: 'wrap',
                    fontWeight: "bold"
                }}>
                    You seem to be drinking {displayedPercentage.toString() === "Infinity" ? "much " : Math.abs(displayedPercentage).toFixed(0) + "% "}
                    {displayedPercentage > 0 ? "more" : "less"}{" "}
                    {getCorrectTimeframeWord(timeframe)}
                </Text>
                <View className="flex-row top-1">

                    {/* percentageblock */}
                <Text style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: displayedPercentage > 0 ? "green" : "orange"
                    }}>
                    {displayedPercentage.toString() === "Infinity" ? "Well Done!" : Math.abs(displayedPercentage).toFixed(0) + "% "}
                </Text>
                <Entypo className="py-2" name={displayedPercentage > 0 ? "arrow-long-up" : "arrow-long-down"} size={24} color={displayedPercentage > 0 ? "green" : "orange"} />
                </View>
                    {/* percentageblock end */}
                {/* ml start */}
                <View className="font-normal">
                    <Text style={{
                        fontSize: 32,
                        fontWeight: "bold",
                        color: displayedPercentage > 0 ? "green" : "orange"
                    }}>
                        {Math.abs(timeframe2 - timeframe1)}ml
                    </Text>
                </View>
                {/* ml end */}
                <View style={{
                    position: "absolute",
                    top: 25,
                }}>
                <VictoryChart domainPadding={{x: 20}}
                              padding={{bottom: 260, left: 140, top: 0, right: 90}}
                theme={custom}>
                    <VictoryBar
                        cornerRadius={4}
                        style={{ data: { fill: "#5cb5e1" } }}
                        data={
                        [
                            {x: 1, y: timeframe2},
                            {x: 2, y: timeframe1}
                        ]
                    } />
                    <VictoryLine
                        data={
                        [
                            {x: 1, y: currentAverage},
                            {x: 2, y: currentAverage}
                        ]
                        } />
                    <VictoryAxis tickCount={1.5}/>
                </VictoryChart>
                </View>
            </View>
        </View>

        <View className="mt-5 bg-gray-200 flex dark:bg-neutral-800 rounded-2xl px-6 py-4 h-30">
            <Text style={{
                fontWeight: "bold",
            }}>You drank the most on:</Text>
            <View className="flex-row justify-between">
            <Text style={{
                fontSize: mostProdConsumption > 9999 ? 28 : 32,
                fontWeight: "bold",
                color: "#5cb5e1"
            }}>{mostProductiveDay}{timeframe != "W" ? "s" : ""}</Text>
                <Text style={{
                    fontSize: mostProdConsumption > 9999 ? 28 : 32,
                    fontWeight: "bold",
                    color: "#5bb450",
                }}>{mostProdConsumption}ml</Text>
            </View>
        </View>

        <View className="mt-5 bg-gray-200 flex dark:bg-neutral-800 rounded-2xl px-6 py-4 h-30">
            <Text style={{
                fontWeight: "bold",
            }}>
                Compared to your average intake over this period, you have drunk:
            </Text>
            <View className="flex-row">
            <Text style={{
                fontSize: 32,
                fontWeight: "bold",
                color: dailyAvgDiff > 0 ? "green" : "orange",
            }}>
                {Math.abs(dailyAvgDiff).toFixed(0)}ml{" "}

            </Text>
                <Text style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    color: dailyAvgDiff > 0 ? "green" : "orange",
                }}>
                    {dailyAvgDiff > 0 ? "More" : "Less"}

                </Text>
            <Entypo className="py-2" name={dailyAvgDiff > 0 ? "arrow-long-up" : "arrow-long-down"} size={24} color={dailyAvgDiff > 0 ? "green" : "orange"} />
            </View>
        </View>
    </>;
}

export default function TrendsPage() {
    const [timewindow, setChartTimeWindow] = useAtom(chartTimeWindowAtom);
    const data = useAtomValue(formattedDataAtom)


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
                        <Pressable style={{
                            backgroundColor: timewindow === "D" ? "#5cb5e1" : "#E5E7EB"
                        }} className="rounded-3xl">
                            <Text
                                className="text-lg px-4"
                                onPress={() => setChartTimeWindow("D")}
                            >
                                D
                            </Text>
                        </Pressable>
                        <Pressable style={{
                            backgroundColor: timewindow === "W" ? "#5cb5e1" : "#E5E7EB"
                        }} className="rounded-3xl">
                            <Text
                                className="text-lg px-4"
                                onPress={() => setChartTimeWindow("W")}
                            >
                                W
                            </Text>
                        </Pressable>
                        <Pressable style={{
                            backgroundColor: timewindow === "M" ? "#5cb5e1" : "#E5E7EB"
                        }} className="rounded-3xl">
                            <Text
                                className="text-lg px-4"
                                onPress={() => setChartTimeWindow("M")}
                            >
                                M
                            </Text>
                        </Pressable>
                        <Pressable style={{
                            backgroundColor: timewindow === "Y" ? "#5cb5e1" : "#E5E7EB"
                        }} className="rounded-3xl">
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
