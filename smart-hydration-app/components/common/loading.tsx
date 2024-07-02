import { ActivityIndicator, View, Text } from "react-native";

export default function Loading({
    isLoading,
    message,
}: {
    isLoading: boolean;
    message: string;
}) {
    if (!isLoading) return null;

    return (
        <View>
            <ActivityIndicator className="justify-center top-2/4" />
            <Text className="mt-16 flex justify-center text-center">
                {message}
            </Text>
        </View>
    );
}
