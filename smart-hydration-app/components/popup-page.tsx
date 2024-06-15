import { View, Pressable, ViewStyle, TouchableOpacity, Easing, Dimensions} from "react-native";
import {useAtom} from "jotai";
import {popupPageAtom} from "@/atom/nav";
import {useSetAtom} from "jotai";
import {PropsWithChildren, useEffect, useRef, useState} from "react";
import {ReduceMotion, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import {Gesture, GestureDetector} from "react-native-gesture-handler";

type SlideUpAnimProps = PropsWithChildren<{style: ViewStyle}>;

export default function PopupPage( { children }: { children: JSX.Element | JSX.Element[] } ) {

    const screenHeight = Dimensions.get("window").height;
    const animation = useSharedValue(screenHeight);
    const popupStatus = useSetAtom(popupPageAtom);
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{translateY: animation.value}],
    }))
    useEffect(() => {
        animation.value = withTiming(0, {
            duration: 400,
            reduceMotion: ReduceMotion.System
        })
    }, []);

    const pan = Gesture.Pan().onChange((event) => {
        animation.value = event.translationY;
    }).onFinalize((finalEvent) => {
        if (animation.value > screenHeight / 4 || finalEvent.velocityY > 1000) {
            animation.value = withTiming(screenHeight, {
                duration: 200,
                reduceMotion: ReduceMotion.System
            }, () => runOnJS(popupStatus)('none'));
        } else {
            animation.value = withTiming(0, {
                duration: 400,
                reduceMotion: ReduceMotion.System
            })
        }
    })
    return (
        <Animated.View className="absolute top-0 left-0 w-full h-full" style={animatedStyles}>
            <GestureDetector gesture={pan}>
                <View className="position relative bottom-0 w-full h-full left-0 bg-gray-200 pl-5 pr-5 pt-5 gap-5 rounded-xl">
                    { children }
                </View>
            </GestureDetector>
        </Animated.View>

    );
}
