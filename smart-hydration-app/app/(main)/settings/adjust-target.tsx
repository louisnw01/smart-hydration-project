import { View, Text } from "react-native";
import { useAtom, useAtomValue } from "jotai";
import { dailyTargetAtom } from "@/atom/user";
import StyledButton from "@/components/common/button";
import { getUserTargetQAtom } from "@/atom/query";

export default function AdjustTarget() {
    // TODO Not sure if this will cause errors down the line or not, probably will but it works for now
    const { data } = useAtomValue(getUserTargetQAtom);
    const dailyTarget = data?.target;
    return (
        <View className="flex flex-col gap-20 w-full">
            <Text className="text-center text-2xl py-6 font-semibold">Your daily target is {dailyTarget}ml</Text>
            <View className="justify-around px-28 text-center">
            <StyledButton
            text="Adjust Daily Target"
            href="adjust-daily-target"
            textClass="text-lg text-center"
        />
            </View>
        </View>
    )
}
