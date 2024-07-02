import { View, Text } from "react-native";
import { hydrationAtom } from "@/atom/hydration";
import { useAtomValue } from "jotai";
import { HYDRATION_MESSAGE } from "@/constants/hydration-status";
import colors from '../colors'
import { userNameAtom } from "@/atom/user";

export default function HydrationStatus () {
    const hydration = useAtomValue(hydrationAtom);
    const hydrated = hydration >= 70;
    const userName = useAtomValue(userNameAtom);

    return (
        <View className="mx-6 px-7 bg-gray-200 py-4 flex flex-row rounded-xl"
        style={{
            backgroundColor: hydrated ? colors.green : colors.red
        }}>
            <Text className="w-full text-center text-3xl text-white">
                {hydrated ? HYDRATION_MESSAGE.high + userName: HYDRATION_MESSAGE.low + userName}
            </Text>
        </View>
    )
}