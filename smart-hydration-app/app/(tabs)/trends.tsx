import colors from "@/colors";
import PageHeading from "@/components/common/page-heading";
import PageWrapper from "@/components/common/page-wrapper";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
    VictoryContainer,
    VictoryChart,
    VictoryZoomContainer,
    VictoryBar,
    VictoryLine,
} from "victory-native";
// import SFPro from "../../assets/fonts/SF-Pro-Display-Regular.otf";
// import { useFont } from "@shopify/react-native-skia";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { chartTimeWindowAtom } from "@/atom/nav";
import { getHydrationAtom } from "@/atom/query";
import { atomEffect } from "jotai-effect";
import { custom } from "@/constants/chart-theme";

function getAggregates(data: any[], type: string) {
    const MS_HOUR = 60 * 60 * 1000;
    const MS_DAY = MS_HOUR * 24;
    const MS_WEEK = MS_DAY * 7;
    const MS_MONTH = MS_WEEK * 4;
    const MS_YEAR = MS_MONTH * 12;

    const timeWindowMap = {
        D: MS_HOUR,
        W: MS_DAY,
        M: MS_WEEK,
        Y: MS_MONTH,
    };

    let delta;
    switch (type) {
        case "W":
            delta = new Date(new Date().getTime() - MS_WEEK);
            break;
        case "D":
            delta = new Date(new Date().getTime() - MS_DAY);
            break;
        case "Y":
            delta = new Date(new Date().getTime() - MS_YEAR);
            break;
        case "M":
            delta = new Date(new Date().getTime() - MS_MONTH);
            break;
        default:
            delta = new Date();
    }

    const aggs: Map<number, {}> = new Map();

    for (const row of data) {
        const roundedTime =
            Math.floor((row.time * 1000) / timeWindowMap[type]) *
            timeWindowMap[type];

        if (roundedTime < delta.getTime()) continue;

        if (aggs.has(roundedTime)) {
            const existing = aggs.get(roundedTime);
            existing.y += row.value;
        } else {
            aggs.set(roundedTime, { x: roundedTime, y: row.value });
        }
    }

    const arr = Array.from(aggs.values());
    arr.sort((a, b) => a.x - b.x);
    return arr;
}

const formattedDataAtom = atom<any[] | null>(null);

const formattedDataEAtom = atomEffect((get, set) => {
    const type = get(chartTimeWindowAtom);
    const { data, isLoading, isError } = get(getHydrationAtom);
    if (isLoading || !data) {
        set(formattedDataAtom, []);
        return;
    }
    const formattedData = getAggregates(data, type);

    set(
        formattedDataAtom,
        formattedData.map((row) => ({
            x: new Date(row.x),
            y: row.y,
        })),
    );
});

function BarChart() {
    useAtomValue(formattedDataEAtom);
    const data = useAtomValue(formattedDataAtom);

    const memoedData = useMemo(() => data, [data]);

    // alert(JSON.stringify(dateData));

    // alert(JSON.stringify(dateData));

    return (
        // <VictoryContainer responsive={true}>
        <VictoryChart
            theme={custom}
            // containerComponent={
            //     <VictoryZoomContainer zoomDimension="x" allowPan={true} />
            // }
            domainPadding={{ x: 20 }}
            padding={{ bottom: 130, left: 50, top: 30, right: 60 }}
        >
            <VictoryBar
                style={{ data: { fill: "#5cb5e1" } }}
                data={memoedData}
                scale={{ x: "time" }}
                cornerRadius={4}
            />
            <VictoryLine
                data={memoedData?.map((row) => ({ x: row.x, y: 2200 })) ?? []}
            />
        </VictoryChart>
        // {/* </VictoryContainer> */ }
    );
}

export default function TrendsPage() {
    const setChartTimeWindow = useSetAtom(chartTimeWindowAtom);

    return (
        <PageWrapper>
            {/* <PageHeading text="Trends" /> */}

            {/*<ScrollView>*/}

            {/*</ScrollView>*/}

            <ScrollView className="flex flex-1 mt-16">
                <View className="flex mx-8 mt-8">
                    <View className="w-full h-72 bg-gray-100 rounded-3xl overflow-hidden">
                        <BarChart />
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
                    <Text className="w-full h-72 bg-gray-200 mt-12 text-3xl text-white text-center rounded-lg text-black">
                        insights
                    </Text>
                    {/*<Text className="w-full h-72 bg-gray-800 mt-12 text-3xl text-white text-center" >more insights</Text>*/}
                </View>
            </ScrollView>
        </PageWrapper>
    );
}
