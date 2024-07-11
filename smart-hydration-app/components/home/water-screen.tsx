import { amountDrankTodayAtom } from "@/atom/hydration";
import { AVERAGE_HYDRATION_PER_DAY } from "@/constants/person";
import { useNavigation, useRouter } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import { atom, useAtomValue } from "jotai";
import { Dimensions, View } from "react-native";

function roundToClosestTarget(
    number: number,
    target1: number,
    target2: number,
): number {
    const diff1 = Math.abs(number - target1);
    const diff2 = Math.abs(number - target2);
    return diff1 < diff2 ? target1 : target2;
}

const screenWaterLevelAtom = atom((get) => {
    const waterLevel = get(amountDrankTodayAtom);
    if (!waterLevel) return 0;

    let scaledLevel = waterLevel / AVERAGE_HYDRATION_PER_DAY;

    if (scaledLevel > 0.03 && scaledLevel < 0.1) {
        scaledLevel = roundToClosestTarget(scaledLevel, 0.03, 0.1);
    } else if (scaledLevel > 0.68 && scaledLevel < 0.71) {
        scaledLevel = roundToClosestTarget(scaledLevel, 0.68, 0.71);
    } else if (scaledLevel > 0.72 && scaledLevel < 0.82) {
        scaledLevel = roundToClosestTarget(scaledLevel, 0.72, 0.82);
    } else if (scaledLevel > 0.89 && scaledLevel < 0.93) {
        scaledLevel = roundToClosestTarget(scaledLevel, 0.89, 0.93);
    }

    return scaledLevel;

    // places where you need to round:
    // 0.03-0.1     - nav bar
    // 0.68-0.71    'of your daily' text
    // 0.72-0.82    'big text'
    // 0.89-93      - header
});

export default function WaterScreen() {
    const screenWaterLevel = useAtomValue(screenWaterLevelAtom);
    const screenHeight = Dimensions.get("screen").height;
    // const num = 0.82;
    return (
        <View
            className="absolute top-0 w-screen bg-blue"
            style={{
                top: screenHeight * (1 - screenWaterLevel),
                height: screenHeight * (1 + screenWaterLevel),
            }}
        />
    );
}

export function useWaterLevel() {
    const waterLevel = useAtomValue(screenWaterLevelAtom);
    const route = useRouteInfo();
    if (
        route.pathname != "/" &&
        !route.pathname.startsWith("/settings") &&
        route.pathname != "add-drink-modal"
    ) {
        return null;
    } else {
        return waterLevel;
    }
}
