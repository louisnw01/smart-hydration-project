import { View, Text } from "react-native";
import { hydrationAtom } from "@/atom/hydration";
import { useAtomValue } from "jotai";
import { HYDRATION_MESSAGE } from "@/constants/hydration-status";


export default function HydrationStatus () {
    const hydration = useAtomValue(hydrationAtom);
    const hydrated = hydration >= 70;

    return (
        <View className="mx-6 px-7 bg-gray-200 py-4 flex flex-row rounded-xl mt-16"
        style = {{
            backgroundColor: hydrated ? "green" : "red"
    }}>
            <Text className="w-full text-center text-3xl text-white">
                {hydrated ? HYDRATION_MESSAGE.high : HYDRATION_MESSAGE.low}
            </Text>
        </View>
    )
}