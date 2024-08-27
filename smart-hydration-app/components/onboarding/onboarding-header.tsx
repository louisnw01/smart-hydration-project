import { Dimensions, Keyboard } from "react-native";
import { Text } from "react-native";

export default function OnboardingHeader({ text }: { text: string }) {
    const windowHeight = Dimensions.get("screen").height;
    return (
        <Text
            className={`font-bold text-4xl dark:text-white w-full text-center ${windowHeight > 667 ? "top-6" : ""}`}
        >
            {text}
        </Text>
    );
}
