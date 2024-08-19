import { useAtomValue } from "jotai";
import InsightsPane from "./insights-pane";
import { View, Text } from "react-native";
import WaterAmount from "../common/water-amount";
import {
    amountDrankTodayAtom,
    avgAmountDrankByTimeNowAtom,
} from "@/atom/hydration";
import { selectedMemberAtom } from "@/atom/community";
import { userJugUserIdAtom } from "@/atom/query";
import { MemberInfo } from "@/interfaces/community";

export default function TodayVsAvgInsight(
    selectedMemberData: MemberInfo,
    userId: number,
) {
    const amountDrankToday = useAtomValue(amountDrankTodayAtom);
    const selectedMember = useAtomValue(selectedMemberAtom);
    const avgAmountDrankByNow = useAtomValue(avgAmountDrankByTimeNowAtom);
    const userJUserId = useAtomValue(userJugUserIdAtom);
    if (Number.isNaN(amountDrankToday) || Number.isNaN(avgAmountDrankByNow)) {
        return null;
    }

    const dailyAvgDiff = amountDrankToday - avgAmountDrankByNow;
    if (selectedMember.id == userJUserId) {
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
                        <Text className="font-bold dark:text-white">
                            Average
                        </Text>
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
    } else {
        return (
            <InsightsPane
                heading={`So far today, ${selectedMember.name} is drinking ${dailyAvgDiff > 0 ? "more" : "less"} than they normally would.`}
            >
                <View className="flex-row w-full gap-32">
                    <View className="flex">
                        <Text className="font-bold dark:text-white">Today</Text>
                        <WaterAmount value={amountDrankToday} />
                    </View>
                    <View className="flex">
                        <Text className="font-bold dark:text-white">
                            Average
                        </Text>
                        <WaterAmount value={avgAmountDrankByNow} />
                    </View>
                </View>
            </InsightsPane>
        );
    }
}
