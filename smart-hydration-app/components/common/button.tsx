import { useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import { PressableProps } from "react-native-paper/lib/typescript/components/TouchableRipple/Pressable";

interface ButtonProps extends PressableProps {
    style?: ViewStyle;
    text: string;
    href?: string;
    textClass: string;
    buttonClass?: string;
    icon?: ReactNode;
}
export default function StyledButton(props: ButtonProps) {
    const router = useRouter();
    const [touched, setTouched] = useState(false);

    props.textClass +=
        props.textClass && !props.textClass.includes("dark:text") ? " dark:text-white" : "";

    const buttonColors = touched
        ? "bg-gray-300 dark:bg-neutral-700"
        : "bg-gray-200 dark:bg-neutral-800";

    props.buttonClass = !props.buttonClass
        ? buttonColors
        : !props.buttonClass.includes("bg-")
          ? (props.buttonClass += " " + buttonColors)
          : props.buttonClass;

    const finalButtonClass =
        "flex-row gap-[3px] px-4 py-2 rounded-3xl " + props.buttonClass;

    return (
        <Pressable
            style={props.style}
            className={finalButtonClass}
            onPress={() =>
                props.onPress ? props.onPress : props.href ? router.navigate(props.href) : undefined
            }
            onTouchStart={() => setTouched(true)}
            onTouchEnd={() => setTouched(false)}
            {...props}
        >
            {props.icon && props.icon}
            <Text className={props.textClass}>{props.text}</Text>
        </Pressable>
    );
}
