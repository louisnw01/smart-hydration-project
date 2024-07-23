import useColorPalette from "@/util/palette";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingHeader({ options }) {
    const insets = useSafeAreaInsets();
    return (
        <View
            className="w-full items-center bg-white dark:bg-black"
            style={{
                paddingTop: insets.top + 150,
            }}
        >
            <Text className="font-bold text-4xl dark:text-white">
                {options.title}
            </Text>
        </View>
    );
}
