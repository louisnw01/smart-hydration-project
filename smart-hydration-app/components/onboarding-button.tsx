import { Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NextButtonProps {
    text: string;
    onPress: () => void;
    color: string;
}

export default function OnboardingButton({
    text,
    onPress,
    color,
}: NextButtonProps) {
    const insets = useSafeAreaInsets();
    return (
        <Pressable
            className="absolute rounded-lg px-4 py-2"
            style={{
                bottom: insets.bottom + 20,
                backgroundColor: color,
            }}
            onPress={onPress}
        >
            <Text className="font-semibold text-2xl text-white">{text}</Text>
        </Pressable>
    );
}
