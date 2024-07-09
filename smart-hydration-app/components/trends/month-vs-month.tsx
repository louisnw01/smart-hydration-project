import { getMonthName } from "@/util/time";
import {
    avgAmountDrankLastMonthAtom,
    avgAmountDrankThisMonthAtom,
} from "@/util/trends";
import { useAtomValue } from "jotai";
import InsightsPane from "./insights-pane";
import WaterAmount from "../common/water-amount";
import { View, Text } from "react-native";

export default function MonthVsLastMonthInsight() {
    const avgAmountThisMonth = useAtomValue(avgAmountDrankThisMonthAtom);
    const avgAmountLastMonth = useAtomValue(avgAmountDrankLastMonthAtom);

    if (avgAmountLastMonth == null || avgAmountThisMonth == null) return null;

    const date = new Date();
    const thisMonthName = getMonthName(date);
    date.setMonth(date.getMonth() - 1);
    const lastMonthName = getMonthName(date);

    const moreThisMonth = avgAmountThisMonth > avgAmountLastMonth;

    return (
        <InsightsPane
            heading={`On average, you're drinking ${avgAmountThisMonth > avgAmountLastMonth ? "more" : "less"} this month when compared to last month.`}
        >
            <View className="flex gap-6">
                <View className="gap-1">
                    <WaterAmount value={avgAmountThisMonth} />
                    <ValueBar
                        text={thisMonthName}
                        value={
                            moreThisMonth
                                ? "100"
                                : (avgAmountThisMonth / avgAmountLastMonth) *
                                  100
                        }
                    />
                </View>
                <View className="gap-1">
                    <WaterAmount value={avgAmountLastMonth} />
                    <ValueBar
                        text={lastMonthName}
                        value={
                            !moreThisMonth
                                ? "100"
                                : (avgAmountLastMonth / avgAmountThisMonth) *
                                  100
                        }
                    />
                </View>
            </View>
        </InsightsPane>
    );
}

function ValueBar({ text, value }) {
    return (
        <View
            className="bg-blue rounded-md px-2 py-1"
            style={{
                width: value + "%",
            }}
        >
            <Text className="text-white font-bold">{text}</Text>
        </View>
    );
}
