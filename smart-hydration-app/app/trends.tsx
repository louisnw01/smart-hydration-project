import colors from "@/colors";
import PageHeading from "@/components/common/page-heading";
import PageWrapper from "@/components/common/page-wrapper";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { CartesianChart, Bar } from "victory-native"
// @ts-ignore
import SFPro from '../assets/fonts/SF-Pro-Display-Regular.otf'
import { useFont } from "@shopify/react-native-skia";


const numPoints = 7

const dummyData = Array.from({ length: numPoints }, (_, i) => ({
  x: i,
  y: 40 + 30 * Math.random(),
}));


function getDay(x: number) {
    const norm = x % 7

    return [
        'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'
    ][norm] || ''
}


function LineChart() {
    const font = useFont(SFPro);

    return (
        <CartesianChart data={dummyData} xKey="x" yKeys={["y"]}
            domain={{x: [
                dummyData.reduce((min, point) => point.x < min ? point.x : min, Infinity)-0.6,
                dummyData.reduce((max, point) => point.x > max ? point.x : max, 0)+0.6,
            ]}}
             axisOptions={{
            font,
            tickCount: { y: 0, x: 7 },
            lineColor: "rgb(200, 200, 200)",
            labelColor: "#000",
            formatXLabel: (x) => getDay(x)
          }}
          // padding={{left: 10, right:10}}
        >
      {({ points, chartBounds }) => (
        //👇 pass a PointsArray to the Line component, as well as options.
        <Bar

          points={points.y}
          color={colors.blue}
          chartBounds={chartBounds}
          roundedCorners={{ topLeft: 4, topRight: 4 }}
          barWidth={32}


          // strokeWidth={3}
          // animate={{ type: "timing", duration: 300 }}
        />
      )}
    </CartesianChart>
    );
}



export default function TrendsPage() {
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

                            <View className="bg-gray-200 rounded-3xl"><Text className="text-lg px-4">D</Text></View>
                            <View className="bg-gray-200 rounded-3xl"><Text className="text-lg px-4">W</Text></View>
                            <View className="bg-gray-200 rounded-3xl"><Text className="text-lg px-4">M</Text></View>
                            <View className="bg-gray-200 rounded-3xl"><Text className="text-lg px-4">Y</Text></View>
                        </View>
                    {/*<Text className="w-full h-72 bg-gray-800 mt-12 text-3xl text-white text-center" >chart</Text>*/}
                    <Text className="w-full h-72 bg-gray-200 mt-12 text-3xl text-white text-center rounded-lg text-black">insights</Text>
                    {/*<Text className="w-full h-72 bg-gray-800 mt-12 text-3xl text-white text-center" >more insights</Text>*/}
                </View>
            </ScrollView>
        </PageWrapper>
    )
}



