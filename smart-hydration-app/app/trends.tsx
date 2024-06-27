import colors from "@/colors";
import PageHeading from "@/components/common/page-heading";
import PageWrapper from "@/components/common/page-wrapper";
import React, {useState} from "react";
import {ActivityIndicator, Pressable, ScrollView, Text, View} from "react-native";
import {Bar, CartesianChart, Line, Scatter} from "victory-native"
import SFPro from '../assets/fonts/SF-Pro-Display-Regular.otf'
import { useFont } from "@shopify/react-native-skia";
import {getHydrationAtom, getJugDataQAtom} from "@/atom/query";
import {chartTimeWindowAtom} from "@/atom/nav";
import {useAtomValue} from "jotai/index";
import {i} from "@tanstack/query-core/build/legacy/hydration-BZ2M_xzi";
import {useAtom, useSetAtom} from "jotai";

function calculateAggregate(x: number, type: string) {
    var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
    var hours = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const now = new Date();
    const lastday = new Date(now.setDate(now.getDate() - now.getDay()+6));
    const seconds = Math.floor(lastday.getTime() / 1000);
    const date = new Date(x * 1000);

    switch (type) {
        case 'week': {
            if ((seconds - x) > 7 * 24 * 60 * 60 * 1000) {
                return 'NULL';
            }
            return days[date.getUTCDay()];
        }
        case 'day': {
            console.log('Comparing ' + now.getUTCDate() + ' and ' + date.getUTCDate())
            if (now.getUTCDate() - 1 !== date.getUTCDate()) {
                return 'NULL';
            }
            return hours[date.getUTCHours()];
        }
        case 'month': {
            if (now.getUTCFullYear() !== date.getUTCFullYear()) {
                return 'NULL';
            }
            return months[date.getUTCMonth()];
        }
        default:
            return 'NULL';
    }
}


function LineChart() {
    const font = useFont(SFPro);
    const {data, isLoading, isError, refetch} = useAtomValue(getHydrationAtom);
    const type = useAtomValue(chartTimeWindowAtom);

    if (data === undefined) {
        return (
            <View className="h-full justify-center">
                <ActivityIndicator />
                <Text className="text-center">Processing hydration data...</Text>
            </View>
        )
    }

    function createChartMap(type: string) {
        // i think this would be best to have in another file
        switch (type) {
            case "week":
                return {
                    0: {time: 'Sun', amount: 0},
                    1: {time: 'Mon', amount: 0},
                    2: {time: 'Tue', amount: 0},
                    3: {time: 'Wed', amount: 0},
                    4: {time: 'Thu', amount: 0},
                    5: {time: 'Fri', amount: 0},
                    6: {time: 'Sat', amount: 0},
                }
            case "day":
                return {
                    0: { time: '1am', amount: 0 },
                    1: { time: '2am', amount: 0 },
                    2: { time: '3am', amount: 0 },
                    3: { time: '4am', amount: 0 },
                    4: { time: '5am', amount: 0 },
                    5: { time: '6am', amount: 0 },
                    6: { time: '7am', amount: 0 },
                    7: { time: '8am', amount: 0 },
                    8: { time: '9am', amount: 0 },
                    9: { time: '10am', amount: 0 },
                    10: { time: '11am', amount: 0 },
                    11: { time: '12pm', amount: 0 },
                    12: { time: '1pm', amount: 0 },
                    13: { time: '2pm', amount: 0 },
                    14: { time: '3pm', amount: 0 },
                    15: { time: '4pm', amount: 0 },
                    16: { time: '5pm', amount: 0 },
                    17: { time: '6pm', amount: 0 },
                    18: { time: '7pm', amount: 0 },
                    19: { time: '8pm', amount: 0 },
                    20: { time: '9pm', amount: 0 },
                    21: { time: '10pm', amount: 0 },
                    22: { time: '11pm', amount: 0 },
                    23: { time: '12am', amount: 0 },
                }
            case "month":
                return {
                    0: { time: 'Jan', amount: 0 },
                    1: { time: 'Feb', amount: 0 },
                    2: { time: 'Mar', amount: 0 },
                    3: { time: 'Apr', amount: 0 },
                    4: { time: 'May', amount: 0 },
                    5: { time: 'Jun', amount: 0 },
                    6: { time: 'Jul', amount: 0 },
                    7: { time: 'Aug', amount: 0 },
                    8: { time: 'Sep', amount: 0 },
                    9: { time: 'Oct', amount: 0 },
                    10: { time: 'Nov', amount: 0 },
                    11: { time: 'Dec', amount: 0 },
                }
            alert('Error: Data Could Not Be Loaded')
        }
    }

    function processData(data, type) {
        const barLabels = createChartMap(type);
        data.forEach(event => {
            // get the correct label
            const correctLabel = calculateAggregate(event.time, type);
            if (correctLabel !== 'NULL') {
                // get the key which contains the correct data
                const key = Object.keys(barLabels).find(key => barLabels[key].time === correctLabel);
                if (key) {
                    // add the amount on if the key is there
                    barLabels[key].amount += event.amount;
                }
            }
        });
        const finalData = Object.values(barLabels);
        return finalData;
    }

    const processedData = processData(data, type);

    const DATA = Array.from({length: processedData.length}, (_, i) => ({
        day: processedData[i].time,
        amount: processedData[i].amount,
    }));

    return (
        <ScrollView horizontal={true}>
        <View style={{height: 250, width: processedData.length * 50}}>

            <CartesianChart
                data={DATA}
                xKey={"day"}
                yKeys={["amount"]}
                axisOptions={{font}}
                // i cant seem to find the option to round the corners of bars
                // or how to make sure all labels show on the axes
            >
                {
                    ({points}) => (
                        <Bar points={points.amount} color="#3ea4f0"
                             chartBounds={{left: 0, right: 0, bottom: 400, top: 0,}}
                             // otherwise bars would overlap
                             barWidth={200 / processedData.length}
                        ></Bar>
                    )
                }
            </CartesianChart>

        </View>
        </ScrollView>
            )
}



export default function TrendsPage() {
    const [chartTimeWindow, setChartTimeWindow] = useAtom(chartTimeWindowAtom)

    return (
        <PageWrapper>
            <PageHeading text='Trends' />

            {/*<ScrollView>*/}

            {/*</ScrollView>*/}

            <ScrollView className="flex flex-1 mt-16">
                <View className="flex mx-8">
                    <View className="w-full h-72 bg-gray-100 rounded-3xl overflow-hidden">
                        <LineChart />
                    </View>
                     <View className="flex flex-row justify-evenly mt-4">
                         <Pressable className="bg-gray-200 rounded-3xl"><Text className="text-lg px-4" onPress={() => setChartTimeWindow('day')}>D</Text></Pressable>
                         <Pressable className="bg-gray-200 rounded-3xl"><Text className="text-lg px-4" onPress={() => setChartTimeWindow('week')}>W</Text></Pressable>
                         <Pressable className="bg-gray-200 rounded-3xl"><Text className="text-lg px-4" onPress={() => setChartTimeWindow('month')}>M</Text></Pressable>
                     </View>
                    {/*<Text className="w-full h-72 bg-gray-800 mt-12 text-3xl text-white text-center" >chart</Text>*/}
                    <Text className="w-full h-72 bg-gray-200 mt-12 text-3xl text-white text-center rounded-lg text-black">insights</Text>
                    {/*<Text className="w-full h-72 bg-gray-800 mt-12 text-3xl text-white text-center" >more insights</Text>*/}
                </View>
            </ScrollView>
        </PageWrapper>
    )
}



