import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useAtomValue } from "jotai";
import { chartTimeWindowAtom } from "@/atom/nav";
import { formattedDataAtom } from "@/util/trends";
import Switcher from "@/components/trends/switcher";
import InsightsPane from "@/components/trends/insights-pane";
import TodayVsAvgInsight from "@/components/trends/today-vs-avg";
import MonthVsLastMonthInsight from "@/components/trends/month-vs-month";
import WaterAmount from "@/components/common/water-amount";

import { mostHydratedDayOfWeekAtom, userHasJugsAtom } from "@/atom/hydration";
import Loading from "@/components/common/loading";
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
      <Text className="font-bold text-2xl mt-5 dark:text-white">Insights</Text>
      <TodayVsAvgInsight />

      <MonthVsLastMonthInsight />

      <MostHydratedDayOfWeek />
    </View>
  );
}

export default function TrendsPage() {
  const { hasJugs, isLoading } = useAtomValue(userHasJugsAtom);

  if (isLoading) {
    return <Loading isLoading message="Loading your information..." />;
  }
  // } else if (!hasJugs) {
  //     return (
  //         <View className="flex flex-1 justify-center items-center">
  //             <Text className="dark:text-white text-2xl">
  //                 You haven't linked any jugs yet.
  //             </Text>
  //         </View>
  //     );
  // }

  return (
    <ScrollView className="bg-gray-100 dark:bg-black">
      <View className="flex pl-4 pb-5 bg-white dark:bg-black">
        <TrendsChart />
        <Switcher />
        {/* <View className="bg-gray-100 rounded-3xl pb-3 overflow-hidden dark:bg-neutral-900"></View> */}
      </View>
      <Insights />
    </ScrollView>
  );
}
