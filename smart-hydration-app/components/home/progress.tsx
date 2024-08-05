import { amountDrankTodayAtom } from "@/atom/hydration";
import { userInfoQAtom } from "@/atom/query";
import colors from "@/colors";
import useColorPalette from "@/util/palette";
import { useAtomValue } from "jotai";
import { ReactNode } from "react";
import { Text, TextInput, View } from "react-native";
import { SharedValue } from "react-native-gesture-handler/lib/typescript/handlers/gestures/reanimatedWrapper";
import Animated, {
    Easing,
    useAnimatedProps,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";
import WaterAmount from "../common/water-amount";

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
        console.log(value);
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
    const palette = useColorPalette();
    const amountDrankToday = useAtomValue(amountDrankTodayAtom);
    const { data } = useAtomValue(userInfoQAtom);

    const animatedProgress = useSharedValue(0);

    const text = useDerivedValue(() => animatedProgress.value.toFixed(0));
    const animatedProps = useAnimatedProps(() => ({
        text: text.value,
    }));

    const target = data?.target || 2200;

    if (!data) return null;

    return (
        <ProgressWheel
            radius={130}
            max={target}
            progress={amountDrankToday}
            width={16}
            color={amountDrankToday >= target ? colors.green : colors.blue}
            backgroundColor={palette.bglight}
            animatedProgress={animatedProgress}
        >
            <View className="mt-6">
                <View className="flex-row justify-center ml-6">
                    <AnimatedTextInput
                        underlineColorAndroid="transparent"
                        editable={false}
                        value={text}
                        className="dark:text-white text-7xl font-semibold -mb-3"
                        {...{ animatedProps }}
                    />

                    <Text className="dark:text-white text-4xl font-semibold self-end pb-2">
                        ml
                    </Text>
                </View>
                <View className="flex-row justify-center gap-1 ml-1">
                    <Text className="text-2xl font-semibold bottom-1 dark:text-white">
                        /
                    </Text>
                    <WaterAmount value={target} size="md" />
                </View>
                <Text className="text-center text-lg dark:text-white mt-3">
                    of your daily target
                </Text>
            </View>
        </ProgressWheel>
    );
}
