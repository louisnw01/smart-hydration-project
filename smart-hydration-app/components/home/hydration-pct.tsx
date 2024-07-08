import { Text, View } from "react-native";
import { hydrationAtom } from "@/atom/hydration";
import { useAtomValue } from "jotai";
import { amountDrankTodayAtom } from "@/util/trends";
import { AVERAGE_HYDRATION_PER_DAY } from "@/constants/person";

export default function HydrationPercentage() {
    const amountDrankToday = useAtomValue(amountDrankTodayAtom);
    // const percent = amountDrankToday / AVERAGE_HYDRATION_PER_DAY;
    return (
        <View className="items-center">
            <Text className="text-8xl font-semibold dark:text-white">
                {amountDrankToday}ml
            </Text>

            <Text className="text-lg">of your target</Text>
        </View>
    );
}
