import { Text } from "react-native";

export default function OnboardingHeader({ text }) {
    return (
        <Text className="font-bold text-4xl dark:text-white w-full text-center pb-20">
            {text}
        </Text>
    );
}
