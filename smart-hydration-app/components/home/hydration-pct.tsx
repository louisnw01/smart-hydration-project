import { Text, View } from "react-native";
import { useAtomValue } from "jotai";
import { AVERAGE_HYDRATION_PER_DAY } from "@/constants/person";
import { amountDrankTodayAtom } from "@/atom/hydration";

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
