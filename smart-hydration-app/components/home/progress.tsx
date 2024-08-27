import { amountDrankTodayAtom } from "@/atom/hydration";
import colors from "@/colors";
import useColorPalette from "@/util/palette";
import { useAtomValue } from "jotai";
import { ReactNode } from "react";
import { Text, TextInput, View } from "react-native";
import Animated, {
    Easing,
    SharedValue,
    useAnimatedProps,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";
import WaterAmount from "../common/water-amount";

import { dailyTargetAtom, unitConverter, unitsAtom } from "@/atom/user";
import { Dimensions } from "react-native";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function ProgressWheel({
    children,
    radius,
    progress,
    max,
    width,
    color,
    backgroundColor,
    animatedProgress,
}: {
    children: ReactNode;
    radius: number;
    progress: number;
    max: number;
    width: number;
    color: string;
    backgroundColor: string;
    animatedProgress: SharedValue<number>;
}) {
    const circumference = 2 * Math.PI * radius;

    const realProgress = useDerivedValue(() => {
        const value = ((max - animatedProgress.value) / max) * circumference;
        return value <= 0 ? 0 : value;
    });

    animatedProgress.value = withTiming(progress, {
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
    });

    return (
        <View
            className="flex flex-row items-center"
            style={{
                width: radius * 2 + width,
                height: radius * 2 + width,
            }}
        >
            <Svg
                height={radius * 3 + width}
                width={radius * 3 + width}
                viewBox={`0 0 ${radius * 3 + width} ${radius * 3 + width}`}
            >
                <G
                    transform={{
                        translateX: width / 2,
                        translateY: width / 2 + radius / 2,
                    }}
                >
                    <Circle
                        stroke={backgroundColor}
                        fill="none"
                        cx={radius}
                        cy={radius}
                        r={radius}
                        strokeWidth={width}
                    />
                    <AnimatedCircle
                        stroke={color}
                        fill="none"
                        cx={radius}
                        cy={radius}
                        r={radius}
                        strokeWidth={width}
                        strokeDasharray={circumference}
                        strokeDashoffset={realProgress}
                        transform={`rotate(-90 ${radius} ${radius})`} // Rotate to start at the top
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            <View className="absolute h-full w-full items-center justify-center">
                {children}
            </View>
        </View>
    );
}

export default function HydrationProgress() {
    const screenIsLarge = Dimensions.get("screen").height > 667;
    const palette = useColorPalette();
    const amountDrankToday = useAtomValue(amountDrankTodayAtom) ?? 0;

    const animatedProgress = useSharedValue(0);

    const text = useDerivedValue(() => animatedProgress.value.toFixed(0));
    const animatedProps = useAnimatedProps(() => ({
        text: text.value,
    })) as any;

    const unit = useAtomValue(unitsAtom);
    const target = unitConverter(useAtomValue(dailyTargetAtom), unit);

    return (
        <ProgressWheel
            radius={screenIsLarge ? 130 : 100}
            max={target}
            progress={amountDrankToday ?? 0}
            width={screenIsLarge ? 16 : 10}
            color={amountDrankToday >= target ? colors.green : colors.blue}
            backgroundColor={palette.bglight}
            animatedProgress={animatedProgress}
        >
            <View className={`${screenIsLarge ? "mt-6" : ""}`}>
                <View className="flex-row justify-center ml-6">
                    <AnimatedTextInput
                        underlineColorAndroid="transparent"
                        editable={false}
                        value={text.value}
                        className={`dark:text-white font-semibold ${screenIsLarge ? "text-7xl -mb-3" : "text-4xl"}`}
                        {...{ animatedProps }}
                    />

                    <Text className="dark:text-white text-4xl font-semibold self-end pb-2">
                        {unit}
                    </Text>
                </View>
                <View className="flex-row justify-center gap-1 ml-1">
                    <Text className="text-2xl font-semibold bottom-1 dark:text-white">
                        /
                    </Text>
                    <WaterAmount value={target} size="md" />
                </View>
                <Text
                    className={`text-center text-lg dark:text-white ${screenIsLarge ? "mt-3" : ""}`}
                >
                    of your daily target
                </Text>
            </View>
        </ProgressWheel>
    );
}
