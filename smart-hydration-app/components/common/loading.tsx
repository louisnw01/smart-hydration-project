import { ActivityIndicator, Text, View } from "react-native";

export default function Loading({
    isLoading,
    message,
    large,
}: {
    isLoading: boolean;
    message?: string;
    large?: boolean;
}) {
    if (!isLoading) return null;
    return (
        <View className="w-full h-full justify-center gap-4">
            <ActivityIndicator size={large ? "large" : "small"} />
            <Text className="text-center text-xl dark:text-white">
                {message}
            </Text>
        </View>
    );
}
