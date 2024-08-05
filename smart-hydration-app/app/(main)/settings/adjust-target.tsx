import { dailyTargetAtom, userInfoQAtom } from "@/atom/query";
import StyledButton from "@/components/common/button";
import { useAtomValue } from "jotai";
import { Text, View } from "react-native";

export default function AdjustTarget() {
    const { data, isLoading } = useAtomValue(userInfoQAtom);
    const dailyTarget = useAtomValue(dailyTargetAtom);

    if (isLoading) return null;

    return (
        <View className="flex flex-col gap-20 w-full">
            <Text className="text-center text-2xl py-6 font-semibold">
                Your daily target is {dailyTarget}ml
            </Text>
            <View className="justify-around px-28 text-center">
                <StyledButton
                    text="Adjust Daily Target"
                    href="adjust-daily-target"
                    textClass="text-lg text-center"
                />
            </View>
        </View>
    );
}
