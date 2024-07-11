import { useAtomValue } from "jotai";
import InsightsPane from "./insights-pane";
import { View, Text } from "react-native";
import WaterAmount from "../common/water-amount";
import {
    amountDrankTodayAtom,
    avgAmountDrankByTimeNowAtom,
} from "@/atom/hydration";

export default function TodayVsAvgInsight() {
    const amountDrankToday = useAtomValue(amountDrankTodayAtom);
    const avgAmountDrankByNow = useAtomValue(avgAmountDrankByTimeNowAtom);

    if (Number.isNaN(amountDrankToday) || Number.isNaN(avgAmountDrankByNow)) {
        return null;
    }

    const dailyAvgDiff = amountDrankToday - avgAmountDrankByNow;

    return (
        <InsightsPane
            heading={`So far today, you're drinking ${dailyAvgDiff > 0 ? "more" : "less"} than you normally would.`}
        >
            <View className="flex-row w-full gap-32">
                <View className="flex">
                    <Text className="font-bold dark:text-white">Today</Text>
                    <WaterAmount value={amountDrankToday} />
                </View>
                <View className="flex">
                    <Text className="font-bold dark:text-white">Average</Text>
                    <WaterAmount value={avgAmountDrankByNow} />
                </View>
                {/* <Text
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
                /> */}
            </View>
        </InsightsPane>
    );
}
