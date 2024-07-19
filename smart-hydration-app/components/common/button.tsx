import useColorPalette from "@/util/palette";
import { useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";

interface ButtonProps {
    text: string;
    href?: string;
    onPress?: Function;
    textSize?: "sm" | "md" | "lg" | "xl";
    buttonClass?: string;
    textClass?: string;
    icon?: ReactNode;
    style?: ViewStyle;
}
export default function StyledButton({
    text,
    href,
    onPress,
    textSize,
    buttonClass,
    textClass,
    icon,
    style,
}: ButtonProps) {
    const router = useRouter();
    const [touched, setTouched] = useState(false);

    let finalTextClass = textSize ? "text-" + textSize : "";
    finalTextClass += " dark:text-white " + textClass;

    const buttonColors = touched
        ? "bg-gray-300 dark:bg-neutral-700"
        : "bg-gray-200 dark:bg-neutral-800";

    buttonClass = !buttonClass
        ? buttonColors
        : !buttonClass.includes("bg-")
          ? (buttonClass += " " + buttonColors)
          : buttonClass;

    const finalButtonClass =
        "flex-row gap-[3px] px-4 py-2 rounded-3xl " + buttonClass;

    return (
        <Pressable
            style={style}
            className={finalButtonClass}
            onPress={() =>
                onPress ? onPress() : href ? router.navigate(href) : undefined
            }
            onTouchStart={() => setTouched(true)}
            onTouchEnd={() => setTouched(false)}
        >
            {icon && icon}
            <Text className={finalTextClass}>{text}</Text>
        </Pressable>
    );
}
