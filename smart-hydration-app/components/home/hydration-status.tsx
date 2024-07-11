import { View, Text } from "react-native";
import { useAtom, useAtomValue } from "jotai";
import { HYDRATION_MESSAGE } from "@/constants/hydration-status";
import colors from "@/colors";
import { userNameAtom } from "@/atom/user";
import { getUserQAtom } from "@/atom/query";
import { useEffect } from "react";
import { amountDrankTodayAtom } from "@/atom/hydration";

export default function HydrationStatus() {
    const hydration = useAtomValue(amountDrankTodayAtom);
    const hydrated = hydration >= 1600;
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
