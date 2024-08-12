import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    Text,
    View,
    ViewStyle,
} from "react-native";

interface ButtonProps extends PressableProps {
    text: string;
    href?: string;
    textClass?: string;
    buttonClass?: string;
    buttonColors?: string;
    touchButtonColors?: string;
    icon?: ReactNode;
    style?: ViewStyle;
    isLoading?: boolean;
    chevron?: boolean;
}

export default function StyledButton(props: ButtonProps) {
    const router = useRouter();
    const [touched, setTouched] = useState(false);

    const textClass = !props.textClass?.includes("dark:text")
        ? `${props.textClass} dark:text-white`
        : props.textClass;

    const buttonColors =
        touched && !props.disabled
            ? props.touchButtonColors || "bg-gray-300 dark:bg-neutral-700"
            : props.buttonColors || "bg-gray-200 dark:bg-neutral-800";
    props.disabled
        ? "bg-gray-300 dark:bg-neutral-700"
        : props.buttonColors || "bg-gray-200 dark:bg-neutral-800";

    const buttonClass = !props.buttonClass
        ? buttonColors
        : !props.buttonClass.includes("bg-")
          ? props.buttonClass + " " + buttonColors
          : props.buttonClass;
    props.disabled ? buttonColors + " " + buttonClass : props.buttonClass;

    const finalButtonClass =
        buttonClass && buttonClass.includes("gap-")
            ? buttonClass
            : "flex-row gap-[3px] px-4 py-2 rounded-3xl " + buttonClass;

    return (
        <Pressable
            style={props.style}
            className={finalButtonClass}
            onPress={() =>
                props.onPress
                    ? props.onPress
                    : props.href
                      ? router.navigate(props.href)
                      : undefined
            }
            onTouchStart={() => setTouched(true)}
            onTouchEnd={() => setTouched(false)}
            {...props}
        >
            {props.icon && props.icon}

            <Text className={textClass}>{props.text}</Text>

            {props.isLoading && <ActivityIndicator color="black" />}

            {props.chevron && (
                <View className="flex-grow items-center flex-row justify-end">
                    <Entypo name="chevron-right" size={18} color="gray" />
                </View>
            )}
        </Pressable>
    );
}
