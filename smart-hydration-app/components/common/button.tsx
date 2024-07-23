import useColorPalette from "@/util/palette";
import { useRouter } from "expo-router";
import { ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";

interface ButtonProps {
    text: string;
    href: string;
    textSize?: "sm" | "md" | "lg" | "xl";
    buttonClass?: string;
    textClass?: string;
    icon?: ReactNode;
}
export default function StyledButton({
    text,
    href,
    textSize,
    buttonClass,
    textClass,
    icon,
}: ButtonProps) {
    const router = useRouter();
    const [touched, setTouched] = useState(false);

    let finalTextClass = textSize ? "text-" + textSize : "";
    finalTextClass += " dark:text-white " + textClass;

    if (!buttonClass) {
        buttonClass = touched
            ? "bg-gray-300 dark:bg-neutral-700"
            : "bg-gray-200 dark:bg-neutral-800";
    }
    const finalButtonClass =
        "flex-row gap-[3px] px-4 py-2 rounded-3xl " + buttonClass;

    return (
        <Pressable
            className={finalButtonClass}
            onPress={() => router.navigate(href)}
            onTouchStart={() => setTouched(true)}
            onTouchEnd={() => setTouched(false)}
        >
            {icon && icon}
            <Text className={finalTextClass}>{text}</Text>
        </Pressable>
    );
}
