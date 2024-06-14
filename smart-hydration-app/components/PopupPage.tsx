import {Animated, View, Pressable, ViewStyle, TouchableOpacity, Easing} from "react-native";
import {useAtom} from "jotai";
import {popupPageAtom} from "@/atom/nav";
import {useSetAtom} from "jotai/react/useSetAtom";
import {PropsWithChildren, useEffect, useRef, useState} from "react";

type SlideUpAnimProps = PropsWithChildren<{style: ViewStyle}>;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

const SlideUp: React.FC<SlideUpAnimProps> = props => {
    const slideUpAnim = useRef(new Animated.Value(1000)).current;
    const [popupStatus, setPopupStatus] = useAtom(popupPageAtom);
    const [direction, setDirection] = useState<"up" | "down">("up");

    // code for slide up and slide down animations
    const flipDirection = () => {
        direction === "up" ? setDirection("down") : setDirection("up");
    }
    useEffect(() => {
        const toValue = (direction === "up" ? 100 : 1000);
        Animated.timing(slideUpAnim, {
            toValue,
            easing: Easing.out(Easing.exp),
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            if (direction === "down") {
                setPopupStatus("none");
            }
        });


    }, [slideUpAnim, direction]);
    return (
        <AnimatedTouchable className="position absolute top-0 w-full h-1/6"  style={{
            ...props.style,
            height: slideUpAnim,
            backgroundColor: 'transparent',
            zIndex: 1,
        }} onPress={() => {flipDirection()}}></AnimatedTouchable>
    )
}


export default function PopupPage( { children }: { children: JSX.Element | JSX.Element[] } ) {

    return (
        <View className="position absolute top-0 left-0 w-full h-full">
        <SlideUp style={{
            width: '100%',
        }} />
        <View className="position relative bottom-0 w-full h-full left-0 bg-gray-200 pl-5 pr-5 pt-5 gap-5 rounded-xl">
            { children }
        </View>
            </View>
    );
}
