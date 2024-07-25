import { ActivityIndicator, View, Text } from "react-native";

export default function Loading({
    isLoading,
    message,
    large,
}: {
    isLoading: boolean;
    message: string;
    large?: boolean;
}) {
    if (!isLoading) return null;

    return (
        <View>
            <ActivityIndicator
                className="justify-center w-full h-full"
                size={large ? "large" : "small"}
            />
            <Text className="mt-16 flex justify-center text-center text-2xl dark:text-white">
                {message}
            </Text>
        </View>
    );
}
