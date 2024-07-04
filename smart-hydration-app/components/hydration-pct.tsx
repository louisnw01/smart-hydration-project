import { Text, View } from "react-native";
import { hydrationAtom } from "@/atom/hydration";
import { useAtomValue } from "jotai";

export default function HydrationPercentage() {
    const hydration = useAtomValue(hydrationAtom);
    return (
        <View className="items-center">
            <Text className="text-8xl font-semibold dark:text-white">
                {hydration}%
            </Text>

            <Text className="text-lg">of your target</Text>
        </View>
    );
}
