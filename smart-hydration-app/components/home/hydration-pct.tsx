import { Text, useColorScheme, View } from "react-native";
import {useAtom, useAtomValue} from "jotai";
import { AVERAGE_HYDRATION_PER_DAY } from "@/constants/person";
import { amountDrankTodayAtom } from "@/atom/hydration";
import { useWaterLevel } from "./water-screen";
import useColorPalette from "@/util/palette";
import {getHydrationQAtom, getUserTargetQAtom} from "@/atom/query";

export default function HydrationPercentage() {
    const palette = useColorPalette();
    const amountDrankToday = useAtomValue(amountDrankTodayAtom);
    const waterTargetResponse = useAtomValue(getUserTargetQAtom);
    let waterTarget = 2200;
    if (waterTargetResponse.data) {
        waterTarget = waterTargetResponse.data.target;
    }
    const waterLevel = useWaterLevel();
    const percentUnderwater = waterLevel && waterLevel >= 0.82;
    const textUnderwater = waterLevel && waterLevel >= 0.71;

    // const percent = amountDrankToday / AVERAGE_HYDRATION_PER_DAY;
    return (
        <View className="items-center">
            <Text
                className="text-8xl font-semibold"
                style={{
                    color: percentUnderwater ? "white" : palette.fg,
                }}
            >
                {amountDrankToday}ml
            </Text>

            <Text
                className="text-lg dark:text-white"
                style={{
                    color: textUnderwater ? "white" : palette.fg,
                }}
            >
                of your daily target ({waterTarget}ml)
            </Text>
        </View>
    );
}
