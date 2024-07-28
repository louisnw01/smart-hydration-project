import { View, Text } from "react-native";
import { useAtom, useAtomValue } from "jotai";
import { HYDRATION_MESSAGE } from "@/constants/hydration-status";
import colors from "@/colors";
import { dailyTargetAtom, userNameAtom } from "@/atom/user";
import { getUserQAtom, getUserTargetQAtom } from "@/atom/query";
import { useEffect } from "react";
import { amountDrankTodayAtom } from "@/atom/hydration";
import { getRelativeTarget } from "@/util/trends";

export default function HydrationStatus() {
    const hydration = useAtomValue(amountDrankTodayAtom);
    const target = useAtomValue(dailyTargetAtom);
    const hydrated = hydration >= getRelativeTarget(target);
    const { refetch, isSuccess, data } = useAtomValue(getUserQAtom);
    const [userName, setUserName] = useAtom(userNameAtom);

    useEffect(() => {
        refetch();
        if (isSuccess) {
            setUserName(data);
        }
    }, [isSuccess]);

    return (
        <View
            className="mx-6 px-7 bg-gray-200 py-4 flex flex-row rounded-xl"
            style={{
                backgroundColor: hydrated ? colors.green : colors.red,
            }}
        >
            <Text className="w-full text-center text-3xl text-white">
                {hydrated
                    ? HYDRATION_MESSAGE.high + userName
                    : HYDRATION_MESSAGE.low + userName}
            </Text>
        </View>
    );
}
