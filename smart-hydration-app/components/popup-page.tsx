import { View, Dimensions } from "react-native";
import { useSetAtom } from "jotai";
import { ReactNode, useContext, useEffect } from "react";
import {
    interpolateColor,
    ReduceMotion,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { AnimationContext } from "@/app/_layout";

export default function PopupPage({
    children,
    height,
    className,
}: {
    children: ReactNode;
    height: number;
    className?: string;
}) {
    const screenHeight = Dimensions.get("window").height;
    const viewHeight = (screenHeight / 100) * height;
    const viewTop = screenHeight - viewHeight;
    const animation = useContext(AnimationContext);
    if (!animation) return;
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateY: animation.value }],
    }));
    const overlayStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            animation.value,
            [screenHeight, viewTop],
            ["transparent", "rgba(0, 0, 0, 0.5)"],
        ),
    }));
    useEffect(() => {
        animation.value = withTiming(viewTop, {
            duration: 400,
            reduceMotion: ReduceMotion.System,
        });
    });

    const pan = Gesture.Pan()
        .onChange((event) => {
            if (viewTop + event.translationY < viewTop) return;
            animation.value = viewTop + event.translationY;
        })
        .onFinalize((finalEvent) => {
            if (
                animation.value > viewTop + screenHeight / 4 ||
                finalEvent.velocityY > 1000
            ) {
                animation.value = withTiming(
                    screenHeight,
                    {
                        duration: 200,
                        reduceMotion: ReduceMotion.System,
                    },
                    () => runOnJS(popupStatus)("none"),
                );
            } else {
                animation.value = withTiming(viewTop, {
                    duration: 400,
                    reduceMotion: ReduceMotion.System,
                });
            }
        });
    return (
        <>
            <Animated.View
                className="absolute top-0 left-0 h-full w-full"
                style={overlayStyles}
            />
            <GestureDetector gesture={pan}>
                <Animated.View
                    className="absolute left-0 w-full z-20 h-full"
                    style={animatedStyles}
                >
                    <View
                        className="bg-white rounded-xl px-5 dark:bg-black"
                        style={{
                            height: viewHeight,
                        }}
                    >
                        <View className="flex items-center mt-[5px] mb-4">
                            <View className="bg-gray-300 w-10 h-[6px] rounded-xl" />
                        </View>
                        <View className={className}>{children}</View>
                    </View>
                </Animated.View>
            </GestureDetector>
        </>
    );
}
