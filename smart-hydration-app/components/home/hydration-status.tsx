import { amountDrankTodayAtom } from "@/atom/hydration";
import { userInfoQAtom } from "@/atom/query";
import { dailyTargetAtom } from "@/atom/user";
import colors from "@/colors";
import { HYDRATION_MESSAGE } from "@/constants/hydration-status";
import { getRelativeTarget } from "@/util/trends";
import { useAtomValue } from "jotai";
import { Text, View } from "react-native";

export default function HydrationStatus() {
    const hydration = useAtomValue(amountDrankTodayAtom);
    const target = useAtomValue(dailyTargetAtom);
    const hydrated = hydration >= getRelativeTarget(target);
    const { refetch, isLoading, data } = useAtomValue(userInfoQAtom);

    if (isLoading || !data) {
        return null;
    }

    return (
        <View
            className="mx-6 px-7 bg-gray-200 py-4 flex flex-row rounded-xl"
            style={{
                backgroundColor: hydrated ? colors.green : colors.red,
            }}
        >
            <Text className="w-full text-center text-3xl text-white">
                {hydrated
                    ? HYDRATION_MESSAGE.high + data.name
                    : HYDRATION_MESSAGE.low + data.name}
            </Text>
        </View>
    );
}
