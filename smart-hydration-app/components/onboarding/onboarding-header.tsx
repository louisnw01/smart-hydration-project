import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingHeader({ options }) {
    const insets = useSafeAreaInsets();
    return (
        <View
            className="w-full items-center bg-white"
            style={{
                paddingTop: insets.top + 150,
            }}
        >
            <Text className="font-bold text-4xl">{options.title}</Text>
        </View>
    );
}
