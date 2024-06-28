import { GestureResponderEvent, Pressable, Text } from "react-native";

interface ButtonProps {
    text: string;
    onPress?: (event: GestureResponderEvent) => void;
    color?: string;
    textSize?: "sm" | "md" | "lg" | "xl";
}
export default function StyledButton({ text, onPress, textSize }: ButtonProps) {
    const textClass = textSize ? "text-" + textSize : undefined;
    return (
        <Pressable
            className="flex justify-center bg-gray-200 px-3 py-3 rounded-3xl"
            onPress={onPress}
        >
            <Text className={textClass}>{text}</Text>
        </Pressable>
    );
}
