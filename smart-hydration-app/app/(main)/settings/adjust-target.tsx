import { View, Text } from "react-native";
import {useAtomValue} from "jotai";
import {dailyTargetAtom} from "@/atom/user";
import StyledButton from "@/components/common/button";

export default function AdjustTarget() {
    const dailyTarget = useAtomValue(dailyTargetAtom);
    return (
        <View className="flex flex-col gap-20 w-full">
            <Text className="text-center text-2xl pt-6 pb-6 font-semibold">Your daily target is {dailyTarget}ml</Text>
            <View className="justify-around pl-28 pr-28 text-center">
            <StyledButton
            text="Adjust Daily Target"
            href="adjust-daily-target"
            textSize="lg"
            textClass="text-center"
        />
            </View>
        </View>
    )
}
