import { Link } from "expo-router";
import {
    GestureResponderEvent,
    Pressable,
    StyleProp,
    Text,
    View,
    ViewStyle,
} from "react-native";

interface ButtonProps {
    text: string;
    href?: string;
    textSize?: "sm" | "md" | "lg" | "xl";
    buttonClass?: string;
    textClass?: string;
}
export default function StyledButton({
    text,
    href,
    textSize,
    buttonClass,
    textClass,
}: ButtonProps) {
    let finalTextClass = textSize ? "text-" + textSize : "";
    finalTextClass += " " + textClass;

    if (!buttonClass) {
        buttonClass = "bg-gray-200";
    }
    const finalButtonClass =
        "justify-center px-3 py-3 rounded-3xl " + buttonClass;
    return (
        <View className={finalButtonClass}>
            <Link className={finalTextClass} href={href}>
                {text}
            </Link>
        </View>
    );
}
