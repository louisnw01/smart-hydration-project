import { ActivityIndicator, View, Text } from "react-native";

export default function Loading({
    isLoading,
    message,
    large,
    mysterious,
}: {
    isLoading: boolean;
    message: string;
    large?: boolean;
}) {
    if (!isLoading) return null;

    return (
        <View className={mysterious ? "justify-center h-full" : ""}>
            <ActivityIndicator
                className="justify-center top-2/4"
                size={large ? "large" : "small"}
            />
            <Text className="mt-16 flex justify-center text-center text-2xl dark:text-white">
                {message}
            </Text>
        </View>
    );
}
