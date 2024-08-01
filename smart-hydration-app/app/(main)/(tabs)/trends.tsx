import { chartTimeWindowAtom } from "@/atom/nav";
import { getHydrationQAtom } from "@/atom/query";
import { ScrollPageWrapper } from "@/components/common/page-wrapper";
import WaterAmount from "@/components/common/water-amount";
import InsightsPane from "@/components/trends/insights-pane";
import MonthVsLastMonthInsight from "@/components/trends/month-vs-month";
import Switcher from "@/components/trends/switcher";
import TodayVsAvgInsight from "@/components/trends/today-vs-avg";
import { formattedDataAtom } from "@/util/trends";
import { useAtomValue } from "jotai";
import { ActivityIndicator, Text, View } from "react-native";

import { mostHydratedDayOfWeekAtom } from "@/atom/hydration";
import TrendsChart from "@/components/trends/chart";

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
                <TrendsChart />
                <Switcher />
            </View>
            <Insights />
        </ScrollPageWrapper>
    );
}
